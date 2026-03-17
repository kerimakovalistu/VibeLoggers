import express from "express";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import path from "path";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import dotenv from "dotenv";

dotenv.config();

const execPromise = util.promisify(exec);

// Initialize Prisma client with the current env
let prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for Vite dev server compatibility
  }));
  app.use(cors());
  app.use(express.json({ limit: "1mb" })); // Prevent large payloads

  // Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: { error: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login/register requests per hour
    message: { error: "Çok fazla giriş denemesi, lütfen daha sonra tekrar deneyin." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", apiLimiter);
  app.use("/api/auth/", authLimiter);

  // System Status Route
  app.get("/api/system/status", async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json({ status: "setup-required" });
      }
      // Check if DB is reachable and tables exist
      await prisma.user.count();
      res.json({ status: "connected" });
    } catch (error) {
      res.json({ status: "setup-required" });
    }
  });

  // Admin Stats Route
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const userCount = await prisma.user.count();
      const viblogCount = await prisma.viblog.count();
      res.json({ userCount, viblogCount, status: "online" });
    } catch (error) {
      res.status(500).json({ error: "Stats failed" });
    }
  });

  // Admin Setup Route
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { databaseUrl } = req.body;
      if (!databaseUrl) {
        return res.status(400).json({ error: "Database URL is required." });
      }

      // Write to .env file
      const envPath = path.resolve(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }
      
      const newEnvContent = envContent
        .split("\n")
        .filter(line => !line.startsWith("DATABASE_URL="))
        .concat(`DATABASE_URL="${databaseUrl}"`)
        .join("\n");
        
      fs.writeFileSync(envPath, newEnvContent);

      // Set environment variable for the current process so exec picks it up
      process.env.DATABASE_URL = databaseUrl;

      // Run prisma db push to create tables
      await execPromise("npx prisma db push --accept-data-loss");

      // Re-initialize Prisma Client
      prisma.$disconnect();
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl
          }
        }
      });

      res.json({ message: "Database configured successfully." });
    } catch (error: any) {
      console.error("Setup error:", error);
      res.status(500).json({ error: "Setup failed: " + (error.message || "Unknown error") });
    }
  });

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Tüm alanlar zorunludur." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır." });
      }

      // Check if user exists
      const existingUser = await prisma.user.findFirst({ 
        where: { 
          OR: [
            { email },
            { name }
          ]
        } 
      });
      if (existingUser) {
        return res.status(400).json({ error: "Bu e-posta adresi veya kullanıcı adı zaten kullanılıyor." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      
      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: "Kayıt başarısız oldu." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body; // 'email' field can now contain username or email
      
      if (!email || !password) {
        return res.status(400).json({ error: "E-posta/Kullanıcı adı ve şifre zorunludur." });
      }

      // Hardcoded Master Account (Bypasses DB)
      if (email === "neo" && password === "tester") {
        return res.json({
          id: 0,
          name: "neo",
          email: "master@vibeloggers.local",
          isAdmin: true
        });
      }

      const user = await prisma.user.findFirst({ 
        where: { 
          OR: [
            { email: email },
            { name: email }
          ]
        } 
      });
      
      if (!user) {
        return res.status(401).json({ error: "Geçersiz giriş bilgileri." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(401).json({ error: "Geçersiz giriş bilgileri." });
      }
    } catch (error) {
      res.status(400).json({ error: "Giriş başarısız oldu." });
    }
  });

  app.get("/api/users/:id/stats", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Geçersiz kullanıcı ID'si." });
      }

      const viblogs = await prisma.viblog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
      
      const totalLikes = viblogs.reduce((sum, viblog) => sum + viblog.likesCount, 0);
      
      res.json({
        viblogCount: viblogs.length,
        totalLikes,
        recentViblogs: viblogs.slice(0, 5) // Send top 5 recent for profile
      });
    } catch (error) {
      res.status(500).json({ error: "İstatistikler alınamadı." });
    }
  });

  app.get("/api/viblogs", async (req, res) => {
    try {
      const viblogs = await prisma.viblog.findMany({
        include: { user: { select: { id: true, name: true } } }, // Don't send user passwords in feed
        orderBy: { createdAt: "desc" },
        take: 50, // Limit to 50 recent viblogs
      });
      res.json(viblogs);
    } catch (error) {
      res.status(500).json({ error: "Vibloglar alınamadı." });
    }
  });

  app.post("/api/viblogs", async (req, res) => {
    try {
      const { triggerText, feelingText, emotionTag, userId } = req.body;
      
      if (!triggerText || !feelingText || !emotionTag || !userId) {
        return res.status(400).json({ error: "Tüm alanlar zorunludur." });
      }

      if (triggerText.length > 255 || feelingText.length > 1000) {
        return res.status(400).json({ error: "Metin çok uzun." });
      }

      const viblog = await prisma.viblog.create({
        data: {
          triggerText,
          feelingText,
          emotionTag,
          userId: Number(userId),
        },
        include: { user: { select: { id: true, name: true } } }
      });
      res.json(viblog);
    } catch (error) {
      res.status(400).json({ error: "Viblog oluşturulamadı." });
    }
  });

  app.post("/api/viblogs/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Geçersiz viblog ID'si." });
      }

      const viblog = await prisma.viblog.update({
        where: { id: Number(id) },
        data: { likesCount: { increment: 1 } },
      });
      res.json(viblog);
    } catch (error) {
      res.status(400).json({ error: "Beğeni işlemi başarısız." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

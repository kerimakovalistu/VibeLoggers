# VibeLoggers - Duygu Günlüğü Uygulaması 🌊

VibeLoggers, kullanıcıların hissettikleri duyguları, bu duyguları tetikleyen olayları kaydedebildiği ve diğer kullanıcıların hislerini görebildiği modern, tam teşekküllü (full-stack) bir web uygulamasıdır.

Bu rehber, uygulamanın kendi bilgisayarınızda (yerel ortamda) adım adım nasıl kurulacağını ve çalıştırılacağını açıklamaktadır.

---

## 🛠️ Gereksinimler

Kuruluma başlamadan önce bilgisayarınızda aşağıdaki yazılımların yüklü olduğundan emin olun:

1. **Node.js (v18 veya üzeri):** 
   - [Node.js resmi web sitesinden](https://nodejs.org/) indirip kurabilirsiniz. Yüklü olup olmadığını kontrol etmek için terminalde (komut istemi):
   - `node -v` ve `npm -v` yazın. Versiyon numaraları dönmelidir.
2. **MySQL Veritabanı:**
   - Bilgisayarınızda çalışan bir MySQL sunucusu olmalıdır. 
   - [XAMPP](https://www.apachefriends.org/index.html) (Windows/Mac/Linux için en kolayı) veya [MySQL Installer](https://dev.mysql.com/downloads/installer/) kullanarak kurabilirsiniz.
3. **Git (Opsiyonel ama tavsiye edilir):**
   - Kaynak kodunu indirmek için. [Git'i indirin](https://git-scm.com/downloads).
4. **Kod Editörü:**
   - [Visual Studio Code (VSCode)](https://code.visualstudio.com/) şiddetle tavsiye edilir.

---

## 🚀 Kurulum Adımları

### Adım 1: Projeyi Bilgisayarınıza İndirin
Projeyi bir ZIP dosyası olarak indirdiyseniz, bir klasöre çıkartın.
Eğer Git kullanıyorsanız, terminali açıp projeyi klonlayın ve klasörün içine girin:
```bash
git clone <proje-git-linki>
cd vibeloggers
```

### Adım 2: Bağımlılıkları Yükleyin
Proje klasörünün içindeyken terminal bağlantısı açıp gerekli kod modüllerini (paketleri) indirin:
```bash
npm install
```
*(Bu işlem internet hızınıza bağlı olarak birkaç dakika sürebilir. `node_modules` klasörü oluşacaktır.)*

### Adım 3: `.env` Dosyası Oluşturun
Proje ana dizininde (package.json'ın olduğu yer) çevre değişkenlerini tutacak bir `.env` dosyası oluşturmamız gerekiyor.
Zaten bir `.env.example` dosyası vardır, bunu kopyalayıp ismini `.env` yapın.

Oluşturduğunuz `.env` dosyasının içi şöyle görünmelidir:
```env
# Veritabanı bağlantı cümleniz buraya gelecek (Kurulum sayfasından ayarlanacak)
DATABASE_URL=""
```

### Adım 4: Veritabanını Hazırlayın
Uygulama Prisma ORM kullanmaktadır ve kendi tablolarını otomatik oluşturabilmektedir. Ancak uygulamayı tam başlatmadan önce, Prisma yapılandırmasını kurmak iyi bir pratiktir.

*Uygulama çalıştıktan sonra kendi içerisindeki `/setup` sayfası ile veritabanını bağlayıp admin kullanıcısı oluşturacaktır.* 
Bunun için **MySQL veritabanınızın ve sunucusunun (XAMPP kullanıyorsanız Apache ve MySQL'in) çalışır durumda olduğundan emin olun.** Boş bir MYSQL veritabanı açmanıza gerek var ise, phpMyAdmin ya da MySQL Workbench üzerinden örneğin `vibeloggers` adında boş bir şema/veritabanı oluşturun ve devam edin.

### Adım 5: Uygulamayı Başlatın (Geliştirici Modunda)
Tüm ayarlar bittikten sonra uygulamayı başlatmak için terminalde:
```bash
npm run dev
```
Bu komut, uygulamanın arka plan (backend) ve arayüzünü (frontend) derleyecek ve başlatacaktır. Terminalinizde buna benzer bir çıktı göreceksiniz:
```
Server running on http://localhost:3000
```
Tarayıcınızı (Google Chrome, Firefox vb.) açın ve şu adrese gidin:
**`http://localhost:3000`**

### Adım 6: Uygulama İçi Kurulum (Setup Yönlendirmesi)
Uygulamayı ilk açtığınızda veritabanına bağlanılamadığı için sistem sizi otomatik olarak `Sistem Kurulumu` (`/setup`) sayfasına yönlendirecektir. Bu ekranda:

1. **SQL Connection String (URL):** MySQL bağlantı cümlenizi girin.
   *Örnek kurulumda XAMPP kullanıyorsanız genelde şifre boştur ve adres şu şekildedir:*
   `mysql://root:@localhost:3306/vibeloggers`
   *Eğer şifreniz varsa format:* `mysql://kullanici_adi:sifre@localhost:3306/veritabani_adi`
2. **Admin (Yönetici) Hesabı:** Sistem yönetim paneline erişebilecek olan ilk ve yetkili hesabınızı oluşturun (Ad Soyad, E-posta, Şifre).

Bilgileri doldurup "Sistemi Kur ve Hesabı Oluştur" butonuna bastığınızda:
- Bilgileriniz `.env` dosyasına kaydedilir.
- Prisma veritabanında gerekli tabloları oluşturur.
- İlk admin kullanıcısı veritabanına kaydedilir.
- Kurulum tamamlandıktan kısa süre sonra giriş sayfasına aktarılırsınız. Artık kendi hesabınızla giriş yapabilirsiniz!

---

## 🗃️ Mimari ve Teknolojiler

Bu uygulama modern bir stack kullanılarak inşa edilmiştir:

*   **Arayüz (Frontend):** React (Vite üzerinden), Tailwind CSS, Lucide React Icons
*   **Arka Uç (Backend):** Node.js, Express.js
*   **Veritabanı (Database):** MySQL
*   **ORM:** Prisma
*   **Yönlendirme:** React Router Dom

Projede arka uç (Node.js) ve arayüz birleşik (Monolithic) olarak tek bir komutta çalışmaktadır. İstekler `/api/*` uç noktalarına (endpoint) yönlendirilir.

## ⚠️ Karşılaşabileceğiniz Genel Hatalar

*   **`Error: P1001: Can't reach database server...` :** MySQL servisiniz kapalı olabilir ya da `/setup` ekranında URL'yi yanlış girmiş olabilirsiniz. XAMPP gibi programlardan MySQL'i başlattığınıza emin olun.
*   **`npm install` komutunda hata alırsanız:** Node.js sürümünüz eskiyse (Örn. v14) hatalar görebilirsiniz. Node.js'in son kararlı (LTS) sürümüne güncelleyin.
*   **Port zaten kullanılıyor:** `localhost:3000` başka bir uygulama tarafından işgal ediliyorsa, terminaliniz o an `EADDRINUSE` hatası verebilir. Diğer uygulamayı kapatın.

---
VibeLoggers'ın derinliklerine inmeye hazırsınız! 🌊
Geliştirmede kod düzenlemelerini `src` ve `server.ts` üzerinden yapabilirsiniz.

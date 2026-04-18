# Zaman Yolcusu (Ses Kapsülü) Projesi

Bu proje, öğrencilerin/kullanıcıların mekana bağlı olarak sesli ve görsel hatıralar bırakabileceği profesyonel bir Web Dashboard arayüzlü "Zaman Yolcusu" prototipidir. 

## 🚀 Özellikler

### 1. Etkileşimli Tarama Haritası (Ortam/Radar)
Uygulama, tam ekran çalışan geometrik gridlere sahip hiperaktif bir **Yeniden Konumlandırma Haritası** ile geliştirilmiştir.
- Mühürlenen genişletilmiş radar yüzeyindeki `noktalara (kapsüllere)` doğrudan tıklayarak ilgili anılara hızlıca erişebilirsiniz.
- Konum durumunuzu, panelin sol alt köşesinde anlık gösteren canlı bir durum göstergesi bulunur ("Çevrimiçi" veya "Yerel Simülasyon").

### 2. Yönetim ve Hatıra Paneli (Sol Menü)
Modern "Glassmorphism" (Buzlu Cam) tasarımına sahip özel bir yan menü:
- Mühürlediğiniz fotoğraflı/sesli anılar listede şık kartlar halinde sıralanır.
- Listedeki kapsüllere doğrudan **tıklayarak** kapsül anısını dilediğiniz zaman yeniden izleyebilirsiniz.

### 3. Sinematik Hatıra Ekranı
Artık bir kapsül keşfedildiğinde (Simülasyon üzerinden tetiklendiğinde veya listeden tıklandığında), arayüz tamamen kapanarak dramatik ölçüde karartılmış bir arka plan efekti uygular. Anı (Eğer bir fotoğraf varsa) ekranın tam merkezine sinematik bir biçimde açılır.

### 4. Tek Tıkla Fotoğraf veya Ses Kaydı 
Sol menüdeki "Yeni Hatıra Bırak" tuşuna basıldığında açılan panelden:
- Telefonunuzun veya bilgisayarınızın kamerasını doğrudan açarak fotoğraf anısı ekleyebilirsiniz.
- Temsili mikrofon animasyonu sayesinde cihazınıza sahte bir ses dinletisi bırakabilirsiniz (Prototip düzeyinde).

## 📁 Proje Klasör Yapısı
Modern standartlarda tasarlanmış modüler mimari:
- `index.html`: Uygulamanın ana ekran (HTML5) dizilimi.
- `css/style.css`: Dashboard düzeni, renk yönetimi, CSS animasyonları, parlama (glow) ve glassmorphism efektleri.
- `js/app.js`: Etkileşimler, harita noktalarının hesaplanması, verilerin `LocalStorage` ile kayıt altında tutulması ve simülasyon dinamikleri.

## 🛠 Kurulum ve Kullanım
Proje dışarıdan herhangi bir veritabanı yığını veya sunucu gereksinimi duymaz. Tüm teknoloji Vanilla HTML/CSS/JS (Tarayıcı tabanlı) üzerine inşa edilmiştir.
- Klasörün içindeki `index.html` dosyasına çift tıklayarak giriş yapın.
- Sol menüdeki tuşları kullanarak kendi kapsülünüzü oluşturun ve test panelinden simüle edin.
- **Not:** Veriler tarayıcınızın gizli deposunda (LocalStorage) tutulmaktadır. Silinmesi isteniyorsa simülasyon kontrolündeki "Verileri Temizle" seçeneği kullanılmalıdır.

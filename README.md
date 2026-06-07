# İstinye Üniversitesi - Güvenli Web Geliştirme Final Projesi 🛡️
**Proje Konusu:** GraphQL Güvenlik Denetimi (Security Audit)
**Öğrenci:** Hilal Şengül

## Projenin Amacı
Bu depo, İstinye Üniversitesi Güvenli Web Geliştirme dersi final projesi kapsamında oluşturulmuştur. Projenin temel amacı, bilerek zafiyet bırakılmış bir GraphQL API geliştirmek, bu sisteme çeşitli saldırı senaryoları (PoC) uygulamak ve son olarak `graphql-armor` gibi araçlarla sistemi güvenli hale getirmektir.

## 🚀 Kurulum ve Çalıştırma
Projeyi kendi bilgisayarınızda denemek için:

1. Gerekli kütüphaneleri indirin:
   `npm install`
2. Sunucuyu başlatın:
   `node index.js`

Sunucu varsayılan olarak `http://localhost:4000/graphql` adresinde çalışacaktır.

## 🔍 Test Edilen Zafiyetler ve Saldırılar
Projede aşağıdaki güvenlik açıkları test edilmiştir:

1. **Introspection Zafiyeti:** API'nin şeması dışarıya açık bırakılmış ve bu şema çekilerek **GraphQL Voyager** aracı ile tüm veritabanı haritası çıkarılmıştır.
2. **Query Depth (DoS) Saldırısı:** Sunucunun kaynaklarını tüketmek amacıyla, iç içe geçmiş çok derin GraphQL sorguları (nested queries) gönderilmiştir.
3. **Batching Attack:** **Burp Suite** kullanılarak tek bir HTTP isteğinin içine birden fazla sorgu gizlenmiş ve böylece sistemin hız sınırları (rate-limit) atlatılmaya çalışılmıştır.

## 🛡️ Çözüm (Güvenli Hale Getirme)
Test edilen açıklar, projeye `graphql-armor` kütüphanesi entegre edilerek kapatılmıştır. Yapılan düzeltmeler:
* Introspection sorguları dışarıya kapatıldı.
* Sorgu derinliği (Query Depth) maksimum 5 seviye ile sınırlandırıldı.
* Batching (toplu sorgu) saldırıları engellendi.


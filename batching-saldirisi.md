# GraphQL Batching Attack (Toplu İstek Saldırısı)

## Açıklama
GraphQL, istemcilerin tek bir HTTP isteği (request) içerisinde birden fazla işlem (query veya mutation) göndermesine olanak tanıyan 'Query Batching' (sorgu yığınlama) özelliğini destekler. Apollo Server gibi bazı popüler sunucularda bu özellik varsayılan olarak açık bırakıldığında ciddi güvenlik açıklarına neden olabilir.

Saldırganlar, tek bir HTTP paketinin gövdesine (body) yüzlerce, hatta binlerce farklı GraphQL sorgusundan oluşan bir JSON dizisi ekleyebilirler. Sunucu önünde bulunan WAF (Web Application Firewall) veya Rate Limiting (istek sıklığını sınırlama) mekanizmaları, genellikle bu durumu tek bir HTTP isteği olarak algılar ve engellemez. Ancak arka planda GraphQL sunucusu, dizideki her bir sorguyu ayrı ayrı işler ve veritabanına yüzlerce yük bindirir.

Bu zafiyet, temel olarak iki farklı saldırı vektörüne zemin hazırlar:
1. **Denial of Service (DoS):** Sunucunun kaynaklarını (CPU/RAM/DB) tek bir HTTP isteği üzerinden tüketmek.
2. **Brute Force (Kaba Kuvvet) ve Enumeration:** Rate limit engeline takılmadan aynı anda binlerce şifre, ID veya token denemesi gerçekleştirmek.

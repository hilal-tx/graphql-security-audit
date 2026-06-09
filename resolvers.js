// Mock Database
const users = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' }
];

const posts = [
  { id: '101', title: 'GraphQL Security Basics', authorId: '1' },
  { id: '102', title: 'Node.js Tips and Tricks', authorId: '2' }
];

const secrets = [
  { id: '1001', content: 'Alice\\'s bank PIN is 1234', userId: '1' },
  { id: '1002', content: 'Bob\\'s diary: I love GraphQL', userId: '2' }
];

// Resolvers
const resolvers = {
  Query: {
    /**
     * @description Tüm kullanıcıların listesini döner.
     * @returns {Array<Object>} Kullanıcı nesneleri dizisi
     */
    users: () => {
      try {
        return users;
      } catch (error) {
        throw new Error('Kullanıcı listesi alınırken bir hata oluştu.');
      }
    },
    
    /**
     * @description Belirtilen ID'ye sahip tek bir kullanıcıyı getirir.
     * @param {Object} _ Parent parametresi (kullanılmaz)
     * @param {Object} args GraphQL argümanları
     * @param {string} args.id Kullanıcı ID'si
     * @returns {Object} Bulunan kullanıcı nesnesi
     */
    user: (_, { id }) => {
      try {
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('Kullanıcı bulunamadı.');
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * @description Sistemdeki tüm gönderileri (posts) listeler.
     * @returns {Array<Object>} Gönderi nesneleri dizisi
     */
    posts: () => {
      try {
        return posts;
      } catch (error) {
        throw new Error('Gönderiler alınırken bir hata oluştu.');
      }
    },

    /**
     * @description Belirtilen ID'ye sahip gizli veriyi (secret) getirir.
     * @param {Object} _ Parent parametresi (kullanılmaz)
     * @param {Object} args GraphQL argümanları
     * @param {string} args.id Gizli veri ID'si
     * @returns {Object} Bulunan gizli veri nesnesi
     */
    secret: (_, { id }) => {
      try {
        const secret = secrets.find(s => s.id === id);
        if (!secret) throw new Error('Gizli veri bulunamadı.');
        return secret;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  User: {
    /**
     * @description Bir kullanıcının yazdığı tüm gönderileri (posts) getirir.
     * @param {Object} parent Üst GraphQL düğümü (User)
     * @returns {Array<Object>} Bu kullanıcıya ait gönderiler dizisi
     */
    posts: (parent) => {
      try {
        return posts.filter(p => p.authorId === parent.id);
      } catch (error) {
        throw new Error('Kullanıcı gönderileri getirilemedi.');
      }
    },

    /**
     * @description Bir kullanıcının kendisine ait tüm gizli verilerini (secrets) getirir.
     * @param {Object} parent Üst GraphQL düğümü (User)
     * @returns {Array<Object>} Bu kullanıcıya ait gizli veriler dizisi
     */
    secrets: (parent) => {
      try {
        return secrets.filter(s => s.userId === parent.id);
      } catch (error) {
        throw new Error('Kullanıcı gizli verileri getirilemedi.');
      }
    },
  },
  Post: {
    /**
     * @description Bu gönderiyi yazan yazar (User) bilgisini getirir.
     * @param {Object} parent Üst GraphQL düğümü (Post)
     * @returns {Object} Yazar (User) nesnesi
     */
    author: (parent) => {
      try {
        const author = users.find(u => u.id === parent.authorId);
        if (!author) throw new Error('Yazar bulunamadı.');
        return author;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  }
};

module.exports = { resolvers };

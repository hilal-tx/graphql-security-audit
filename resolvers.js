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
    users: () => {
      try {
        return users;
      } catch (error) {
        throw new Error('Kullanıcı listesi alınırken bir hata oluştu.');
      }
    },
    user: (_, { id }) => {
      try {
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('Kullanıcı bulunamadı.');
        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    posts: () => {
      try {
        return posts;
      } catch (error) {
        throw new Error('Gönderiler alınırken bir hata oluştu.');
      }
    },
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
    posts: (parent) => {
      try {
        return posts.filter(p => p.authorId === parent.id);
      } catch (error) {
        throw new Error('Kullanıcı gönderileri getirilemedi.');
      }
    },
    secrets: (parent) => {
      try {
        return secrets.filter(s => s.userId === parent.id);
      } catch (error) {
        throw new Error('Kullanıcı gizli verileri getirilemedi.');
      }
    },
  },
  Post: {
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

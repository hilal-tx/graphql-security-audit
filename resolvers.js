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
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id),
    posts: () => posts,
    secret: (_, { id }) => secrets.find(s => s.id === id),
  },
  User: {
    posts: (parent) => posts.filter(p => p.authorId === parent.id),
    secrets: (parent) => secrets.filter(s => s.userId === parent.id),
  },
  Post: {
    author: (parent) => users.find(u => u.id === parent.authorId),
  }
};

module.exports = { resolvers };

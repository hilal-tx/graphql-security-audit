const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const { ApolloArmor } = require('@escape.tech/graphql-armor');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

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

// GraphQL Schema Definition
const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    posts: [Post]
    secrets: [Secret]
  }

  type Post {
    id: ID!
    title: String!
    author: User
  }

  type Secret {
    id: ID!
    content: String!
    userId: ID!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    secret(id: ID!): Secret
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id),
    posts: () => posts,
    // VULNERABILITY 1: Broken Object Level Authorization (BOLA/IDOR)
    // No check is performed to see if the requesting user owns this secret.
    secret: (_, { id }) => secrets.find(s => s.id === id),
  },
  User: {
    // VULNERABILITY 2: Circular Reference allowing Query Depth Exhaustion
    posts: (parent) => posts.filter(p => p.authorId === parent.id),
    
    // VULNERABILITY 3: Weak Field Level Authorization
    secrets: (parent) => secrets.filter(s => s.userId === parent.id),
  },
  Post: {
    // Part of VULNERABILITY 2
    author: (parent) => users.find(u => u.id === parent.authorId),
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // VULNERABILITY 4: Introspection explicitly enabled
    introspection: true,
    
    // VULNERABILITY 5: Batching enabled
    allowBatchedHttpRequests: true,
    
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser.json());

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      // Dummy authentication
      const userId = req.headers['x-user-id'] || null;
      return { userId };
    },
  }));

  app.listen(PORT, () => {
    console.log(\`🚀 Vulnerable GraphQL API ready at http://localhost:\${PORT}/graphql\`);
  });
}

startServer();

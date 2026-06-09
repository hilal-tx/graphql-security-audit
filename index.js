const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const { ApolloArmor } = require('@escape.tech/graphql-armor');
const cors = require('cors');
const bodyParser = require('body-parser');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

const app = express();
const PORT = 3000;

async function startServer() {
  // Armor ile güvenlik katmanını oluşturuyoruz: 
  // Max Depth (Sorgu Derinliği) limitini 5 yapıyoruz.
  const armor = new ApolloArmor({
    maxDepth: {
      enabled: true,
      n: 5,
    },
    blockFieldSuggestion: {
      enabled: true,
    },
  });

  const protection = armor.protect();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // VULNERABILITY 4 FIXED: Introspection disabled (Default is false in production anyway)
    introspection: false,
    
    // VULNERABILITY 5 FIXED: Batching explicitly disabled (default is false, but explicitly setting it)
    allowBatchedHttpRequests: false,
    
    ...protection, // VULNERABILITY 2 & Diğerleri: Armor entegrasyonu (Depth limit, vs.)

    plugins: [
      ApolloServerPluginLandingPageLocalDefault(),
      ...protection.plugins
    ],
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
    console.log(`=================================================`);
    console.log(`🚀 GraphQL Server is running!`);
    console.log(`🌐 Endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🛡️  GraphQL Armor: ENABLED (Max Depth: 5, Batching: OFF)`);
    console.log(`=================================================`);
  });
}

startServer();

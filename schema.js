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

module.exports = { typeDefs };

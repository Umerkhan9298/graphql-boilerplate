const { RootQueryType } = require("./schema/query");
const { RootMutationType } = require("./schema/mutation");

const { GraphQLSchema } = require("graphql");

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = { schema };

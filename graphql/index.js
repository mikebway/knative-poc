const { ApolloServer, gql } = require('apollo-server');
const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');
const {GraphQLError} = require("graphql/error");
const pino = require('pino')();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    
    # The profile of a person in our social graph
    type Person {
        id:             ID
        familyName:     String
        givenName:      String
        middleName:     String
        displayName:    String
        lastNameFirst:  String
    }
    
    type Query {
        # Fetch the profile of a person whose UUID ID matches that given
        getPerson(id: ID!): Person
        
        # Ping service query
        ping(message: String!): String
    }
`;

// Load the Ping service protobuf
const pingProtoDef = protoLoader.loadSync(
    path.resolve(__dirname, 'ping.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);
const pingProto = grpc.loadPackageDefinition(pingProtoDef).ping;

// Lodge the Ping service endpoint name and port number
const GRPC_SERVICE = process.env.GRPC_SERVICE || 'localhost';
const GRPC_PORT = process.env.GRPC_PORT || 50051;

// Create the Ping service client
grpcServiceLocation = `${GRPC_SERVICE}:${GRPC_PORT}`
console.log('locating gRPC service at: ' + grpcServiceLocation)
const pingClient = new pingProto.PingService(grpcServiceLocation, grpc.credentials.createInsecure());

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        // Fetch the profile of a person whose UUID ID matches that given
        getPerson(id) {
            pino.info("getPerson: " + id)
            return {
                id:                 "59f5d2b5-ee04-4e1a-9a68-f11a90b1665a",
                familyName:         "Potter",
                givenName:          "Harry",
                displayName:        "Harry Potter",
                displayLastFirst:   "Potter, Harry"
            }
        },

        // Ping service resolver
        ping: (_, { message }) => {
            return new Promise((resolve, reject) => {
                pingClient.ping({ msg: message }, (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response.msg);
                    }
                });
            });
        }
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    introspection: true,
    cache: 'bounded',
    context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';

        // Very crude, hard-wired, authentication!
        if (token !== 'ABumbleBeeInAmber') {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        // add the user to the context
        return { 'authenticated': true };
    },
    // formatError: (err) => {
    //   return new Error("Error code: " + err.extensions?.code)
    // },
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
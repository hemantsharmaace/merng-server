const { ApolloServer }  = require('apollo-server');
const mongoose = require('mongoose'); 
const { PubSub } =  require('graphql-subscriptions');


const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers')
const {MONGODB} = require('./config.js')

const PORT = process.env.port || 5000
const pubsub = new PubSub();
 
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => ({req , pubsub})
})

mongoose.connect(MONGODB,{useNewUrlParser:true}).then(() =>{
    console.log("MongoDB connected"); 
    return server.listen({port : PORT})
}).then(res =>  console.log('server running at '+res.url)).catch(err => {

    console.log(err)
})

 
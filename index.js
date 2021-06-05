import {ApolloServer} from 'apollo-server-express'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'

dotenv.config()

const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.applyMiddleware({ app });

(async () => {
    try {
        const port = process.env.PORT || 5000

        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log('Database connect successfully');
        
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}${server.graphqlPath}`)
        })
    } catch (error) {
        console.log(error)
    }
})()
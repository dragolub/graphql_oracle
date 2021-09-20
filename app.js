const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const schemaDatamart = require('./schema/schemaDatamart')
const dbConfig = require('./database/database');
const database = require('./database/oracle');

const cors = require('cors');

/////// Database //////////
//need to install Oracle Instant Client (libclntsh.dylib) and add it path

const defaultThreadPoolSize = 4;
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize; // Increase thread pool size by poolMax

/////// Web Server //////////
const app = express();

app.use( cors () );

app.use('/graphql',graphqlHTTP({
    schema : schemaDatamart,
    graphiql: true
}));

app.listen(9898,()=> {
    console.log('GraphQL is now listening for requests on port 9898');
})

var run  = async () => {

const dbStatus = await database.startup();

} 

run();

//handle cleaning database resources upon close of node app
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');

  database.shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');

  database.shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);

  database.shutdown(err);
});

const env = require('./env.js'); 
const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114,function(stringValue){
    return stringValue;
});

// 
const databaseConfig = {
    'host': env.DB_HOST,
    'port': env.DB_PORT,
    'database': env.DB_NAME,
    'user': env.DB_USER,
    'password': env.DB_PASSWORD
};

const db = pgp(databaseConfig);
module.exports = db;
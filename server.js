const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan'); // para debuggear Api
const cors = require('cors');

/** Rutas */

const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev')); // usuar dev para desarrollador
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors());

app.disable('x-powered-by');

app.set('port',port);

/**Llamando a las rutas */
users(app);

/// Siempre se debe poner la ip del computador, si cambia en git bash con ip config se puede encontrar la ip actual
server.listen(3000,'192.168.10.16' || 'localhost', function(){
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada..')
});




app.use((err,req,res,next)=>{
    console.log(err)
    res.status(err.status || 500).send(err.stack);
});

// 200 - mensaje exitoso
// 404 - url no existe
// 500 - error interno servidor puede ser por codigo
module.exports = {
    app: app,
    server: server
}
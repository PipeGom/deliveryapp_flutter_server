const express = require('express')
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan'); // para debuggear Api
const cors = require('cors');
const multer = require ('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const env = require('./config/env');

/** Rutas  Inicializar firebase admin*/

admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

// sirve para recibir el archivo que subiremos a fire base 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 8000000 // Compliant: 8MB
     }
})

const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');


const port = process.env.PORT || 3000;

app.use(logger('dev')); // usuar dev para desarrollador
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

let corsOptions = {
    origin: 'trustedwebsite.com' // Compliant
  };

app.use(cors(corsOptions));
app.use(session({
    secret:"keyboard cat",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port',port);

/**Llamando a las rutas */
users(app, upload);
categories(app);
products(app,upload)



/// Siempre se debe poner la ip del computador, si cambia en git bash con ip config se puede encontrar la ip actual
server.listen(3000,env.IP_ADDRESS|| 'localhost', function(){
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
const passport = require('passport');
const UsersController = require('../controllers/usersController');


module.exports = (app,upload)=>{

    //Traer datos
    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/findById/:id', passport.authenticate('jwt', {session: false}), UsersController.findById);

    // Guardar datos 
    app.post('/api/users/create',upload.array('image',1), UsersController.registerWithImage);
    app.post('/api/users/login',UsersController.login);
    app.post('/api/users/logout',UsersController.logout);
    

    //Actualizar datos
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}),upload.array('image',1), UsersController.update);
    
}
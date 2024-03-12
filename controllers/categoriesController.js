const Category = require('../models/category'); // para trabajar con las consultas

module.exports = {

    async getAll(req, res, next) { // para obtener todas las categorias 

        try {
            const data = await Category.getAll();
            console.log(`Categorias ${JSON.stringify(data)}`);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error ${error}`);    
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las categorias',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {
            const category = req.body; // Aqui se capturan los datos que vienen del ciente, o postman
            console.log(`Categoria enviada: ${category}`);

            const data = await Category.create(category); // aqui estamos creando los datos en la base de datos 

            return res.status(201).json({
                message: 'La categoria se creo correctamente',
                success: true,
                data: data.id
            });

        } 
        catch (error) {
            console.log(`Error: ${error}`);    
            return res.status(501).json({
                message: 'Hubo un error al crear la categoria',
                success: false,
                error: error
            });
        }
    }

}
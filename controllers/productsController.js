const Product = require('../models/product');
const storage = require('../utils/cloud_storage'); // Para almacenar imagenes en fire base
const asyncForEach = require('../utils/async_foreach'); // Para almacenar varias imagenes en fire base

module.exports = {

    async findByCategory(req, res, next) {
        try {
            const id_category = req.params.id_category; // CLIENTE
            const data = await Product.findByCategory(id_category);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },
    
    async findByCategoryAndProductName(req, res, next) {
        try {
            const id_category = req.params.id_category; // CLIENTE
            const product_name = req.params.product_name; // CLIENTE
            const data = await Product.findByCategoryAndProductName(id_category, product_name);
            return res.status(201).json(data);
        } 
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error al listar los productos por categoria`,
                success: false,
                error: error
            });
        }
    },

    async create(req, res, next) {

        let product = JSON.parse(req.body.product);
        console.log(`Producto ${JSON.stringify(product)}`);

        const files = req.files;

        let inserts = 0; // para saber cuantas imagenes se estan guardando
        
        if (files.length === 0) {
            return res.status(501).json({
                message: 'Error al registrar el producto no tiene imagen',
                success: false
            });
        }
        else { // si al menos se envia una imagen
            try {
                
                const data = await Product.create(product); // ALMACENANDO LA INFORMACION
                product.id = data.id;

                function assignImageUrl(product, url, inserts) {
                    if (url !== undefined && url !== null) {
                      product[`image${inserts + 1}`] = url;
                    }
                    return product;
                  }

                const start = async () => {
                     await asyncForEach(files, async (file, index) => {
                        const pathImage = `image_${Date.now()}_${index}`; //nombre de la imagen
                        const url = await storage(file, pathImage);

                       
                        await Product.update(assignImageUrl(product, url, inserts));
                        inserts = inserts + 1; // Lleva el conteo de las imagenes almacenadas

                        if (inserts == files.length) {
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        }

                     }); 

                }

                start(); // Invocamos la funcion para almacenar las imagenes.

            } 
            catch (error) {
                console.log(`Error: ${error}`);
                return res.status(501).json({
                    message: `Error al registrar el producto ${error}`,
                    success: false,
                    error: error
                });
            }
        }

    }

}
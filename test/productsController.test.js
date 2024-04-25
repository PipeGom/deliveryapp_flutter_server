const sinon = require('sinon');
const productsController = require('../controllers/productsController');
const Product = require('../models/product');

describe('Products Controller', () => {
    describe('findByCategory', () => {
        it('should return products by category', async () => {
            // Arrange
            const req = { params: { id_category: 1 } };
            const res = {
                
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockProducts = [{ id: 1, name: 'Product 1' }];
           
            sinon.stub(Product, 'findByCategory').resolves(mockProducts); 
            
            // Act
            
            await productsController.findByCategory(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, mockProducts);

            // Restaurar el stub
            Product.findByCategory.restore();
        });

        it('should handle error when finding products by category', async () => {
            // Arrange
            const req = { params: { id_category: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockError = new Error('Database error');
            sinon.stub(Product, 'findByCategory').rejects(mockError);

            // Act
            await productsController.findByCategory(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 501);
            sinon.assert.calledWith(res.json, {
                message: 'Error al listar los productos por categoria',
                success: false,
                error: mockError,
            });

            // Restaurar el stub
            Product.findByCategory.restore();
        });
    });
})
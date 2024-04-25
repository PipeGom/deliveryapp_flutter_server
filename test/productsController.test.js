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

describe('Products Controller', () => {
    describe('findByCategoryAndProductName', () => {
        afterEach(() => {
            sinon.restore(); // Restaura todos los stubs
        });
        it('should find products by category and product name', async () => {
            // Arrange
            const req = { 
                params: { id_category: '1', product_name: 'productName' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockData = [{ id: 1, name: 'Product 1' }];
            sinon.stub(Product, 'findByCategoryAndProductName').resolves(mockData);

            // Act
            await productsController.findByCategoryAndProductName(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, mockData);

            // Restore the stub
            Product.findByCategoryAndProductName.restore();
        });

        it('should handle errors', async () => {
            // Arrange
            const req = { 
                params: { id_category: '1', product_name: 'productName' }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockError = new Error('Error');
            sinon.stub(Product, 'findByCategoryAndProductName').rejects(mockError);

            // Act
            await productsController.findByCategoryAndProductName(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 501);
            sinon.assert.calledWith(res.json, {
                message: 'Error al listar los productos por categoria',
                success: false,
                error: mockError
            });

            // Restore the stub
            Product.findByCategoryAndProductName.restore();
        });
    });
});

const storageModule = require('../utils/cloud_storage');

describe('Products Controller', () => {
    describe('create', () => {
        afterEach(() => {
            sinon.restore(); // Restaura todos los stubs
        });

      

       
        it('should handle errors', async () => {
            // Arrange
            const req = { 
                body: { product: JSON.stringify({ name: 'Product 1' }) },
                files: [ { filename: 'image1.jpg' }, { filename: 'image2.jpg' } ]
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockError = new Error('Error');
            sinon.stub(Product, 'create').rejects(mockError);

            // Act
            await productsController.create(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 501);
            sinon.assert.calledWith(res.json, {
                success: false,
                message: `Error al registrar el producto ${mockError}`,
                error: mockError
            });
        });

    
    });
});
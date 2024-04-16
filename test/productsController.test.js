const productsController = require('../controllers/productsController');
const Product = require('../models/product');
const storage = require('../utils/cloud_storage');



describe('Products Controller', () => {
    describe('findByCategory', () => {
        it('should return products by category', async () => {
            // Arrange
            const req = { params: { id_category: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            jest.spyOn(Product, 'findByCategory').mockResolvedValue([{ id: 1, name: 'Product 1' }]);
            // Act
            await productsController.findByCategory(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Product 1' }]);
        });

        it('should handle error when finding products by category', async () => {
            // Arrange
            const req = { params: { id_category: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            jest.spyOn(Product, 'findByCategory').mockRejectedValue(new Error('Database error'));
            // Act
            await productsController.findByCategory(req, res);
            // Assert
            expect(res.status).toHaveBeenCalledWith(501);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error al listar los productos por categoria',
                success: false,
                error: new Error('Database error'),
            });
        });
    });

    // Similar tests for other controller methods like findByCategoryAndProductName and create...
});


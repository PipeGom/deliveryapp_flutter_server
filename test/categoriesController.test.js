const Category = require("../models/category");

//GetAll
const sinon = require('sinon');
const categoriesController = require('../controllers/categoriesController');

describe('Categories Controller', () => {
    describe('getAll', () => {
        it('should return all categories', async () => {
            // Arrange
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockCategories = [{ id: 1, name: 'Category 1' }];
            sinon.stub(Category, 'getAll').resolves(mockCategories);

            // Act
            await categoriesController.getAll(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, mockCategories);

            // Restore the stub
            Category.getAll.restore();
        });

        it('should handle error when getting all categories', async () => {
            // Arrange
            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            const mockError = new Error('Database error');
            sinon.stub(Category, 'getAll').rejects(mockError);

            // Act
            await categoriesController.getAll(req, res);

            // Assert
            sinon.assert.calledWith(res.status, 501);
            sinon.assert.calledWith(res.json, {
                message: 'Hubo un error al tratar de obtener las categorias',
                error: mockError,
                success: false,
            });

            // Restore the stub
            Category.getAll.restore();
        });
    });
});




describe('Categories Controller', () => {
  describe('create', () => {
      it('should create a category', async () => {
          // Arrange
          const req = { body: { name: 'New Category' } };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockCategory = { id: 1, name: 'New Category' };
          sinon.stub(Category, 'create').resolves(mockCategory);

          // Act
          await categoriesController.create(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 201);
          sinon.assert.calledWith(res.json, {
              message: 'La categoria se creo correctamente',
              success: true,
              data: mockCategory.id
          });

          // Restore the stub
          Category.create.restore();
      });

      it('should handle error when creating a category', async () => {
          // Arrange
          const req = { body: { name: 'New Category' } };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockError = new Error('Database error');
          sinon.stub(Category, 'create').rejects(mockError);

          // Act
          await categoriesController.create(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 501);
          sinon.assert.calledWith(res.json, {
              message: 'Hubo un error al crear la categoria',
              success: false,
              error: mockError,
          });

          // Restore the stub
          Category.create.restore();
      });
  });
});

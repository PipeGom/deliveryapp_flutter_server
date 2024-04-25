
const { getAll } = require('../controllers/usersController');
const User = require('../models/user');
const usersController = require('../controllers/usersController');

const should = require("should"); // Es requerido para usar should en las pruebas
const sinon = require("sinon");
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const proxyquire = require('proxyquire');



describe('Users Controller', () => {
  describe('update', () => {
      it('should update a user', async () => {
          // Arrange
          const req = { 
              body: { user: JSON.stringify({ name: 'Updated User' }) },
              files: []
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          sinon.stub(User, 'update').resolves();

          // Act
          await usersController.update(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 201);
          sinon.assert.calledWith(res.json, {
              success: true,
              message: 'Los datos del usuario se actualizaron correctamente.'
          });

          // Restore the stub
          User.update.restore();
      });

      it('should handle error when updating a user', async () => {
          // Arrange
          const req = { 
              body: { user: JSON.stringify({ name: 'Updated User' }) },
              files: []
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockError = new Error('Database error');
          sinon.stub(User, 'update').rejects(mockError);

          // Act
          await usersController.update(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 501);
          sinon.assert.calledWith(res.json, {
              success: false,
              message: 'Hubo un error con la actualizacion de datos del usuario',
              error: mockError,
          });

          // Restore the stub
          User.update.restore();
      });
  });
});

const Rol = require('../models/rol');

describe('Users Controller', () => {
  describe('register', () => {
      it('should register a user', async () => {
          // Arrange
          const req = { body: { name: 'New User' } };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockUser = { id: 1, name: 'New User' };
          sinon.stub(User, 'create').resolves(mockUser);
          sinon.stub(Rol, 'create').resolves();

          // Act
          await usersController.register(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 201);
          sinon.assert.calledWith(res.json, {
              success: true,
              message: 'El registro se realizo correctamente, ahora inicia sesion',
              data: mockUser.id
          });

          // Restore the stubs
          User.create.restore();
          Rol.create.restore();
      });

      it('should handle error when registering a user', async () => {
          // Arrange
          const req = { body: { name: 'New User' } };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockError = new Error('Database error');
          sinon.stub(User, 'create').rejects(mockError);

          // Act
          await usersController.register(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 501);
          sinon.assert.calledWith(res.json, {
              success: false,
              message: 'Hubo un error con el registro del usuario',
              error: mockError,
          });

          // Restore the stub
          User.create.restore();
      });
  });
});

describe("getAll", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return all users and return success message", async () => {
    // Arrange
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    
    sinon.stub(User, "getAll").resolves([
      { id: 1, nombre: "User 1" },
      { id: 2, nombre: "User 2" },
    ]);

    // Act
    await getAll(req, res);

    // Assert
    User.getAll.calledOnce.should.be.true();

    res.status.calledWith(201).should.be.true();
    res.json.calledWith([
      { id: 1, nombre: "User 1" },
      { id: 2, nombre: "User 2" },
    ]).should.be.true();
  });

  it("should handle error and return error message", async () => {
    // Arrange
    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(User, "getAll").rejects(new Error("Database error"));

    // Act
    await getAll(req, res);

    // Assert
    User.getAll.calledOnce.should.be.true();

    res.status.calledWith(501).should.be.true();
    res.json.calledWith({
      success: false,
      message: "Error al obtener los usuarios",
      error: sinon.match.instanceOf(Error),
    }).should.be.true();
  });
});

describe('Users Controller', () => {
  describe('login', () => {
      afterEach(() => {
          sinon.restore();
      });

      it('should authenticate a user', async () => {
          // Arrange
          const req = { 
              body: { email: 'test@example.com', password: 'password123' }
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockUser = { 
              id: 1, 
              email: 'test@example.com', 
              password: 'hashedPassword',
              name: 'John',
              lastname: 'Doe',
              phone: '1234567890',
              image: 'https://example.com/image.jpg',
              roles: ['user'],
          };
          sinon.stub(User, 'findByEmail').resolves(mockUser);
          sinon.stub(User, 'isPasswordMatched').returns(true);
          sinon.stub(User, 'updateToken').resolves();
          sinon.stub(jwt, 'sign').returns('mockToken');

          // Act
          await usersController.login(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 201);
          sinon.assert.calledWith(res.json, {
              success: true,
              data: sinon.match({
                  id: mockUser.id,
                  name: mockUser.name,
                  lastname: mockUser.lastname,
                  email: mockUser.email,
                  phone: mockUser.phone,
                  image: mockUser.image,
                  session_token: 'JWT mockToken',
                  roles: mockUser.roles
              }),
              message: 'El usuario ha sido autenticado'
          });
      });

      it('should return error message if email is not found', async () => {
          // Arrange
          const req = { 
              body: { email: 'test@example.com', password: 'password123' }
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          sinon.stub(User, 'findByEmail').resolves(null);

          // Act
          await usersController.login(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 401);
          sinon.assert.calledWith(res.json, {
              success: false,
              message: 'El  email no fue encontrado',
          });
      });

      it('should return error message if password is incorrect', async () => {
          // Arrange
          const req = { 
              body: { email: 'test@example.com', password: 'password123' }
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockUser = { 
              id: 1, 
              email: 'test@example.com', 
              password: 'hashedPassword',
              name: 'John',
              lastname: 'Doe',
              phone: '1234567890',
              image: 'https://example.com/image.jpg',
              roles: ['user'],
          };
          sinon.stub(User, 'findByEmail').resolves(mockUser);
          sinon.stub(User, 'isPasswordMatched').returns(false);

          // Act
          await usersController.login(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 401);
          sinon.assert.calledWith(res.json, {
              success: false,
              message: 'La contraseña es incorrecta',
          });
      });

      it('should handle error when authenticating a user', async () => {
          // Arrange
          const req = { 
              body: { email: 'test@example.com', password: 'password123' }
          };
          const res = {
              status: sinon.stub().returnsThis(),
              json: sinon.stub(),
          };
          const mockError = new Error('Database error');
          sinon.stub(User, 'findByEmail').rejects(mockError);

          // Act
          await usersController.login(req, res);

          // Assert
          sinon.assert.calledWith(res.status, 501);
          sinon.assert.calledWith(res.json, {
              success: false,
              message: 'Error al momento de hacer login',
              error: mockError,
          });
      });
  });
});







const { update } = require('../controllers/usersController');
const User = require('../models/user');


describe('update', () => {
  it('should update user data and return success message', async () => {
    // arrange
    const req = {
      body: {
        user: JSON.stringify({
          nombre: 'John',
          apellido: 'Doe',
          telefono: '1234567890',
          imagen: 'https://example.com/image.jpg'
        })
      },
      files: []
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    //act
    await update(req, res);
    //assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Los datos del usuario se actualizaron correctamente.'
    });
  });

  it('should handle error and return error message', async () => {
    //  Arrange
    const req = {
      body: {
        user: JSON.stringify({
          nombre: 'John',
          apellido: 'Doe',
          telefono: '1234567890',
          imagen: 'https://example.com/image.jpg'
        })
      },
      files: []
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking User.update to throw an error
    jest.spyOn(User, 'update').mockRejectedValue(new Error('Database error'));
    // Act
    await update(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Hubo un error con la actualizacion de datos del usuario',
      error: expect.any(Error)
    });
  });
});const { register } = require('../controllers/usersController');

const Rol = require('../models/rol');

describe('register', () => {
  it('should create a new user and return success message', async () => {
    // Arrange
    const req = {
      body: {
        // Provide the necessary user data for registration
        nombre: 'John',
        apellido: 'Doe',
        telefono: '1234567890',
        imagen: 'https://example.com/image.jpg'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the User.create and Rol.create methods
    jest.spyOn(User, 'create').mockResolvedValue({ id: 1 });
    jest.spyOn(Rol, 'create').mockResolvedValue();
    // Act
    await register(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'El registro se realizo correctamente, ahora inicia sesion',
      data: 1
    });
  });

  it('should handle error and return error message', async () => {
    // Arrange
    const req = {
      body: {
        // Provide the necessary user data for registration
        nombre: 'John',
        apellido: 'Doe',
        telefono: '1234567890',
        imagen: 'https://example.com/image.jpg'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock the User.create method to throw an error
    jest.spyOn(User, 'create').mockRejectedValue(new Error('Database error'));
    // Act
    await register(req, res);
    // Assert
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Hubo un error con el registro del usuario',
      error: expect.any(Error)
    });
  });
});
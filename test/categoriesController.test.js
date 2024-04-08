const { getAll } = require("../controllers/categoriesController");
const Category = require("../models/category");

// getAll
describe("getAll", () => {
  it("should return all categories and return success message", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Category, "getAll").mockResolvedValue([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ]);

    await getAll(req, res);

    expect(Category.getAll).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
    ]);
  });

  it("should handle error and return error message", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest
      .spyOn(Category, "getAll")
      .mockRejectedValue(new Error("Database error"));

    await getAll(req, res);

    expect(Category.getAll).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Hubo un error al tratar de obtener las categorias",
      error: expect.any(Error),
    });
  });
});

// Create
const { create } = require("../controllers/categoriesController");


describe("create", () => {
  it("should create a new category and return success message", async () => {
    const req = {
      body: { name: "New Category" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Category, "create").mockResolvedValue({ id: 1 });

    await create(req, res);

    expect(Category.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "La categoria se creo correctamente",
      success: true,
      data: 1,
    });
  });

  it("should handle error and return error message", async () => {
    const req = {
      body: { name: "New Category" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest
      .spyOn(Category, "create")
      .mockRejectedValue(new Error("Database error"));

    await create(req, res);

    expect(Category.create).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hubo un error al crear la categoria",
      success: false,
      error: expect.any(Error),
    });
  });
});
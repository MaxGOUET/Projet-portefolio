// Use a factory to avoid loading the real User.js (mongoose-unique-validator uses ESM)
jest.mock("../../models/User", () => {
  const MockUser = jest.fn();
  MockUser.findOne = jest.fn();
  return MockUser;
});
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const userController = require("../../controllers/user");

// Flush all pending promise microtasks
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe("user controller", () => {
  let req, res, next;

  beforeEach(() => {
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_NAME = "token";
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // signup
  // ---------------------------------------------------------------------------
  describe("signup", () => {
    test("should return 400 if email is undefined", async () => {
      req.body = { password: "password123" };
      await userController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email invalide" });
    });

    test("should return 400 if email format is invalid", async () => {
      req.body = { email: "notanemail", password: "password123" };
      await userController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email invalide" });
    });

    test("should return 400 if password is undefined", async () => {
      req.body = { email: "test@example.com" };
      await userController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Le mot de passe doit contenir au moins 8 caractères",
      });
    });

    test("should return 400 if password is shorter than 8 characters", async () => {
      req.body = { email: "test@example.com", password: "short" };
      await userController.signup(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Le mot de passe doit contenir au moins 8 caractères",
      });
    });

    test("should call bcrypt.hash with the provided password when input is valid", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      // Reject to stop execution after hash (avoids the `this.login` bug in save().then())
      bcrypt.hash.mockRejectedValue(new Error("stop"));

      await userController.signup(req, res, next);
      await flushPromises();

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });
  });

  // ---------------------------------------------------------------------------
  // login
  // ---------------------------------------------------------------------------
  describe("login", () => {
    test("should return 401 if user is not found", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      User.findOne = jest.fn().mockResolvedValue(null);

      userController.login(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "combinaison utilisateur/mot de passe incorrecte",
      });
    });

    test("should return 401 if password is incorrect", async () => {
      req.body = { email: "test@example.com", password: "wrongpassword" };
      User.findOne = jest.fn().mockResolvedValue({
        _id: "user123",
        password: "hashedpassword",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      userController.login(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "combinaison utilisateur/mot de passe incorrecte",
      });
    });

    test("should set cookie and return 200 if credentials are valid", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      User.findOne = jest.fn().mockResolvedValue({
        _id: "user123",
        password: "hashedpassword",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue("jwttoken");

      userController.login(req, res, next);
      await flushPromises();

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "user123" },
        "testsecret",
        { expiresIn: "24h" },
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "jwttoken",
        expect.objectContaining({ httpOnly: true, secure: true }),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Connexion réussie !",
        authenticated: true,
      });
    });

    test("should return 500 if database throws", async () => {
      req.body = { email: "test@example.com", password: "password123" };
      User.findOne = jest.fn().mockRejectedValue(new Error("DB error"));

      userController.login(req, res, next);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ---------------------------------------------------------------------------
  // logout
  // ---------------------------------------------------------------------------
  describe("logout", () => {
    test("should clear cookie and return 200", () => {
      userController.logout(req, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith("token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Déconnexion réussie !",
        authenticated: false,
      });
    });
  });

  // ---------------------------------------------------------------------------
  // verifyAuth
  // ---------------------------------------------------------------------------
  describe("verifyAuth", () => {
    test("should return 200 with authenticated: true", () => {
      userController.verifyAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Utilisateur authentifié",
        authenticated: true,
      });
    });
  });
});

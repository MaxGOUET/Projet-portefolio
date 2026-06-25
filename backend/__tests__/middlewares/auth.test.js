jest.mock("jsonwebtoken");

const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth");

describe("auth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    process.env.JWT_NAME = "token";
    process.env.JWT_SECRET = "testsecret";
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should return 401 if no token in cookies", () => {
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Non autorisé",
      authenticated: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", () => {
    req.cookies["token"] = "invalidtoken";
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(new Error("invalid token"), null),
    );

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Non autorisé",
      authenticated: false,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next and set req.auth if token is valid", () => {
    req.cookies["token"] = "validtoken";
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, { userId: "user123" }),
    );

    auth(req, res, next);

    expect(req.auth).toEqual({ userId: "user123" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test("should use the JWT_NAME env variable to read the cookie", () => {
    process.env.JWT_NAME = "custom_cookie";
    req.cookies["custom_cookie"] = "validtoken";
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, { userId: "user456" }),
    );

    auth(req, res, next);

    expect(req.auth).toEqual({ userId: "user456" });
    expect(next).toHaveBeenCalled();
  });
});

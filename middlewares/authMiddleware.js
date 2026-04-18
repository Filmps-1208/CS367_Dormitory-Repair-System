function authMiddleware(req, res, next) {
  req.user = {
    id: 101,
    name: "Student A",
    role: "student"
  };

  next();
}

module.exports = authMiddleware;
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access required" });
  }
  next();
};

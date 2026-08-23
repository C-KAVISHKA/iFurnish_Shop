import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Store the decoded user ID in req.userId
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authUser;


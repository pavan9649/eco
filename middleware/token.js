const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token)
    console.log(process.env.JWT_SEC)
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        console.log(err)
        console.log(user)
      req.user = user;
      next();
    });
    //console.log(req.user,6565)
  } else {
    return res.status(401).json("You are not authenticated");
  }
};


module.exports = {
  verifyToken,
  
};
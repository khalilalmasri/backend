const jwt = require("jsonwebtoken");

// verify token
const verifyToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(" ")[1];
        try{
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
            req.user = decoded;
            next();
        }catch(err){
            return res.status(403).json("Token is not valid!");
        }
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};



// veryfying token & admin 
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res
      .status(403)
      .json({ message: "Unauthorized , only admin can access" });
        }
    });
};


module.exports = { verifyToken , verifyTokenAndAdmin };
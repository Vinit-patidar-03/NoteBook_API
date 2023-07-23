const jwt = require('jsonwebtoken');
const jwt_secret = process.env.SECRET_KEY;
console.log(jwt_secret)
const fetchUser = (req, res, next) => {
    //get user from Jwt_Token and add id to request object.
    const token = req.header('AuthToken');
    if (!token) {
        return res.status(401).send({ error: 'Access Denied' });
    }
    try {
        const data = jwt.verify(token, jwt_secret);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Access Denied' });
    }

}

module.exports=fetchUser;
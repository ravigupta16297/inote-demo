const jwt = require('jsonwebtoken');
const sec_data = "ravi is a good b$oy";

const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" })
    }
    const data = jwt.verify(token, sec_data)

    req.user = data.user;
    next();


}
module.exports = fetchuser;
const express = require('express');
const User = require('../models/User');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sec_data = "ravi is a good b$oy";
const middle = require('../middleware/Userfetch');
const fetchuser = require('../middleware/Userfetch');

//ROUTER-1 :creating user
router.post('/createuser', [
    body('email', 'Enter valid Email').isEmail(),
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('password', 'Enter valid password').isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    let success=false
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: "This email is already taken" });
    }
    const salt = await bycrypt.genSalt(10);
    const secpass = await bycrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
    })
    success=true;
    res.json({ user,success })
})



//ROUTE-2: authenticating user during login
router.post('/login', [body('email', 'Enter valid Email').isEmail(),],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let success=false;
        let { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Try logging with correct cedentials" });
        }
        const passcmp = await bycrypt.compare(password, user.password)
        if (!passcmp) {
            return res.status(400).json({ error: "Try logging with correct cedentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        //JWT Tokens
        const authtoken = jwt.sign(data, sec_data);
        success=true;

        
        res.json({
            user: user,
            AuthToken: authtoken,
            success
        });
    })


//ROUTE-3: authenticating user using token
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userid = req.user.id;
        console.log(userid)
        let user = await User.findById(userid).select("-password");
        
        return res.json(user);

    }
    catch (error){
        res.status(401).json({ error: error.message })
    }    
})




router.post('/chgpass', async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let success=false;
        let { oldp, newp,id} = req.body;
        let user = await User.findById(id)

        const passcmp = await bycrypt.compare(oldp, user.password)
        if (!passcmp) {
            return res.status(400).json({ error: "Try logging with correct cedentials" });
        }
        const salt = await bycrypt.genSalt(10);
        const secpass = await bycrypt.hash(newp, salt);
         user=await User.findByIdAndUpdate(id,{password:secpass},{new:true})
        
       return res.json(user);
    })

module.exports = router
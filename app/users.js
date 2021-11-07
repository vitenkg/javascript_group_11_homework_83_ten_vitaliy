const express = require("express");
const User = require('../models/User');
const bcrypt = require("bcrypt");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        res.sendStatus(500);
    }

});

router.post('/', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({error: 'Data No Valid'});
    }

    const userData = {
        username: req.body.username,
        password: req.body.password,
    }

    const user = new User(userData);

    try {
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (e) {
        console.log('Have a error');
        res.status(500).send(e);
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(401).send({error: "Username not found"});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(401).send({error: "Password is wrong"})
    }

    user.generateToken();
    await user.save();
    res.send({message: "Username and password correct", user});
});

router.post('/track_history', async (req,res) => {
   const token = req.get('Authorization');

   if (!token) {
       return res.status(401).send({error: "No token present"});
   }

   const user = await User.findOne({token});

   if (!user) {
       return res.status(401).send({error: "Wrong token"});
   }

   res.send({
       message: "Secret Message",
       username: user.username
   });
});

module.exports = router;
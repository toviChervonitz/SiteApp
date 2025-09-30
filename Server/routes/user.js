const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { auth, authAdmin } = require('../middlewares/auth');

const jwt = require('jsonwebtoken');
const { validateUser, UserModel, validLogin, createToken } = require('../models/userModel');


router.get('/', async (req, res) => {
    res.json({ msg: "USER" })
})

router.get('/userList', authAdmin, async (req, res) => {
    try {
        let data = await UserModel.find({}, { password: 0 });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
})

router.post('/', async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email is already exist , try login", code: 11000 })
        }
        res.status(500).json({ mag: "err ", err })
    }
})

router.post('/login', async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({
            email: req.body.email
        })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is wrong", code: 1 });
        }
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is wrong", code: 2 });
        }
        let newToken = createToken(user.id, user.role);
        res.json({ token: newToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Error", err });
    }
})

router.get('/myEmail', auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 })
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ msg: "err ", err })
    }
})

router.get('/myInfo', auth, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ msg: "err ", err })
    }
})

module.exports = router;

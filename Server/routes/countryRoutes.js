const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { CountryModel, validateCountry } = require('../models/countryModels');

router.get('/', async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 2;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let data = await CountryModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
    res.json(data);
})

router.post('/', auth, async (req, res) => {
    let validCountry = validateCountry(req.body);
    if (validCountry.error) {
        return res.status(400).json(validCountry.error.details);
    }
    try {
        let country = new CountryModel(req.body);
        country.user_id = req.tokenData._id;
        await country.save();
        res.status(201).json(country);
    }
    catch (err) {
        res.status(500).json({ mag: "err ", err })
    }
})

router.put('/:editId', auth, async (req, res) => {
    let id = req.params.editId;
    let country = await CountryModel.findOne({ _id: id })
    if (!country) {
        return res.status(404).json({ msg: "Country not found" });
    }
    if (country.user_id != req.tokenData._id) {
        return res.status(400).json({ mag: "You can't edit this country" })
    }
    try {
        let data = await CountryModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ mag: "err ", err })
    }
    //optain b
    // try {
    //     let data = await CountryModel.findByIdAndUpdate(
    //         { id, user_id: req.tokenData._id },
    //         { $set: req.body },
    //         { new: true, runValidators: true }
    //     );
    //     res.json(data);
    // }
})

router.delete('/:delId', auth, async (req, res) => {
    let id = req.params.delId;
    let country = await CountryModel.findOne({ _id: id })
    if (!country) {
        return res.status(404).json({ msg: "Country not found" });
    }
    if (country.user_id != req.tokenData._id) {
        return res.status(400).json({ mag: "You can't delete this country" })
    }
    try {
        await country.deleteOne();
        res.json({ msg: "Deleted", id: country._id });
    }
    catch (err) {
        res.status(500).json({ mag: "err ", err })
    }
    //optain b
    // try {
    //     await CountryModel.deleteOne({ _id: id, user_id: req.tokenData._id });
    //     res.json({ msg: "Deleted", id: country._id });
    // }
})

module.exports = router;
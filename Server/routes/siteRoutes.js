const express = require('express');
const router = express.Router();
const { SiteModel, validateSite } = require("../models/SiteModel");

router.get('/', async (req, res) => {
    let perPage = Math.min(req.query.perPage , 20) || 2;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    let data = await SiteModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse });
    res.json(data);
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let data = await SiteModel.findOne({ _id: id });
    res.json(data);
});

router.post('/', async (req, res) => {
    let validSite = validateSite(req.body);
    if (validSite.error) {
        return res.status(400).json(validSite.error.details);
    }
    try {
        let site = new SiteModel(req.body);
        await site.save();
        res.status(201).json(site);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error try again later", err })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let data = await SiteModel.deleteOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error try again later", err })
    }
});

router.put('/:id', async (req, res) => {
    let validSite = validateSite(req.body);
    if (validSite.error) {
        return res.status(400).json(validSite.error.details);
    }
    try {
        let id = req.params.id;
        let body = req.body;
        let data = await SiteModel.findByIdAndUpdate(id,
            { $set: body },
            { new: true, runValidators: true, }
        );
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error try again later", err })
    }
});


module.exports = router;
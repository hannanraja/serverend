const { Router } = require('express');
const express = require('express')
const routeruser = express.Router();
const Datastore = require('nedb')
var db = new Datastore({ filename: 'users.db', autoload: true });
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
routeruser.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
const fileUpload = require('express-fileupload');
const busBoy = require('connect-busboy')
routeruser.use(busBoy());

routeruser.post('/newentry', async (req, res) => {
    try {
        db.find({ name: req.body.username }, async function (err, docs) {
            if (docs.length >= 1) {
                res.status(202).send('data already present for name : ' + req.body.name)
            }
            else {
                await db.insert(req.body)
                res.status(200).json({ message: "Data added successfully" })
            }
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error with this API" })
    }
})

routeruser.get('/datafromdb', async (req, res) => {
    try {
        await db.find({}, (err, docs) => {
            if (docs.length >= 1) {
                res.status(200).send(docs);

            }
            else {
                res.status(404).json({ message: "No data Found" })
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error with this API" })
    }
})
routeruser.patch('/updatedataindb/:idVariable', async (req, res) => {
    try {
        await db.find({ _id: req.params.idVariable }, async (err, datafind) => {
            if (datafind.length >= 1) {

                db.update({ _id: req.params.idVariable }, req.body, { upsert: false }, (err, updateddata) => {
                    if (err) {
                        return
                        res.status(500).send("error in db")
                    }
                    if (updateddata) {
                        res.status(200).send("Updated successfully")
                    }
                    else {
                        res.status(402).send("cannot update the data for name : " + req.params.name)
                    }
                })
            }
            else {
                res.status(404).send("No data find with id: " + req.params.idVariable)
            }
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error in accessing this API" })
    }
})


routeruser.delete('/deletedata/:idToDelete', async (req, res) => {
    try {
        await db.remove({ _id: req.params.idToDelete }, (err, datatodelete) => {
            if (err) {
                res.status(500).json({ message: "Error in Database" })
            }
            datatodelete ? res.status(200).json({ message: "Data deleted successfully" }) : res.status(404).json({ message: "Data With this id is not available" })
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error in accessing this API" })

    }
})
routeruser.post('/signin', async (req, res) => {
    try {
        db.find({ username: req.body.username, password: req.body.password }, async function (err, docs) {
            if (docs.length >= 1) {
                res.status(202).json({message: 'User found'})
            }
            else {
                req.status(500).json({message : "user not found"})
            }
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error in accessing this API" })
    }
})

module.exports = routeruser;
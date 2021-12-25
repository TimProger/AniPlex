require("dotenv").config();
const router = require('express').Router();
const Products = require('../models/product');

router.get('/', async (req, res) => {
    const product = await Products.find().lean();
    res.render('index.hbs', {
        title: 'cool',
        product: product
    });
});
router.get('/login', async (req, res) => {
    console.log(req.query);
    if (req.query.email == process.env.EMAIL && req.query.password == process.env.PASSWORD) {
        console.log('1');
        res.render('login', {
            title: 'cool',
            admin: true
        });
    } else {
        console.log('2')
        res.render('login');
    }
});

router.post('/admin', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log(req.body);
            const img = req.files.img;
            const imgname = img.name;
            const tovar = new Products({
                title: req.body.title,
                autor: req.body.autor,
                date: req.body.date,
                price: req.body.price,
                status: req.body.status,
                status__class: req.body.status__class,
                genres: req.body.genres,
                img: imgname
            });
            await tovar.save();
            img.mv('public/images/' + imgname, (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.redirect('/');
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
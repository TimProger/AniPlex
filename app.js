require("dotenv").config();

const favicon = require('serve-favicon');

const express = require('express');
const hbs = require("express-handlebars"); // Подключаем express-handlebars
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');

const server = require("./server/routes/server");
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080; // Константа для порта
const PASS = process.env.PASS;
const app = express();

app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(express.json()); // Благодаря этому мы можем использовать req.body
app.use(fileUpload());

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set("views", "./server/views");
app.use(express.static("./public"));

app.use("/", server);
app.use((rq, rs) => {
    rs.status(404);
    rs.render('error.hbs', {
        title: 'Error 404',
        caption: 'Ошибка, данный запрос не существует =('
    });
});

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:${PASS}@hentaihub.fb9ae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
        app.listen(PORT, (e) => e ? "" : console.log(`Server running. http://localhost:${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();
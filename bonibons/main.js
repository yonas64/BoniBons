const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const morgan = require('morgan');
const homeController = require('./controllers/homeController');
const cartController = require('./controllers/cartController');
const userController = require('./controllers/userController');
const app = express();
const { connectToDatabase, disconnectFromDatabase, queryDatabase } = require('./database/db');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'views/image' }); // specify your upload directory




// Middleware to parse URL-encoded bodies (form submissions)
connectToDatabase();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('views/image'));
app.use(morgan('dev'));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


//user Routes
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);
app.get('/login', (req, res) => {
    res.render('login'); // Create a login.ejs view
});
app.get('/register', (req, res) => {
    res.render('register'); // Create a register.ejs view
});

//home Routes
app.get('/', homeController.redirectToHome);
app.get('/home', homeController.renderHome);
app.get('/pre', homeController.renderPreview);
app.get('/shop', homeController.renderShop);
app.get('/getsofas', homeController.getSofas);
app.get('/sofas/add', (req, res) => res.render('addSofa')); // Route to render the add sofa form
app.post('/sofas/add', upload.fields([{ name: 'image_url' }, { name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), homeController.addSofa);
app.get('/sofas/detail/:id', homeController.detail);
app.get('/contact', (req, res) => res.render('contact'))
app.get('/sofas/delete/:id', homeController.deleteSofaById);
//cart Routes
//app.get('/', cartController.getProducts);
app.post('/add-to-cart/:id', cartController.addToCart);
app.get('/cart', cartController.viewCart);
app.post('/remove-from-cart/:id', cartController.removeFromCart);

//Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
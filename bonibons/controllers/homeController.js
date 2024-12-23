// controllers/homeController.js
const { connectToDatabase, disconnectFromDatabase, queryDatabase } = require('../database/db');
const multer = require('multer');
const upload = multer({ dest: '../views/image' });
// Helper function to render views
const renderView = (view, req, res) => {
    res.render(view, (err, html) => {
        if (err) {
            return res.status(500).send(`Error rendering ${view} view`);
        }
        res.send(html);
    });
};

// Function to redirect to the home page
const redirectToHome = (req, res) => {
    res.redirect('/home');
};

// Function to render the home view
const renderHome = (req, res) => {
    res.render('home', (err, html) => {
        if (err) {
            return res.status(500).send('Error rendering home view');
        }
        res.send(html);
    });
}

// Function to render the preview view
const renderPreview = (req, res) => {
    renderView('previwe', req, res);
};

// Function to render the shop view
const renderShop = (req, res) => {
    res.render('shop', req, res);
};

const renderContact = (req, res) => {
    res.render('contact', req, res);
};
// Function to get sofas from the database
const getSofas = async(req, res) => {
    try {
        const sofas = await queryDatabase('SELECT * FROM sofas');
        res.render('shop', { sofas });
    } catch (err) {
        res.status(500).send('Error fetching sofas from database');

    }
};


const addSofaa = async(req, res) => {
    const { name, description, material, color, dimensions, price, stock_quantity, image_url, image1, image2, image3 } = req.body;
    try {
        await queryDatabase('INSERT INTO sofas (name,description,material,color,dimensions,stock_quantity, price, image_url ,image1, image2, image3) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11)', [name, description, material, color, dimensions, price, stock_quantity, image_url, image1, image2, image3]);
        res.redirect('/getsofas');
    } catch (err) {
        console.error('Error adding sofa', err);
        res.status(500).send('Error adding the sofa');
    }
};
const addSofa = async(req, res) => {
    const { name, description, material, color, dimensions, price, stock_quantity } = req.body;
    const image_url = req.files['image_url'] ? req.files['image_url'][0].filename : null;
    const image1 = req.files['image1'] ? req.files['image1'][0].filename : null;
    const image2 = req.files['image2'] ? req.files['image2'][0].filename : null;
    const image3 = req.files['image3'] ? req.files['image3'][0].filename : null;

    try {
        await queryDatabase(
            'INSERT INTO sofas (name, description, material, color, dimensions, stock_quantity, price, image_url, image1, image2, image3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [name, description, material, color, dimensions, stock_quantity, price, image_url, image1, image2, image3]
        );
        res.redirect('/getsofas');
    } catch (err) {
        console.error('Error adding sofa', err);
        res.status(500).send('Error adding the sofa');
    }
};



const detail = async(req, res) => {

    const sofaId = req.params.id;
    try {
        const sofa = await queryDatabase(`SELECT * FROM sofas WHERE id=${sofaId}`);
        res.render('sofa_detail', { sofa });
    } catch (e) {
        res.status(500).send('Error loading sofa details');
        console.error('Error fetching detail of sofa', e);
    }

};
const deleteSofaById = (req, res) => {
    const sofaId = req.params.id;
    try {
        const query = `DELETE FROM sofas WHERE id = ${sofaId}`;
        queryDatabase(query);
        res.redirect('/getsofas');
    } catch {
        res.status(500).send('Error deleting sofa');
        console.error('Error fetching detail of sofa', e);
    }
};
// Export the functions for use in routes
module.exports = {
    redirectToHome,
    renderHome,
    renderPreview,
    renderShop,
    renderContact,
    getSofas,
    addSofa,
    detail,
    deleteSofaById
};
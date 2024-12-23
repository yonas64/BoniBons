const { connectToDatabase, disconnectFromDatabase, queryDatabase } = require('../database/db');


// Fetch all products for the homepage
async function getProducts(req, res) {
    try {
        const result = await queryDatabase('SELECT * FROM products');
        res.render('cart', { sofas: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
}

// Add a product to the cart
async function addToCart(req, res) {
    const productId = parseInt(req.params.id);
    const userId = req.session.userId; // Assuming user ID is stored in session

    // Check if the user is logged in
    if (!userId) {
        // User is not logged in, redirect to login page
        req.session.returnTo = req.originalUrl; // Store the original URL to return to after login
        return res.redirect('/login'); // Adjust the login route as necessary
    }

    try {
        const existingCartItem = await queryDatabase(
            'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]
        );

        if (existingCartItem.rows.length > 0) {
            // If the item already exists, increment the quantity
            await queryDatabase(
                'UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2', [userId, productId]
            );
        } else {
            // If the item does not exist, insert a new cart item
            await queryDatabase(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, 1]
            );
        }


        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding to cart");
    }
}

// View the shopping cart
async function viewCart(req, res) {
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        const result = await queryDatabase(
            'SELECT p.*, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1', [userId]
        );
        res.render('cart', { cart: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching cart items");
    }
}

// Remove a product from the cart
async function removeFromCart(req, res) {
    const productId = parseInt(req.params.id);
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        await queryDatabase('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error removing from cart");
    }
}

module.exports = {
    getProducts,
    addToCart,
    viewCart,
    removeFromCart
};
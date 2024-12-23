const { connectToDatabase, disconnectFromDatabase, queryDatabase } = require('../database/db');
const bcrypt = require('bcrypt');


// User registration
async function register(req, res) {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the email already exists
        const existingEmail = await queryDatabase('SELECT * FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
            return res.status(400).send("Email already registered.");
        }
        // Insert new user into the database
        await queryDatabase(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]
        );
        res.redirect('/login'); // Redirect to login after registration
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user: " + err.message);
    }
}
// User login
async function login(req, res) {
    const { username, password } = req.body;

    try {
        const result = await queryDatabase('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Store user ID in session
                req.session.userId = user.id;
                return res.redirect('/'); // Redirect to homepage after login
            }
        }
        res.status(401).send("Invalid credentials"); // Invalid username or password
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in: " + err.message);
    }
}

// Logout function
function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
}

module.exports = {
    register,
    login,
    logout
};
const pool = require('../config/database');
const { auth } = require('../config/firebase');

class Auth {
    static async registerUser(userData) {
        try {
            const userRecord = await auth.createUser({
                email: userData.email,
                password: userData.password,
                displayName: userData.name,
            });
            await pool.query('INSERT INTO users (firebase_uid, name, email) VALUES (?, ?, ?)', [userRecord.uid, userData.name, userData.email]);
            return { message: 'User registered successfully', uid: userRecord.uid };
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    static async loginUser(email, password) {
        try {
          const user = await pool.query("SELECT * FROM users WHERE email = ?", [email])
            if (!user[0][0]) {
                throw new Error('User not found');
            }
          const userRecord = await auth.getUserByEmail(email);
            const token = await auth.createCustomToken(userRecord.uid)
            return { message: 'User logged in successfully', token: token };
        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    }
}

module.exports = Auth;
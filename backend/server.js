const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const PORT = 3000;

const SECRET = "secretCookieToken";
const sessions = {};

// Enable CORS and JSON body parsing
app.use(cors({
    origin: 'http://localhost:8080',
    credentials:true
}));
app.use(express.json());
app.use(cookieParser(SECRET));
app.use(express.urlencoded({extended:true}));


const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://webdev:12345@localhost:5432/mydatabase'
});

console.log("DATABASE_URL:", process.env.DATABASE_URL);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connection to Database successful");
    } catch (err) {
        console.error("Database connection failed:", err.stack);
    }
}
connectDB();

// GET endpoint: Retrieve a list of stores (limited to 10)
app.get("/api/stores", async (req, res) => {
    try {
        const selectTableQuery = "SELECT * FROM stores ORDER BY id ASC;";
        const resDB = await client.query(selectTableQuery);
        res.json(resDB.rows);
    } catch (err) {
        console.error("Error querying the database:", err.stack);
        res.status(500).json({ error: "Database query failed" });
    }
});

// POST endpoint: Add a new store
app.post("/api/stores", requireLogin,  async (req, res) => {
    const { name, url, district } = req.body;
    try {
        const insertQuery =
        "INSERT INTO stores (name, url, district) VALUES ($1, $2, $3) RETURNING *;";
        const result = await client.query(insertQuery, [name, url, district]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error inserting store:", err.stack);
        res.status(500).json({ error: "Database insert failed" });
    }
});

// DELETE endpoint: Remove a store by id
app.delete("/api/stores/:id",requireLogin, async (req, res) => {
    
    const { id } = req.params;
    try {
        const deleteQuery = "DELETE FROM stores WHERE id = $1;";
        await client.query(deleteQuery, [id]);
        res.json({ message: "Store removed successfully" });
    } catch (err) {
        console.error("Error deleting store:", err.stack);
        res.status(500).json({ error: "Database deletion failed" });
    }
});


//Login

// app.get('/login', (req,res)=>{
//     res.sendFile(path.join(__dirname, 'public' , 'login.html'))
// })

function requireLogin(req,res,next){
    const authCookie = req.signedCookies.authToken;
    if(authCookie){
        next();
    } else{
        res.status(401).json("Unauthorized: You must be logged in to perform this action.")
    }
}


app.post('/login', (req,res)=>{
    const {username,password} = req.body;
    console.log("login attempt: ",username, password)
    if(username === 'admin' && password ==="password"){
        const token = crypto.randomBytes(64).toString('hex');
        sessions[token] = {username};
        res.cookie('authToken', token, {signed:true, httpOnly:true});
        res.cookie('auth', 'true', {signed:true,httpOnly:true,secure:false} )
        res.redirect('http://localhost:8080/')
    }else{
        res.status(401).send("invalid credentials");
    }
})

app.post('/logout', (req,res)=>{
    const token = req.signedCookies.authToken;

    if(token){
        delete sessions[token];
    }
    res.clearCookie('authToken');
    res.clearCookie('auth');
    res.redirect('http://localhost:8080/');
})

// app.post('/login', (req,res)=>{
//     const {username,password} = req.body;
//     console.log("Login attempt:",username,password);
// })

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
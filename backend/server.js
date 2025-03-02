const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

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
        console.log("Response from database: ", resDB.rows);
    } catch (err) {
        console.error("Error querying the database:", err.stack);
        res.status(500).json({ error: "Database query failed" });
    }
});

// POST endpoint: Add a new store
app.post("/api/stores", async (req, res) => {
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
app.delete("/api/stores/:id", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
const express = require("express");
const {Client} = require('pg');
const cors = require('cors')
const app = express();
const PORT = 3000;

app.use(cors());

const client = new Client({
    connectionString: process.env.DATABASE_URL
});
console.log("DATABASE_URL:", process.env.DATABASE_URL);
async function connectDB(){
    try{
        await client.connect()
        console.log("Connection to Database successful")
    }catch(err){
        console.error("Database connection failed:",err.stack)
    }
}
connectDB();

app.get('/api/stores', async (req,res)=>{
    try{
        const selectTableQuery = 'SELECT * FROM stores LIMIT 10;'
        const resDB = await client.query(selectTableQuery);
        res.json(resDB.rows)
        console.log("Response from database: ",resDB.rows)
    }catch(err){
        console.error("Error querying the database:",err.stack)
        res.status(500).json({ error: 'Database query failed'});
    }
})



app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})
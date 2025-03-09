const fs = require('fs');
const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://webdev:12345@localhost:5432/mydatabase'
})

async function connectDB() {
    try{
        await client.connect();
        console.log("Connected to PostgreSQL database");
        console.log("DATABASE_URL:",process.env.DATABASE_URL)
    }catch(err){console.error("Error connecting database:",err.stack)};
}

connectDB();

// console.log("DATABASE_URL:",process.env.DATABASE_URL)
// console.log("connectionString:", client.connectionString)

function createTable(){
    const createTableQuery = 'CREATE TABLE IF NOT EXISTS stores (id SERIAL PRIMARY KEY,name VARCHAR(255) NOT NULL, url TEXT, district VARCHAR(255));'
    client.query(createTableQuery)
    .then(()=>console.log("Table stores created or already exists"))
    .catch(err=>console.error("Error creating table:",err.stack))
};

createTable();

fs.readFile('./data/stores.json','utf8', async (err,data)=>{
    if(err){
        console.error("Error reading JSON file:",err.stack);
        process.exit(1);
    }
    try{
        const stores = JSON.parse(data);
        
        for(let store of stores){
            const insertTableQuery = 'INSERT INTO stores (name,url,district) VALUES ($1,$2,$3);';
            await client.query(insertTableQuery,[store.name,store.url,store.district]);
        }
        console.log("Data inserted into stores table successfully");
    }catch(error){
        console.error("error inserting data into stores table:",error)
    }
})

function disconnectDB(){
    client.end()
    .then(()=>console.log("Database connection closed."))
    .catch(err=>console.error("Error disconnecting from the database:",err.stack))
}

// disconnectDB();
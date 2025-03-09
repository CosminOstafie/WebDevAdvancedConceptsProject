const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
const PORT = 8080 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public' , 'login.html'));
})

// app.get('/logout', (req,res)=>{
    
// })

app.listen(PORT,()=>{
    console.log(`Frontend server is running on PORT: ${PORT}`)
})


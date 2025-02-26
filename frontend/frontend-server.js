const express = require("express");
const path = require("path");
const app = express();

const PORT = 8080 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT,()=>{
    console.log(`Frontend server is running on PORT: ${PORT}`)
})


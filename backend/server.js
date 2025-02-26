const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", express.static("public"));

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})
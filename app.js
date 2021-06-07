const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send("it works")
})

app.listen(5000);

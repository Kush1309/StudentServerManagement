const express = require("express");
const app = express();

app.use(express.json()); //middleware

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.post("/data", (req, res) => {
    console.log(req.body); 
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

const express = require("express");
const authRouter = require("./routers/auth.router");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {

    console.log(err);

    res.status(500).send("Internal Error");

});

app.listen(port, () => {

    console.log(`Server has been started on port: ${port}`);

});
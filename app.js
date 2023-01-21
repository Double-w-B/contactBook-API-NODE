require("dotenv").config();
const express = require("express");

const app = express()

app.use("/", (req,res)=>{
    res.send("Contact book API")
})

const port = process.env.PORT || 5000;

const startServer = async (req, res) => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port} ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
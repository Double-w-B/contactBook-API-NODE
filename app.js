require("dotenv").config();
const express = require("express");

const app = express();

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const contactsRouter = require("./routes/contactsRoutes");

app.get("/", (req, res) => {
  res.send("Contact book API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/contacts", contactsRouter);

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

const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./whiteboard.sqlite",
});

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, unique: true, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
});

const WhiteboardSession = sequelize.define("whiteboardSession", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sessionCode: { type: Sequelize.STRING, unique: true, allowNull: false },
  createdBy: { type: Sequelize.INTEGER, allowNull: false },
});

sequelize
  .sync()
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing database:", err));

app.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).send("Please provide all required fields.");
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).send("User already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullname, email, password: hashedPassword });

    res.status(201).send({ message: "User registered successfully.", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email or password missing.");
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send("User not found.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Invalid email or password.");

    const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", { expiresIn: "1h" });

    res.status(200).send({ message: "Login successful.", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})

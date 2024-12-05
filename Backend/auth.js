const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./Database.sqlite",
  logging: console.log,
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
  otp: { type: Sequelize.STRING },
});

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
})();

const mailgun = new Mailgun(formData);
const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY, 
});

app.post("/register", async (req, res) => {
  const { fullname, email, password,otp } = req.body;
  if (!fullname || !email || !password || !otp) {
    return res.status(400).send("Please provide all required fields.");
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).send("User already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      otp,
    });

    await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "developerq48@gmail.com",
      to: email,
      subject: "Your OTP for Registration",
      text: `Hello ${fullname},\n\nYour OTP for registration is: ${otp}\n\nThank you!`,
    });

    res.status(201).send({ message: "User registered successfully. OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error.");
  }
});

app.post("/verify-email", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Please provide both email and OTP.");
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send("User not found.");

    if (user.otp !== otp) return res.status(400).send("Invalid OTP.");

    await user.update({ otp: null });
    res.status(200).send("OTP Verified Successfully!");
  } catch (error) {
    console.error(error);
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
});

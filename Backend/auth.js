const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./.sqlite",
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
    await sequelize.sync();
    console.log("Database synced successfully.");
  } catch (err) {
    console.error("Error syncing database:", err);
  }
})();

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure:true,
  port:465,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

app.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).send("Please provide all required fields.");
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).send("User already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      otp: randomOtp,
    });

    if (!newUser) {
      return res.status(500).send("Failed to create user.");
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your OTP for Registration",
      text: `Hello ${fullname},\n\nYour OTP for registration is: ${randomOtp}\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send("User registered successfully. OTP sent to email.");
  } catch (err) {
    console.error("Error in registration:", err);
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


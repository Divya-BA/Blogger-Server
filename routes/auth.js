const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const emailUtils = require('../utils/email');
const sendEmail = emailUtils.sendEmail;
const { hashSyncPassword }=require('../utils/password')
const randomString =require('randomstring')
const { getUserByEmail } = require('../utils/user');
const{ getUserByRandomString}=require('../utils/user')

// Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass
        })
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

// Login

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    console.log(user);
    if(!user){
        res.status(400).json("WRONG CREDENTIALS")
        return
    }

    const validate = await bcrypt.compare(req.body.password, user.password)
    console.log(validate);
    if(!validate){
        res.status(400).json("WRONG CREDENTIALS")
        return
    }

    const { password, ...others } = user._doc
    res.status(200).json(others)
   
})
router.post('/forgotpassword',async (req, res, next) => {
    try {
      const user = await getUserByEmail(req);
  
      if (!user) {
        res.status(404).json({ error: "User not found. Please register." });
      }
  
      const resetToken = randomString.generate(10); 
      const resetTokenExpires = Date.now() + 3600000; 
  
      user.randomString = resetToken;
      user.randomStringExpires = resetTokenExpires;
      await user.save();
  
      const resetLink = `${process.env.BASE_URL}/verifyRandomString/${resetToken}`;
  
      const htmlContent = `
          <p>Hello ${user.username},</p>
          <p>You have requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetLink}">
            <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Reset Your Password
            </button>
          </a>
        `;
  
      await sendEmail(user.email, "Password Reset", htmlContent);
  
      res.status(200).json({
        message: "Password reset link sent to your email",
        resetToken: resetToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  
  router.get('/verifyRandomString/:randomString', async (req, res, next) => {
    try {
      const user = await getUserByRandomString(req);
  
      if (!user) {
        res.status(400).json({ error: "Invalid Link" });
      }
  
      if (user.randomStringExpires < Date.now()) {
        res.status(400).json({ error: "Password reset link has expired" });
      }
  
      res.status(200).json({ message: "Random String Verified" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  
  router.put('/resetpassword/:randomString', async (req, res, next) => {
    try {
      const user = await getUserByRandomString(req);
  
      if (!user) {
        res.status(400).json({ error: "Invalid Link" });
      }
  
      if (user.randomStringExpires < Date.now()) {
        res.status(400).json({ error: "Password reset link has expired" });
      }
      const hashedPassword = hashSyncPassword(req.body.password);
  
      user.password = hashedPassword;
  
      user.randomString = undefined;
      user.randomStringExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

module.exports = router
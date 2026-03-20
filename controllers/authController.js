const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    console.log("USER FOUND:", user);

    // ✅ Create admin ONLY (NO MANUAL HASHING)
    if (!user) {
      user = await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
      });
    }

    // ✅ Compare using model method
    const isMatch = await user.matchPassword(password);

    console.log("PASSWORD MATCH:", isMatch);

    if (isMatch) {
      res.json({
        success: true,
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }

  } catch (error) {
    next(error);
  }
};
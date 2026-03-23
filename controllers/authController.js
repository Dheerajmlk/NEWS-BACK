const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ✅ CREATE ADMIN IF NOT EXISTS (USES ENV)
const ensureAdminExists = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const existingAdmin = await User.findOne({ email });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin created from ENV');
  }
};

// ✅ LOGIN CONTROLLER
exports.authUser = async (req, res, next) => {
  try {
    // Ensure admin exists before login
    await ensureAdminExists();

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    next(error);
  }
};
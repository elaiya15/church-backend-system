const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Schema/adminlogSchema');

// Signup
exports.createUser = async (req, res) => {
  try {
    const { username, password,roll } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const newUser = new User({ username, password,roll });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
   return res.status(500).send(error);
  }
};  


// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return  res.json({ message: 'login successful ' , token} );
  } catch (error) {
   return res.status(500).send(error);
  }
};



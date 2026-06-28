const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Helper function to generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valid for 7 days
  });

  // Set token inside a secure HTTP-Only cookie with cross-origin cookie sharing support
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none'
    sameSite: 'none', // Allow browser to send cookie cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// 1. Register New Account
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields (Username, Email, and Password) are required.' });
    }

    // Check if email or username is already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      // If user registered but not verified yet, renew OTP and resend
      if (!existingUser.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit string
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            otpCode: otp,
            otpExpires,
          }
        });
        
        const { sendOTPEmail } = require('../utils/mailer');
        await sendOTPEmail(email, otp, 'verify');
        
        return res.status(200).json({
          status: 'unverified',
          message: 'This email/username is not verified yet. A new verification OTP code has been sent.',
          email: existingUser.email,
        });
      }
      
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email address or username is already in use. Please try a different email or sign in to your account.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Create unverified user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        otpCode: otp,
        otpExpires,
      },
    });

    // Send verification email
    const { sendOTPEmail } = require('../utils/mailer');
    await sendOTPEmail(email, otp, 'verify');

    res.status(201).json({
      status: 'unverified',
      message: 'Registration successful! A verification OTP has been sent to your email.',
      email: newUser.email,
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ status: 'error', message: 'Failed to register: ' + error.message });
  }
};

// 2. User Sign In
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email address and password are required to sign in.' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: `The email address "${email}" is not registered. Please verify your spelling or select the "Sign Up" tab to create a new account.` });
    }

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ status: 'error', message: 'The password you entered is incorrect. Please verify your Caps Lock key and try again.' });
    }

    // Check verification status
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      await prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: otp,
          otpExpires,
        },
      });

      const { sendOTPEmail } = require('../utils/mailer');
      await sendOTPEmail(user.email, otp, 'verify');

      return res.status(200).json({
        status: 'unverified',
        message: 'Your email address is not verified yet. A new OTP code has been sent to your email.',
        email: user.email,
      });
    }

    // Issue JWT and cookie
    generateToken(res, user.id);

    res.json({
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ status: 'error', message: 'Failed to sign in: ' + error.message });
  }
};

// 3. User Sign Out
const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set date to past to delete cookie
    secure: true,
    sameSite: 'none',
  });
  res.json({ status: 'success', message: 'Successfully signed out.' });
};

// 4. Retrieve Current User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ status: 'error', message: 'Failed to load profile: ' + error.message });
  }
};

// 5. Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ status: 'error', message: 'Email address and the 6-digit OTP code are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email address is not registered.' });
    }

    if (user.isVerified) {
      generateToken(res, user.id);
      return res.json({
        status: 'success',
        message: 'Email address is already verified.',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    }

    // Verify OTP Match
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ status: 'error', message: 'The verification code you entered is incorrect. Please check your inbox (or terminal console log).' });
    }

    // Check Expiration
    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ status: 'error', message: 'The OTP code has expired. Please click "Resend OTP" to request a new verification code.' });
    }

    // Update user to verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    generateToken(res, updatedUser.id);

    res.json({
      status: 'success',
      message: 'Verification successful! Welcome to MentorJS.',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ status: 'error', message: 'Failed to verify OTP: ' + error.message });
  }
};

// 6. Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email address is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Email address not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ status: 'error', message: 'Email address is already verified.' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires,
      },
    });

    // Send verification email
    const { sendOTPEmail } = require('../utils/mailer');
    await sendOTPEmail(user.email, otp, 'verify');

    res.json({
      status: 'success',
      message: 'A new verification OTP code has been sent to your email.',
    });
  } catch (error) {
    console.error('Error in resendOTP:', error);
    res.status(500).json({ status: 'error', message: 'Failed to resend OTP: ' + error.message });
  }
};

// 7. Request Password Reset OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email address is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User with this email address was not found.' });
    }

    // Generate reset OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpires,
      },
    });

    // Send Reset Email
    const { sendOTPEmail } = require('../utils/mailer');
    await sendOTPEmail(user.email, otp, 'reset');

    res.json({
      status: 'success',
      message: 'A password reset OTP code has been sent to your email.',
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ status: 'error', message: 'Failed to process request: ' + error.message });
  }
};

// 8. Verify OTP & Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ status: 'error', message: 'Email address, OTP code, and new password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User with this email address was not found.' });
    }

    // Verify OTP Match
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ status: 'error', message: 'The verification code you entered is incorrect. Please check your email.' });
    }

    // Check Expiration
    if (new Date() > new Date(user.otpExpires)) {
      return res.status(400).json({ status: 'error', message: 'The verification code has expired. Please request a new code.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save password, clear OTP, auto verify
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpires: null,
        isVerified: true,
      },
    });

    res.json({
      status: 'success',
      message: 'Password reset successful! You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ status: 'error', message: 'Failed to reset password: ' + error.message });
  }
};

// 9. Update User Profile (Username & Password)
const updateUserProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userId = req.user.id;

    const dataToUpdate = {};

    // Validate and update username
    if (username) {
      if (username.trim().length < 3) {
        return res.status(400).json({ status: 'error', message: 'Username must be at least 3 characters long.' });
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'Username is already taken by another user.' });
      }

      dataToUpdate.username = username;
    }

    // Validate and update password
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long.' });
      }

      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ status: 'error', message: 'No profile details were provided to update.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update profile: ' + error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  updateUserProfile,
};

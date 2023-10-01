const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name required'],
      trim: true,
      minlength: [5, 'Name is too short'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      unique: [true, 'This email already used'],
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Email required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangeAt: Date,
    passwordVerify: Boolean,
    passwordCodeExpires: Date,
    passwordResetCode: String,
  },
  { timestamps: true }
);

userModel.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = model('user', userModel);

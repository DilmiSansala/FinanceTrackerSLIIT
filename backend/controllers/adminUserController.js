const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcryptjs"); //For password hashing purposes
const jwt = require("jsonwebtoken");

const adminUserController = {
  //!Registration
  register: asyncHandler(async (req, res) => {
    
    //Get the data from the user input / grt data from the client
    const {  username, email, password } = req.body;
    //*Validation

    if ( !username || !email || !password) {
      throw new Error("All fields must be field");
    } //To be able to render this error msg should create middleware

    //*Check is the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    //*Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //*create the user and save in to the data base
    const userCreated = await User.create({
    
      username,
      email,
      password: hashedPassword,
    });

    //*Send the response
    res.json({
      username: userCreated.username,//: `${userCreated.firstName} ${userCreated.lastName}`,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  //!Fetch all the users
  fetch: asyncHandler(async (req, res) => {
    const users = await User.find({}, { password: 0 }); //Fetch all the users exclude password
    res.json(users);
  }),

  //!Profile
  profile: asyncHandler(async (req, res) => {
    //*Find the user

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    //*send response
    res.json({
      username: user.username,
      email: user.email,
    });
  }),

  //!update user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    //*find the user
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    //*Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    //*resave the user
    await user.save();

    //*send the response
    res.json({
      message: "Password change successfully",
    });
  }),

  //!Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    //*update the user
    const updateUser = await User.findByIdAndUpdate(
      req.params.id, //getting the user id from the user authentication middleware
      {
        email, //passing the argument
        username,
      },
      { new: true /*return the updated record*/ } //? This will return all the values
    );

    res.json({
      message: "User profile updated successfully",
      updateUser,
    });
  }),

  //! Delete user
  delete: asyncHandler(async (req, res) => {
    if (await User.findByIdAndDelete(req.params.id)) {
      res.json({ message: "User deleted Successful" });
    }
  }),
};

module.exports = adminUserController;

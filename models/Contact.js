const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: [2, "surname can not be less than 2 characters"],
      maxlength: [30, "surname can not be more than 30 characters"],
    },
    surname: {
      type: String,
      required: [true, "Please provide surname"],
      minlength: [1, "surname can not be less than 1 character"],
      maxlength: [30, "surname can not be more than 30 characters"],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      minlength: [6, "number can not be less than 6 characters"],
      maxlength: [9, "number can not be more than 9 characters"],
    },
    email: {
      type: String,
    },
    address: {
      type: String,
      maxlength: [40, "surname can not be more than 40 characters"],
      default: "",
    },
    notes: {
      type: String,
      maxlength: [40, "surname can not be more than 40 characters"],
      default: "",
    },
    img: {
      src: { type: String, default: "" },
      name: { type: String, default: "" },
      id: { type: String, default: "" },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);

const path = require("path");
const Contact = require("../models/Contact");
const CustomError = require("../customErrors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
let contactImageUrl = "";
let contactImageName = "";

// ! getAllContacts
const getAllContacts = async (req, res) => {
  const { userId } = req.user;
  const contacts = await Contact.find({ createdBy: userId });

  res.status(StatusCodes.OK).json({ count: contacts.length, contacts });
};
// ! getAllContacts

//! getContact
const getContact = async (req, res) => {
  res.send("getContact");
};
//! getContact

//! addContact
const addContact = async (req, res) => {
  const {
    body: { phone, img },
    user: { userId },
  } = req;

  const contactAlreadyExists = await Contact.findOne({
    phone,
    createdBy: userId,
  });

  if (contactAlreadyExists) {
    throw new CustomError.BadRequestError("Contact already exists");
  }
  if (contactImageUrl) {
    img.src = contactImageUrl;
    img.name = contactImageName;
  }
  const contact = await Contact.create({ ...req.body, createdBy: userId });

  contactImageUrl = "";
  contactImageName = "";

  res.status(StatusCodes.CREATED).json({ contact });
};
//! addContact

//! updateContact
const updateContact = async (req, res) => {
  const {
    body: { name, surname, phone },
    user: { userId },
    params: { id: contactId },
  } = req;

  if (!name || !surname || !phone) {
    throw new CustomError.BadRequestError(
      "Name, surname and phone number are required"
    );
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, createdBy: userId },
    req.body,
    {
      new: true,
    }
  );

  if (!contact) {
    throw new CustomError.NotFoundError(`No contact with id ${contactId}`);
  }

  res.status(StatusCodes.OK).json({ contact });
};
//! updateContact

//! deleteContact
const deleteContact = async (req, res) => {
  const {
    user: { userId },
    params: { id: contactId },
  } = req;

  const contact = await Contact.findByIdAndRemove({
    _id: contactId,
    createdBy: userId,
  });

  if (!contact) {
    throw new NotFoundError(`No job with id ${contactId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Contact removed!" });
};
//! deleteContact

//! deleteManyContacts
const deleteManyContacts = async (req, res) => {
  const {
    user: { userId },
    body: { contactsId },
  } = req;

  for (const singleId of contactsId) {
    await Contact.findByIdAndRemove({ _id: singleId, createdBy: userId });
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Contacts removed!" });
};
//! deleteManyContacts

//! uploadContactImage
const uploadContactImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "contactBook-js" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);
  contactImageUrl = result.secure_url;
  contactImageName = req.files.image.name;

  res.status(StatusCodes.OK).json({ msg: "Image added successfully!" });
};
//! uploadContactImage

module.exports = {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
  deleteManyContacts,
  uploadContactImage,
};

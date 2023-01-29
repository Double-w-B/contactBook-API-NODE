const path = require("path");
const Contact = require("../models/Contact");
const CustomError = require("../customErrors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
let contactImageUrl = "";
let contactImageName = "";
let contactImageId = "";

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
    body: { name, surname, phone, img },
    user: { userId },
    params: { id: contactId },
  } = req;

  if (!name || !surname || !phone) {
    throw new CustomError.BadRequestError(
      "Name, surname and phone number are required"
    );
  }

  if (contactImageUrl) {
    img.src = contactImageUrl;
    img.name = contactImageName;
  }

  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, createdBy: userId },
    req.body,
    {
      new: true,
    }
  );

  contactImageUrl = "";
  contactImageName = "";

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
  contactImageId = result.public_id;

  res.status(StatusCodes.OK).json({ msg: contactImageId });
};
//! uploadContactImage

//! removeContactImageFromDB
const removeContactImage = async (req, res) => {
  const {
    body: { cloudinaryImgId, contactId },
    user: { userId },
  } = req;

  if (contactId) {
    await Contact.findOneAndUpdate(
      { _id: contactId, createdBy: userId },
      { img: { src: "", name: "" } },
      {
        new: true,
      }
    );
  }
  let resultMsg = "";

  contactImageUrl = "";
  contactImageName = "";

  await cloudinary.uploader
    .destroy(cloudinaryImgId)
    .then(({ result }) => (resultMsg = result));

  res.status(StatusCodes.OK).json({ msg: resultMsg });
};
//! removeContactImageFromDB

//!removeUnsavedImageFromDB
const removeUnsavedImageFromDB = async (req, res) => {
  if (!contactImageUrl || !contactImageId) {
    throw new CustomError.BadRequestError("Image wasn't added");
  }

  let resultMsg = "";

  await cloudinary.uploader
    .destroy(contactImageId)
    .then(({ result }) => (resultMsg = result));

  contactImageUrl = "";
  contactImageName = "";
  contactImageId = "";

  res.status(StatusCodes.OK).json({ msg: resultMsg });
};
//!removeUnsavedImageFromDB

module.exports = {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
  deleteManyContacts,
  uploadContactImage,
  removeContactImage,
  removeUnsavedImageFromDB,
};

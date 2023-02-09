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

//! addContact
const addContact = async (req, res) => {
  const { body, user } = req;
  const { phone, img } = body;
  const { userId } = user;

  const filter = { phone, createdBy: userId };
  const contactAlreadyExists = await Contact.findOne(filter);

  if (contactAlreadyExists) {
    throw new CustomError.BadRequestError("Contact already exists");
  }

  if (contactImageUrl) {
    img.src = contactImageUrl;
    img.name = contactImageName;
    img.id = contactImageId;
  }

  const contact = await Contact.create({ ...req.body, createdBy: userId });

  contactImageUrl = "";
  contactImageName = "";

  res.status(StatusCodes.CREATED).json({ contact });
};
//! addContact

//! updateContact
const updateContact = async (req, res) => {
  const { body, user, params } = req;
  const { name, surname, phone, img } = body;
  const { userId } = user;
  const { id: contactId } = params;

  if (!name || !surname || !phone) {
    const msg = "Name, surname and phone number are required";
    throw new CustomError.BadRequestError(msg);
  }

  if (contactImageUrl) {
    img.src = contactImageUrl;
    img.name = contactImageName;
    img.id = contactImageId;
  }

  const filter = { _id: contactId, createdBy: userId };
  const options = { new: true };
  const contact = await Contact.findOneAndUpdate(filter, req.body, options);

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
  const { user, params } = req;
  const { userId } = user;
  const { id: contactId } = params;

  const filter = { _id: contactId, createdBy: userId };

  const contact = await Contact.findOne(filter);

  if (!contact) {
    throw new CustomError.NotFoundError(`No contact with id ${contactId}`);
  }

  if (contact.img.id) {
    await cloudinary.uploader.destroy(contact.img.id);
  }

  await contact.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Contact removed!" });
};
//! deleteContact

//! deleteManyContacts
const deleteManyContacts = async (req, res) => {
  const { user, body } = req;
  const { userId } = user;
  const { contactsId } = body;

  for (const singleId of contactsId) {
    const contact = await Contact.findOne({ _id: singleId, createdBy: userId });
    if (contact.img.id) {
      await cloudinary.uploader.destroy(contact.img.id);
    }
    await contact.remove();
  }

  res.status(StatusCodes.OK).json({ msg: "Success! Contacts removed!" });
};
//! deleteManyContacts

//! uploadContactImage
const uploadContactImage = async (req, res) => {
  const file = req.files.image.tempFilePath;
  const options = { use_filename: true, folder: "contactBook-js" };

  const result = await cloudinary.uploader.upload(file, options);

  fs.unlinkSync(file);

  contactImageUrl = result.secure_url;
  contactImageName = req.files.image.name;
  contactImageId = result.public_id;

  const response = { contactImageId, contactImageUrl, contactImageName };
  res.status(StatusCodes.OK).json(response);
};
//! uploadContactImage

//! removeContactImageFromDB
const removeContactImage = async (req, res) => {
  const { body, user } = req;
  const { userId } = user;
  const { cloudinaryImageId: imgId, contactId } = body;

  const filter = { _id: contactId, createdBy: userId };
  const update = { img: { src: "", name: "", id: "" } };
  const options = { new: true };

  if (contactId) {
    await Contact.findOneAndUpdate(filter, update, options);
  }
  let resultMsg = "";

  contactImageUrl = "";
  contactImageName = "";

  await cloudinary.uploader
    .destroy(imgId)
    .then(({ result }) => (resultMsg = result));

  res.status(StatusCodes.OK).json({ msg: resultMsg });
};
//! removeContactImageFromDB

//! removeUnsavedImageFromDB
const removeUnsavedImageFromDB = async (req, res) => {
  if (!contactImageUrl || !contactImageId) {
    throw new CustomError.BadRequestError("Image wasn't added");
  }

  let resultMsg = "";

  await cloudinary.uploader
    .destroy(contactImageId)
    .then(({ result }) => (resultMsg = result));

  contactImageId = "";
  contactImageUrl = "";
  contactImageName = "";

  res.status(StatusCodes.OK).json({ msg: resultMsg });
};
//! removeUnsavedImageFromDB

module.exports = {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  deleteManyContacts,
  uploadContactImage,
  removeContactImage,
  removeUnsavedImageFromDB,
};

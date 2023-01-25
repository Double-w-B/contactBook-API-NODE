const Contact = require("../models/Contact");
const CustomError = require("../customErrors");
const { StatusCodes } = require("http-status-codes");

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
    body: { phone },
    user: { userId },
  } = req;

  const contactAlreadyExists = await Contact.findOne({
    phone,
    createdBy: userId,
  });

  if (contactAlreadyExists) {
    throw new CustomError.BadRequestError("Contact already exists");
  }
  const contact = await Contact.create({ ...req.body, createdBy: userId });

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

module.exports = {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
};

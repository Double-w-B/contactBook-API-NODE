const getAllContacts = async (req, res) => {
  res.send("getAllContacts");
};
const getContact = async (req, res) => {
  res.send("getContact");
};
const addContact = async (req, res) => {
  res.send("addContact");
};
const updateContact = async (req, res) => {
  res.send("updateContact");
};
const deleteContact = async (req, res) => {
  res.send("deleteContact");
};

module.exports = {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
};

const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  getContact,
  addContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactsController");


router.route("/").get(getAllContacts).post(addContact);
router.route("/:id").get(getContact).patch(updateContact).delete(deleteContact);

module.exports = router;
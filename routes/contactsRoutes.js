const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  deleteManyContacts,
  uploadContactImage,
  removeContactImage,
  removeUnsavedImageFromDB,
} = require("../controllers/contactsController");

router.route("/uploadImage").post(uploadContactImage);
router.route("/removeImage").post(removeContactImage);
router.route("/removeUnsavedImage").get(removeUnsavedImageFromDB);
router
  .route("/")
  .get(getAllContacts)
  .post(addContact)
  .delete(deleteManyContacts);
router.route("/:id").patch(updateContact).delete(deleteContact);

module.exports = router;

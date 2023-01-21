const express = require("express");
const router = express.Router();

const {
  checkUser,
  updateName,
  updateEmail,
  updatePassword,
  deleteUser,
} = require("../controllers/userController");

router.route("/checkUser").get(checkUser);
router.route("/updateName").patch(updateName);
router.route("/updateEmail").patch(updateEmail);
router.route("/updatePassword").patch(updatePassword);
router.route("/deleteUser").delete(deleteUser);

module.exports = router;

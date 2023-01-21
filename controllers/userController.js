const checkUser = async (req, res) => {
  res.send("check");
};
const updateName = async (req, res) => {
  res.send("updateName");
};
const updateEmail = async (req, res) => {
  res.send("updateEmail");
};
const updatePassword = async (req, res) => {
  res.send("updatePassword");
};
const deleteUser = async (req, res) => {
  res.send("delete");
};

module.exports = {
  checkUser,
  updateName,
  updateEmail,
  updatePassword,
  deleteUser,
};

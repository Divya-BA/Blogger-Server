
const bcrypt = require("bcrypt");
const CustomError = require('./error');

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new CustomError("Password hashing failed", 500);
  }
}

function hashSyncPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Password hashing failed");
  }
}

async function comparePassword(plainPassword, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return passwordMatch;
  } catch (error) {
    throw new CustomError("Password comparison failed", 500);
  }
}

module.exports = {
  hashPassword,
  hashSyncPassword,
  comparePassword,
};

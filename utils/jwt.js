
const jwt =require('jsonwebtoken')
const crypto=require('crypto')
const dotenv=require('dotenv')
dotenv.config();

function generateToken(user) {
  const { _id, email } = user;
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  const payload = {
    _id,
    email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

function sendToken(user) {
  const token = generateToken(user);
  return token;
}

function generateActivationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

export { generateToken, verifyToken, sendToken, generateActivationToken };

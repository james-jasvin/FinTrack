const yenv = require('yenv')
const env = yenv()

const PORT = env.PORT
const MONGODB_URI = env.MONGODB_URI
const SECRET = env.SECRET

module.exports = { PORT, MONGODB_URI, SECRET }
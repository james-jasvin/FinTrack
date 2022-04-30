const yenv = require('yenv')

let env = null

// If production environment then use env.yaml for the environment variables
// Otherwise use env-local.yaml for the same
if (process.env.NODE_ENV == 'production')
	env = yenv()
else if (process.env.NODE_ENV == 'test')
	env = yenv('env-enc.yaml')
else
	env = yenv('env-local.yaml')

const PORT = env.PORT
const MONGODB_URI = env.MONGODB_URI
const SECRET = env.SECRET

module.exports = { PORT, MONGODB_URI, SECRET }
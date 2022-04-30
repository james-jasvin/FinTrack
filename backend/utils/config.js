const yenv = require('yenv')

let env = null

/*
* If production environment then use the env.yaml file (generated via Ansible Vault + Playbook)
* for the environment variables.
* If testing environment then use the env-enc.yaml file (which will be decrypted in the Jenkins pipeline).
* And if in development environment, use the env-local.yaml file.
*/
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
// Avoid printing any logs when in testing environment

const info = (...params) => {
	if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'local-test')
		console.log(...params)
}

const error = (...params) => {
	if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'local-test')
		console.error(...params)
}

module.exports = { info, error }
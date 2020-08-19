import jwt from 'jsonwebtoken'

const generateJwt = (userId) => {
	return jwt.sign({ userId }, 'thisisasecret', {
		expiresIn: '3 days',
	})
}

export { generateJwt as default }

import jwt from 'jsonwebtoken'

const generateJwt = (userId) => {
	jwt.sign({ userId }, 'thisisasecret', {
		expiresIn: '3 days',
	})
}

export { generateJwt as default }

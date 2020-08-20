import jwt from 'jsonwebtoken'

const generateJwt = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '3 days',
	})
}

export { generateJwt as default }

import { User } from '../recources/user/user.model'
import jwt from 'jsonwebtoken'
import config from './config'

export const newToken = user => {
	return jwt.sign(
		{
			id: user.id,
			username: user.username,
			email: user.email
		},
		config.secrets.jwt,
		{
			expiresIn: config.secrets.jwtExp
		}
	)
}

export const verifyToken = token =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secrets.jwt, (err, payload) => {
			if (err) return reject(err)
			resolve(payload)
		})
	})

export const signup = async (req, res) => {
	if (!req.body.email || !req.body.password) {
		res.status(400).send({ message: 'Invalid email or password!' })
	}
	try {
		const user = await User.create(req.body)
		const token = newToken(user)
		return res.status(201).send({ token })
	} catch (e) {
		console.error(e)
		return res.status(400).end()
	}
}

export const signin = async (req, res) => {
	if (!req.body.email || !req.body.password) {
		res.status(400).send({ message: 'Email and password required.' })
	}
	const user = await User.findOne({ email: req.body.email })

	if (!user) return res.status(401).end()

	try {
		const pswMatch = await user.checkPassword(req.body.password)
		if (!pswMatch) return res.status(401).send({ message: 'Invalid password!' })

		const token = newToken(user)
		return res.status(201).send({ token })
	} catch (e) {
		console.error(e)
		return res.status(400).end()
	}
}

export const verify = async (req, res, next) => {
	if (!req.headers.authorization) return res.status(401).end()
	const token = req.headers.authorization.split('Bearer ')[1]
	if (!token) return res.status(401).end()
	try {
		const payload = await verifyToken(token)
		console.log('payload', payload)
		const user = await User.findById(payload.id).select('-password').lean().exec()
		req.user = user
		next()
	} catch (e) {
		console.error(e)
		return res.status(401).end()
	}
}

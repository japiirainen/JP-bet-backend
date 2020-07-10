import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'
import config from './config'
import * as Yup from 'Yup'

const schema = Yup.object().shape({
    email: Yup.string().trim().email().required(),
    username: Yup.string().trim().min(2).required(),
    firstname: Yup.string().max(99).trim().required(),
    lastname: Yup.string().max(99).trim().required(),
    password: Yup.string()
        .min(8)
        .max(100)
        .matches(/[^A-Za-z-0-9]/, 'password must contain a special character')
        .matches(/[A-Z]/, 'password must contain an uppercase letter')
        .matches(/[a-z]/, 'password must contain a lowercase letter')
        .matches(/[0-9]/, 'password must contain a number')
        .required(),
})

export const newToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        config.secrets.jwt,
        {
            expiresIn: config.secrets.jwtExp,
        }
    )
}

export const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.secrets.jwt, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

export const signup = async (req, res, next) => {
    const { email, password, username, firstname, lastname } = req.body
    const createUser = {
        email,
        password,
        username,
        firstname,
        lastname,
    }
    try {
        await schema.validate(createUser, {
            abortEarly: false,
        })
        const insertedUser = await User.create({
            email,
            password,
            username,
            firstname,
            lastname,
        })
        const token = newToken(insertedUser)
        return res.status(201).send({
            token,
            user: insertedUser,
        })
    } catch (e) {
        res.status(400)
        next(e)
    }
}

export const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: 'Email and password required.',
        })
    }
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user) return res.status(401).end()

    try {
        const pswMatch = await user.checkPassword(req.body.password)
        if (!pswMatch)
            return res.status(401).send({
                message: 'Invalid password!',
            })

        const token = newToken(user)
        return res.status(201).send({
            token,
            user: user,
        })
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
        const user = await User.findById(payload.id)
            .select('-password')
            .lean()
            .exec()
        req.user = user
        next()
    } catch (e) {
        console.error(e)
        return res.status(401).end()
    }
}

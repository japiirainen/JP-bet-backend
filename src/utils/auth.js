const { User, Reset } = require('../resources/user/user.model')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const config = require('./config')
const Yup = require('yup')
const sendResetLink = require('./email')

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

const newToken = (user) => {
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

const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, config.secrets.jwt, (err, payload) => {
            if (err) return reject(err)
            resolve(payload)
        })
    })

const signup = async (req, res, next) => {
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

const signin = async (req, res) => {
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

const verify = async (req, res, next) => {
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
//post
const forgotPassword = async (req, res, next) => {
    try {
        const user = await await User.findOne({ email: req.body.email })
        if (!user) return next()

        const id = uuidv4()

        const doc = {
            id,
            email: user.email,
        }
        await Reset.create(doc)
        sendResetLink(user.email, id)
        res.status(200).json({ message: 'success' })
    } catch (e) {
        next(e)
    }
}
//put
const resetPassword = async (req, res, next) => {
    try {
        const resetRequest = Reset.findOne(req.body.id)
        if (!resetRequest) return next()

        const user = await User.updateOne(
            { email: resetRequest.email },

            {
                $set: {
                    password: req.body.password,
                },
            }
        )
        res.status(200).json({
            message: 'success',
            user,
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    verifyToken,
    signup,
    signin,
    verify,
    forgotPassword,
    resetPassword,
}

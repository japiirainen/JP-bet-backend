const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            default: 'email',
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        pictureurl: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'user'],
            default: 'user',
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        settings: {
            theme: {
                type: String,
                required: false,
                default: 'dark',
            },
            language: {
                type: String,
                required: false,
                default: 'english',
            },
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    console.log('im here')
    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err)
        }

        this.password = hash
        next()
    })
})

userSchema.pre('update', function (next) {
    if (!this._update.password) return next()
    bcrypt.hash(this._update.password, 8, (err, hash) => {
        if (err) {
            return next(err)
        }

        this._update.password = hash
        next()
    })
})

userSchema.methods.checkPassword = function (password) {
    const passwordHash = this.password
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err)
            }

            resolve(same)
        })
    })
}

module.exports = {
    User: mongoose.model('user', userSchema, 'users'),
}

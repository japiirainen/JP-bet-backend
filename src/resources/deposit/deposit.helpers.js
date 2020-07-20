const { Deposit } = require('./deposit.model')
const { User } = require('../user/user.model')

const processDeposit = async (userID, amount) => {
    function updateUser() {
        const updatedUser = User.findOneAndUpdate(
            {
                _id: userID,
            },
            {
                $inc: {
                    balance: +amount,
                },
            },
            { new: true }
        )
            .lean()
            .exec()
        return updatedUser
    }
    function createDeposit() {
        Deposit.create({ amount: amount, user: userID })
    }

    const results = await Promise.all([updateUser(), createDeposit()])
    return results[0]
}

const getDeposits = async (userID) => {
    const doc = await Deposit.find({
        user: userID,
    })
        .lean()
        .exec()
    return doc
}

module.exports = {
    processDeposit,
    getDeposits,
}

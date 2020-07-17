const R = require('ramda')

const calculateReturn = (odds, amount) => {
    const result = R.multiply(odds, parseFloat(amount))
    return result
}

module.exports = calculateReturn

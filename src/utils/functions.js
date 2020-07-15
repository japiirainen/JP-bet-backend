const R = require('ramda')

export const calculateReturn = (odds, amount) => {
    const result = R.multiply(odds, parseFloat(amount))
    return result
}

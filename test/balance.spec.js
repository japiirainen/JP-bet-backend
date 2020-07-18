const { expect } = require('chai')
const dbConnect = require('../database/db')
const {
    processDeposit,
    getDeposits,
} = require('../src/resources/deposit/deposit.helpers')

require('dotenv').config()

dbConnect(process.env.DBURL || 'mongodb://localhost:27017')

describe('Deposit router post', () => {
    it('should process deposit and return updated user', async () => {
        const result = await processDeposit('5f08104eb6fa8f1e464f3772', 20)
        expect(result).to.exist
        console.log(result)
    })
})

describe('Deposit router get', () => {
    it('should return all deposits made by a singe user', async () => {
        const result = await getDeposits('5f08104eb6fa8f1e464f3772')
        expect(result).to.exist
        console.log(result)
    })
})

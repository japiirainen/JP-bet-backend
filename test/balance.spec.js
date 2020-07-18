const { expect } = require('chai')
const dbConnect = require('../database/db')
const { processDeposit } = require('../src/resources/deposit/deposit.router')

require('dotenv').config()

dbConnect(process.env.DBURL || 'mongodb://localhost:27017')

describe('Deposit router', () => {
    it('should process deposit and return updated user', async () => {
        const result = await processDeposit('5f08104eb6fa8f1e464f3772', 20)
        expect(result).to.exist
        console.log(result)
    })
})

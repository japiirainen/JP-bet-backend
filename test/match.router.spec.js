const { processBet } = require('../src/resources/match/match.router')
const { expect } = require('chai')
const dbConnect = require('../database/db')

require('dotenv').config()

dbConnect(process.env.DBURL || 'mongodb://localhost:27017')

describe('Match router', () => {
    it('should process bet', async () => {
        const result = await processBet('team1', {
            _id: '5f10671467f962c4cf94250a',
            choice: 'tie',
            createdBy: '5f08104eb6fa8f1e464f3772',
            projectedWin: 120,
        })
        expect(result).to.exist
        console.log(result)
    })
})

const crudControllers = require('../../utils/crud')
const { Betslip } = require('./betslip.model')

module.exports = crudControllers(Betslip)

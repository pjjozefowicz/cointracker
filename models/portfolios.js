const Sequalize = require('sequelize')

const sequalize = require('../utils/database')
const Balance = require('./balances')
const Transaction = require('./transactions')


const Portfolio = sequalize.define('portfolios', {
    portfolio_id: {
        type: Sequalize.UUID,
        defaultValue: Sequalize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequalize.STRING(32),
        allowNull: false,
    },
    owner_id: {
        type: Sequalize.STRING(32),
        allowNull: false,
    },
    is_main: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
    },
})

Portfolio.hasMany(Transaction, {
    foreignKey:{
        name: 'portfolio_id',
        allowNull: false,
    }
})

Portfolio.hasMany(Balance, {
    foreignKey:{
        name: 'portfolio_id',
        allowNull: false,
    }
})

module.exports = Portfolio
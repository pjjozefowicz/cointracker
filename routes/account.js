const express = require('express');

const accountController = require('../controllers/account');

const router = express.Router();

// GET /account/transactions
router.get('/transactions', accountController.getTransactions);

// GET /account/transaction/:tx_id
router.get('/transaction/:tx_id', accountController.getTransaction);

// POST /account/transaction
router.post('/transaction', accountController.createTransaction);

// DELETE /account/transaction/tx_id
router.delete('/transaction/:tx_id', accountController.deleteTransaction);

// UPDATE /account/transaction/tx_id
router.put('/transaction/:tx_id', accountController.updateTransaction);

// GET /account/portfolios
router.get('/portfolios', accountController.getPortfolios);

// GET /account/portfolio/:portfolio_id
router.get('/portfolio/:portfolio_id', accountController.getPortfolio);

// POST /account/portfolio
router.post('/portfolio', accountController.createPortfolio);

// DELETE /account/portfolio/:portfolio_id
router.delete('/portfolio/:portfolio_id', accountController.deletePortfolio);

// UPDATE /account/portfolio/:portfolio_id
router.put('/portfolio/:portfolio_id', accountController.updatePortfolio);

// GET /account/balances
router.get('/balances', accountController.getBalances);

// GET /account/balance/:balance_id
router.get('/balance/:balance_id', accountController.getBalance);

// POST /account/balance
router.post('/balance', accountController.createBalance);

// DELETE /account/balance/:balance_id
router.delete('/balance/:balance_id', accountController.deleteBalance);

// UPDATE /account/balance/:balance_id
router.put('/balance/:balance_id', accountController.updateBalance);

module.exports = router;
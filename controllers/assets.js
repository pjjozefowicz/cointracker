const Sequalize = require("sequelize");
const Crypto = require("../models/cryptocurrencies");
const Data = require("../models/historical_data");
const { validationResult } = require("express-validator/check");
const Change = require("../models/price_changes");
const Balance = require("../models/balances");
const sequalize = require("../utils/database");

exports.getCoins = (req, res, next) => {
  Crypto.findAll()
    .then((coins) => res.status(200).json(coins))
    .catch(res.status(500));
};

exports.getCoininfo = (req, res, next) => {
    const coins = req.query.coins.split(',');
    Change.findAll({
      attributes: ['coin_name','rate','market_cap','pln_1h_change','pln_1d_change','pln_7d_change','image_url'],
      where: {
        coin_name: coins,
      },
    })
    .then((coins) => res.status(200).json(coins))
    .catch(res.status(500));
};

exports.getDashboardData = (req, res, next) => {
  const portfolio_id = req.params.portfolio_id;
  sequalize
    .query(
      `SELECT balances.cryptocurrency_id, cr.name, cr.code, balances.amount, balances.cost, ch.rate, ch.market_cap, ch.pln_1h_change, ch.pln_1d_change, ch.pln_7d_change, ch.image_url
      FROM balances 
      INNER JOIN cryptocurrencies AS cr
      ON balances.cryptocurrency_id = cr.cryptocurrency_id
      INNER JOIN changes AS ch
      ON balances.cryptocurrency_id = ch.coin_name
      WHERE balances.portfolio_id = '${portfolio_id}'`,
      { type: sequalize.QueryTypes.SELECT }
    )
    .then((data) => {
      if (data === null) {
        return res.status(404);
      } else {
        return res.status(200).json(data);
      }
    })
    .catch(res.status(500));
};

exports.getHistory = (req, res, next) => {
  const coins = req.query.coins.split(',');
  Data.findAll({
    attributes: ["coin_name", "timestamp", "price"],
    where: {
      coin_name: coins,
    },
  })

    .then((values) => { 
      var dataArray = {}
      var price = {}
      var dataArray2 = []
      price["price"] = []
      price["timestamp"] = []
      
      for (var c = 0; c < coins.length;c++) {
      counter = 0         
      values.forEach((i) => {                
         if (i.coin_name == coins[c]){
           counter = counter + 1      
           if (counter % 4 === 0 && counter % 3 === 0 ) {
            price["price"] = i.price
            price["timestamp"] = i.timestamp
            dataArray2.push(JSON.parse(JSON.stringify(price)))
            console.log(price)  
            console.log(dataArray2) 
          } 
      }
         })
         dataArray[coins[c]] = dataArray2 
      }
      res.status(200).json(dataArray);
    })
    .catch(res.status(500));
};
exports.getCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Crypto.findByPk(coin_id)
    .then((coin) => {
      if (coin === null) {
        return res.status(404);
      } else {
        return res.status(200).json(coin);
      }
    })
    .catch(res.status(500));
};

exports.createCoin = (req, res, next) => {
  const name = req.body.name;
  const code = req.body.code;
  const cryptocurrency_id = req.body.coingecko_id;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    Crypto.create({
      name: name,
      code: code,
      cryptoccurency_id: coingecko_id,
    })
      .then((coin) =>
        res.status(201).json({
          message: "Coin created successfully!",
          coin: coin,
        })
      )
      .catch(res.status(500));
  } else {
    res.status(422).json({
      message: "Invalid values, coin not created",
    });
  }
};

exports.deleteCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  Crypto.destroy({
    where: {
      cryptocurrency_id: coin_id,
    },
  })
    .then((deleted_count) => {
      if (deleted_count > 0) {
        return res.status(200).json({
          message: "Coin deleted successfully!",
        });
      } else {
        return res.status(404).json({
          message: "There is no such a coin",
        });
      }
    })
    .catch(res.status(500));
};

exports.updateCoin = (req, res, next) => {
  const coin_id = req.params.coin_id;
  const name = req.body.name;
  const code = req.body.code;
  const cryptocurrency_id = req.body.coingecko_id;
  Crypto.update(
    {
      name: name,
      code: code,
      cryptocurrency_id: coingecko_id,
    },
    {
      where: {
        cryptocurrency_id: coin_id,
      },
    }
  )
    .then((count) => {
      if (count > 0) {
        return res.status(200).json({ message: "Coin updated" });
      } else {
        return res.status(404).json({ message: "There's no such a coin" });
      }
    })
    .catch(res.status(500));
};

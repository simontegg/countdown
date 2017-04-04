const express = require('express')
const parsePrice = require('parse-price')
const Nightmare = require('nightmare')
const request = require('superagent')
const cfenv = require('cfenv')
const DATASTORE_URL = 'https://us-central1-scaper-162700.cloudfunctions.net/datastore'

const app = express()
const appEnv = cfenv.getAppEnv()

app.get('/', function (req, res) {
  if (req.query.search) {
    scrape(req.query.search, (err, products) => {
      if (err) return res.status(500).end(err)
      request.post(DATASTORE_URL)
        .send({ data: products })
        .end(console.log)
    })
     
    return res.send(`Searching ${req.query.search}`)
  }
  
  res.status(400).send('no search')
})

app.listen(appEnv.port || 8080, function () {
  console.log(`server started on ${appEnv.port}`)        
})

function scrape (search, callback) {
  const nightmare = Nightmare({ show: false })
  const url = foodSearch(search)
  console.log(url)

  nightmare.goto(url)
    .wait('.search-content')
    .evaluate(function (search) {
      var products = []
      $('#product-list .product-stamp').each(function () {
        var description = $(this).find('.description').text()
        var price = $(this)
          .find('.price')
          .text()
          .replace(`\n`, '')
          .trim()
        var href = $(this)
          .find('a._jumpTop')
          .attr('href')
          .replace(`&searchString=${search}`, '')

        products.push({
          store: 'countdown',
          href: href,
          search: search,
          description: description,
          price: price
        })
      })

      return products
    }, search, parsePrice)
    .end()
    .then((products) => callback(null, parsePrices(products)))
    .catch(callback)
}

function foodSearch (food) {
  return `https://shop.countdown.co.nz/Shop/#url=/Shop/SearchProducts${encodeURIComponent(`?search=${food}`)}`

}

function parsePrices (products) {
  return products.map((product) => {
    const price = product.price
    return Object.assign(
      {}, 
      product, 
      { price: parsePrice(price), priceUnit: price.substr(-2) }
    )
  })
}

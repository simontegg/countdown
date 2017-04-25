#!/usr/bin/env node
const express = require('express')


const app = express()

app.get('/', function (req, res) {
  res.send('hello')
})

app.listen(process.env.PORT, function () {
  console.log('listening on ', process.env.PORT)          
})


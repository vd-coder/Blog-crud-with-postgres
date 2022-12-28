const { Client } = require('pg')
const config=require("./app/config/config");
const client = new Client({
  host: config.HOST,
  port: config.PORT,
  user: config.USER,
  password: config.PASSWORD,
})
client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

  client.query(`CREATE DATABASE ${config.DB}`, (err, res) => {
    if (err) throw err
    console.log(res)
    client.end()
  })
  
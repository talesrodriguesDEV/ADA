const Conta = require('./models/Conta')
const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/contas.json')))

async function populateDB () {
  try {
    const contas = await Conta.find({}, null, { limit: 1 })

    if (contas.length === 0) {
      await Conta.create(data)

      console.log('Banco de dados populado com successo.')
    } else console.log('Banco de dados já estava populado.')
  } catch (err) {
    console.log(err)
  }
}

module.exports = populateDB

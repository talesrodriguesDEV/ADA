const { model, Schema } = require('mongoose')

const contaSchema = new Schema({
  codProp: Number,
  tipo: String,
  valor: Number,
  venc: Date
})

const Conta = model('Conta', contaSchema)

module.exports = Conta

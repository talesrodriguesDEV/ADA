const Conta = require('../database/models/Conta')

const express = require('express')

const router = express.Router()

router.get('/prop/:cod', async (req, res) => {
  const { cod } = req.params

  const contas = await Conta.find({ codProp: cod })

  res.status(200).json(contas)
})

router.get('/tipo/:rp', async (req, res) => {
  const { rp } = req.params

  let tipo
  switch (rp) {
    case 'r':
      tipo = 'A receber'
      break
    case 'p':
      tipo = 'A pagar'
      break
    case 'rp':
      tipo = /A/
      break
    default:
      tipo = ''
      break
  }

  const contas = await Conta.find({ tipo })

  res.status(200).json(contas)
})

router.get('/mes-venc/:m', async (req, res) => {
  const { m } = req.params

  const contas = await Conta.find({})

  const contasFiltradas = contas.filter(conta => conta.venc.getMonth() === Number(m) - 1 || Number(m) === 0)

  res.status(200).json(contasFiltradas)
})

module.exports = router

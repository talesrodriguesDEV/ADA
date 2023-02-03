import './App.css'
import logo from './images/logo.jpg'
import { Form, Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'

function App () {
  const [code, setCode] = useState(0)
  const [type, setType] = useState('')
  const [month, setMonth] = useState(0)
  const [bills, setBills] = useState([])
  const [disable1, setDisable1] = useState(false)
  const [disable2, setDisable2] = useState(false)
  const [disable3, setDisable3] = useState(false)
  const [mixFilters, setMixFilters] = useState(true)

  useEffect(() => {
    if (mixFilters) {
      setDisable1(false)
      setDisable2(false)
      setDisable3(false)
    } else {
      setDisable1(false)
      setDisable2(true)
      setDisable3(true)
    }
  }, [mixFilters])

  const toggleDisabledInputs = (index, setDisable) => {
    if (!mixFilters) {
      setDisable(false)
      switch (index) {
        case 1:
          setDisable2(true)
          setDisable3(true)
          break
        case 2:
          setDisable1(true)
          setDisable3(true)
          break
        case 3:
          setDisable1(true)
          setDisable2(true)
          break
        default:
          break
      }
    }
  }

  const renderMonths = () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    return months.map((month, index) => (
      <option key={index} value={index + 1}>{month}</option>
    ))
  }

  const fetchBills = async (aux, filter) => {
    const response = await fetch(`http://localhost:3001/contas/${filter}`)
    const json = await response.json()

    if (aux) setBills(json)
    else return json
  }

  const searchBills = async (e) => {
    e.preventDefault()

    const byCode = `prop/${code}`
    const byType = `tipo/${type}`
    const byMonth = `mes-venc/${month}`

    if (mixFilters) {
      const bills = await fetchBills(false, byCode)
      let billsType
      let billsMonth

      const tipo = type === 'r' ? 'A receber' : 'A pagar'

      if (type === '') billsType = bills
      else billsType = bills.filter(bill => bill.tipo === tipo)

      if (month === 0) billsMonth = billsType
      else billsMonth = billsType.filter(bill => new Date(bill.venc).getMonth() + 1 === Number(month))

      setBills(billsMonth)
    } else if (!disable1) fetchBills(true, byCode)
    else if (!disable2) fetchBills(true, byType)
    else if (!disable3) fetchBills(true, byMonth)
  }

  const generateReport = () => {
    const file = new File([JSON.stringify(bills)], 'report')
    const url = URL.createObjectURL(file)

    const a = document.createElement('a')
    a.download = 'report.json'
    a.href = url
    a.click()
  }

  return (
    <div className="container">
      <header>
        <img style={{ margin: 0, padding: 0 }} src={logo} alt="Anfitriões de aluguel - logo" />
      </header>
      <Form onSubmit={searchBills} style={{ backgroundColor: 'white' }}>
        <fieldset>
          <Form.Group onClick={() => toggleDisabledInputs(1, setDisable1)}>
            <Form.Label>Código da propriedade</Form.Label>
            <Form.Control required={mixFilters} disabled={disable1} onChange={({ target }) => setCode(target.value)} type="number" />
          </Form.Group>
          <Form.Group onClick={() => toggleDisabledInputs(2, setDisable2)}>
            <Form.Label>Tipo de conta</Form.Label>
            <Form.Check disabled={disable2} defaultChecked onChange={({ target }) => setType(target.value)} value="" inline type="radio" label="Ambos" name="tipo" />
            <Form.Check disabled={disable2} onChange={({ target }) => setType(target.value)} value="r" inline type="radio" label="A receber" name="tipo" />
            <Form.Check disabled={disable2} onChange={({ target }) => setType(target.value)} value="p" inline type="radio" label="A pagar" name="tipo" />
          </Form.Group>
          <Form.Group onClick={() => toggleDisabledInputs(3, setDisable3)}>
            <Form.Label>Mês de vencimento</Form.Label>
            <Form.Select disabled={disable3} onChange={({ target }) => setMonth(target.value)}>
              <option value={0}>Quaisquer</option>
              {renderMonths()}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Combinar Filtros</Form.Label>
            <Form.Check defaultChecked type="checkbox" onChange={({ target }) => setMixFilters(target.checked)} />
          </Form.Group>
          <Button type="submit">Pesquisar</Button>
        </fieldset>
      </Form>
      <main>
        <h1>Contas pendentes</h1>
        {bills.map(bill => (
          <div key={bill._id} style={{ backgroundColor: 'white' }}>
            <h2>Código da propriedade: {bill.codProp}</h2>
            <p>Tipo: {bill.tipo}</p>
            <p>Valor: {`R$ ${bill.valor.toFixed(2).replace('.', ',')}`}</p>
            <p>Vencimento: {new Date(bill.venc).toLocaleDateString('pt-BR')}</p>
          </div>
        ))}
        <Button onClick={generateReport}>Gerar Relatório</Button>
      </main>
    </div>
  )
}

export default App

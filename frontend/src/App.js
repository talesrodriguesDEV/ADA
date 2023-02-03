import './App.css'
import logo from './images/logo.jpg'
import { Form, Button, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState } from 'react'

function App () {
  const [code, setCode] = useState(0)
  const [type, setType] = useState('rp')
  const [month, setMonth] = useState(0)
  const [bills, setBills] = useState([])
  const [disable1, setDisable1] = useState(false)
  const [disable2, setDisable2] = useState(false)
  const [disable3, setDisable3] = useState(false)
  const [mixFilters, setMixFilters] = useState(true)
  const [loading, setLoading] = useState(false)

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

    if (aux) {
      setBills(json)
      setLoading(false)
      window.alert(`Sua busca teve ${json.length} resultado(s).`)
    } else return json
  }

  const searchBills = async (e) => {
    e.preventDefault()
    setLoading(true)

    const byCode = `prop/${code}`
    const byType = `tipo/${type}`
    const byMonth = `mes-venc/${month}`

    if (mixFilters) {
      const bills = await fetchBills(false, byCode)
      let billsType
      let billsMonth

      const tipo = type === 'r' ? 'A receber' : 'A pagar'

      if (type === 'rp') billsType = bills
      else billsType = bills.filter(bill => bill.tipo === tipo)

      if (month === 0) billsMonth = billsType
      else billsMonth = billsType.filter(bill => new Date(bill.venc).getMonth() + 1 === Number(month))

      setBills(billsMonth)
      setLoading(false)
      window.alert(`Sua busca teve ${billsMonth.length} resultado(s).`)
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
    <>
      <header>
        <img src={logo} alt="Anfitriões de aluguel - logo" />
        <Form onSubmit={searchBills} style={{ backgroundColor: 'white' }}>
          <Form.Group controlId="code" className="mb-2" onClick={() => toggleDisabledInputs(1, setDisable1)}>
            <Form.Label>Código da propriedade</Form.Label>
            <Form.Control required={mixFilters} disabled={disable1} onChange={({ target }) => setCode(target.value)} type="number" />
          </Form.Group>
          <Form.Group className="mb-2" onClick={() => toggleDisabledInputs(2, setDisable2)}>
            <Form.Label>Tipo de conta</Form.Label>
            <br />
            <Form.Group controlId="both">
              <Form.Check id="both" disabled={disable2} defaultChecked onChange={({ target }) => setType(target.value)} value="rp" inline type="radio" label="Ambas" name="tipo" />
            </Form.Group>
            <Form.Group controlId="receive">
              <Form.Check id="receive" disabled={disable2} onChange={({ target }) => setType(target.value)} value="r" inline type="radio" label="A receber" name="tipo" />
            </Form.Group>
            <Form.Group controlId="pay">
              <Form.Check id="pay" disabled={disable2} onChange={({ target }) => setType(target.value)} value="p" inline type="radio" label="A pagar" name="tipo" />
            </Form.Group>
          </Form.Group>
          <Form.Group className="mb-2" onClick={() => toggleDisabledInputs(3, setDisable3)}>
            <Form.Label>Mês de vencimento</Form.Label>
            <Form.Select disabled={disable3} onChange={({ target }) => setMonth(target.value)}>
              <option value={0}>Quaisquer</option>
              {renderMonths()}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Check defaultChecked type="checkbox" inline onChange={({ target }) => setMixFilters(target.checked)} />
            <Form.Label>Combinar Filtros</Form.Label>
            <br />
            {!mixFilters && <Form.Text>Clique no filtro desejado.</Form.Text>}
          </Form.Group>
          <Button type="submit">Buscar Contas</Button>
        </Form>
      </header>
      {loading
        ? <h1 style={{ backgroundColor: 'white', textAlign: 'center', padding: '20px', borderRadius: '45%', margin: '50px 30px' }}>Carregando...</h1>
        : (
            bills.length !== 0 && (
            <main>
              <Table striped bordered hover style={{ backgroundColor: 'white', marginTop: '80px' }}>
                <thead style={{ position: 'sticky', top: '460px', backgroundColor: 'white' }}>
                  <tr>
                    <th>Índice</th>
                    <th>Código da propriedade</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                  </tr>
                </thead>
                <tbody style={{}}>
                  {bills.map((bill, index) => (
                    <tr key={bill._id}>
                      <td>{index + 1}</td>
                      <td>{bill.codProp}</td>
                      <td>{bill.tipo}</td>
                      <td>{`R$ ${bill.valor.toFixed(2).replace('.', ',')}`}</td>
                      <td>{new Date(bill.venc).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <br />
              <br />
              <footer>
              <Button onClick={generateReport}>Gerar Relatório</Button>
              </footer>
            </main>
            )
          )}
    </>
  )
}

export default App

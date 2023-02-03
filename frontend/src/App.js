import React, { useEffect, useState } from 'react'
import { generateReport } from './helpers'
import logo from './images/logo.jpg'
import './App.css'

import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import BillsTable from './components/BillsTable'
import SearchForm from './components/SearchForm'

function App () {
  const [bills, setBills] = useState([])

  const [code, setCode] = useState(0)
  const [type, setType] = useState('rp')
  const [month, setMonth] = useState(0)

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

  return (
    <>
      <header>
        <img src={logo} alt="Anfitriões de aluguel - logo" />
        <SearchForm
          searchBills={searchBills}
          toggleDisabledInputs={toggleDisabledInputs}
          mixFilters={mixFilters}
          setMixFilters={setMixFilters}
          disable1={disable1}
          disable2={disable2}
          disable3={disable3}
          setDisable1={setDisable1}
          setDisable2={setDisable2}
          setDisable3={setDisable3}
          setCode={setCode}
          setType={setType}
          setMonth={setMonth}
        />
      </header>
      {loading
        ? <h1 id="loading">Carregando...</h1>
        : (
            bills.length !== 0 && (
            <main>
              <BillsTable bills={bills} />
              <br />
              <br />
              <footer>
                <Button onClick={() => generateReport(bills)}>Gerar Relatório</Button>
              </footer>
            </main>
            )
          )}
    </>
  )
}

export default App

import React from 'react'
import { Table } from 'react-bootstrap'
import { array } from 'prop-types'

export default function BillsTable ({ bills }) {
  return (
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
      <tbody>
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
  )
}

BillsTable.propTypes = {
  bills: array.isRequired
}

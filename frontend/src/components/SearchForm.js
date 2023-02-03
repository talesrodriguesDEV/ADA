import React from 'react'
import { Form, Button } from 'react-bootstrap'
import { func, bool } from 'prop-types'
import { renderMonths } from '../helpers'

export default function SearchForm ({
  searchBills,
  toggleDisabledInputs,
  mixFilters,
  setMixFilters,
  disable1,
  disable2,
  disable3,
  setDisable1,
  setDisable2,
  setDisable3,
  setCode,
  setType,
  setMonth
}) {
  return (
    <Form onSubmit={searchBills} style={{ backgroundColor: 'white' }}>
      <Form.Group controlId="code" className="mb-2" onClick={() => toggleDisabledInputs(1, setDisable1)}>
        <Form.Label>Código da propriedade</Form.Label>
        <Form.Control
          required={mixFilters}
          disabled={disable1}
          onChange={({ target }) => setCode(target.value)}
          type="number"
        />
      </Form.Group>
      <Form.Group className="mb-2" onClick={() => toggleDisabledInputs(2, setDisable2)}>
        <Form.Label>Tipo de conta</Form.Label>
        <br />
        <Form.Group controlId="both">
          <Form.Check
            id="both"
            name="tipo"
            label="Ambas"
            disabled={disable2}
            defaultChecked
            value="rp"
            inline
            type="radio"
            onChange={({ target }) => setType(target.value)}
          />
        </Form.Group>
        <Form.Group controlId="receive">
          <Form.Check
            id="receive"
            name="tipo"
            label="A receber"
            disabled={disable2}
            value="r"
            inline
            type="radio"
            onChange={({ target }) => setType(target.value)}
          />
        </Form.Group>
        <Form.Group controlId="pay">
          <Form.Check
            id="pay"
            name="tipo"
            label="A pagar"
            disabled={disable2}
            value="p"
            inline
            type="radio"
            onChange={({ target }) => setType(target.value)}
          />
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
        <Form.Check
          defaultChecked
          type="checkbox"
          inline
          onChange={({ target }) => setMixFilters(target.checked)}
        />
        <Form.Label>Combinar Filtros</Form.Label>
        <br />
        {!mixFilters && <Form.Text>Clique no filtro desejado.</Form.Text>}
      </Form.Group>
      <Button type="submit">Buscar Contas</Button>
    </Form>
  )
}

SearchForm.propTypes = {
  searchBills: func.isRequired,
  toggleDisabledInputs: func.isRequired,
  mixFilters: bool.isRequired,
  setMixFilters: func.isRequired,
  disable1: bool.isRequired,
  disable2: bool.isRequired,
  disable3: bool.isRequired,
  setDisable1: func.isRequired,
  setDisable2: func.isRequired,
  setDisable3: func.isRequired,
  setCode: func.isRequired,
  setType: func.isRequired,
  setMonth: func.isRequired
}

import React from 'react'

export const renderMonths = () => {
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  return months.map((month, index) => (
    <option key={index} value={index + 1}>{month}</option>
  ))
}

export const generateReport = (bills) => {
  const file = new File([JSON.stringify(bills)], 'report')
  const url = URL.createObjectURL(file)

  const a = document.createElement('a')
  a.download = 'report.json'
  a.href = url
  a.click()
}

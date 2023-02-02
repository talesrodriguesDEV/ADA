const reservas = require('./reservas.json');
const { addDays, addHours } = require('date-fns');
const fs = require('fs');
const path = require('path');

const formateDate = (date) => {
  const aux = date.split('-');
  const aux2 = `${aux[2]}-${aux[1]}-${aux[0]}`;
  const aux3 = new Date(aux2);
  
  return addHours(aux3, 3);
}

const nextTuesday = (weekDay, date) => {
  let aux;

  if (weekDay <= 2) {
    aux = 2 - weekDay;
  } else {
    aux = 9 - weekDay;
  }

  return addDays(date, aux);
}

const contas = reservas.reduce((acc, curr) => {
  const codProp = curr['Nome alojamento'];
  let rValor;
  let rVenc;
  let pValor;
  let pVenc;

  const checkIn = formateDate(curr['Data de check-in']);
  const checkOut = formateDate(curr['Data de check-out']);
  const checkOutDay = checkOut.getDay();

  if (curr.Portal === 'Booking.com') {
    rValor = curr['Total da reserva sem imposto'] - curr['Comissão portal/intermediário: comissão personalizada'];
    rVenc = checkOut.toLocaleDateString('pt-BR');
    pValor = curr['Extras sem imposto'];
    pVenc = nextTuesday(checkOutDay, checkOut).toLocaleDateString('pt-BR'); 
  } else if (curr.Portal === 'Airbnb.com') {
    rValor = curr['Total da reserva sem imposto'] - curr['Comissão portal/intermediário: comissão personalizada'];
    rVenc = addDays(checkIn, 5).toLocaleDateString('pt-BR');
    pValor = curr['Extras sem imposto'];
    pVenc = nextTuesday(checkOutDay, checkOut).toLocaleDateString('pt-BR');
  }

  if (curr.Portal !== 'Booking.com' && curr.Portal !== 'Airbnb.com') return acc;

  return [
    ...acc,
    {
      codProp,
      tipo: 'A receber',
      valor: rValor,
      venc: rVenc,
    },
    {
      codProp,
      tipo: 'A pagar',
      valor: pValor,
      venc: pVenc,
    }]
}, []);

fs.writeFileSync(path.resolve(__dirname, 'contas.json'), JSON.stringify(contas));

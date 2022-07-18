const result = document.querySelector('#result');
const resultEnabled = false;

const createRow = () => {
  const element = document.createElement('div');
  element.classList.add('note-row');

  const inputNote = document.createElement('input');
  inputNote.classList.add('note')
  inputNote.setAttribute('name', 'note')
  inputNote.setAttribute('min', '0')
  
  const inputPercentage = document.createElement('input');
  inputPercentage.setAttribute('name','percentage')
  inputPercentage.setAttribute('min',0)
  inputPercentage.setAttribute('max',100)
  inputPercentage.classList.add('note')
  
  element.appendChild(inputNote)
  element.appendChild(inputPercentage)

  return element;
}

const combineNotes = (notes, percentages) => {
  let combine = [];

  notes.forEach((note, index) => {
    combine = [...combine, {
      note: Number(note.value),
      percentage: Number(percentages[index].value)
    }]
  })

  return combine;
}

const calcPercentageTotal = (notes) => {
  return notes.reduce((acc, curr) => {
    return acc += curr.percentage
  }, 0);
}

const calculatePercentageIsFull = (notes) => {
  const TOTAL_PERCENTAGE = 100;
  const MIN_PERCENTAGE = 0;

  const sumPercentage = calcPercentageTotal(notes)
  
  if(sumPercentage > TOTAL_PERCENTAGE || sumPercentage < MIN_PERCENTAGE) {
    return true;
  }

  return false
}

const showResultMessage = (error, message, color = '#FFF') => {
  const messageDOM = document.querySelector('#message-result');
  const containerMessage = document.querySelector('#result-text');

  if(error){
    messageDOM.classList.add('error-message')
    messageDOM.textContent = message
    containerMessage.style.backgroundColor = "#EB4747"
    containerMessage.style.padding = "0 5px"
    return
  }

  messageDOM.classList.remove('error-message')
  containerMessage.style.backgroundColor = color
  messageDOM.textContent = message
}

const getNotesDOM = () => {
  const noteInputs = document.getElementsByName('note');
  const percentageInputs = document.getElementsByName('percentage');

  const notes = combineNotes(noteInputs, percentageInputs)

  return notes;
}

const addNote = (e) => {
  e.preventDefault();
  const form = document.querySelector('#container-notes');
  
  const notes = getNotesDOM();

  if(!calculatePercentageIsFull(notes)) {
    form.appendChild(createRow());
    showResultMessage(calculatePercentageIsFull(notes), '')
    return
  } 

  showResultMessage(calculatePercentageIsFull(notes), 'El total de porcentage no debe ser mayor a 100 ni menor que 0 😒')
}

const calcAverage = (notes) => {
  const subTotalArray = notes.map(({note, percentage}) => note * (percentage / 100));
  return subTotalArray.reduce((acc, curr) => acc += curr, 0);
}
const calculateAverageListener = () => {
  const notes = getNotesDOM();
  const totalPercentage = calcPercentageTotal(notes);

  if(totalPercentage === 100){
    const total = calcAverage(notes)
    if(total >= 40){
      showResultMessage(false, `Tu promedio es: ${total.toFixed(1)} 😉`, '#62D2A2')
    }else {
      showResultMessage(true, `Tu promedio es: ${total.toFixed(1)} 🥺`)
    }
    return
  }

  showResultMessage(true, `La suma de los porcentajes no es 100 😒`)
}

const clearResult = () => {
  document.querySelector('#note-form').reset();
  showResultMessage(false, ``)
}

document.querySelector('#note-form').addEventListener('submit', addNote);
document.querySelector('#calc-result').addEventListener('click', calculateAverageListener)
document.querySelector('#clear').addEventListener('click', clearResult);
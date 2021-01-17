/**
 * input and textarea to populate with date
 */
const paciente = [
  'id',
  'nombre',
  'apellido',
  'fdn',
  'tel',
  'email',
  'antecedentes',
  'ginecouro',
  'alergias'
];
const nota = [
  'enfactual',
  'exfisico',
  'excomple',
  'diagnosticos',
  'tratamiento'
];
/**
 * Single Page App behaviour as tabs
 * 
 * 
 * @param {object} event, onclick
 * @param {string} div id to be displayed or hidded
 */
function openSection(event, section) {
  let x, i, tablink;
  x = document.getElementsByClassName('section');
  for (i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  document.getElementById(section).style.display = "block";

  tablink = document.getElementsByClassName('tablink');
  for (i = 0; i < tablink.length; i++) {
    tablink[i].classList.remove('w3-blue');
  }
  event.currentTarget.classList.add('w3-blue');
}
/**
 * Monitor key pressed over ID input, if 'Enter', sends
 * event.key to '/leerDB
 * 
 * response.json() -- receive readablestream, read it, returns
 * a promise with body text transformed to JSON
 * 
 * @param {object} event onkeydown
 * @return {promise}
 * @param {array of objects} docs from neDB find query, length should be 1
 */
function checkId(event) {
  if (event.key == "Enter") {
    fetch(`/leerDB?id=${event.target.value}`)
      .then((response) => {
        console.log('response status:' + response.status);
        console.log('response ok:' + response.ok);
        return response.json();
      })
      .then((doc) => {
        if (doc != null) {
          desactivarPaciente();
          populateForm(doc);
        } else {
          console.log('toca activar campos');
          activarPaciente();
        }
      })
  }
}

/**
 * 
 * 
 * @return static nodeList with elements that matched the selector
 * 
 */
function listarCampos() {
  let nodelist = document.querySelectorAll('.campos');
  return nodelist;
}


/**
 * change input and textarea to readOnly = false
 * id input is set readOnly = true
 * 
 * @paciente is a const with input /textarea #id
 * 
 * 
 */
function activarPaciente() {
  for (let x of paciente) {
    if (x == 'id') {
      console.log('desactivando campo id');
      document.querySelector(`#${x}`).readOnly = true;
      continue;
    }
    document.querySelector(`#${x}`).readOnly = false;
    document.querySelector('#nombre').focus();
  }
}
/**
 * 
 * 
 * 
 * 
 */
function activarNota() {
  let id = document.querySelector('#id').value;
  if ( isNaN( parseInt(id) ) ) {
    console.log('no hay ID !, lo que hay es ' + document.querySelector('#id').value);
    return;
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).value = '';
    document.querySelector(`#${x}`).readOnly = false;
  }
  document.querySelector('#grabarnota').disabled = false;
  document.querySelector('#enfactual').focus(); 
}

/**
 * 
 * 
 * 
 * 
 */
function desactivarPaciente() {
  for (let x of paciente) {
    document.querySelector(`#${x}`).readOnly = true;
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).readOnly = true;
  }
}


/**
 * if /leerDB sends [{doc}]
 * 
 * 
 * @param {doc} object doc from neDB findOne query
 * 
 *  */
function populateForm(doc) {
  let cantidadNotas = doc.notas.length;
  console.log('cantidad de notas es ' + cantidadNotas);
  for (let x of paciente) {
    document.querySelector(`#${x}`).value = doc[x];
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).value =
      (doc.notas[cantidadNotas - 1]) ? (doc.notas[cantidadNotas - 1])[x] : '';
  }
}

/**
 * 
 * collect data from fist tab (break when reach 'enfactual')
 * send {object} data, as JSON string to /grabarPaciente
 * 
 * 
 */
function grabarPaciente() {
  let data = {};
  for (let x of paciente) {
    
    data[x] = document.querySelector(`#${x}`).value;
  }
  data.notas = [];

  fetch('/grabarPaciente', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" }
  })
    .then((response) => {
      console.log('grabarPaciente response ok es ' + response.ok);
      desactivarPaciente();
    });
}

/**
 * 
 * 
 * 
 * 
 * 
 */
function grabarNota() {
  let id = document.querySelector('#id').value;
  if ( isNaN(parseInt(id))) {
    console.log('ID no es un numero');
    return;
  }
  let nuevaNota = {};
  nuevaNota.stamp = Date.now();
  for (let x of nota) {
    nuevaNota[x] = document.querySelector(`#${x}`).value;
  }
  fetch(`/grabarNota?id=${id}`, {
    method: 'POST',
    body: JSON.stringify(nuevaNota),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      console.log('grabarNota response ok es ' + response.ok);
    });
}


/**
 * Single Page App behaviour as tabs
 * 
 * 
 * @param {object} event, onclick
 * @param {string} div id to be displayed or hided
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
  var nodelist = listarCampos();
  if (event.key == "Enter") {
    fetch(`/leerDB?id=${event.target.value}`)
      .then((response) => {
        console.log('response status:' + response.status);
        console.log('response ok:' + response.ok);
        return response.json();
      })
      .then((docs) => {
        if (docs.length >= 1) {
          populateForm(docs);
          desactivarCampos(nodelist);
        } else {
          activarCampos(nodelist);
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
 * @param { nodeList } nodelist
 * 
 * 
 */
function activarCampos(nodelist) {
  let x;
  for (x = 0; x < nodelist.length; x++) {
    if (nodelist[x].id == 'id') {
      nodelist[x].readOnly = true;
      continue;
    }
    nodelist[x].readOnly = false;
    document.querySelector('#nombre').focus();
  }
}

/**
 * 
 * 
 * @param { nodeList } nodelist
 * 
 */
function desactivarCampos( nodelist ) {
  let x;
  for (x = 0; x < nodelist.length; x++) {
    nodelist[x].readOnly = true;
  }
}


/**
 * if /leerDB sends [{doc}]
 * 
 * 
 * @param {docs} array of docs from neDB find query, should be lenght 1 
 */
function populateForm( docs ) {
  let nodelist = document.querySelectorAll('.campos');
  let x;
  for (x = 0; x < nodelist.length; ++x) {
    nodelist[x].value = docs[0][nodelist[x].id];
  }
}

/**
 * collect data from .campos
 * 
 * send {object} data, as JSON string to /grabarPaciente
 * 
 * 
 */
function grabarPaciente() {
  let data = {};
  let nodelist = document.querySelectorAll('.campos');
  let x;
  for (x = 0; x < nodelist.length; x++) {
    data[nodelist[x].id] = nodelist[x].value;
  }
  fetch('/grabarPaciente', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" }
  })
    .then((response) => {
      console.log('grabarPaciente response ok es ' + response.ok);
      desactivarCampos(nodelist);
    });
};
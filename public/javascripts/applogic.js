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
  'antecedentes'
];
const nota = [
  'enfactual',
  'exfisico',
  'excomple',
  'diagnosticos',
  'tratamiento'
];
const meses = {
  0: 'Enero',
  1: 'Febrero',
  2: 'Marzo',
  3: 'Abril',
  4: 'Mayo',
  5: 'Junio',
  6: 'Julio',
  7: 'Agosto',
  8: 'Septiembre',
  9: 'Octubre',
  10: 'Noviembre',
  11: 'Diciembre'
};
var documento = {};

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
    tablink[i].classList.remove('w3-theme-l3');
  }
  event.currentTarget.classList.add('w3-theme-l3');
}
/**
 * Monitor key pressed over ID input, if 'Enter', sends
 * event.key to '/leerDB
 * 
 * response.json() -- receive readablestream, read it, returns
 * a promise with body text transformed to JSON
 * {object} var documento , global objecto to store retrieved document
 * @param {object} event onkeydown
 * @return {promise}
 * @param {object} doc from neDB findOne query
 * */
function checkId(event) {
  let id = parseInt(document.querySelector('#id').value);
  if (event.key == "Enter" && id >= 1) {
    fetch(`/leerDB?id=${event.target.value}`)
      .then((response) => {
        console.log('response status:' + response.status);
        console.log('response ok:' + response.ok);
        return response.json();
      })
      .then((doc) => {
        if (doc != null) {
          documento = doc;
          desactivarPaciente();
          poblarCampos();
          poblarEtiquetas();
          crearPaginacion();
          document.querySelector("#idModal").style.display = "none";
          panelInformativo("panelExito", "Data received succesfully.");
        } else {
          activarPaciente();
          document.querySelector("#idModal").style.display = "none";
          panelInformativo("panelInformacion", "Ready to insert a new record");
        }
      })
      .catch((err) => {
        panelInformativo("panelAdvertencia", "Oops... Error !")
        console.log('err');
      });
  }
}
/**
 * @param {string} tipo : ['panelExito', 'panelInformacion', 'panelAdvertencia']
 * @param {string} contenido : string for alert details
 * 
 */
function panelInformativo(tipo, contenido) {
  let panel = document.querySelector(`#${tipo}`);
  let parrafo = document.querySelector(`#${tipo} p`);
  parrafo.innerHTML = contenido;
  panel.style.display = 'block';
  retirarPanel(panel);
}
/**
 * @param {object} panel: DOM element
 * 
 */
function retirarPanel(panel) {
  setTimeout(function() {
    panel.style.opacity = 0;
  }, 5000);
  setTimeout(function () {
    panel.style.display = "none";
    panel.style.opacity = 1;
  }, 7000);
}
/**
 * change input and textarea to readOnly = false
 * id input is set readOnly = true
 * 
 * @paciente is a const with input /textarea html id attributes
 * 
 */
function activarPaciente() {
  for (let x of paciente) {
    if (x == 'id') {
      document.querySelector(`#${x}`).readOnly = true;
      continue;
    }
    document.querySelector(`#${x}`).readOnly = false;
    document.querySelector('#nombre').focus();
    document.querySelector('#grabarPaciente').disabled = false;
  }
}
/**
 * 
 */
function desactivarPaciente() {
  for (let x of paciente) {
    document.querySelector(`#${x}`).readOnly = true;
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).readOnly = true;
  }
  document.querySelector('#grabarPaciente').disabled = true;
}
/**
 * 
 */
function activarNota() {
  let id = document.querySelector('#id').value;
  if (isNaN(parseInt(id))) {
    console.log('no hay ID !, lo que hay es ' + document.querySelector('#id').value);
    return;
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).value = '';
    document.querySelector(`#${x}`).readOnly = false;
  }
  document.querySelector('#etiquetaFecha').innerHTML = crearFecha(Date.now());
  document.querySelector('#activarNota').disabled = true;
  document.querySelector('#grabarNota').disabled = false;
  document.querySelector('#enfactual').focus();
  document.querySelector('#paginador').style.visibility = 'hidden';
  tagInformativa('#tagVacia');
}
/**
 * 
 */
function desactivarNota() {
  let fecha = crearFecha(Date.now());
  for (let x of nota) {
    document.querySelector(`#${x}`).readOnly = true;
  }
  document.querySelector('#activarNota').disabled = true;
  document.querySelector('#grabarNota').disabled = true;
  document = querySelector('#etiquetaFecha').innerHTML = fecha;
}
/**
 * if /leerDB sends [{doc}]
 * 
 * 
 * {object} documento is a global variable, populated if checkId returns a document 
 * 
 *  */
function poblarCampos() {
  let cantidadNotas = documento.notas.length;
  for (let x of paciente) {
    document.querySelector(`#${x}`).value = documento[x];
  }
  for (let x of nota) {
    document.querySelector(`#${x}`).value =
      documento.notas[cantidadNotas - 1] ? documento.notas[cantidadNotas - 1][x] : '';
  }
  document.querySelector('#edad').value = calcularEdad();
  document.querySelector('#activarNota').disabled = false;
}
/**
 * {object} documento is a global variable, populated if checkId returns a document 
 * 
 */
function poblarEtiquetas() {
  document.querySelector('#etiquetaNombre').innerHTML = documento.apellido + ', ' + documento.nombre;
  document.querySelector('#etiquetaEdad').innerHTML = `${calcularEdad()} años`;
  let cantidadNotas = documento.notas.length;
  let stamp = documento.notas[cantidadNotas - 1] ? documento.notas[cantidadNotas - 1]['stamp'] : '';
  if (!isNaN(parseInt(stamp))) {
    let fecha = crearFecha(stamp);
    document.querySelector('#etiquetaFecha').innerHTML = fecha;
  }
}
/**
 * @param {number} stamp
 */
function crearFecha(stamp) {
  let objetoFecha = new Date(stamp);
  let fecha = objetoFecha.getDate() + '-' + (meses[objetoFecha.getMonth()]) + '-'
    + objetoFecha.getFullYear();
  return fecha;
}
/**
 * 
 */
function calcularEdad() {
  let hoy = new Date();
  let fdn = new Date(documento.fdn);
  let años = hoy.getFullYear() - fdn.getFullYear();
  let ajuste = (fdn.getMonth() - hoy.getMonth() > 0) ? 1 : 0;
  let edad = años - ajuste;
  return edad;
}
/**
 * 
 */
function crearPaginacion() {
  let contenedor = document.querySelector('#paginador');
  let elemento;
  for (let x = 0; x < documento.notas.length; x++) {
    elemento = document.createElement('a');
    elemento.innerHTML = x + 1;
    elemento.classList.add('w3-button');
    contenedor.appendChild(elemento);
  }
  contenedor.lastElementChild ? contenedor.lastElementChild.classList.add('w3-theme') : undefined;
}
/**
 * 
 */
function cambiarPagina(evt) {
  let paginadorHijos = document.querySelector('#paginador').children;
  let notaSolicitada = parseInt(evt.target.innerHTML) - 1;
  let fecha = crearFecha(documento.notas[notaSolicitada]['stamp']);
  for (let x of nota) {
    document.querySelector(`#${x}`).value = documento.notas[notaSolicitada][x];
  }
  document.querySelector('#etiquetaFecha').innerHTML = fecha;
  for (let x of paginadorHijos) {
    x.classList.remove('w3-theme');
  }
  paginadorHijos[parseInt(evt.target.innerHTML - 1)].classList.add('w3-theme');
}
/**
 * 
 * collect data from fist tab (break when reach 'enfactual')
 * send {object} data, as JSON string to /grabarPaciente
 * 
 * 
 */
function grabarPaciente() {
  let id = document.querySelector('#id').value;
  if (id == '') {
    console.log('Registro sin identificacion !');
    return;
  }
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
      console.log('la respuesta fue ' + response);
      return response.json();
      console.log('grabarPaciente response ok es ' + response.ok);
      desactivarPaciente();
      activarNota();
    })
    .then((doc) => {
      documento = doc;
      desactivarPaciente();
      poblarCampos();
      poblarEtiquetas();
      tagInformativa('#tagExito');
      console.log('el documento recibido luego de grabado es ' + doc);
    })
    .catch((err) => {
      console.log(err);
      tagInformativa('#tagError');
    });
}
/**
 * 
 */
function grabarNota() {
  let id = document.querySelector('#id').value;
  if (isNaN(parseInt(id))) {
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
      document.querySelector('#activarNota').disabled = true;
      document.querySelector('#grabarNota').disabled = true;
      tagInformativa('#tagExito');
    })
    .catch((err) => {
      console.log(err);
      tagInformativa('#tagError');
    });
}
/**
 * 
 */
function poblarReporte(e) {
  for (let x of paciente) {
    document.querySelector(`#${x}Informe`) ?
      document.querySelector(`#${x}Informe`).innerHTML = document.querySelector(`#${x}`).value : undefined;
  }
  document.querySelector('#edadInforme').innerHTML = document.querySelector('#edad').value;
  for (let x of nota) {
    document.querySelector(`#${x}Informe`) ?
      document.querySelector(`#${x}Informe`).innerHTML = document.querySelector(`#${x}`).value : undefined;
  }
  document.querySelector("#fechaInforme").innerHTML = document.querySelector("#etiquetaFecha").innerHTML;
}
/**
 * @param {object} e: event from onsubmit
 */
function almacenarDatosProfesionales(e) {
  e.preventDefault();
  let formaElementos = document.querySelectorAll("#datosProfesionales *[name]");
  for (let x of formaElementos) {
    localStorage.setItem(x.name, x.value);
  }
  poblarDatosProfesionales();
  tagInformativa('#tagExito');
}
/**
 * from localStorate, populate patient report foot section
 */
function poblarDatosProfesionales() {
  let elementosFormaProfesional = document.querySelectorAll('#datosProfesionales input[name]');
  for (let x of elementosFormaProfesional) {
    x.value = localStorage.getItem(x.name) ?? "";
  }
  let grado = localStorage.getItem("grado") ?? "";
  let nombres = localStorage.getItem("nombres") ?? "";
  let apellidos = localStorage.getItem("apellidos") ?? "";
  let credencial1 = localStorage.getItem("credencial1") ?? '';
  let credencial2 = localStorage.getItem("credencial2") ?? '';
  let credencial3 = localStorage.getItem("credencial3") ?? '';
  let credenciales = `${credencial1} ${credencial2} ${credencial3}`;
  document.querySelector("#medicoNombre").innerHTML = `${grado} ${nombres} ${apellidos}`;
  document.querySelector("#medicoEspecialidad").innerHTML = localStorage.getItem("especialidad") ?? "";
  document.querySelector("#medicoCredenciales").innerHTML = credenciales;
}
/**
 * 
 */
function almacenarFirma(e) {



}


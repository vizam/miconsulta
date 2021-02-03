/**
 *  
 */
function paginarNotas() {
  let notas = document.querySelectorAll('#divNotas > div');
  notas[notas.length - 1].style.display = 'block';
  let paginas = document.querySelectorAll('#paginador > a');
  paginas[notas.length - 1].classList.add('w3-green');
}
/**
 * @param {object} event object
 */
function cambiarPagina(event) {
  let pagina = event.target.innerHTML - 1;
  let notas = document.querySelectorAll('#divNotas > div');
  let paginador = document.querySelectorAll('#paginador > a');
  
  for (let x of notas) {
    x.style.display = 'none';
  }
  notas[pagina].style.display = 'block';
  for (let x of paginador) {
    x.classList.remove('w3-green');
  }
  paginador[pagina].classList.add('w3-green');
}
/**
 * 
 */
function getAction(event) {
  let form = document.forms[0];
  let id = document.querySelector('form > input').value;
  form.action = `/records`;
}
/**
 * @param {object} e: event from onsubmit
 */
function almacenarDatosProfesionales(e) {
  e.preventDefault();
  let elementos = e.target.elements;
  for (let x of elementos) {
    localStorage.setItem(x.name, x.value);
  }
  panelInformativo();
  //poblarDatosProfesionales();
  //tagInformativa('#tagExito');
}
/**
 * from localStorate, populate patient report foot section
 */
function poblarDatosProfesionales() {
  let elementos = document.querySelectorAll('#datosProfesionales input[name]');
  for (let x of elementos) {
    x.value = localStorage.getItem(x.name) ?? "";
  }
  /* let grado = localStorage.getItem("grado") ?? "";
  let nombres = localStorage.getItem("nombres") ?? "";
  let apellidos = localStorage.getItem("apellidos") ?? "";
  let credencial1 = localStorage.getItem("credencial1") ?? '';
  let credencial2 = localStorage.getItem("credencial2") ?? '';
  let credencial3 = localStorage.getItem("credencial3") ?? '';
  let credenciales = `${credencial1} ${credencial2} ${credencial3}`;
  document.querySelector("#medicoNombre").innerHTML = `${grado} ${nombres} ${apellidos}`;
  document.querySelector("#medicoEspecialidad").innerHTML = localStorage.getItem("especialidad") ?? "";
  document.querySelector("#medicoCredenciales").innerHTML = credenciales; */
}
/**
 * 
 */
function panelInformativo() {
  let panel = document.querySelector('#panelExito');
  let parrafo = document.querySelector('#panelExito > p');
  parrafo.innerHTML = 'Operación realiazada con éxito';
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

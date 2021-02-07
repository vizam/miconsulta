/**
 *  
 */
function paginarNotas() {
  let notas = document.querySelectorAll('#divNotas > div');
  notas[notas.length - 1].style.display = 'block';
  let paginas = document.querySelectorAll('#paginador > a');
  paginas[notas.length - 1].classList.add('w3-theme');
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
    x.classList.remove('w3-theme');
  }
  paginador[pagina].classList.add('w3-theme');
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
  panelInformativo('Success', 'Data stored succesfully');
}
/**
 * from localStorate, populate patient report foot section
 */
function poblarAjustes() {
  let elementos = document.querySelectorAll('#datosProfesionales input[name]');
  for (let x of elementos) {
    x.value = localStorage.getItem(x.name) ?? "";
  }
}
/**
 * 
 */
function poblarInforme() {
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
 * @param {string} type kind of panel, defined in backend
 * @param {string} msg message detail, defined in backend
 */
function panelInformativo(type, msg) {
  if (type) {
    let color = {
      Success: 'rgb(60, 179, 113)',
      Info: 'rgp(0, 157, 255, 0.5)',
      Warning: 'rgb(255, 99, 71, 0.5)'
    };
    let panel = document.querySelector('#info');
    document.querySelector('#info > h3').innerHTML = type;
    document.querySelector('#info > p').innerHTML = msg;
    panel.style.backgroundColor = color[type];
    panel.style.display = 'block';
    retirarPanel(panel);
  }
}
/**
 * @param {object} panel div element
 * 
 */
function retirarPanel(panel) {
  setTimeout(function () {
    panel.style.opacity = 0;
  }, 5000);
  setTimeout(function () {
    panel.style.display = "none";
    panel.style.opacity = 1;
  }, 7000);
}
/**
 * 
 */
function appKeys(event) {
  
  let paginador = document.querySelectorAll('#paginador > a');
  let notas = document.querySelectorAll('#divNotas > div');
  let pagina;
  for (let x of paginador) {
    if (x.classList.contains('w3-theme-action')) {
      pagina = x.innerHTML;
    }
  }
  if (event.key == "ArrowLeft") {
    if (pagina > 1) {
      for (let x of notas) {
        x.style.display = 'none';
      }
      notas[pagina - 2].style.display = 'block';
      paginador[pagina - 1].classList.toggle('w3-theme-action');
      paginador[pagina - 2].classList.toggle('w3-theme-action');
    } else {
      return;
    }
  }
  if (event.key == "ArrowRight") {
    if (pagina < paginador.length) {
      for (let x of notas) {
        x.style.display = 'none';
      }
      notas[pagina].style.display = 'block';
      paginador[pagina].classList.toggle('w3-theme-action');
      paginador[pagina - 1].classList.toggle('w3-theme-action');
    } else {
      return;
    }
  }
}
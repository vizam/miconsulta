/**
 *
 */
function paginarNotas() {
  let notas = document.querySelectorAll("#divNotas > div");
  if (notas.length) {
    notas[notas.length - 1].style.display = "block";
    let paginas = document.querySelectorAll("#paginador > a");
    paginas[notas.length - 1].classList.add("w3-theme");
  }
}
/**
 * @param {object} event object
 */
function cambiarPagina(event) {
  let pagina = event.target.innerHTML - 1;
  let notas = document.querySelectorAll("#divNotas > div");
  let paginador = document.querySelectorAll("#paginador > a");
  for (let x of notas) {
    x.style.display = "none";
  }
  notas[pagina].style.display = "block";
  for (let x of paginador) {
    x.classList.remove("w3-theme");
  }
  paginador[pagina].classList.add("w3-theme");
}
/**
 * @param {string} message kind of message, defined in backend
 * @param {string} details message detail, defined in backend
 */
function panelInformativo() {
  let message = document.querySelector("#message").innerHTML;
  let details = document.querySelector("#details").innerHTML;

  if (message) {
    let messageString = {
      warning: "Alerta !",
      info: "Información:",
      success: "Bien hecho !",
      welcome: "Bienvenid@ !",
    };
    let panelColor = {
      warning: "Tomato",
      info: "RoyalBlue",
      success: "ForestGreen",
      welcome: "ForestGreen",
    };
    let detailsString = {
      success: "Operación realizada con éxito !",
      welcome: "Vamos... sin miedo al éxito !",
      noemail: "Email no registrado !",
      wrongpass: "Clave equivocada !... consulte al administrador",
      bademail: "Este email ya existe en la base de datos ! ... Use otro",
      error: "Ha ocurrido un error !... intente de nuevo",
      newrecord: "No existe el registro... Quiere crear uno ?",
      emptynotes: `Para crear una nueva nota, presione <span class="fas fa-pen
      w3-margin-left w3-margin-right w3-text-white"></span> en la parte superior de la página`,
      storednote: "Nueva Nota almacenada con éxito...",
      storedrecord: "Nuevo Registro almacenado con éxito...",
      badcode: "Código equivocado u obsoleto !... Contacte al adminstrador  ",
      invalidrecord: "Ese registro ya existe !... Operación inválida.",
      invaliduser: "Usuario inválido ...",
      networkdown: "El server no responde... intente mas tarde",
      invalidfile: "El archivo no es válido",
      nodatos: "No hay suficientes datos para completar esta accion",
      mailed: "Correo electrónico enviado con éxito... al parecer =p",
    };
    let panel = document.querySelector("#info");
    panel.style.backgroundColor = panelColor[message];
    document.querySelector("#info > h3").innerHTML = messageString[message];
    document.querySelector("#info > p").innerHTML =
      detailsString[details] ?? "";
    panel.style.display = "block";
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
 * Respalda la nota en progreso, localmente, cada 10 seg
 * @param {object} e 
 */
function respaldarNota(e) {
  nota.removeEventListener('keydown', respaldarNota);
  let areas = document.querySelectorAll("#modalNote textarea");
  setTimeout( function() {
    for (let area of areas) {
      localStorage.setItem(area.name, area.value);
    } 
    nota.addEventListener('keydown', respaldarNota);
  }, 10000);
}
/**
 * Si fuera necesario, recupera la nota que se guardo localmente
 * @param {object} e 
 */
function recuperarNota(e) {
  let campos = document.querySelectorAll("#modalNote textarea");
  let confirmado = window.confirm("Esta acción borrará lo que ha escrito hasta ahora, y tratará de recuperar datos previos. Desea continuar ?");
  if (confirmado) {
    for (let campo of campos) {
      campo.value = localStorage.getItem(campo.name);
    }
  }
}
/**
 *
 */
function showPreview(e) {
  let preview = document.querySelector("#firma");
  let file = e.target.files.item(0);
  let domString = URL.createObjectURL(file);
  preview.src = domString;
}
/**
 *
 * @param {*} event
 */
function storePreview(ev) {
  ev.preventDefault();
  let archivo = document.querySelector("#archivo").files[0];
  if (
    archivo.size > 256000 ||
    (archivo.type != "image/jpeg" && archivo.type != "image/png")
  ) {
    document.querySelector("#message").innerHTML = "warning";
    document.querySelector("#details").innerHTML = "invalidfile";
    panelInformativo();
    return;
  }
  let reader = new FileReader();
  reader.onload = function (e) {
    let data = reader.result;
    localStorage.setItem("firma", data);
    document.querySelector("#message").innerHTML = "success";
    document.querySelector("#details").innerHTML = "success";
    panelInformativo();
  };
  reader.readAsDataURL(archivo);
}
/**
 *
 * @param {*} event
 */
function cargarFirma() {
  let domString = localStorage.getItem("firma") ?? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
  document.querySelector("#firma").src = domString;
}
/**
 *
 * @param {*} event
 */

function enviarCorreo(e) {
  e.preventDefault();
  let forma = e.target;
  let notas = document.querySelectorAll("#divNotas > div");
  let pacienteID = document.querySelector("#patientId").innerHTML;
  let paginaActiva;
  let firma = document.querySelector("#firma").src;
  for (let x = 0; x < notas.length; x++) {
    if (notas[x].style.display == "block") {
      paginaActiva = x;
    }
  }
  if (paginaActiva >= 0) {
    forma.action = `/reportes/${pacienteID}/${paginaActiva}`;
    document.querySelector("#mailerFirma").value = firma;
    forma.submit();
  } else {
    document.querySelector("#message").innerHTML = "info";
    document.querySelector("#details").innerHTML = "nodatos";
    document.querySelector("#modalMailer").style.display = "none";
    panelInformativo();
  }
}

function paginadorTeclas(event) {
  let paginador = document.querySelectorAll("#paginador > a");
  let notas = document.querySelectorAll("#divNotas > div");
  let pagina;
  for (let x of paginador) {
    if (x.classList.contains("w3-theme")) {
      pagina = x.innerHTML;
    }
  }
  if (event.key == "ArrowLeft" && event.shiftKey == true) {
    if (pagina > 1) {
      for (let x of notas) {
        x.style.display = "none";
      }
      notas[pagina - 2].style.display = "block";
      paginador[pagina - 1].classList.toggle("w3-theme");
      paginador[pagina - 2].classList.toggle("w3-theme");
    } else {
      return;
    }
  }
  if (event.key == "ArrowRight" && event.shiftKey == true) {
    if (pagina < paginador.length) {
      for (let x of notas) {
        x.style.display = "none";
      }
      notas[pagina].style.display = "block";
      paginador[pagina].classList.toggle("w3-theme");
      paginador[pagina - 1].classList.toggle("w3-theme");
    } else {
      return;
    }
  }
}

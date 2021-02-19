/**
 * 
 * @param {object} event 
 */
function almacenarDatosProfesionales(event) {
  event.preventDefault();
  let forma = new FormData(event.target);
  let cuerpo = new URLSearchParams(forma);
  fetch("/ajustes/dataprofesional", {
    method: "POST",
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: cuerpo
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      document.getElementById('message').innerHTML = response.message;
      document.getElementById('details').innerHTML = response.details;
      panelInformativo();
    })
    .catch(function (error) {
      document.getElementById('message').innerHTML = 'warning';
      document.getElementById('details').innerHTML = 'networkdown';
      panelInformativo();
      /* setTimeout(function() {
        window.location.replace('/users');  
      }, 5000); */
    });
}
function enviarCorreo(e) {
  console.log('aqui estoy');
  e.preventDefault();
  let forma = e.target;
  let notas = document.querySelectorAll("#divNotas > div");
  let pacienteID = document.querySelector("#patientId").innerHTML;
  let paginaActiva;
  for (let x = 0; x < notas.length; x++) {
    if (notas[x].style.display == "block") {
      paginaActiva = x;
      console.log('pagina es ' + x);
    }
  }
  if (paginaActiva >= 0) {
    forma.action = `/reportes/${pacienteID}/${paginaActiva}`;
    forma.submit();
  } else {
    document.querySelector('#message').innerHTML = 'info';
    document.querySelector('#details').innerHTML = 'nodatos';
    document.querySelector('#modalMailer').style.display = 'none';
    panelInformativo();
  }
}
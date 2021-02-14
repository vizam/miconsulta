/**
 * 
 * @param {object} event 
 */
function almacenarDatosProfesionales(event) {
  event.preventDefault();
  let forma = new FormData(event.target);
  let cuerpo = new URLSearchParams(forma);
  fetch("/ajaxapis/dataprofesional", {
    method: "POST",
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: cuerpo
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (respuesta) {
      document.getElementById('type').innerHTML = respuesta.messageType;
      document.getElementById('msg').innerHTML = respuesta.message;
      panelInformativo();
    })
    .catch(function (error) {
      document.getElementById('type').innerHTML = 'warning';
      document.getElementById('msg').innerHTML = 'networkdown';
      panelInformativo();
      /* setTimeout(function() {
        window.location.replace('/users');  
      }, 5000); */
    });
}

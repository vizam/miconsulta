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

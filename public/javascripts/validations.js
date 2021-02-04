
/**
 * Triggered by onkeyup over password and confirm password 
 * @param {object} event object
 * 
 */
function checkPassword(event) {
  let form = event.target.form; 
  let password = form.querySelector('[name=password]');
  let confirmPassword = form.querySelector('[name=confirmpassword]');
  if (password.value != confirmPassword.value) {
    password.style.backgroundColor = "rgb(255, 99, 71, 0.5)";
    confirmPassword.style.backgroundColor = 'rgb(255, 99, 71, 0.5)';
    form.querySelector('[type=submit]').disabled = true;
    return;
  } else {
    password.style.backgroundColor = "revert";
    confirmPassword.style.backgroundColor = 'revert';
    form.querySelector('[type=submit]').disabled = false;
  }
}
/* function validateForm(event) {
  let form = event.target.form;
  console.log('password es igual...');
  for (let x of form) {
    if (x.value == '') {
      if (event.target.type == 'submit') {
        event.preventDefault();
      }
      x.focus();
      form.querySelector('[type=submit]').disabled = true; 
      return;
    } else {
      x.style.backgroundColor = 'initial';
    }
  } 
  form.querySelector('[type=submit]').disabled = false; 
} 
 */

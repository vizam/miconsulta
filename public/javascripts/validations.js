
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
    password.style.backgroundColor = "darksalmon";
    confirmPassword.style.backgroundColor = 'darksalmon';
    form.querySelector('[type=submit]').disabled = true;
    return;
  } else {
    password.style.backgroundColor = "initial";
    confirmPassword.style.backgroundColor = 'initial';
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

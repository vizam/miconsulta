
/**
 * Triggered by onkeyup over password and confirm password 
 * @param {object} event object
 * 
 */
function checkPassword() {
  let form = event.target.form;
  let password = form.querySelector('[name=password]');
  let confirmPassword = form.querySelector('[name=confirmpassword]');
  console.log(confirmPassword);
  if (password.value != confirmPassword.value) {
    password.style.backgroundColor = "rgb(255, 99, 71, 0.5)";
    confirmPassword.style.backgroundColor = "rgb(255, 99, 71, 0.5)";
    form.querySelector('[type=submit]').disabled = true;
    return;
  } else {
    password.style.backgroundColor = "revert";
    confirmPassword.style.backgroundColor = "revert";
    form.querySelector('[type=submit]').disabled = false;
  }
}
/**
 * Triggered by onkeyup over email and confirm email 
 * @param {object} event object
 * 
 */
function checkEmail() {
  let form = event.target.form;
  let email = form.querySelector('[name=email]');
  let confirmEmail = form.querySelector('[name=confirmemail]');
  if (email.value != confirmEmail.value) {
    email.style.backgroundColor = "rgb(255, 99, 71, 0.5)";
    confirmEmail.style.backgroundColor = "rgb(255, 99, 71, 0.5)";
    form.querySelector('[type=submit]').disabled = true;
    return;
  } else {
    email.style.backgroundColor = "revert";
    confirmEmail.style.backgroundColor = "revert";
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

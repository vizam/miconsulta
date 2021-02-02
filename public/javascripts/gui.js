/**
 * GUI TABs layout
 * 
 * 
 * @param {object} event, onclick
 * @param {string} div id to be displayed or hidded
 */
function changeTab(event, section) {
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
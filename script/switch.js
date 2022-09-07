const input = document.querySelector('.input');
const form = document.querySelector('.form');


form.addEventListener('submit', e => {
  e.preventDefault();

  localStorage.setItem('user', input.value);
  window.location = 'main.html';
  form.reset();
});

const socket = io('ws://localhost:3000');

function sendMessage(e) {
  e.preventDefault();
  const input = document.querySelector('input');
  const message = input.value;
  if (message) {
    socket.send(message);
    input.value = '';
  }
  input.focus();

  return false;
}
document.querySelector('form').addEventListener('submit', sendMessage);

//listen to event
socket.addEventListener('message', (message) => {
  const el = document.createElement('li');
  el.textContent = message;
  document.querySelector('ul').appendChild(el);
});

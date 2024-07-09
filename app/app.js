const socket = io('ws://localhost:3000');

function sendMessage(e) {
  e.preventDefault();
  const input = document.querySelector('.message');
  const message = input.value;
  const name = document.querySelector('.username').value;
  if (message) {
    socket.send(message, name);
    input.value = '';
  }
  input.focus();

  return false;
}
document.querySelector('form').addEventListener('submit', sendMessage);

//listen to event
socket.addEventListener('message', (message) => {
  const el = document.createElement('li');
  el.textContent = `  ${message}`;
  document.querySelector('ul').appendChild(el);
});

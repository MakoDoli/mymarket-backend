const socket = io('ws://localhost:3000');

document.querySelector('form').addEventListener('submit', sendMessage);

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

//listen to socket
socket.addEventListener('message', (message) => {
  const el = document.createElement('li');
  el.textContent = `  ${message}`;
  document.querySelector('ul').appendChild(el);
});

document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  const loginButton = document.querySelector('.login-button');

  const showLogin = document.querySelector('.show-login');

  const signupButton = document.querySelector('.signup-button');

  const loginForm = document.querySelector('.loginForm');

  loginButton.addEventListener('click', () => loginForm.classList.remove('hidden'));
  loginForm.addEventListener('submit', async () => {
    //event.preventDefault();
    signupButton.classList.remove('active');

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    await signin(email, password);
  });
  // Async functions for authentication

  async function checkAuthStatus() {
    try {
      const res = await fetch('http://localhost:3000/api/users/check-auth');
      const data = await res.json();

      if (data.authenticated) {
        loginButton.classList.remove('active');
        showLogin.classList.remove('hidden');
        signupButton.classList.remove('active');
        window.location.reload();
      }

      return data.authenticated;
    } catch (err) {
      loginButton.classList.remove('active');
      signupButton.classList.add('active');
      console.error('Failed to check authentication', err);
      return;
    }
  }

  async function signin(email, password) {
    try {
      const res = await fetch('http://localhost:3000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        showLogin.classList.add('active');
        loginButton.classList.remove('active');
      }
    } catch (err) {
      console.error('Failed to sign in', err);
    }
  }
});

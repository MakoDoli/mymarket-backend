const socket = io('ws://ec2-51-20-85-158.eu-north-1.compute.amazonaws.com:3000');

document.querySelector('.message-form').addEventListener('submit', sendMessage);

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
  //const sendButton = document.querySelector('.send-button');
  const loginButton = document.querySelector('.login-button');

  const showLogin = document.querySelector('.show-login');

  const signupButton = document.querySelector('.signup-button');
  const signoutButton = document.querySelector('.signout-button');

  const loginForm = document.querySelector('.loginForm');
  const signupForm = document.querySelector('.signupForm');

  checkAuthStatus();
  // Event Listeners
  loginButton.addEventListener('click', () => {
    signupButton.classList.remove('active');
    loginButton.classList.remove('active');
    loginForm.classList.remove('hidden');
  });

  signupButton.addEventListener('click', () => {
    signupButton.classList.remove('active');
    loginButton.classList.remove('active');
    signupForm.classList.remove('hidden');
  });

  signoutButton.addEventListener('click', async () => {
    signupButton.classList.add('active');
    loginButton.classList.add('active');
    showLogin.classList.add('hidden');
    try {
      const data = await signout();

      if (data.status === 'success') window.location.reload();
    } catch (err) {
      console.log(err);
    }
  });

  //   SIGN -IN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    const data = await signin(email, password);
    if (data.status === 'success') {
      showLogin.classList.add('active');
      loginButton.classList.remove('active');
      signupButton.classList.add('active');

      window.location.reload();
    }
    if (data.status === 'fail') {
      loginButton.classList.remove('active');
    }
  });

  //   SIGN -UP

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm');
    if (confirmPassword !== password || password.length < 6) {
      alert('Passwords do not match!');
      return;
    }
    const data = await signup(email, password);
    if (data.status === 'success') {
      loginButton.classList.add('active');
      signupButton.classList.remove('active');
      window.location.reload();
    }
    if (data.status === 'error') {
      alert('Email is already in use');
      loginButton.classList.remove('active');
    }
  });
  // Async functions for authentication

  async function checkAuthStatus() {
    try {
      const res = await fetch(
        'http://ec2-51-20-85-158.eu-north-1.compute.amazonaws.com:3000/api/users/check-auth',
      );
      const data = await res.json();
      if (data.statusCode === 401) {
        showLogin.classList.add('hidden');
        throw new Error('Unauthorized');
      }
      if (data.authenticated) {
        loginButton.classList.remove('active');
        showLogin.classList.remove('hidden');
        signupButton.classList.remove('active');
        //sendButton.classList.remove('hidden');
      }
      console.log(data);
      return data.authenticated;
    } catch (err) {
      loginButton.classList.add('active');
      signupButton.classList.add('active');

      //sendButton.classList.add('hidden');

      console.error('Failed to check authentication', err);
      return;
    }
  }

  async function signin(email, password) {
    try {
      const res = await fetch(
        'http://ec2-51-20-85-158.eu-north-1.compute.amazonaws.com:3000/api/users/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();

      console.log(data);
      return data;
    } catch (err) {
      console.error('Failed to sign in', err);
    }
  }

  async function signup(email, password) {
    try {
      const res = await fetch(
        'http://ec2-51-20-85-158.eu-north-1.compute.amazonaws.com:3000/api/users/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();

      console.log(data);
      return data;
    } catch (err) {
      console.error('Failed to sign up', err);
    }
  }

  async function signout() {
    try {
      const res = await fetch(
        'http://ec2-51-20-85-158.eu-north-1.compute.amazonaws.com:3000/api/users/signout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Adding appropriate headers
          },
        },
      );
      const data = await res.json();
      console.log(data.status);
      return data;
    } catch (err) {
      alert('You are not logged in');
      console.error('Failed to sign out', err);
    }
  }
});

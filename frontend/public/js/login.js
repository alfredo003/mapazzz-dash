const firebaseConfig = {
    apiKey: "AIzaSyDG4Yh4PJUKcesMFwrT_Ij80ytwAC9NdP0",
    authDomain: "mapazzz-f3710.firebaseapp.com",
    projectId: "mapazzz-f3710",
    storageBucket: "mapazzz-f3710.firebasestorage.app",
    messagingSenderId: "651181150618",
    appId: "1:651181150618:web:ace0651cfe3120e115ea23",
    measurementId: "G-3VBNWW2ZJ0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Adicione isso no início do arquivo para debug
firebase.auth().onAuthStateChanged((user) => {
  console.log('Estado da autenticação mudou:', user ? 'Usuário logado' : 'Usuário não logado');
  console.log('Token atual:', localStorage.getItem('authToken'));
});

// Authentication functions
async function loginUser(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const token = await userCredential.user.getIdToken();
    
    if (token) {
      localStorage.setItem('authToken', token);
      setTimeout(() => {
      window.location.href = 'index.html';
      }, 100);
    } else {
      throw new Error('Token de autenticação inválido');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Erro ao fazer login: ' + error.message);
  }
}

// Function to check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('authToken');
  const currentPage = window.location.pathname.split('/').pop();
  
  console.log('Checking auth:', { token, currentPage });
  
  if (currentPage === 'login.html' && token) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
    window.location.href = 'index.html';
      } else {
        localStorage.removeItem('authToken');
      }
    });
    return;
  }
  
  if (currentPage !== 'login.html' && !token) {
    window.location.href = 'login.html';
    return;
  }
}


document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            forgotPassword(event);
        });
    }
});

function forgotPassword(event) {
    // Your forgot password logic here
    alert('Funcionalidade de recuperação de senha em desenvolvimento');
} 
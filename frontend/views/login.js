
<script>
// Initialize Firebase
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

// Get auth instance
const auth = firebase.auth();

// Handle login form submission
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = document.querySelector('.btn');

    // Clear previous error messages
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    // Add loading state
    submitButton.classList.add('loading');

    try {
        // Set persistence based on "remember me" checkbox
        const persistence = remember ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;

        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        // Sign in user
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Successful login
        console.log('Login successful:', userCredential.user);
        
        // Redirect to dashboard
        await loginUser(email, password);

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific error cases
        let errorText = '';
        switch (error.code) {
            case 'auth/user-not-found':
                errorText = 'Usuário não encontrado.';
                break;
            case 'auth/wrong-password':
                errorText = 'Senha incorreta.';
                break;
            case 'auth/invalid-email':
                errorText = 'Email inválido.';
                break;
            case 'auth/user-disabled':
                errorText = 'Esta conta foi desativada.';
                break;
            default:
                errorText = 'Erro ao fazer login. Tente novamente.';
        }

        // Display error message
        errorMessage.textContent = errorText;
        errorMessage.style.display = 'block';
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
    }
}

// Handle forgot password
async function forgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const errorMessage = document.getElementById('errorMessage');

    if (!email) {
        errorMessage.textContent = 'Por favor, insira seu email para redefinir a senha.';
        errorMessage.style.display = 'block';
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        errorMessage.textContent = 'Email de redefinição de senha enviado. Verifique sua caixa de entrada.';
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#27ae60'; // Success color
    } catch (error) {
        console.error('Password reset error:', error);
        
        let errorText = '';
        switch (error.code) {
            case 'auth/invalid-email':
                errorText = 'Email inválido.';
                break;
            case 'auth/user-not-found':
                errorText = 'Não existe conta com este email.';
                break;
            default:
                errorText = 'Erro ao enviar email de redefinição. Tente novamente.';
        }

        errorMessage.textContent = errorText;
        errorMessage.style.display = 'block';
        errorMessage.style.color = 'var(--primary-color)'; // Error color
    }
}

// Check if user is already logged in
auth.onAuthStateChanged((user) => {
    if (user) {
        // Verifica se já existe um token antes de redirecionar
        const token = localStorage.getItem('authToken');
        if (token) {
            window.location.href = 'index.html';
        } else {
            // Se não houver token, gera um novo
            user.getIdToken().then(token => {
                localStorage.setItem('authToken', token);
        window.location.href = 'index.html';
            });
        }
    }
});

async function loginUser(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('authToken', token);
        window.location.href = 'index.html'; // Redirect to dashboard after login
    } catch (error) {
        console.error('Error during login:', error);
        alert('Erro ao fazer login: ' + error.message);
    }
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}
</script>
</body>
</html>
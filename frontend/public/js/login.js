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
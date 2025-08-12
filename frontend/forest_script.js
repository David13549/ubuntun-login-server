// Sistema de autenticación mejorado
const users = [
    { username: 'admin', password: 'forest123', name: 'Guardián del Bosque', email: 'admin@forest.com' },
    { username: 'ranger', password: 'tree456', name: 'Explorador', email: 'ranger@forest.com' },
    { username: 'demo', password: 'demo', name: 'Visitante', email: 'demo@forest.com' }
];

let loginAttempts = 0;
const maxAttempts = 3;
let isLoginMode = true;

// Función para alternar entre login y registro
function toggleAuthMode() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toggleBtn = document.getElementById('toggleAuth');
    const toggleText = document.getElementById('toggleText');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const forgotSection = document.getElementById('forgotSection');

    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleBtn.textContent = 'Crear Cuenta';
        toggleText.textContent = '¿No tienes una cuenta?';
        formTitle.textContent = 'Forest Login';
        formSubtitle.textContent = 'Ingresa a tu cuenta en el bosque digital';
        forgotSection.style.display = 'block';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleBtn.textContent = 'Iniciar Sesión';
        toggleText.textContent = '¿Ya tienes una cuenta?';
        formTitle.textContent = 'Únete al Bosque';
        formSubtitle.textContent = 'Crea tu cuenta y explora el bosque digital';
        forgotSection.style.display = 'none';
    }
    
    playSound('click');
}

// Función para verificar fortaleza de contraseña
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.className = 'strength-bar';
    
    switch(strength) {
        case 0:
        case 1:
            strengthBar.classList.add('strength-weak');
            feedback = 'Muy débil';
            strengthText.style.color = '#ff4444';
            break;
        case 2:
            strengthBar.classList.add('strength-fair');
            feedback = 'Débil';
            strengthText.style.color = '#ffaa00';
            break;
        case 3:
            strengthBar.classList.add('strength-good');
            feedback = 'Buena';
            strengthText.style.color = '#88cc00';
            break;
        case 4:
        case 5:
            strengthBar.classList.add('strength-strong');
            feedback = 'Fuerte';
            strengthText.style.color = '#00aa44';
            break;
    }
    
    strengthText.textContent = feedback;
    return strength >= 3;
}

// Función para validar datos de registro
function validateRegistration(formData) {
    const errors = [];
    
    if (formData.firstName.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (formData.lastName.length < 2) {
        errors.push('El apellido debe tener al menos 2 caracteres');
    }
    
    if (!validateEmail(formData.email)) {
        errors.push('Email inválido');
    }
    
    if (formData.username.length < 3) {
        errors.push('El usuario debe tener al menos 3 caracteres');
    }
    
    if (users.some(u => u.username === formData.username)) {
        errors.push('Este nombre de usuario ya existe');
    }
    
    if (users.some(u => u.email === formData.email)) {
        errors.push('Este email ya está registrado');
    }
    
    if (formData.password !== formData.confirmPassword) {
        errors.push('Las contraseñas no coinciden');
    }
    
    if (!checkPasswordStrength(formData.password)) {
        errors.push('La contraseña debe ser más fuerte');
    }
    
    return errors;
}

// Función para registrar nuevo usuario
function registerUser(formData) {
    const newUser = {
        username: formData.username,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    
    showMessage(`¡Bienvenido al bosque, ${newUser.name}! Tu cuenta ha sido creada exitosamente.`, 'success');
    
    // Cambiar a modo login después de registro exitoso
    setTimeout(() => {
        toggleAuthMode();
        document.getElementById('username').value = newUser.username;
        showMessage('Ahora puedes iniciar sesión con tu nueva cuenta', 'info');
    }, 2000);
    
    return true;
}

// Función para mostrar mensajes con animación
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #2a5a2a, #1a4a1a);' : 
          type === 'error' ? 'background: linear-gradient(135deg, #5a2a2a, #4a1a1a);' : 
          'background: linear-gradient(135deg, #2a2a2a, #1a1a1a);'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.style.transform = 'translateX(0)', 100);
    setTimeout(() => messageDiv.style.transform = 'translateX(100%)', 3000);
    setTimeout(() => messageDiv.remove(), 3300);
}

// Función para validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Event listeners principales
document.getElementById('toggleAuth').addEventListener('click', toggleAuthMode);

// Formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('regFirstName').value.trim(),
        lastName: document.getElementById('regLastName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        username: document.getElementById('regUsername').value.trim(),
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    const termsAccepted = document.getElementById('termsAccept').checked;
    
    if (!termsAccepted) {
        showMessage('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    const errors = validateRegistration(formData);
    
    if (errors.length > 0) {
        showMessage(errors[0], 'error');
        return;
    }
    
    const regBtn = document.getElementById('regBtn');
    const originalText = regBtn.textContent;
    regBtn.textContent = 'Creando cuenta...';
    regBtn.disabled = true;
    
    setTimeout(() => {
        if (registerUser(formData)) {
            document.getElementById('registerForm').reset();
            document.getElementById('strengthBar').className = 'strength-bar';
            document.getElementById('strengthText').textContent = '';
        }
        
        regBtn.textContent = originalText;
        regBtn.disabled = false;
    }, 1500);
});

// Verificar fortaleza de contraseña en tiempo real
document.getElementById('regPassword').addEventListener('input', function() {
    checkPasswordStrength(this.value);
});

// Verificar que las contraseñas coincidan
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.style.borderColor = '#ff4444';
    } else if (confirmPassword) {
        this.style.borderColor = '#00aa44';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

// Verificar disponibilidad de usuario
document.getElementById('regUsername').addEventListener('blur', function() {
    const username = this.value.trim();
    if (username && users.some(u => u.username === username)) {
        this.style.borderColor = '#ff4444';
        showMessage('Este nombre de usuario ya existe', 'error');
    } else if (username && username.length >= 3) {
        this.style.borderColor = '#00aa44';
    }
});

// Verificar disponibilidad de email
document.getElementById('regEmail').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && users.some(u => u.email === email)) {
        this.style.borderColor = '#ff4444';
        showMessage('Este email ya está registrado', 'error');
    } else if (email && validateEmail(email)) {
        this.style.borderColor = '#00aa44';
    }
});

// Términos y condiciones
document.getElementById('termsLink').addEventListener('click', function(e) {
    e.preventDefault();
    
    const termsWindow = window.open('', 'terms', 'width=600,height=400,scrollbars=yes');
    termsWindow.document.write(`
        <html>
        <head><title>Términos y Condiciones - Forest Login</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            <h1>🌲 Términos y Condiciones del Bosque Digital</h1>
            <h2>1. Bienvenido al Bosque</h2>
            <p>Al unirte a nuestro bosque digital, aceptas respetar la naturaleza y mantener un ambiente limpio y seguro.</p>
            
            <h2>2. Comportamiento en el Bosque</h2>
            <p>• Respeta a otros exploradores del bosque<br>
            • No dañes los recursos digitales<br>
            • Mantén la privacidad de otros usuarios</p>
            
            <h2>3. Protección de Datos</h2>
            <p>Tus datos están seguros como los secretos del bosque más profundo. Solo usamos la información necesaria para tu experiencia.</p>
            
            <h2>4. Responsabilidades</h2>
            <p>Como guardián de tu propia cuenta, eres responsable de mantener seguras tus credenciales.</p>
            
            <p><em>Estos términos están escritos con amor por la naturaleza digital. 🦌</em></p>
            
            <button onclick="window.close()" style="padding: 10px 20px; background: #2a2a2a; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
        </body>
        </html>
    `);
});

// Función de login principal
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (loginAttempts >= maxAttempts) {
        showMessage('Demasiados intentos fallidos. Espera un momento.', 'error');
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validaciones
    if (!username || !password) {
        showMessage('Por favor completa todos los campos.', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('El usuario debe tener al menos 3 caracteres.', 'error');
        return;
    }
    
    // Simular tiempo de carga
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Verificando...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        // Buscar usuario
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            showMessage(`¡Bienvenido al bosque, ${user.name}!`, 'success');
            loginAttempts = 0;
            
            // Simular redirección exitosa
            setTimeout(() => {
                document.body.style.filter = 'blur(5px)';
                const successDiv = document.createElement('div');
                successDiv.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(255,255,255,0.95);
                        padding: 40px;
                        border-radius: 20px;
                        text-align: center;
                        
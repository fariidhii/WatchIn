import { renderLogin } from '../../views/auth/login';
import { renderRegister } from '../../views/auth/register';
import { renderAdminDashboard } from '../../views/admin/dashboard';
import { renderEmployeeDashboard } from '../../views/employee/dashboard';

export function initAuth() {
    const app = document.getElementById('app');
    
    // Handle navigation
    function navigateToLogin() {
        app.innerHTML = renderLogin();
        setupLoginListeners();
    }

    function navigateToRegister() {
        app.innerHTML = renderRegister();
        setupRegisterListeners();
    }

    // Setup event listeners for login page
    function setupLoginListeners() {
        const loginForm = document.getElementById('loginForm');
        const registerLink = document.getElementById('registerLink');
        const backToHome = document.getElementById('backToHome');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToRegister();
            });
        }

        if (backToHome) {
            backToHome.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '/';
            });
        }
    }

    // Setup event listeners for register page
    function setupRegisterListeners() {
        const registerForm = document.getElementById('registerForm');
        const loginLink = document.getElementById('loginLink');
        const backToHome = document.getElementById('backToHome');

        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToLogin();
            });
        }

        if (backToHome) {
            backToHome.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '/';
            });
        }
    }

    // Handle login form submission
    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);

                // Redirect based on user role
                if (data.user.role === 'admin') {
                    app.innerHTML = renderAdminDashboard();
                    setupAdminDashboardListeners();
                } else {
                    app.innerHTML = renderEmployeeDashboard();
                    setupEmployeeDashboardListeners();
                }
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }

    // Handle register form submission
    async function handleRegister(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigateToLogin();
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    }

    // Setup admin dashboard listeners
    function setupAdminDashboardListeners() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
    }

    // Setup employee dashboard listeners
    function setupEmployeeDashboardListeners() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.hash = '/';
    }

    // Initialize with login page
    navigateToLogin();
} 
// Simplified Tabster Popup - Authentication Only
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tabster popup loaded');
    
    // Screen elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const forgotPasswordScreen = document.getElementById('forgot-password-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loadingOverlay = document.getElementById('loading-overlay');
    const messageContainer = document.getElementById('message-container');

    // Navigation buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn-dropdown');

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');

    // Screen navigation links
    const gotoSignup = document.getElementById('goto-signup');
    const gotoLogin = document.getElementById('goto-login');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLogin = document.getElementById('back-to-login');
    const backToWelcome = document.getElementById('back-to-welcome');
    const backToWelcome2 = document.getElementById('back-to-welcome-2');
    const backToWelcome3 = document.getElementById('back-to-welcome-3');

    // Forms
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    // User menu elements
    const userAvatar = document.getElementById('user-avatar');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const welcomeMessage = document.getElementById('welcome-message');
    const avatarInitials = document.getElementById('avatar-initials');

    // Initialize the app
    initializeTheme();
    setupNavigation();
    setupForms();
    setupThemeToggle();
    setupUserMenu();
    initializeApp();

    function initializeTheme() {
        const savedTheme = localStorage.getItem('tabster-theme') || 'dark';
        applyTheme(savedTheme);
    }

    function setupThemeToggle() {
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
                localStorage.setItem('tabster-theme', newTheme);
            });
        }
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
        }
    }

    async function initializeApp() {
        try {
            showLoading(true);
            
            if (typeof authHelpers !== 'undefined') {
                const user = await authHelpers.getCurrentUser();
                
                if (user) {
                    await loadUserData(user);
                    showScreen('dashboard');
                } else {
                    const savedScreen = localStorage.getItem('tabster-current-screen');
                    showScreen(savedScreen || 'welcome');
                }
            } else {
                console.warn('authHelpers not available');
                showScreen('welcome');
            }
        } catch (error) {
            console.error('App initialization error:', error);
            showScreen('welcome');
        } finally {
            showLoading(false);
        }
    }

    function setupNavigation() {
        // Main auth buttons
        if (loginBtn) loginBtn.addEventListener('click', () => showScreen('login'));
        if (signupBtn) signupBtn.addEventListener('click', () => showScreen('signup'));
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

        // Navigation links
        if (gotoSignup) gotoSignup.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('signup');
        });
        if (gotoLogin) gotoLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('login');
        });
        if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('forgot-password');
        });
        if (backToLogin) backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('login');
        });
        if (backToWelcome) backToWelcome.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('welcome');
        });
        if (backToWelcome2) backToWelcome2.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('welcome');
        });
        if (backToWelcome3) backToWelcome3.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen('welcome');
        });
    }

    function setupForms() {
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (signupForm) signupForm.addEventListener('submit', handleSignup);
        if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    function showScreen(screenName) {
        const screens = [welcomeScreen, loginScreen, signupScreen, forgotPasswordScreen, dashboardScreen];
        
        screens.forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.style.display = 'none';
            }
        });

        let targetScreen;
        switch (screenName) {
            case 'welcome':
                targetScreen = welcomeScreen;
                break;
            case 'login':
                targetScreen = loginScreen;
                break;
            case 'signup':
                targetScreen = signupScreen;
                break;
            case 'forgot-password':
                targetScreen = forgotPasswordScreen;
                break;
            case 'dashboard':
                targetScreen = dashboardScreen;
                break;
            default:
                targetScreen = welcomeScreen;
                screenName = 'welcome';
        }

        if (targetScreen) {
            targetScreen.style.display = 'flex';
            targetScreen.classList.add('active');
        }

        localStorage.setItem('tabster-current-screen', screenName);
        clearMessages();
    }

    async function handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            showLoading(true);
            clearMessages();

            const { data, error } = await authHelpers.signIn(email, password);
            
            if (error) {
                throw error;
            }

            if (data.user) {
                showSuccess('Sign in successful! Welcome back.', form);
                await loadUserData(data.user);
                setTimeout(() => showScreen('dashboard'), 1000);
            } else {
                throw new Error('Sign in failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Failed to sign in. Please try again.', form);
        } finally {
            showLoading(false);
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        try {
            showLoading(true);
            clearMessages();

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const { data, error } = await authHelpers.signUp(email, password, name);
            
            if (error) {
                throw error;
            }

            showSuccess('Account created successfully! Please check your email to verify your account.', form);
            form.reset();
            setTimeout(() => showScreen('login'), 2000);
        } catch (error) {
            console.error('Signup error:', error);
            showError(error.message || 'Failed to create account. Please try again.', form);
        } finally {
            showLoading(false);
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');

        try {
            showLoading(true);
            clearMessages();

            const { data, error } = await authHelpers.resetPassword(email);
            
            if (error) {
                throw error;
            }

            showSuccess('Reset link sent! Please check your email.', form);
            form.reset();
            setTimeout(() => showScreen('login'), 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            showError(error.message || 'Failed to send reset email. Please try again.', form);
        } finally {
            showLoading(false);
        }
    }

    async function handleLogout() {
        try {
            showLoading(true);
            await authHelpers.signOut();
            localStorage.removeItem('tabster-current-screen');
            showScreen('welcome');
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Failed to sign out properly', 'error');
        } finally {
            showLoading(false);
        }
    }

    async function loadUserData(user) {
        try {
            if (user && user.user_metadata) {
                const displayName = user.user_metadata.display_name || user.user_metadata.full_name || user.email;
                const initials = getInitials(displayName);
                
                if (welcomeMessage) {
                    welcomeMessage.textContent = `Welcome back, ${displayName.split(' ')[0]}!`;
                }
                
                if (avatarInitials) {
                    avatarInitials.textContent = initials;
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    function getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    }

    function setupUserMenu() {
        if (userAvatar && dropdownMenu) {
            userAvatar.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', function() {
                dropdownMenu.classList.remove('show');
            });

            dropdownMenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    function showLoading(show) {
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    function showError(message, form) {
        showMessage(message, 'error', form);
    }

    function showSuccess(message, form) {
        showMessage(message, 'success', form);
    }

    function showMessage(message, type, form) {
        clearMessages();
        
        const messageEl = document.createElement('div');
        messageEl.className = `${type}-message`;
        messageEl.textContent = message;
        
        if (form) {
            form.insertBefore(messageEl, form.firstChild);
        } else if (messageContainer) {
            messageContainer.appendChild(messageEl);
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 5000);
        }
    }

    function clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }
}); 
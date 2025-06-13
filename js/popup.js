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

                // Initialize dashboard and load workspaces
                await initializeDashboard();
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

    function setupWorkspaceCards() {
        const workspaceCards = document.querySelectorAll('.workspace-card');
        
        workspaceCards.forEach(card => {
            card.addEventListener('click', function() {
                const workspaceId = this.dataset.workspace;
                const action = this.dataset.action;
                
                if (action === 'create') {
                    handleCreateWorkspace();
                } else if (workspaceId) {
                    handleWorkspaceClick(workspaceId);
                }
            });
        });
    }

    function handleWorkspaceClick(workspaceId) {
        // For now, just show a message since we're not connecting to DB yet
        console.log(`Opening workspace: ${workspaceId}`);
        showMessage(`Opening ${workspaceId} workspace...`, 'success');
        
        // TODO: Navigate to workspace tabs view
        // This is where you'll later implement the workspace navigation
    }

    function handleCreateWorkspace() {
        // For now, just show a message since we're not connecting to DB yet
        console.log('Creating new workspace');
        showMessage('Create workspace feature coming soon!', 'success');
        
        // TODO: Show create workspace modal/form
        // This is where you'll later implement the workspace creation flow
    }

    // Initialize workspace functionality
    setupWorkspaceCards();

    async function loadWorkspaces() {
        try {
            showLoading(true);
            const { data: spaces, error } = await authHelpers.getUserSpaces();
            
            if (error) {
                console.error('Error loading spaces:', error);
                showError('Failed to load workspaces. Please try again.');
                return;
            }

            renderWorkspaces(spaces);
        } catch (error) {
            console.error('Error loading spaces:', error);
            showError('Failed to load workspaces. Please try again.');
        } finally {
            showLoading(false);
        }
    }

    function renderWorkspaces(spaces) {
        const workspacesGrid = document.getElementById('workspaces-grid');
        if (!workspacesGrid) return;

        // Clear existing content
        workspacesGrid.innerHTML = '';

        // Render each workspace
        spaces.forEach(space => {
            const workspaceCard = createWorkspaceCard(space);
            workspacesGrid.appendChild(workspaceCard);
        });

        // Add create new workspace card
        const createCard = createNewWorkspaceCard();
        workspacesGrid.appendChild(createCard);

        // Setup event listeners for all cards
        setupWorkspaceCardListeners();
    }

    function createWorkspaceCard(space) {
        const card = document.createElement('div');
        card.className = 'workspace-card';
        card.dataset.workspace = space.id;
        
        // Convert hex color to rgba for background
        const rgbaBackground = hexToRgba(space.color, 0.15);
        
        card.innerHTML = `
            <div class="workspace-icon" style="background: ${rgbaBackground}; border-color: ${space.color};">
                ${space.emoji || '📁'}
            </div>
            <div class="workspace-content">
                <h4>${space.name}</h4>
                <p>${space.description || 'No description'}</p>
            </div>
            <div class="workspace-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;

        return card;
    }

    function hexToRgba(hex, alpha) {
        if (!hex) return 'rgba(255, 255, 255, 0.03)';
        
        // Remove the hash if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function createNewWorkspaceCard() {
        const card = document.createElement('div');
        card.className = 'workspace-card new-workspace';
        card.dataset.action = 'create';
        
        card.innerHTML = `
            <div class="workspace-icon new">
                ➕
            </div>
            <div class="workspace-content">
                <h4>Create Workspace</h4>
                <p>Start organizing your tabs</p>
            </div>
        `;

        return card;
    }

    function setupWorkspaceCardListeners() {
        const workspaceCards = document.querySelectorAll('.workspace-card');
        
        workspaceCards.forEach(card => {
            card.addEventListener('click', function() {
                const workspaceId = this.dataset.workspace;
                const action = this.dataset.action;
                
                if (action === 'create') {
                    handleCreateWorkspace();
                } else if (workspaceId) {
                    handleWorkspaceClick(workspaceId);
                }
            });
        });
    }

    function handleWorkspaceClick(workspaceId) {
        console.log(`Opening workspace: ${workspaceId}`);
        showMessage(`Opening workspace...`, 'success');
        
        // TODO: Navigate to workspace tabs view
        // This is where you'll implement the workspace navigation
    }

    function handleCreateWorkspace() {
        console.log('Creating new workspace');
        showMessage('Create workspace feature coming soon!', 'success');
        
        // TODO: Show create workspace modal/form
        // This is where you'll implement the workspace creation flow
    }

    // Load workspaces when dashboard is shown
    async function initializeDashboard() {
        await loadWorkspaces();
    }

    // Call initialize when needed
    if (document.getElementById('dashboard-screen')?.classList.contains('active')) {
        initializeDashboard();
    }
}); 
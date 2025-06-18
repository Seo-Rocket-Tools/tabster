// Minimal Tabster Popup - UI Only
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tabster popup loaded');
    
    // Screen elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const forgotPasswordScreen = document.getElementById('forgot-password-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const createSpaceScreen = document.getElementById('create-space-screen');

    // Navigation buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');

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

    // Initialize the app
    initializeTheme();
    setupNavigation();
    setupThemeToggle();
    
    // Show welcome screen by default
    showScreen('welcome');

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

    function setupNavigation() {
        // Main auth buttons
        if (loginBtn) loginBtn.addEventListener('click', () => showScreen('login'));
        if (signupBtn) signupBtn.addEventListener('click', () => showScreen('signup'));

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

    function showScreen(screenName) {
        const editSpaceScreen = document.getElementById('edit-space-screen');
        const screens = [welcomeScreen, loginScreen, signupScreen, forgotPasswordScreen, dashboardScreen, createSpaceScreen, editSpaceScreen];
        
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
            case 'create-space-screen':
                targetScreen = createSpaceScreen;
                break;
            case 'edit-space-screen':
                targetScreen = editSpaceScreen;
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
    }


    // SECTION USER LOGIN HANDLER

    // On user sign-in / login form submit listener
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        console.log('Popup: Attempting sign-in for:', email);
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        try {
            // Send login credentials to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signin',
                email: email,
                password: password
            });
            
            if (response.success) {
                console.log('Popup: Sign-in successful, updating dashboard');
                updateMainDashboard(response.userData, response.userSpaces);
                showScreen('dashboard');
            } else {
                console.error('Popup: Sign-in failed:', response.error);
                showLoginError(response.error);
            }
        } catch (error) {
            console.error('Popup: Sign-in exception:', error);
            showLoginError('Connection error. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Helper function to show login error
    function showLoginError(message) {
        // Find or create error element
        let errorElement = document.getElementById('login-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'login-error';
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.marginTop = '10px';
            errorElement.style.fontSize = '14px';
            
            const form = document.getElementById('login-form');
            form.insertBefore(errorElement, form.querySelector('.auth-links'));
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    // Helper function to update main dashboard with user data and spaces
    function updateMainDashboard(userData, userSpaces) {
        console.log('Popup: Updating dashboard with:', { userData, userSpaces });
        
        // Update welcome message with user's display name or full name
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && userData) {
            const displayName = userData.display_name || userData.full_name || 'User';
            welcomeMessage.textContent = `Welcome back, ${displayName}!`;
        }
        
        // Update user avatar initials
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials && userData) {
            const name = userData.display_name || userData.full_name || userData.email;
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarInitials.textContent = initials;
        }
        
        // Update spaces grid
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid && userSpaces) {
            spacesGrid.innerHTML = ''; // Clear existing spaces
            
            if (userSpaces.length === 0) {
                // Show empty state
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <p>No spaces yet</p>
                    <button class="btn btn-primary" onclick="showScreen('create-space-screen')">Create your first space</button>
                `;
                spacesGrid.appendChild(emptyState);
            } else {
                // Create space cards
                userSpaces.forEach(space => {
                    const spaceCard = createSpaceCard(space);
                    spacesGrid.appendChild(spaceCard);
                });
            }
        }
    }

    // Helper function to create a space card element
    function createSpaceCard(space) {
        const card = document.createElement('div');
        card.className = 'workspace-card';
        card.style.backgroundColor = space.color || '#6366f1';
        
        card.innerHTML = `
            <div class="workspace-icon">${space.emoji || '📁'}</div>
            <div class="workspace-info">
                <h4 class="workspace-name">${space.name}</h4>
                <p class="workspace-description">${space.description || 'No description'}</p>
            </div>
            <div class="workspace-actions">
                <button class="btn btn-sm" onclick="openSpace('${space.id}')">Open</button>
            </div>
        `;
        
        return card;
    }

    // Global function to open a space (can be expanded later)
    window.openSpace = function(spaceId) {
        console.log('Opening space:', spaceId);
        // TODO: Implement space opening functionality
    };
}); 
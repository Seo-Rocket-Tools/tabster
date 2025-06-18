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
    setupUserMenu();
    
    // Check user authentication on popup open
    checkUserAuthOnOpen();

    // SECTION UI RELATED FUNCTIONS

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

    function setupUserMenu() {
        const userAvatar = document.getElementById('user-avatar');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn-dropdown');

        // Toggle dropdown when avatar is clicked
        if (userAvatar && dropdownMenu) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }

        // Handle signout click
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUserSignout();
            });
        }
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
        
        // Update user avatar initials and clear loading state
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials && userData) {
            const name = userData.display_name || userData.full_name || userData.email;
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarInitials.textContent = initials;
            avatarInitials.classList.remove('skeleton-shimmer'); // Remove shimmer animation
        }
        
        // Update spaces grid
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid && userSpaces) {
            spacesGrid.innerHTML = ''; // Clear existing spaces
            
            // Always create space cards (even if empty) and add "New Space" card
            userSpaces.forEach(space => {
                const spaceCard = createSpaceCard(space);
                spacesGrid.appendChild(spaceCard);
            });
            
            // Add "New Space" card at the end
            const newSpaceCard = createNewSpaceCard();
            spacesGrid.appendChild(newSpaceCard);
        }
    }

    // Helper function to create a space card element
    function createSpaceCard(space) {
        const card = document.createElement('div');
        card.className = 'space-card';
        card.setAttribute('data-space-id', space.id);
        card.onclick = () => openSpace(space.id);
        
        card.innerHTML = `
            <div class="space-icon">${space.emoji || '📁'}</div>
            <div class="space-content">
                <div class="space-name">${space.name}</div>
                <div class="space-description">${space.description || 'No description'}</div>
            </div>
            <div class="space-menu">
                <button class="space-menu-btn">⋯</button>
            </div>
        `;
        
        return card;
    }

    // Helper function to create the "New Space" card
    function createNewSpaceCard() {
        const card = document.createElement('div');
        card.className = 'space-card new-space-card';
        card.onclick = () => showScreen('create-space-screen');
        
        card.innerHTML = `
            <div class="new-space-icon">+</div>
            <div class="new-space-content">
                <div class="new-space-title">New Space</div>
                <div class="new-space-subtitle">Organize your tabs</div>
            </div>
        `;
        
        return card;
    }

    // Helper function to create a skeleton loading card
    function createSkeletonCard() {
        const card = document.createElement('div');
        card.className = 'space-card skeleton-card';
        
        card.innerHTML = `
            <div class="space-icon">
                <div class="skeleton-shimmer"></div>
            </div>
            <div class="space-content">
                <div class="space-name">
                    <div class="skeleton-shimmer"></div>
                </div>
                <div class="space-description">
                    <div class="skeleton-shimmer"></div>
                </div>
            </div>
            <div class="space-menu">
                <button class="space-menu-btn">
                    <div class="skeleton-shimmer"></div>
                </button>
            </div>
        `;
        
        return card;
    }

    // Helper function to show loading dashboard
    function showLoadingDashboard() {
        console.log('Popup: Showing loading dashboard with skeleton card');
        
        // Update welcome message to "Please wait..."
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = 'Please wait...';
        }
        
        // Update user avatar with loading state and shimmer animation
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials) {
            avatarInitials.textContent = ''; // Clear text content
            avatarInitials.classList.add('skeleton-shimmer'); // Add shimmer animation
        }
        
        // Show spaces grid with skeleton card
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid) {
            spacesGrid.innerHTML = ''; // Clear existing content
            
            // Add skeleton loading card
            const skeletonCard = createSkeletonCard();
            spacesGrid.appendChild(skeletonCard);
        }
        
        // Show dashboard screen
        showScreen('dashboard');
    }

    // Global function to open a space (can be expanded later)
    window.openSpace = function(spaceId) {
        console.log('Opening space:', spaceId);
        // TODO: Implement space opening functionality
    };

    // SECTION ON POPUP OPEN FLOW

    // Check user authentication when popup opens
    async function checkUserAuthOnOpen() {
        console.log('Popup: Checking user authentication on open...');
        
        // Show loading dashboard immediately for better UX
        showLoadingDashboard();
        
        try {
            // Send auth check request to background script
            const response = await chrome.runtime.sendMessage({
                type: 'checkAuth'
            });
            
            if (!response.success) {
                console.error('Popup: Auth check failed:', response.error);
                showScreen('welcome');
                return;
            }
            
            if (!response.authenticated) {
                console.log('Popup: User not authenticated, showing welcome screen');
                showScreen('welcome');
                return;
            }
            
            // User is authenticated - update dashboard with real data
            console.log('Popup: User authenticated, updating dashboard with real data');
            updateMainDashboard(response.userData, response.userSpaces);
            
            // Check for active space and update UI accordingly
            await checkAndUpdateActiveSpace(response.userSpaces);
            
        } catch (error) {
            console.error('Popup: Auth check exception:', error);
            showScreen('welcome');
        }
    }

    // Check chrome local storage for active space and update UI
    async function checkAndUpdateActiveSpace(userSpaces) {
        try {
            console.log('Popup: Checking for active space in local storage...');
            
            // Request active space data from background (which uses getLocalActiveSpace)
            const activeSpaceResponse = await chrome.runtime.sendMessage({
                type: 'getActiveSpace'
            });
            
            if (!activeSpaceResponse || !activeSpaceResponse.success || !activeSpaceResponse.data) {
                console.log('Popup: No active space found in local storage');
                return;
            }
            
            const activeSpace = activeSpaceResponse.data;
            console.log('Popup: Active space found:', activeSpace);
            
            // Find matching space in user spaces and add indicator
            addActiveSpaceIndicator(activeSpace, userSpaces);
            
        } catch (error) {
            console.error('Popup: Error checking active space:', error);
        }
    }

    // Add visual indicator to the active space in the spaces list
    function addActiveSpaceIndicator(activeSpace, userSpaces) {
        try {
            // Find the space that matches the active space
            const matchingSpace = userSpaces.find(space => space.id === activeSpace.id);
            
            if (!matchingSpace) {
                console.log('Popup: Active space not found in user spaces list');
                return;
            }
            
            console.log('Popup: Adding active indicator to space:', matchingSpace.name);
            
            // Find the space card in the DOM
            const spacesGrid = document.getElementById('workspaces-grid');
            if (!spacesGrid) return;
            
            const spaceCards = spacesGrid.querySelectorAll('.space-card:not(.new-space-card)');
            spaceCards.forEach(card => {
                const spaceName = card.querySelector('.space-name');
                if (spaceName && spaceName.textContent === matchingSpace.name) {
                    // Add active indicator class/style
                    card.classList.add('active-space');
                    
                    // Add active indicator element
                    if (!card.querySelector('.active-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'active-indicator';
                        indicator.innerHTML = '✓ Active';
                        indicator.style.cssText = `
                            position: absolute;
                            top: 8px;
                            right: 8px;
                            background: #10b981;
                            color: white;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-size: 10px;
                            font-weight: bold;
                            z-index: 10;
                        `;
                        
                        card.style.position = 'relative';
                        card.appendChild(indicator);
                    }
                }
            });
            
        } catch (error) {
            console.error('Popup: Error adding active space indicator:', error);
        }
    }

    // SECTION USER LOGOUT HANDLER

    // Handle user signout
    async function handleUserSignout() {
        try {
            console.log('Popup: Initiating user signout...');
            
            // Show loading state (optional - for user feedback)
            const signoutBtn = document.querySelector('.signout-option');
            if (signoutBtn) {
                signoutBtn.textContent = 'Signing out...';
                signoutBtn.style.pointerEvents = 'none';
            }
            
            // Send signout request to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signout'
            });
            
            if (!response.success) {
                console.error('Popup: Signout failed:', response.error);
                // Reset button state
                if (signoutBtn) {
                    signoutBtn.textContent = 'Sign Out';
                    signoutBtn.style.pointerEvents = 'auto';
                }
                // Show error message (you can enhance this later)
                alert('Signout failed: ' + response.error);
                return;
            }
            
            console.log('Popup: Signout successful, redirecting to welcome screen');
            
            // Clear any local UI state and redirect to welcome screen
            clearDashboardState();
            showScreen('welcome');
            
        } catch (error) {
            console.error('Popup: Signout exception:', error);
            // Reset button state
            const signoutBtn = document.querySelector('.signout-option');
            if (signoutBtn) {
                signoutBtn.textContent = 'Sign Out';
                signoutBtn.style.pointerEvents = 'auto';
            }
            alert('Signout failed: ' + error.message);
        }
    }

    // Clear dashboard state and reset UI
    function clearDashboardState() {
        // Clear welcome message
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = '';
        }
        
        // Clear avatar
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials) {
            avatarInitials.textContent = '';
            avatarInitials.classList.remove('skeleton-shimmer');
        }
        
        // Clear spaces grid
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid) {
            spacesGrid.innerHTML = '';
        }
        
        // Hide any open dropdowns
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        
        console.log('Popup: Dashboard state cleared');
    }
}); 
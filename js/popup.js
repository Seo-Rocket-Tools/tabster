// Minimal Tabster Popup - UI Only
document.addEventListener('DOMContentLoaded', function() {
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

    // Modern Message Banner System
    const MessageBanner = {
        element: null,
        iconElement: null,
        textElement: null,
        currentTimeout: null,

        init() {
            this.element = document.getElementById('message-banner');
            this.iconElement = document.getElementById('message-banner-icon');
            this.textElement = document.getElementById('message-banner-text');
        },

        show(message, type = 'info', duration = 4000) {
            if (!this.element) this.init();

            // Clear any existing timeout
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
                this.currentTimeout = null;
            }

            // Set content
            this.textElement.textContent = message;
            
            // Set icon based on type
            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ',
                loading: '⧗'
            };
            this.iconElement.textContent = icons[type] || icons.info;

            // Clear previous type classes
            this.element.className = 'message-banner';
            
            // Add new type class
            this.element.classList.add(type);

            // Show banner
            setTimeout(() => {
                this.element.classList.add('show');
            }, 10);

            // Auto-hide after duration (unless it's a loading message)
            if (type !== 'loading' && duration > 0) {
                this.currentTimeout = setTimeout(() => {
                    this.hide();
                }, duration);
            }
        },

        hide() {
            if (!this.element) return;

            this.element.classList.remove('show');
            this.element.classList.add('hide');

            // Clear timeout
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
                this.currentTimeout = null;
            }

            // Remove hide class after animation
            setTimeout(() => {
                this.element.classList.remove('hide');
            }, 400);
        },

        success(message, duration = 4000) {
            this.show(message, 'success', duration);
        },

        error(message, duration = 6000) {
            this.show(message, 'error', duration);
        },

        warning(message, duration = 5000) {
            this.show(message, 'warning', duration);
        },

        info(message, duration = 4000) {
            this.show(message, 'info', duration);
        },

        loading(message) {
            this.show(message, 'loading', 0); // No auto-hide for loading
        }
    };

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

        // Reset signout button state in case it was disabled
        if (logoutBtn) {
            logoutBtn.style.pointerEvents = 'auto';
            // Remove any existing click listeners to prevent duplicates
            const newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        }

        // Get the fresh reference after cloning
        const freshLogoutBtn = document.getElementById('logout-btn-dropdown');

        // Toggle dropdown when avatar is clicked
        if (userAvatar && dropdownMenu) {
            // Remove existing avatar listeners to prevent duplicates
            const newUserAvatar = userAvatar.cloneNode(true);
            userAvatar.parentNode.replaceChild(newUserAvatar, userAvatar);
            
            // Get fresh reference and add listener
            const freshAvatar = document.getElementById('user-avatar');
            if (freshAvatar) {
                freshAvatar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('show');
                });
            }

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                const currentAvatar = document.getElementById('user-avatar');
                if (currentAvatar && !currentAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }

        // Handle signout click
        if (freshLogoutBtn) {
            freshLogoutBtn.addEventListener('click', (e) => {
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
        
        // Show loading banner and disable button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        MessageBanner.loading('Signing in...');
        
        try {
            // Send login credentials to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signin',
                email: email,
                password: password
            });
            
            if (response.success) {
                MessageBanner.success('Sign in successful! Welcome back.');
                
                // Small delay to show success message before switching screens
                setTimeout(() => {
                    updateMainDashboard(response.userData, response.userSpaces);
                    showScreen('dashboard');
                    MessageBanner.hide(); // Hide banner when switching screens
                }, 1000);
            } else {
                MessageBanner.error(response.error || 'Sign in failed. Please try again.');
            }
        } catch (error) {
            MessageBanner.error('Connection error. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
        }
    });

    // Helper function to update main dashboard with user data and spaces
    function updateMainDashboard(userData, userSpaces) {
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
        
        // Reset and setup user menu to ensure proper state
        setupUserMenu();
        
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
        // Show loading dashboard immediately for better UX
        showLoadingDashboard();
        
        try {
            // Send auth check request to background script
            const response = await chrome.runtime.sendMessage({
                type: 'checkAuth'
            });
            
            if (!response.success) {
                showScreen('welcome');
                return;
            }
            
            if (!response.authenticated) {
                showScreen('welcome');
                return;
            }
            
            // User is authenticated - update dashboard with real data
            updateMainDashboard(response.userData, response.userSpaces);
            
            // Check for active space and update UI accordingly
            await checkAndUpdateActiveSpace(response.userSpaces);
            
        } catch (error) {
            showScreen('welcome');
        }
    }

    // Check chrome local storage for active space and update UI
    async function checkAndUpdateActiveSpace(userSpaces) {
        try {
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
            // Show loading banner and disable signout option
            const signoutBtn = document.querySelector('.signout-option');
            if (signoutBtn) {
                signoutBtn.style.pointerEvents = 'none';
            }
            
            MessageBanner.loading('Signing out...');
            
            // Send signout request to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signout'
            });
            
            if (!response.success) {
                console.error('Popup: Signout failed:', response.error);
                MessageBanner.error('Signout failed: ' + response.error);
                
                // Reset button state
                if (signoutBtn) {
                    signoutBtn.style.pointerEvents = 'auto';
                }
                return;
            }
            
            MessageBanner.success('Signed out successfully!');
            
            // Reset button state immediately after successful signout
            if (signoutBtn) {
                signoutBtn.style.pointerEvents = 'auto';
            }
            
            // Small delay to show success message before switching screens
            setTimeout(() => {
                clearDashboardState();
                showScreen('welcome');
                MessageBanner.hide(); // Hide banner when switching screens
            }, 1000);
            
        } catch (error) {
            console.error('Popup: Signout exception:', error);
            MessageBanner.error('Signout failed: ' + error.message);
            
            // Reset button state
            const signoutBtn = document.querySelector('.signout-option');
            if (signoutBtn) {
                signoutBtn.style.pointerEvents = 'auto';
            }
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
    }

    // SECTION USER SIGNUP HANDLER

    // On user sign-up / signup form submit listener
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        // Show loading banner and disable button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        MessageBanner.loading('Creating account...');
        
        try {
            // Send signup credentials to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signup',
                fullName: fullName,
                email: email,
                password: password
            });
            
            if (response.success) {
                MessageBanner.success(response.message);
                
                // Small delay to show success message before switching screens
                setTimeout(() => {
                    showScreen('login');
                    MessageBanner.hide(); // Hide banner when switching screens
                }, 2000);
            } else {
                MessageBanner.error(response.error || 'Sign up failed. Please try again.');
            }
        } catch (error) {
            MessageBanner.error('Connection error. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
        }
    });
}); 
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
            
            // Clear active space from storage before logout
            await clearActiveSpaceFromStorage();
            
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

                // Initialize dashboard and restore active space
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
        console.log(`Opening space: ${workspaceId}`);
        switchToWorkspace(workspaceId);
    }

    async function switchToWorkspace(spaceId) {
        try {
            // Add visual feedback - show spinner on clicked space and disable others
            const workspaceCard = document.querySelector(`[data-workspace="${spaceId}"]`);
            const workspacesGrid = document.getElementById('workspaces-grid');
            
            if (workspaceCard && workspacesGrid) {
                workspaceCard.classList.add('loading');
                workspacesGrid.classList.add('workspaces-disabled');
            }

            showMessage('Switching space...', 'success');

            // Note: Database updates removed - not implemented yet

            // Save the active space to Chrome storage
            await saveActiveSpaceToStorage(spaceId);

            // Get the space data including tabs
            const { data: spaces, error: spacesError } = await authHelpers.getUserSpaces();
            if (spacesError) {
                throw new Error(`Failed to load spaces: ${spacesError.message}`);
            }

            const currentSpace = spaces.find(space => space.id === spaceId);
            if (!currentSpace) {
                throw new Error('Space not found');
            }

            // Load tabs from the space
            await loadTabsFromSpace(currentSpace);

            // Update UI to reflect active state
            updateActiveSpaceIndicator(spaceId);

            showMessage(`Switched to ${currentSpace.name}`, 'success');

        } catch (error) {
            console.error('Error switching workspace:', error);
            showMessage(`Failed to switch space: ${error.message}`, 'error');
        } finally {
            // Remove visual feedback
            const workspaceCard = document.querySelector(`[data-workspace="${spaceId}"]`);
            const workspacesGrid = document.getElementById('workspaces-grid');
            
            if (workspaceCard && workspacesGrid) {
                workspaceCard.classList.remove('loading');
                workspacesGrid.classList.remove('workspaces-disabled');
            }
        }
    }

    async function saveActiveSpaceToStorage(spaceId) {
        try {
            const user = await authHelpers.getCurrentUser();
            if (user) {
                const storageKey = `tabster_active_space_${user.id}`;
                await chrome.storage.local.set({ [storageKey]: spaceId });
                console.log('Saved active space to storage:', spaceId);
            }
        } catch (error) {
            console.error('Error saving active space to storage:', error);
            // Don't throw error as this shouldn't block workspace switching
        }
    }

    async function getActiveSpaceFromStorage() {
        try {
            const user = await authHelpers.getCurrentUser();
            if (user) {
                const storageKey = `tabster_active_space_${user.id}`;
                const result = await chrome.storage.local.get([storageKey]);
                return result[storageKey] || null;
            }
            return null;
        } catch (error) {
            console.error('Error getting active space from storage:', error);
            return null;
        }
    }

    async function clearActiveSpaceFromStorage() {
        try {
            const user = await authHelpers.getCurrentUser();
            if (user) {
                const storageKey = `tabster_active_space_${user.id}`;
                await chrome.storage.local.remove([storageKey]);
                console.log('Cleared active space from storage');
            }
        } catch (error) {
            console.error('Error clearing active space from storage:', error);
        }
    }



    async function loadTabsFromSpace(space) {
        try {
            console.log('Loading tabs from space:', space.name);
            
            if (!space.tabs_data || !Array.isArray(space.tabs_data) || space.tabs_data.length === 0) {
                console.log('No tabs data found for space, closing all tabs');
                await closeAllTabsExceptThis();
                return;
            }

            console.log(`Loading ${space.tabs_data.length} tabs from space`);

            // Close all current tabs except the extension popup
            await closeAllTabsExceptThis();

            // Sort tabs by order (pinned tabs first, then by index)
            const sortedTabs = space.tabs_data.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return (a.index || 0) - (b.index || 0);
            });

            // Create tabs in order
            for (let i = 0; i < sortedTabs.length; i++) {
                const tabData = sortedTabs[i];
                await createTabFromData(tabData, i);
            }

            console.log('Successfully loaded tabs from space');

        } catch (error) {
            console.error('Error loading tabs from space:', error);
            throw error;
        }
    }

    async function createTabFromData(tabData, index) {
        try {
            const tab = await chrome.tabs.create({
                url: tabData.url,
                active: index === 0, // Make first tab active
                pinned: tabData.pinned || false,
                index: index
            });

            console.log(`Created tab: ${tabData.title || tabData.url}`);
            return tab;

        } catch (error) {
            console.error('Error creating tab:', tabData, error);
            // Continue with other tabs even if one fails
        }
    }

    async function closeAllTabsExceptThis() {
        try {
            // Get all tabs in current window
            const tabs = await chrome.tabs.query({ currentWindow: true });
            
            // Find tabs to close (everything except extension pages)
            const tabsToClose = tabs.filter(tab => 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('chrome://') &&
                !tab.url.startsWith('edge-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );

            // Close tabs
            const tabIds = tabsToClose.map(tab => tab.id);
            if (tabIds.length > 0) {
                await chrome.tabs.remove(tabIds);
                console.log(`Closed ${tabIds.length} tabs`);
            }

        } catch (error) {
            console.error('Error closing tabs:', error);
            throw error;
        }
    }

    function updateActiveSpaceIndicator(activeSpaceId) {
        // Remove active indicator from all cards
        const allCards = document.querySelectorAll('.workspace-card');
        allCards.forEach(card => {
            card.classList.remove('active-space');
        });

        // Add active indicator to the current space
        const activeCard = document.querySelector(`[data-workspace="${activeSpaceId}"]`);
        if (activeCard) {
            activeCard.classList.add('active-space');
        }
    }

    function handleCreateWorkspace() {
        console.log('Creating new space');
        showMessage('Create space feature coming soon!', 'success');
        
        // TODO: Show create workspace modal/form
        // This is where you'll implement the workspace creation flow
    }

    // Initialize workspace functionality
    setupWorkspaceCards();

    // Load workspaces and set initial active state
    async function loadWorkspaces() {
        try {
            showLoading(true);
            const { data: spaces, error } = await authHelpers.getUserSpaces();
            
            if (error) {
                console.error('Error loading spaces:', error);
                showError('Failed to load spaces. Please try again.');
                return;
            }

            renderWorkspaces(spaces);

            // Set active space indicator based on browser storage
            const activeSpaceId = await getActiveSpaceFromStorage();
            if (activeSpaceId) {
                // Verify the space still exists
                const activeSpace = spaces.find(space => space.id === activeSpaceId);
                if (activeSpace) {
                    updateActiveSpaceIndicator(activeSpaceId);
                } else {
                    // Clear invalid space from storage
                    await clearActiveSpaceFromStorage();
                }
            }

        } catch (error) {
            console.error('Error loading spaces:', error);
            showError('Failed to load spaces. Please try again.');
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
                <h4>Create Space</h4>
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

    // Check if current tabs match the saved space
    async function currentTabsMatchSpace(space) {
        try {
            if (!space.tabs_data || !Array.isArray(space.tabs_data)) {
                return false;
            }

            const currentTabs = await chrome.tabs.query({ currentWindow: true });
            const nonExtensionTabs = currentTabs.filter(tab => 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('chrome://') &&
                !tab.url.startsWith('edge-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );

            // If tab counts don't match, it's not the same space
            if (nonExtensionTabs.length !== space.tabs_data.length) {
                return false;
            }

            // If both are empty, consider it a match
            if (nonExtensionTabs.length === 0 && space.tabs_data.length === 0) {
                return true;
            }

            // Sort both arrays by URL for comparison
            const currentUrls = nonExtensionTabs.map(tab => tab.url).sort();
            const spaceUrls = space.tabs_data.map(tab => tab.url).sort();

            // Compare URLs - if they match, it's likely the same space
            return JSON.stringify(currentUrls) === JSON.stringify(spaceUrls);

        } catch (error) {
            console.error('Error comparing tabs with space:', error);
            return false;
        }
    }

    // Check if we should restore active space from storage
    async function checkAndRestoreActiveSpace() {
        try {
            const activeSpaceId = await getActiveSpaceFromStorage();
            if (!activeSpaceId) {
                console.log('No active space saved in storage');
                return;
            }

            // Get spaces to verify the saved space still exists
            const { data: spaces, error } = await authHelpers.getUserSpaces();
            if (error || !spaces) {
                console.error('Error loading spaces for restoration:', error);
                return;
            }

            const savedSpace = spaces.find(space => space.id === activeSpaceId);
            if (!savedSpace) {
                console.log('Saved active space no longer exists, clearing storage');
                await clearActiveSpaceFromStorage();
                return;
            }

            console.log('Found saved active space:', savedSpace.name);

            // Check if current tabs already match the saved space
            const tabsMatch = await currentTabsMatchSpace(savedSpace);
            if (tabsMatch) {
                console.log('Current tabs already match saved space, no restoration needed');
                updateActiveSpaceIndicator(activeSpaceId);
                return;
            }

            console.log('Current tabs do not match saved space, checking if restoration is appropriate...');
            
            // Check if we have minimal tabs (safe to restore)
            const currentTabs = await chrome.tabs.query({ currentWindow: true });
            const nonExtensionTabs = currentTabs.filter(tab => 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('chrome://') &&
                !tab.url.startsWith('edge-extension://') &&
                !tab.url.startsWith('moz-extension://')
            );

            // Only restore if we have minimal tabs (like just new tab page)
            if (nonExtensionTabs.length <= 1) {
                console.log('Minimal tabs detected, restoring saved space:', savedSpace.name);
                showMessage(`Restoring space: ${savedSpace.name}`, 'success');
                await loadTabsFromSpace(savedSpace);
                updateActiveSpaceIndicator(activeSpaceId);
            } else {
                console.log('Multiple tabs open, not auto-restoring but updating UI indicator');
                updateActiveSpaceIndicator(activeSpaceId);
            }

        } catch (error) {
            console.error('Error during active space restoration:', error);
        }
    }

    // Load workspaces when dashboard is shown
    async function initializeDashboard() {
        await loadWorkspaces();
        
        // Check if we should restore the active space (only when popup first opens)
        await checkAndRestoreActiveSpace();
    }

    // Call initialize when needed
    if (document.getElementById('dashboard-screen')?.classList.contains('active')) {
        initializeDashboard();
    }
}); 
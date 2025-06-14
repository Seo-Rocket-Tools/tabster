// Simplified Tabster Popup - Authentication Only
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tabster popup loaded');
    
    // Screen elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const forgotPasswordScreen = document.getElementById('forgot-password-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const createSpaceScreen = document.getElementById('create-space-screen');
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

    // Connect to background script for disconnect detection and improved reliability
    const port = chrome.runtime.connect({ name: 'popup' });
    port.onDisconnect.addListener(() => {
        console.log('🔌 Popup: Connection to background script disconnected');
    });

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
            // Don't show loading overlay for initial authentication check
            
            if (typeof authHelpers !== 'undefined') {
                const user = await authHelpers.getCurrentUser();
                
                if (user) {
                    // Immediately show dashboard with skeleton for logged-in users
                    showScreen('dashboard');
                    await loadUserData(user);
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
        }
        // No finally block - we don't want to hide loading overlay here anymore
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

            // Get current user info
            const user = await authHelpers.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get the user's session for JWT token
            const { data: { session } } = await supabaseClient.auth.getSession();
            const userToken = session?.access_token || null;

            console.log('🔄 Popup: Delegating space switch to background script');

            // Delegate space switching entirely to background script
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ 
                    type: 'switch_to_space', 
                    spaceId: spaceId,
                    userId: user.id,
                    userToken: userToken
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });

            if (!response.success) {
                throw new Error(response.error || 'Failed to switch space');
            }

            console.log('✅ Popup: Space switch completed by background script');

            // Update UI to reflect active state
            updateActiveSpaceIndicator(spaceId);

            showMessage(`Switched to ${response.spaceName}`, 'success');

        } catch (error) {
            console.error('❌ Popup: Error switching workspace:', error);
            showMessage(`Failed to switch space: ${error.message}`, 'error');
        } finally {
            // Always remove visual feedback
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
                // Get the user's session for JWT token
                const { data: { session } } = await supabaseClient.auth.getSession();
                
                // Store both user-specific and global active space
                const userStorageKey = `tabster_active_space_${user.id}`;
                const globalStorageKey = 'tabster_current_active_space';
                
                await chrome.storage.local.set({ 
                    [userStorageKey]: spaceId,
                    [globalStorageKey]: {
                        spaceId: spaceId,
                        userId: user.id,
                        userToken: session?.access_token || null,
                        timestamp: new Date().toISOString()
                    }
                });
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
                const userStorageKey = `tabster_active_space_${user.id}`;
                const globalStorageKey = 'tabster_current_active_space';
                
                await chrome.storage.local.remove([userStorageKey, globalStorageKey]);
                console.log('Cleared active space from storage');
            }
        } catch (error) {
            console.error('Error clearing active space from storage:', error);
        }
    }

    // Note: Tab restoration functions moved to background script for better reliability
    // The background script now handles all tab operations during space switching

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
        showScreen('create-space-screen');
        setupCreateSpaceForm();
    }

    async function handleDeleteSpace(spaceId) {
        try {
            // Close any open dropdowns
            document.querySelectorAll('.workspace-options-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
                dropdown.closest('.workspace-card').classList.remove('dropdown-open');
            });

            // Get space details for confirmation
            const { data: spaces, error: fetchError } = await authHelpers.getUserSpaces();
            if (fetchError) {
                showMessage('Failed to load space details', 'error');
                return;
            }

            const space = spaces.find(s => s.id === spaceId);
            if (!space) {
                showMessage('Space not found', 'error');
                return;
            }

            // Show custom confirmation modal
            showDeleteConfirmationModal(space, spaceId);

        } catch (error) {
            console.error('Error deleting space:', error);
            showMessage(`Failed to load space details: ${error.message}`, 'error');
        }
    }

    function showDeleteConfirmationModal(space, spaceId) {
        const modal = document.getElementById('delete-confirmation-modal');
        const spaceNameDisplay = document.getElementById('space-name-display');
        const confirmationInput = document.getElementById('space-name-confirmation');
        const confirmationError = document.getElementById('confirmation-error');
        const cancelBtn = document.getElementById('cancel-delete');
        const confirmBtn = document.getElementById('confirm-delete');

        // Set the space name to match
        spaceNameDisplay.textContent = space.name;
        
        // Reset form state
        confirmationInput.value = '';
        confirmationError.style.display = 'none';
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Delete Space';

        // Show modal
        modal.style.display = 'flex';
        setTimeout(() => confirmationInput.focus(), 100);

        // Real-time validation
        function validateInput() {
            const inputValue = confirmationInput.value;
            const isMatch = inputValue === space.name;
            
            confirmBtn.disabled = !isMatch;
            
            if (inputValue && !isMatch) {
                confirmationError.style.display = 'block';
            } else {
                confirmationError.style.display = 'none';
            }
        }

        // Event listeners
        const inputHandler = () => validateInput();
        const cancelHandler = () => hideDeleteConfirmationModal();
        const confirmHandler = () => confirmDeleteSpace(space, spaceId);
        const keypressHandler = (e) => {
            if (e.key === 'Enter' && !confirmBtn.disabled) {
                confirmDeleteSpace(space, spaceId);
            } else if (e.key === 'Escape') {
                hideDeleteConfirmationModal();
            }
        };
        const overlayHandler = (e) => {
            if (e.target === modal) {
                hideDeleteConfirmationModal();
            }
        };

        // Add event listeners
        confirmationInput.addEventListener('input', inputHandler);
        confirmationInput.addEventListener('keydown', keypressHandler);
        cancelBtn.addEventListener('click', cancelHandler);
        confirmBtn.addEventListener('click', confirmHandler);
        modal.addEventListener('click', overlayHandler);

        // Store cleanup function
        window.deleteModalCleanup = () => {
            confirmationInput.removeEventListener('input', inputHandler);
            confirmationInput.removeEventListener('keydown', keypressHandler);
            cancelBtn.removeEventListener('click', cancelHandler);
            confirmBtn.removeEventListener('click', confirmHandler);
            modal.removeEventListener('click', overlayHandler);
        };
    }

    function hideDeleteConfirmationModal() {
        const modal = document.getElementById('delete-confirmation-modal');
        modal.style.display = 'none';
        
        // Clean up event listeners
        if (window.deleteModalCleanup) {
            window.deleteModalCleanup();
            delete window.deleteModalCleanup;
        }
    }

    async function confirmDeleteSpace(space, spaceId) {
        const confirmBtn = document.getElementById('confirm-delete');
        
        try {
            // Show loading state
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Deleting...';

            // Show loading state for the specific card
            const card = document.querySelector(`[data-workspace="${spaceId}"]`);
            if (card) {
                card.classList.add('loading');
            }

            // Delete the space
            const { error: deleteError } = await authHelpers.deleteSpace(spaceId);
            
            if (deleteError) {
                throw new Error(deleteError.message || 'Failed to delete space');
            }

            // Check if we're deleting the currently active space
            const activeSpaceId = await getActiveSpaceFromStorage();
            const wasActiveSpace = activeSpaceId === spaceId;

            if (wasActiveSpace) {
                await clearActiveSpaceFromStorage();
            }

            // Hide modal
            hideDeleteConfirmationModal();

            // Show success message and reload workspaces
            showMessage(`Space "${space.name}" deleted successfully`, 'success');
            await loadWorkspaces();

            // If we deleted the active space, switch to the topmost remaining space
            if (wasActiveSpace) {
                await switchToTopmostSpace();
            }

        } catch (error) {
            console.error('Error deleting space:', error);
            showMessage(`Failed to delete space: ${error.message}`, 'error');
            
            // Remove loading state on error
            const card = document.querySelector(`[data-workspace="${spaceId}"]`);
            if (card) {
                card.classList.remove('loading');
            }

            // Reset button state
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Delete Space';
        }
    }

    async function switchToTopmostSpace() {
        try {
            // Get all remaining spaces
            const { data: spaces, error } = await authHelpers.getUserSpaces();
            if (error) {
                console.error('Error loading spaces for auto-switch:', error);
                return;
            }

            // If there are spaces remaining, switch to the first one (topmost)
            if (spaces && spaces.length > 0) {
                const topmostSpace = spaces[0]; // Spaces are ordered by order_index ascending
                console.log(`Auto-switching to topmost space: ${topmostSpace.name}`);
                await switchToWorkspace(topmostSpace.id);
            } else {
                console.log('No spaces remaining after deletion');
            }
        } catch (error) {
            console.error('Error auto-switching to topmost space:', error);
        }
    }

    async function handleEditSpace(spaceId) {
        try {
            // Close any open dropdowns
            document.querySelectorAll('.workspace-options-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
                dropdown.closest('.workspace-card').classList.remove('dropdown-open');
            });

            // Get space details
            const { data: spaces, error } = await authHelpers.getUserSpaces();
            if (error) {
                showMessage('Failed to load space details', 'error');
                return;
            }

            const space = spaces.find(s => s.id === spaceId);
            if (!space) {
                showMessage('Space not found', 'error');
                return;
            }

            // Show edit screen and setup form
            showScreen('edit-space-screen');
            setupEditSpaceForm(space);

        } catch (error) {
            console.error('Error editing space:', error);
            showMessage(`Failed to load space details: ${error.message}`, 'error');
        }
    }

    // Store the document click listener so we can remove it
    let documentClickListener = null;
    let editDocumentClickListener = null;

    function setupCreateSpaceForm() {
        // Clear form
        document.getElementById('space-name').value = '';
        document.getElementById('space-emoji').value = '📦';
        document.getElementById('space-description').value = '';
        document.getElementById('include-current-tabs').checked = false;
        
        // Reset color selection
        const colorPreview = document.getElementById('color-preview');
        const colorLabel = document.getElementById('color-label');
        colorPreview.style.background = 'var(--bg-tertiary)';
        colorLabel.textContent = 'Choose a color';
        colorLabel.className = 'color-label placeholder';
        
        // Store selected values
        let selectedEmoji = '📦'; // Default to 📦
        let selectedColor = null;
        let selectedColorName = null;

        // Remove previous document click listener if exists
        if (documentClickListener) {
            document.removeEventListener('click', documentClickListener);
        }

        // Get elements
        const emojiInput = document.getElementById('space-emoji');
        const emojiDropdown = document.getElementById('emoji-dropdown');
        const colorInput = document.getElementById('space-color');
        const colorDropdown = document.getElementById('color-dropdown');

        function hideEmojiDropdown() {
            emojiDropdown.classList.remove('show');
        }

        function hideColorDropdown() {
            colorDropdown.classList.remove('show');
            colorInput.classList.remove('focused');
        }

        // Clear any existing 'show' classes
        hideEmojiDropdown();
        hideColorDropdown();

        // Emoji field interactions - use onclick to replace any existing handlers
        emojiInput.onclick = (e) => {
            e.stopPropagation();
            emojiDropdown.classList.toggle('show');
            hideColorDropdown();
        };

        // Emoji selection
        const emojiOptions = document.querySelectorAll('.emoji-option');
        emojiOptions.forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                selectedEmoji = option.dataset.emoji;
                emojiInput.value = selectedEmoji;
                hideEmojiDropdown();
            };
        });

        // Color field interactions
        colorInput.onclick = (e) => {
            e.stopPropagation();
            colorDropdown.classList.toggle('show');
            colorInput.classList.toggle('focused');
            hideEmojiDropdown();
        };

        // Color selection
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                selectedColor = option.dataset.color;
                selectedColorName = option.dataset.name;
                
                // Update preview
                colorPreview.style.background = selectedColor;
                colorLabel.textContent = selectedColorName;
                colorLabel.className = 'color-label';
                
                hideColorDropdown();
            };
        });

        // Hide dropdowns when clicking outside
        documentClickListener = (e) => {
            if (!e.target.closest('#create-space-screen .emoji-input-container')) {
                hideEmojiDropdown();
            }
            if (!e.target.closest('#create-space-screen .color-input-container')) {
                hideColorDropdown();
            }
        };
        document.addEventListener('click', documentClickListener);

        // Cancel buttons
        const cancelButtons = [
            document.getElementById('cancel-create-space'),
            document.getElementById('cancel-create-space-btn')
        ];
        
        cancelButtons.forEach(btn => {
            if (btn) {
                btn.onclick = () => {
                    // Clean up document listener when canceling
                    if (documentClickListener) {
                        document.removeEventListener('click', documentClickListener);
                        documentClickListener = null;
                    }
                    showScreen('dashboard');
                };
            }
        });

        // Form submission
        const createSpaceForm = document.getElementById('create-space-form');
        createSpaceForm.onsubmit = async (e) => {
            e.preventDefault();
            await handleCreateSpaceSubmit(selectedEmoji, selectedColor);
        };
    }

    function setupEditSpaceForm(space) {
        // Pre-populate form with space data
        document.getElementById('edit-space-name').value = space.name || '';
        document.getElementById('edit-space-emoji').value = space.emoji || '📦';
        document.getElementById('edit-space-description').value = space.description || '';

        // Set up color preview
        const colorPreview = document.getElementById('edit-color-preview');
        const colorLabel = document.getElementById('edit-color-label');
        if (space.color) {
            colorPreview.style.background = space.color;
            // Find color name from the color options
            const colorOption = document.querySelector(`#edit-color-dropdown [data-color="${space.color}"]`);
            if (colorOption) {
                colorLabel.textContent = colorOption.dataset.name;
                colorLabel.className = 'color-label';
            } else {
                colorLabel.textContent = space.color;
                colorLabel.className = 'color-label';
            }
        } else {
            colorPreview.style.background = 'var(--bg-tertiary)';
            colorLabel.textContent = 'Choose a color';
            colorLabel.className = 'color-label placeholder';
        }

        // Store selected values (initialized with current space data)
        let selectedEmoji = space.emoji || '📦';
        let selectedColor = space.color || null;
        let selectedColorName = colorLabel.textContent;

        // Remove previous document click listener if exists
        if (editDocumentClickListener) {
            document.removeEventListener('click', editDocumentClickListener);
        }

        // Get elements
        const emojiInput = document.getElementById('edit-space-emoji');
        const emojiDropdown = document.getElementById('edit-emoji-dropdown');
        const colorInput = document.getElementById('edit-space-color');
        const colorDropdown = document.getElementById('edit-color-dropdown');

        function hideEmojiDropdown() {
            emojiDropdown.classList.remove('show');
        }

        function hideColorDropdown() {
            colorDropdown.classList.remove('show');
            colorInput.classList.remove('focused');
        }

        // Clear any existing 'show' classes
        hideEmojiDropdown();
        hideColorDropdown();

        // Emoji field interactions
        emojiInput.onclick = (e) => {
            e.stopPropagation();
            emojiDropdown.classList.toggle('show');
            hideColorDropdown();
        };

        // Emoji selection
        const emojiOptions = document.querySelectorAll('#edit-emoji-dropdown .emoji-option');
        emojiOptions.forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                selectedEmoji = option.dataset.emoji;
                emojiInput.value = selectedEmoji;
                hideEmojiDropdown();
            };
        });

        // Color field interactions
        colorInput.onclick = (e) => {
            e.stopPropagation();
            colorDropdown.classList.toggle('show');
            colorInput.classList.toggle('focused');
            hideEmojiDropdown();
        };

        // Color selection
        const colorOptions = document.querySelectorAll('#edit-color-dropdown .color-option');
        colorOptions.forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                selectedColor = option.dataset.color;
                selectedColorName = option.dataset.name;

                // Update preview
                colorPreview.style.background = selectedColor;
                colorLabel.textContent = selectedColorName;
                colorLabel.className = 'color-label';

                hideColorDropdown();
            };
        });

        // Hide dropdowns when clicking outside
        editDocumentClickListener = (e) => {
            if (!e.target.closest('#edit-space-screen .emoji-input-container')) {
                hideEmojiDropdown();
            }
            if (!e.target.closest('#edit-space-screen .color-input-container')) {
                hideColorDropdown();
            }
        };
        document.addEventListener('click', editDocumentClickListener);

        // Cancel buttons
        const cancelButtons = [
            document.getElementById('cancel-edit-space'),
            document.getElementById('cancel-edit-space-btn')
        ];

        cancelButtons.forEach(btn => {
            if (btn) {
                btn.onclick = () => {
                    // Clean up document listener when canceling
                    if (editDocumentClickListener) {
                        document.removeEventListener('click', editDocumentClickListener);
                        editDocumentClickListener = null;
                    }
                    showScreen('dashboard');
                };
            }
        });

        // Form submission
        const editSpaceForm = document.getElementById('edit-space-form');
        editSpaceForm.onsubmit = async (e) => {
            e.preventDefault();
            await handleEditSpaceSubmit(space.id, selectedEmoji, selectedColor);
        };
    }

    async function handleEditSpaceSubmit(spaceId, selectedEmoji, selectedColor) {
        const nameInput = document.getElementById('edit-space-name');
        const descriptionInput = document.getElementById('edit-space-description');
        const submitButton = document.querySelector('#edit-space-form button[type="submit"]');

        try {
            // Show loading state
            showLoading(true);
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Saving...';
            }

            // Validate required fields
            if (!nameInput.value.trim()) {
                throw new Error('Space name is required');
            }

            // Prepare space data
            const spaceData = {
                name: nameInput.value.trim(),
                description: descriptionInput.value.trim() || null,
                emoji: selectedEmoji,
                color: selectedColor
            };

            // Update space in database
            const { error: updateError } = await authHelpers.updateSpace(spaceId, spaceData);
            
            if (updateError) {
                throw updateError;
            }

            // Clean up document listener
            if (editDocumentClickListener) {
                document.removeEventListener('click', editDocumentClickListener);
                editDocumentClickListener = null;
            }

            // Show success and return to dashboard
            showMessage('Space updated successfully!', 'success');
            showScreen('dashboard');
            
            // Refresh the workspace list to show updated space
            await loadWorkspaces();

        } catch (error) {
            console.error('Error updating space:', error);
            showMessage(`Failed to update space: ${error.message}`, 'error');
        } finally {
            showLoading(false);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Save Changes';
            }
        }
    }

    async function handleCreateSpaceSubmit(selectedEmoji, selectedColor) {
        try {
            const spaceName = document.getElementById('space-name').value.trim();
            const spaceDescription = document.getElementById('space-description').value.trim();
            const includeCurrentTabs = document.getElementById('include-current-tabs').checked;

            if (!spaceName) {
                showMessage('Please enter a space name', 'error');
                return;
            }

            // Show loading state
            const submitBtn = document.querySelector('#create-space-form button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;

            // Prepare space data
            const spaceData = {
                name: spaceName,
                description: spaceDescription || null,
                emoji: selectedEmoji || '📁',
                color: selectedColor || '#6B7280'
            };

            // Get current tabs if checkbox is checked
            let tabsData = null;
            if (includeCurrentTabs) {
                const currentTabs = await chrome.tabs.query({});
                const nonExtensionTabs = currentTabs.filter(tab => 
                    !tab.url.startsWith('chrome-extension://') &&
                    !tab.url.startsWith('chrome://') &&
                    !tab.url.startsWith('edge-extension://') &&
                    !tab.url.startsWith('moz-extension://')
                );

                tabsData = nonExtensionTabs.map(tab => ({
                    id: tab.id,
                    url: tab.url,
                    title: tab.title,
                    index: tab.index,
                    pinned: tab.pinned,
                    windowId: tab.windowId,
                    active: tab.active,
                    favIconUrl: tab.favIconUrl || null
                }));
                
                spaceData.tabs_data = tabsData;
            }

            // Create the space
            console.log('Creating space with data:', spaceData);
            const { data: newSpace, error } = await authHelpers.createSpace(spaceData);

            if (error) {
                throw new Error(error.message || 'Failed to create space');
            }

            console.log('Space created successfully:', newSpace);
            showMessage(`Space "${spaceName}" created successfully!`, 'success');

            // Switch to the new space using background script
            if (!includeCurrentTabs) {
                // Use background script to switch to new space with clean tabs
                console.log('🔄 Popup: Switching to new space with clean tabs via background script');
                
                // Get user info for background script call
                const user = await authHelpers.getCurrentUser();
                const { data: { session } } = await supabaseClient.auth.getSession();
                const userToken = session?.access_token || null;
                
                const switchResponse = await new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage({ 
                        type: 'switch_to_space', 
                        spaceId: newSpace.id,
                        userId: user.id,
                        userToken: userToken
                    }, (response) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(response);
                        }
                    });
                });

                if (!switchResponse.success) {
                    throw new Error(switchResponse.error || 'Failed to switch to new space');
                }
                
                console.log('✅ Popup: Successfully switched to new space with clean tabs');
            } else {
                // Just save to storage if keeping current tabs
                await saveActiveSpaceToStorage(newSpace.id);
            }

            // Go back to dashboard and refresh
            showScreen('dashboard');
            await loadWorkspaces();
            updateActiveSpaceIndicator(newSpace.id);

        } catch (error) {
            console.error('Error creating space:', error);
            showMessage(`Failed to create space: ${error.message}`, 'error');
        } finally {
            // Reset button
            const submitBtn = document.querySelector('#create-space-form button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Create Space';
                submitBtn.disabled = false;
            }
        }
    }

    // Initialize workspace functionality
    setupWorkspaceCards();

    // Load workspaces and set initial active state
    async function loadWorkspaces() {
        try {
            // Immediately render skeleton card - no loading overlay
            renderSkeletonSpaces();

            // Get current user info
            const user = await authHelpers.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get the user's session for JWT token
            const { data: { session } } = await supabaseClient.auth.getSession();
            const userToken = session?.access_token || null;

            console.log('🔄 Popup: Getting spaces via background script');

            // Get spaces from background script
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ 
                    type: 'get_spaces', 
                    userId: user.id,
                    userToken: userToken
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });

            if (!response.success) {
                throw new Error(response.error || 'Failed to load spaces');
            }

            console.log('✅ Popup: Spaces loaded via background script');

            const spaces = response.spaces;
            const activeSpaceId = response.activeSpaceId;

            // Replace skeleton with actual spaces
            renderWorkspaces(spaces);

            // Set active space indicator
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
            console.error('❌ Popup: Error loading spaces:', error);
            showError('Failed to load spaces. Please try again.');
        }
        // No finally block - we don't show/hide loading overlay anymore
    }

    function renderSkeletonSpaces() {
        const workspacesGrid = document.getElementById('workspaces-grid');
        if (!workspacesGrid) return;

        // Clear existing content
        workspacesGrid.innerHTML = '';

        // Create single skeleton space card
        const skeletonCard = createSkeletonSpaceCard();
        workspacesGrid.appendChild(skeletonCard);
    }

    function createSkeletonSpaceCard() {
        const card = document.createElement('div');
        card.className = 'workspace-card skeleton-card';
        
        card.innerHTML = `
            <div class="workspace-icon skeleton-icon">
                <div class="skeleton-shimmer"></div>
            </div>
            <div class="workspace-content">
                <div class="skeleton-title">
                    <div class="skeleton-shimmer"></div>
                </div>
                <div class="skeleton-description">
                    <div class="skeleton-shimmer"></div>
                </div>
            </div>
            <div class="workspace-action skeleton-action">
                <div class="skeleton-shimmer"></div>
            </div>
        `;

        return card;
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
                <div class="workspace-options-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                </svg>
                </div>
                <div class="workspace-options-dropdown">
                    <div class="workspace-option edit-option" data-action="edit" data-workspace="${space.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Edit Space
                    </div>
                    <div class="workspace-option delete-option" data-action="delete" data-workspace="${space.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Delete Space
                    </div>
                </div>
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
            <div class="new-space-container">
                <div class="new-space-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
            </div>
                <div class="new-space-text">
                    <span class="new-space-title">New Space</span>
                    <span class="new-space-subtitle">Organize your tabs</span>
                </div>
            </div>
        `;

        return card;
    }

    function setupWorkspaceCardListeners() {
        const workspaceCards = document.querySelectorAll('.workspace-card');
        
        workspaceCards.forEach(card => {
            // Handle card clicks (for switching spaces)
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on options button or dropdown
                if (e.target.closest('.workspace-action')) {
                    return;
                }
                
                const workspaceId = this.dataset.workspace;
                const action = this.dataset.action;
                
                if (action === 'create') {
                    handleCreateWorkspace();
                } else if (workspaceId) {
                    handleWorkspaceClick(workspaceId);
                }
            });

            // Handle options button clicks
            const optionsBtn = card.querySelector('.workspace-options-btn');
            if (optionsBtn) {
                optionsBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Close all other dropdowns first and remove dropdown-open class
                    document.querySelectorAll('.workspace-options-dropdown.show').forEach(dropdown => {
                        dropdown.classList.remove('show');
                        dropdown.closest('.workspace-card').classList.remove('dropdown-open');
                    });
                    
                    // Toggle this dropdown
                    const dropdown = this.nextElementSibling;
                    const isShowing = dropdown.classList.toggle('show');
                    
                    // Add or remove dropdown-open class for z-index management
                    if (isShowing) {
                        card.classList.add('dropdown-open');
                    } else {
                        card.classList.remove('dropdown-open');
                    }
                });
            }

            // Handle edit option clicks
            const editOption = card.querySelector('.edit-option');
            if (editOption) {
                editOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const workspaceId = this.dataset.workspace;
                    handleEditSpace(workspaceId);
                });
            }

            // Handle delete option clicks
            const deleteOption = card.querySelector('.delete-option');
            if (deleteOption) {
                deleteOption.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const workspaceId = this.dataset.workspace;
                    handleDeleteSpace(workspaceId);
                });
            }
        });

        // Close dropdowns when clicking outside (use a named function to avoid conflicts)
        function closeWorkspaceDropdowns(e) {
            if (!e.target.closest('.workspace-action')) {
                document.querySelectorAll('.workspace-options-dropdown.show').forEach(dropdown => {
                    dropdown.classList.remove('show');
                    dropdown.closest('.workspace-card').classList.remove('dropdown-open');
                });
            }
        }
        
        // Remove any existing workspace dropdown listeners
        document.removeEventListener('click', closeWorkspaceDropdowns);
        document.addEventListener('click', closeWorkspaceDropdowns);
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
                console.log('Minimal tabs detected, attempting to restore saved space:', savedSpace.name);
                showMessage(`Restoring space: ${savedSpace.name}`, 'success');
                // Note: Background script will handle restoration on startup
                // We just update the UI indicator here
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
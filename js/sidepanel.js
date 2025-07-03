document.addEventListener('DOMContentLoaded', function() {

    console.log('SIDEPANEL LOADED...')

    /* SECTION INITIALIZATION */

    let CURRENT_USER = null;

    // Listen for tab data refresh messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'tabDataRefreshed') {
            if (message.success) {
                UI_DASHBOARD_DATA.updateData(message.data);
            } else {
                console.error('Tab data refresh error:', message.error);
            }
        }
    });

    /* SECTION POPUP INITIALIZATION */
    async function initializePopup() {
        if (await checkUserAuth()) {
            UI_DASHBOARD_DATA.loading();
            showScreen('dashboard');
            UI_DASHBOARD_DATA.updateData({userData: CURRENT_USER});

            // get dashboard data
            chrome.runtime.sendMessage({ type: 'refreshTabData' });
            
        } else {
            showScreen('welcome');
        }
    }

    initializePopup();


    /* SECTION MESSAGE BANNER SYSTEM */
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

    /* SECTION SCREEN MANAGEMENT */
    function showScreen(screenName) {
        const welcomeScreen = document.getElementById('welcome-screen');
        const loginScreen = document.getElementById('login-screen');
        const signupScreen = document.getElementById('signup-screen');
        const forgotPasswordScreen = document.getElementById('forgot-password-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        const createSpaceScreen = document.getElementById('create-space-screen');
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

    /* SECTION AUTHENTICATION */
    async function checkUserAuth() {
        try {
            const response = await chrome.runtime.sendMessage({ type: 'checkAuth' });
            CURRENT_USER = response.userData;
            return response.success && response.authenticated;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }

    /* SECTION NAVIGATION HANDLERS */

    const loginNavs = [
        document.getElementById('login-btn'),
        document.getElementById('goto-login'),
        document.getElementById('back-to-login')
    ].forEach(nav => {
        nav.addEventListener('click', () => {
            showScreen('login');
        });
    });

    const signupNavs = [
        document.getElementById('signup-btn'),
        document.getElementById('goto-signup'),
        document.getElementById('back-to-welcome-2')
    ].forEach(nav => {
        nav.addEventListener('click', () => {
            showScreen('signup');
        });
    });
    
    const resetPasswordNavs = [
        document.getElementById('forgot-password-link')
    ].forEach(nav => {
        nav.addEventListener('click', () => {
            showScreen('forgot-password');
        });
    });

    const backToWelcomeNavs = [
        document.getElementById('back-to-welcome'),
        document.getElementById('back-to-welcome-2'),
        document.getElementById('back-to-welcome-3')
    ].forEach(nav => {
        nav.addEventListener('click', () => {
            showScreen('welcome');
        });
    });


    /* SECTION AUTHENTICATION */

    // handle login
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
                UI_DASHBOARD_DATA.loading();
                showScreen('dashboard');
                UI_DASHBOARD_DATA.updateData({userData: response.userData});

                CURRENT_USER = response.userData;

                // get dashboard data
                chrome.runtime.sendMessage({ type: 'refreshTabData', fresh: true });

                
                MessageBanner.hide(); // Hide banner when switching screens
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

    // handle logout
    document.getElementById('logout-btn-dropdown').addEventListener('click', async (e) => {
        e.preventDefault();
        await chrome.runtime.sendMessage({ type: 'signout' });
        MessageBanner.success('Signed out successfully.');
        showScreen('welcome');
    });

    // handle signup
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const fullName = document.getElementById('signup-name').value;

        // Show loading banner and disable button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        MessageBanner.loading('Signing up...');

        try {
            // Send signup credentials to background script
            const response = await chrome.runtime.sendMessage({
                type: 'signup',
                email: email,
                password: password,
                fullName: fullName
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
    

    /* SECTION MINOR UI HANDLERS */

    // Toggle dropdown when avatar is clicked
    const UI_USER_AVATAR = document.getElementById('user-avatar');
    const UI_USER_MENU = document.getElementById('dropdown-menu');
    if (UI_USER_AVATAR && UI_USER_MENU) {
        UI_USER_AVATAR.addEventListener('click', (e) => {
            e.stopPropagation();
            UI_USER_MENU.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!UI_USER_AVATAR.contains(e.target) && !UI_USER_MENU.contains(e.target)) {
                UI_USER_MENU.classList.remove('show');
            }
        });
    }


    // Dashboard data handlers
    const UI_DASHBOARD_DATA = {
        welcomeMessage: document.getElementById('welcome-message'),
        avatarInitials: document.getElementById('avatar-initials'),
        essentialsGrid: document.getElementById('essentials-grid'),
        spacesGrid: document.getElementById('workspaces-grid'),
        userData: null,
        essentials: null,
        spaces: null,
        
        loading () {
            // Update welcome message to "Please wait..."
            if (this.welcomeMessage) {
                this.welcomeMessage.textContent = 'Please wait...';
            }

            // Update user avatar with loading state and shimmer animation
            if (this.avatarInitials) {
                this.avatarInitials.textContent = ''; // Clear text content
                this.avatarInitials.classList.add('skeleton-shimmer'); // Add shimmer animation
            }

            // Show essentials grid with skeleton cards
            const essentialsGrid = document.getElementById('essentials-grid');
            if (essentialsGrid) {
                essentialsGrid.innerHTML = ''; // Clear existing content
                
                // Add skeleton loading cards (5 essentials + 1 add button)
                for (let i = 0; i < 6; i++) {
                    const skeletonCard = this._createEssentialSkeletonCard();
                    essentialsGrid.appendChild(skeletonCard);
                }
            }

            // Show spaces grid with skeleton card
            const spacesGrid = document.getElementById('workspaces-grid');
            if (spacesGrid) {
                spacesGrid.innerHTML = ''; // Clear existing content
                
                // Add skeleton loading card
                const skeletonCard = this._createSpaceSkeletonCard();
                spacesGrid.appendChild(skeletonCard);
            }
        },

        updateData({userData, essentials, spaces}) {
            this.userData = userData;
            this.essentials = essentials;
            this.spaces = spaces;


            if (userData) {
                // Update welcome message with user's display name or full name
                if (this.welcomeMessage) {
                    this.welcomeMessage.textContent = `Welcome back, ${userData.full_name || userData.email}`;
                }

                // Update user avatar initials
                if (this.avatarInitials) {
                    const name = userData.display_name || userData.full_name || userData.email;
                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    this.avatarInitials.textContent = initials;
                    this.avatarInitials.classList.remove('skeleton-shimmer'); // Remove shimmer animation
                }
            }

            if (essentials) {
                // Clear existing skeleton cards and populate with actual essentials
                if (this.essentialsGrid) {
                    this.essentialsGrid.innerHTML = ''; // Clear existing content
                    
                    // Add essential items
                    essentials.forEach(essential => {
                        // Only proceed if we have the required fields
                        if (!essential.url || !essential.favicon) return;
                        
                        const essentialItem = document.createElement('div');
                        essentialItem.className = 'essential-item';
                        essentialItem.setAttribute('data-url', essential.url);
                        
                        // Extract domain from URL for title and fallback
                        let displayTitle = essential.url;
                        let fallbackText = 'ES';
                        
                        try {
                            const url = new URL(essential.url);
                            displayTitle = url.hostname.replace('www.', '');
                            fallbackText = displayTitle.substring(0, 2).toUpperCase();
                        } catch (e) {
                            // If URL parsing fails, use the original URL
                            fallbackText = essential.url.substring(0, 2).toUpperCase();
                        }
                        
                        essentialItem.setAttribute('title', displayTitle);
                        
                        essentialItem.innerHTML = `
                            <div class="essential-icon">
                                <img src="${essential.favicon}" alt="${displayTitle}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="fallback-icon" style="display: none;">${fallbackText}</div>
                            </div>
                        `;
                        
                        this.essentialsGrid.appendChild(essentialItem);
                    });
                    
                    // Add "Add Essential" button at the end
                    const addEssentialItem = document.createElement('div');
                    addEssentialItem.className = 'essential-item add-essential';
                    addEssentialItem.setAttribute('title', 'Add Essential');
                    addEssentialItem.addEventListener('click', UI_NEW_ESSENTIAL_MODAL.show);
                    
                    addEssentialItem.innerHTML = `
                        <div class="essential-icon add-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                    `;
                    
                    this.essentialsGrid.appendChild(addEssentialItem);
                }
            }

            if (spaces) {
                if (!this.spacesGrid) return;
                
                // Store current expansion states
                const expansionStates = this._getExpansionStates();
                
                this.spacesGrid.innerHTML = '';
                
                // Render space cards
                spaces.forEach(space => {
                    space.isExpanded = expansionStates.spaces[space.id] || false;
                    
                    if (space.folders) {
                        space.folders.forEach((folder, folderIndex) => {
                            const folderKey = `${space.id}-${folderIndex}`;
                            folder.isExpanded = expansionStates.folders[folderKey] !== undefined 
                                ? expansionStates.folders[folderKey] 
                                : folder.isDefault;
                        });
                    }
                    
                    const spaceCard = this._createSpaceCard(space);
                    this.spacesGrid.appendChild(spaceCard);
                });
                
                // Add "New Space" card
                this.spacesGrid.appendChild(this._createNewSpaceCard());
                
                // Initialize tree interactions
                this._initializeTreeInteractions();
            }
        },

        _createSpaceSkeletonCard() {
            const card = document.createElement('div');
            card.className = 'space-card skeleton-card';
            
            card.innerHTML = `
                <div class="space-card-header">
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
                    <div class="space-actions">
                        <button class="space-expand-btn">
                            <div class="skeleton-shimmer"></div>
                        </button>
                        <button class="space-switch-btn">
                            <div class="skeleton-shimmer"></div>
                        </button>
                        <button class="space-menu-btn">
                            <div class="skeleton-shimmer"></div>
                        </button>
                    </div>
                </div>
            `;
            
            return card;
        },

        _createEssentialSkeletonCard() {
            const card = document.createElement('div');
            card.className = 'essential-item skeleton-card';
            
            card.innerHTML = `
                <div class="essential-icon">
                    <div class="skeleton-shimmer"></div>
                </div>
            `;
            
            return card;
        },


        // spaces helpers

        _getExpansionStates() {
            const states = { spaces: {}, folders: {} };
            
            if (!this.spacesGrid) return states;
            
            const existingSpaces = this.spacesGrid.querySelectorAll('.space-card[data-space-id]');
            existingSpaces.forEach(spaceCard => {
                const spaceId = spaceCard.getAttribute('data-space-id');
                const treeElement = spaceCard.querySelector('.space-tree');
                states.spaces[spaceId] = treeElement && treeElement.style.display !== 'none';
                
                const folders = spaceCard.querySelectorAll('.tree-folder');
                folders.forEach((folder, folderIndex) => {
                    const folderContent = folder.querySelector('.tree-folder-content');
                    const folderKey = `${spaceId}-${folderIndex}`;
                    states.folders[folderKey] = folderContent && folderContent.style.display !== 'none';
                });
            });
            
            return states;
        },

        _createSpaceCard(space) {
            const card = document.createElement('div');
            card.className = 'space-card';
            card.setAttribute('data-space-id', space.id);
            card.setAttribute('data-index', this.spaces.findIndex(s => s.id === space.id));
            
            card.innerHTML = `
                <div class="space-card-header" data-space-id="${space.id}">
                    <div class="drag-handle" draggable="true" title="Drag to reorder">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                            <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
                        </svg>
                    </div>
                    <div class="space-icon">${space.emoji || '📁'}</div>
                    <div class="space-content">
                        <div class="space-name">${space.name}</div>
                        <div class="space-description">${space.description || 'No description'}</div>
                    </div>
                    <div class="space-actions">
                        <button class="space-switch-btn" title="Switch to ${space.name}" disabled>
                            <img src="icons/load_space.svg" width="14" height="14" style="color: currentColor;">
                        </button>
                        <button class="space-menu-btn" disabled>⋯</button>
                    </div>
                </div>
                <div class="space-tree" style="display: ${space.isExpanded ? 'block' : 'none'};">
                    ${space.folders ? this._createFolderTree(space.folders) : ''}
                </div>
            `;
            
            // Apply custom color styling
            if (space.color) {
                const spaceIcon = card.querySelector('.space-icon');
                if (spaceIcon) {
                    spaceIcon.style.cssText = `
                        border: 2px solid ${space.color} !important;
                        background-color: ${space.color}1A !important;
                        transition: all 0.2s ease !important;
                    `;
                }
            }
            
            // Set expanded class
            if (space.isExpanded) {
                card.classList.add('expanded');
            }
            
            // Add click handler for expansion
            const cardHeader = card.querySelector('.space-card-header');
            cardHeader.addEventListener('click', (e) => {
                if (e.target.closest('.space-actions') || e.target.closest('.drag-handle')) {
                    return;
                }
                this._toggleSpaceExpansion(card);
            });
            
            return card;
        },

        _toggleSpaceExpansion(card) {
            const treeElement = card.querySelector('.space-tree');
            const isExpanded = treeElement.style.display !== 'none';
            
            if (isExpanded) {
                // Collapse
                treeElement.style.display = 'none';
                card.classList.remove('expanded');
            } else {
                // First, collapse all other spaces
                const allSpaceCards = this.spacesGrid.querySelectorAll('.space-card:not(.new-space-card)');
                allSpaceCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherTreeElement = otherCard.querySelector('.space-tree');
                        if (otherTreeElement && otherTreeElement.style.display !== 'none') {
                            otherTreeElement.style.display = 'none';
                            otherCard.classList.remove('expanded');
                        }
                    }
                });
                
                // Then expand the clicked space and reset folder states to initial state
                treeElement.style.display = 'block';
                card.classList.add('expanded');
                
                // Reset folder expansion states to initial state
                const spaceId = parseInt(card.getAttribute('data-space-id'));
                const space = this.spaces.find(s => s.id === spaceId);
                
                if (space && space.folders) {
                    space.folders.forEach(folder => {
                        // Reset to initial state: default folder expanded, others collapsed
                        folder.isExpanded = folder.isDefault;
                    });
                    
                    // Update just the tree content without replacing the entire card
                    treeElement.innerHTML = this._createFolderTree(space.folders);
                    
                    // Re-initialize tree interactions for the updated content
                    this._initializeTreeInteractions();
                }
            }
        },

        _initializeTreeInteractions() {
            if (!this.spacesGrid) return;
            
            // Remove existing tree click handler to prevent duplicates
            if (this.spacesGrid.treeClickHandler) {
                this.spacesGrid.removeEventListener('click', this.spacesGrid.treeClickHandler);
            }
            
            // Create tree click handler
            const treeClickHandler = (e) => {
                // Ignore clicks during drag operations
                if (document.querySelector('.dragging')) {
                    return;
                }
                
                this._handleTreeClick(e);
            };
            
            // Store handler for cleanup
            this.spacesGrid.treeClickHandler = treeClickHandler;
            
            // Add event listener
            this.spacesGrid.addEventListener('click', treeClickHandler);
            
            // Handle favicon errors
            const treeErrorHandler = (e) => {
                if (e.target.classList.contains('tab-favicon')) {
                    e.target.style.display = 'none';
                }
            };
            
            this.spacesGrid.addEventListener('error', treeErrorHandler, true);
        },

        _handleTreeClick(e) {
            const target = e.target;
            
            // Handle folder expansion/collapse
            if (target.closest('.tree-folder-header') && 
                !target.closest('.tree-actions') && 
                !target.closest('.folder-drag-handle')) {
                
                this._toggleFolder(target.closest('.tree-folder'));
                return;
            }
            
            // Handle action buttons
            if (target.closest('.tree-action-btn')) {
                e.stopPropagation();
                this._handleActionButton(target.closest('.tree-action-btn'));
                return;
            }
        },

        _toggleFolder(folderElement) {
            if (!folderElement) return;
            
            const folderContent = folderElement.querySelector('.tree-folder-content');
            const folderIcon = folderElement.querySelector('.tree-icon svg');
            const isExpanded = folderContent.style.display !== 'none';
            
            if (isExpanded) {
                // Collapse
                folderContent.style.display = 'none';
                folderElement.classList.remove('expanded');
                folderElement.classList.add('collapsed');
                if (folderIcon) {
                    folderIcon.innerHTML = '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>';
                }
            } else {
                // Expand
                folderContent.style.display = 'block';
                folderElement.classList.remove('collapsed');
                folderElement.classList.add('expanded');
                if (folderIcon) {
                    folderIcon.innerHTML = '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z"/>';
                }
            }
        },

        _handleActionButton(btn) {
            if (btn.classList.contains('load-btn')) {
                const isFolder = btn.closest('.tree-folder-header');
                const isTab = btn.closest('.tree-tab');
                
                if (isFolder) {
                    const folderName = btn.closest('.tree-folder').querySelector('.tree-label').textContent;
                    console.log('Load folder:', folderName);
                    // TODO: Implement folder loading functionality
                } else if (isTab) {
                    const tabTitle = btn.closest('.tree-tab').querySelector('.tree-label').textContent;
                    console.log('Load tab:', tabTitle);
                    // TODO: Implement tab loading functionality
                }
            } else if (btn.classList.contains('add-tab-btn')) {
                const folderElement = btn.closest('.tree-folder');
                if (folderElement) {
                    const folderName = folderElement.querySelector('.tree-label').textContent;
                    console.log('Add tab to folder:', folderName);
                    // TODO: Implement add tab to folder functionality
                }
            } else if (btn.classList.contains('options-btn')) {
                const isFolder = btn.closest('.tree-folder-header');
                const isTab = btn.closest('.tree-tab');
                
                if (isFolder) {
                    const folderName = btn.closest('.tree-folder').querySelector('.tree-label').textContent;
                    console.log('Folder options:', folderName);
                    // TODO: Implement folder options menu
                } else if (isTab) {
                    const tabTitle = btn.closest('.tree-tab').querySelector('.tree-label').textContent;
                    console.log('Tab options:', tabTitle);
                    // TODO: Implement tab options menu
                }
            }
        },

        _createFolderTree(folders) {
            return folders.map((folder, folderIndex) => {
                const isFolderExpanded = folder.isExpanded !== undefined ? folder.isExpanded : folder.isDefault;
                const folderState = isFolderExpanded ? 'expanded' : 'collapsed';
                const folderIcon = isFolderExpanded ? 'folder_open' : 'folder';
                
                return `
                    <div class="tree-folder ${folderState}" data-folder="${folderIndex}">
                        <div class="tree-folder-header" data-drop-zone="folder">
                            ${!folder.isDefault ? `
                            <div class="folder-drag-handle" draggable="true" title="Drag to reorder folder">
                                <img src="icons/drag_handle.svg" width="16" height="16">
                            </div>
                            ` : `
                            <div class="folder-drag-handle-spacer"></div>
                            `}
                            <div class="tree-indent">
                                <div class="tree-icon">
                                    <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                                        ${folderIcon === 'folder_open' ? 
                                            '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z"/>' :
                                            '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>'
                                        }
                                    </svg>
                                </div>
                            </div>
                            <div class="tree-label">${folder.name}</div>
                            <div class="tree-actions">
                                <button class="tree-action-btn add-tab-btn" title="Add tab to folder">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                                </button>
                                <button class="tree-action-btn load-btn" title="Load folder">
                                    <img src="icons/load_up.svg" width="14" height="14" style="color: currentColor;">
                                </button>
                                <button class="tree-action-btn options-btn" title="Folder options">
                                    <img src="icons/more-vertical.svg" width="14" height="14" style="color: currentColor;">
                                </button>
                            </div>
                        </div>
                        <div class="tree-folder-content" style="display: ${isFolderExpanded ? 'block' : 'none'};">
                            ${folder.tabs ? this._createTabList(folder.tabs) : ''}
                        </div>
                        </div>
                    `;
            }).join('');
        },

        _createTabList(tabs) {
            return tabs.map(tab => `
                <div class="tree-tab" data-tab-id="${tab.tabId}" data-drop-zone="tab">
                    <div class="tab-drag-handle" draggable="true" title="Drag to reorder tab">
                        <img src="icons/drag_handle.svg" width="16" height="16">
                    </div>
                    <div class="tree-indent">
                        <div class="tree-icon">
                            <img src="${tab.favicon}" alt="" width="16" height="16" class="tab-favicon">
                        </div>
                    </div>
                    <div class="tree-label" title="${tab.title}">${tab.title}</div>
                    <div class="tree-actions">
                        <button class="tree-action-btn load-btn" title="Load tab">
                            <img src="icons/load_up.svg" width="14" height="14" style="color: currentColor;">
                        </button>
                        <button class="tree-action-btn options-btn" title="Tab options">
                            <img src="icons/more-vertical.svg" width="14" height="14" style="color: currentColor;">
                        </button>
                    </div>
                </div>
            `).join('');
        },

        _createNewSpaceCard() {
            const card = document.createElement('div');
            card.className = 'space-card new-space-card';
            
            card.innerHTML = `
                <div class="new-space-icon">+</div>
                <div class="new-space-content">
                    <div class="new-space-title">New Space</div>
                    <div class="new-space-subtitle">Organize your tabs</div>
                </div>
            `;
            
            return card;
        }
    }

    // new essential modal handlers
    const UI_NEW_ESSENTIAL_MODAL = {
        modal: document.getElementById('add-essential-modal'),
        form: document.getElementById('add-essential-form'),
        urlInput: document.getElementById('essential-url'),
        urlError: document.getElementById('url-error'),
        cancelBtn: document.getElementById('cancel-essential'),
        submitBtn: document.getElementById('add-essential-submit'),
        faviconPreview: document.getElementById('favicon-preview'),
        faviconImg: document.getElementById('favicon-img'),
        
        // Internal state
        _faviconLoadTimeout: null,
        _faviconCache: new Map(),

        init() {

            // Hide modal when cancel button is clicked
            if (this.cancelBtn) {
                this.cancelBtn.addEventListener('click', () => {
                    this.hide();
                });
            }

            // Hide modal when clicking outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });

            // Handle form submission
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this._handleSubmit();
            });

            // Real-time URL validation and favicon loading
            if (this.urlInput) {
                this.urlInput.addEventListener('input', () => {
                    this._clearUrlError();
                    this._validateUrl();
                    this._debouncedLoadFavicon();
                });
                
                this.urlInput.addEventListener('paste', () => {
                    setTimeout(() => {
                        this._clearUrlError();
                        this._validateUrl();
                        this._debouncedLoadFavicon();
                    }, 50);
                });
            }

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal && this.modal.style.display !== 'none') {
                    this.hide();
                }
            });
        },

        show() {
            document.getElementById('add-essential-modal').style.display = 'flex';

            setTimeout(() => {
                if (this.urlInput) {
                    this.urlInput.focus();
                }
            }, 100);
        },

        hide() {
            if (this.modal) {
                this.modal.style.display = 'none';
            }
            
            if (this.form) {
                this.form.reset();
                this._clearUrlError();
                this._resetFaviconPreview();
            }
        },

        _validateUrl() {
            if (!this.urlInput || !this.submitBtn) return false;

            const url = this.urlInput.value.trim();
            
            if (!url) {
                this.submitBtn.disabled = true;
                return false;
            }

            try {
                new URL(url);
                this.submitBtn.disabled = false;
                return true;
            } catch {
                if (url && !url.includes(' ') && url.includes('.')) {
                    this.urlInput.value = `https://${url}`;
                    this.submitBtn.disabled = false;
                    return true;
                }
                
                this._showUrlError('Please enter a valid URL (e.g., https://example.com)');
                this.submitBtn.disabled = true;
                return false;
            }
        },

        _showUrlError(message) {
            if (this.urlError) {
                this.urlError.textContent = message;
                this.urlError.style.display = 'block';
            }
        },

        _clearUrlError() {
            if (this.urlError) {
                this.urlError.style.display = 'none';
                this.urlError.textContent = '';
            }
        },

        async _handleSubmit() {
            if (!this.urlInput) return;

            const url = this.urlInput.value.trim();
            const favicon = this.faviconImg.src;
            
            if (!this._validateUrl()) {
                return;
            }

            if (this.submitBtn) {
                this.submitBtn.disabled = true;
                this.submitBtn.textContent = 'Adding...';
            }
            
            MessageBanner.loading('Adding essential...');

            try {
                const response = await chrome.runtime.sendMessage({
                    type: 'addEssential',
                    url: url,
                    favicon: favicon
                });

                if (response.success) {
                    MessageBanner.success('Essential added successfully!');

                    // get dashboard data
                    chrome.runtime.sendMessage({ type: 'refreshTabData', fresh: true });
                } else {
                    MessageBanner.error(response.error || 'Failed to add essential');
                }
            } catch (error) {
                console.error('Add essential error:', error);
                MessageBanner.error('Failed to add essential. Please try again.');
                
                if (this.submitBtn) {
                    this.submitBtn.disabled = false;
                    this.submitBtn.textContent = 'Add Essential';
                }
            } finally {
                setTimeout(async () => {
                    this.hide();
                    MessageBanner.hide();

                    if (this.submitBtn) {
                        this.submitBtn.disabled = false;
                        this.submitBtn.textContent = 'Add Essential';
                    }
                }, 1500);
            }
        },

        _debouncedLoadFavicon() {
            if (this._faviconLoadTimeout) {
                clearTimeout(this._faviconLoadTimeout);
            }
            
            this._faviconLoadTimeout = setTimeout(() => {
                this._loadFavicon();
            }, 500);
        },

        _loadFavicon() {
            if (!this.urlInput || !this.faviconPreview || !this.faviconImg) return;

            const url = this.urlInput.value.trim();
            
            if (!url) {
                this._resetFaviconPreview();
                return;
            }

            let validUrl;
            try {
                validUrl = new URL(url);
            } catch {
                if (url && !url.includes(' ') && url.includes('.')) {
                    try {
                        validUrl = new URL(`https://${url}`);
                    } catch {
                        this._resetFaviconPreview();
                        return;
                    }
                } else {
                    this._resetFaviconPreview();
                    return;
                }
            }

            const cacheKey = validUrl.hostname.toLowerCase();
            if (this._faviconCache.has(cacheKey)) {
                const cachedFavicon = this._faviconCache.get(cacheKey);
                if (cachedFavicon) {
                    this._setFaviconLoaded(cachedFavicon);
                } else {
                    this._setFaviconError();
                }
                return;
            }

            this._setFaviconLoading();

            const specialFavicon = this._getSpecialDomainFavicon(validUrl);
            if (specialFavicon) {
                const testImg = new Image();
                testImg.onload = () => {
                    this._setFaviconLoaded(specialFavicon);
                };
                testImg.onerror = () => {
                    this._tryStandardFavicon(validUrl);
                };
                testImg.src = specialFavicon;
            } else {
                this._tryStandardFavicon(validUrl);
            }
        },

        _getSpecialDomainFavicon(validUrl) {
            const hostname = validUrl.hostname.toLowerCase();
            
            const specialDomains = {
                'mail.google.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
                'gmail.com': 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
                'calendar.google.com': 'https://calendar.google.com/googlecalendar/images/favicon_v2014_4.ico',
                'drive.google.com': 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
                'docs.google.com': 'https://ssl.gstatic.com/docs/common/product/docs_app_icon2.png',
                'sheets.google.com': 'https://ssl.gstatic.com/docs/common/product/sheets_app_icon2.png',
                'slides.google.com': 'https://ssl.gstatic.com/docs/common/product/slides_app_icon2.png',
                'photos.google.com': 'https://ssl.gstatic.com/social/photosui/images/favicon/favicon_square_32.png',
                'analytics.google.com': 'https://www.google.com/analytics/web/images/favicon.ico',
                'stackoverflow.com': 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
                'github.com': 'https://github.com/favicon.ico',
                'linkedin.com': 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
                'twitter.com': 'https://abs.twimg.com/favicons/twitter.2.ico',
                'x.com': 'https://abs.twimg.com/favicons/twitter.2.ico',
                'facebook.com': 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico',
                'instagram.com': 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhH.ico',
                'youtube.com': 'https://www.youtube.com/s/desktop/12d6b690/img/favicon_32x32.png',
                'netflix.com': 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
                'spotify.com': 'https://open.spotify.com/favicon.ico',
                'reddit.com': 'https://www.redditstatic.com/shreddit/assets/favicon/64x64.png',
                'discord.com': 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.ico',
                'slack.com': 'https://a.slack-edge.com/80588/img/icons/favicon-32.png',
                'notion.so': 'https://www.notion.so/images/favicon.ico',
                'figma.com': 'https://static.figma.com/app/icon/1/favicon.png'
            };
            
            if (specialDomains[hostname]) {
                return specialDomains[hostname];
            }
            
            for (const domain in specialDomains) {
                if (hostname.endsWith('.' + domain) || hostname === domain) {
                    return specialDomains[domain];
                }
            }
            
            return null;
        },

        _tryStandardFavicon(validUrl) {
            const faviconUrl = `${validUrl.protocol}//${validUrl.hostname}/favicon.ico`;
            
            const testImg = new Image();
            testImg.onload = () => {
                this._setFaviconLoaded(faviconUrl);
            };
            testImg.onerror = () => {
                this._tryAlternativeFavicons(validUrl);
            };
            testImg.src = faviconUrl;
        },

        _tryAlternativeFavicons(validUrl) {
            const alternatives = [
                `${validUrl.protocol}//${validUrl.hostname}/favicon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/favicon.svg`,
                `${validUrl.protocol}//${validUrl.hostname}/apple-touch-icon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/apple-touch-icon-precomposed.png`,
                `${validUrl.protocol}//${validUrl.hostname}/icon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/icon.svg`,
                `${validUrl.protocol}//${validUrl.hostname}/images/favicon.ico`,
                `${validUrl.protocol}//${validUrl.hostname}/images/favicon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/assets/favicon.ico`,
                `${validUrl.protocol}//${validUrl.hostname}/assets/favicon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/static/favicon.ico`,
                `${validUrl.protocol}//${validUrl.hostname}/static/favicon.png`,
                `${validUrl.protocol}//${validUrl.hostname}/favicon-32x32.png`,
                `${validUrl.protocol}//${validUrl.hostname}/favicon-16x16.png`,
                `${validUrl.protocol}//${validUrl.hostname}/android-chrome-192x192.png`,
                `${validUrl.protocol}//${validUrl.hostname}/apple-touch-icon-152x152.png`
            ];

            let currentIndex = 0;

            const tryNext = () => {
                if (currentIndex >= alternatives.length) {
                    this._tryFaviconServices(validUrl);
                    return;
                }

                const testImg = new Image();
                testImg.onload = () => {
                    this._setFaviconLoaded(alternatives[currentIndex]);
                };
                testImg.onerror = () => {
                    currentIndex++;
                    tryNext();
                };
                testImg.src = alternatives[currentIndex];
            };

            tryNext();
        },

        _tryFaviconServices(validUrl) {
            const faviconServices = [
                `https://www.google.com/s2/favicons?domain=${validUrl.hostname}&sz=128`,
                `https://www.google.com/s2/favicons?domain=${validUrl.hostname}&sz=64`,
                `https://www.google.com/s2/favicons?domain=${validUrl.hostname}&sz=32`,
                `https://www.google.com/s2/favicons?domain=${validUrl.host}&sz=64`,
                `https://icons.duckduckgo.com/ip3/${validUrl.hostname}.ico`,
                `https://favicons.githubusercontent.com/${validUrl.hostname}`,
                ...(validUrl.hostname.startsWith('www.') ? [] : [
                    `https://www.google.com/s2/favicons?domain=www.${validUrl.hostname}&sz=64`,
                    `https://icons.duckduckgo.com/ip3/www.${validUrl.hostname}.ico`
                ])
            ];

            let serviceIndex = 0;

            const tryNextService = () => {
                if (serviceIndex >= faviconServices.length) {
                    this._setFaviconError();
                    return;
                }

                const testImg = new Image();
                testImg.onload = function() {
                    if (this.width > 0 && this.height > 0) {
                        UI_NEW_ESSENTIAL_MODAL._setFaviconLoaded(faviconServices[serviceIndex]);
                    } else {
                        serviceIndex++;
                        tryNextService();
                    }
                };
                testImg.onerror = () => {
                    serviceIndex++;
                    tryNextService();
                };
                testImg.src = faviconServices[serviceIndex];
            };

            tryNextService();
        },

        _setFaviconLoading() {
            const faviconPlaceholder = this.faviconPreview?.querySelector('.favicon-placeholder');
            
            if (!this.faviconPreview || !this.faviconImg || !faviconPlaceholder) return;

            this.faviconPreview.classList.add('loading');
            this.faviconImg.style.display = 'none';
            faviconPlaceholder.style.display = 'flex';
            faviconPlaceholder.textContent = '⏳';

            if (this.submitBtn) {
                this.submitBtn.disabled = true;
                this.submitBtn.style.opacity = '0.6';
            }
            if (this.cancelBtn) {
                this.cancelBtn.disabled = true;
                this.cancelBtn.style.opacity = '0.6';
            }
        },

        _setFaviconLoaded(faviconUrl) {
            const faviconPlaceholder = this.faviconPreview?.querySelector('.favicon-placeholder');
            
            if (!this.faviconPreview || !this.faviconImg || !faviconPlaceholder) return;

            this.faviconPreview.classList.remove('loading');
            this.faviconImg.src = faviconUrl;
            this.faviconImg.style.display = 'block';
            faviconPlaceholder.style.display = 'none';

            if (this.cancelBtn) {
                this.cancelBtn.disabled = false;
                this.cancelBtn.style.opacity = '1';
            }
            if (this.submitBtn) {
                const isValidUrl = this._validateUrl();
                this.submitBtn.disabled = !isValidUrl;
                this.submitBtn.style.opacity = isValidUrl ? '1' : '0.6';
            }

            if (this.urlInput) {
                const url = this.urlInput.value.trim();
                try {
                    const validUrl = new URL(url.includes('://') ? url : `https://${url}`);
                    const cacheKey = validUrl.hostname.toLowerCase();
                    this._faviconCache.set(cacheKey, faviconUrl);
                } catch (e) {
                    // Ignore cache errors
                }
            }
        },

        _setFaviconError() {
            const faviconPlaceholder = this.faviconPreview?.querySelector('.favicon-placeholder');
            
            if (!this.faviconPreview || !this.faviconImg || !faviconPlaceholder) return;

            this.faviconPreview.classList.remove('loading');
            this.faviconImg.style.display = 'none';
            faviconPlaceholder.style.display = 'flex';
            faviconPlaceholder.textContent = '🌐';

            if (this.cancelBtn) {
                this.cancelBtn.disabled = false;
                this.cancelBtn.style.opacity = '1';
            }
            if (this.submitBtn) {
                const isValidUrl = this._validateUrl();
                this.submitBtn.disabled = !isValidUrl;
                this.submitBtn.style.opacity = isValidUrl ? '1' : '0.6';
            }

            if (this.urlInput) {
                const url = this.urlInput.value.trim();
                try {
                    const validUrl = new URL(url.includes('://') ? url : `https://${url}`);
                    const cacheKey = validUrl.hostname.toLowerCase();
                    this._faviconCache.set(cacheKey, null);
                } catch (e) {
                    // Ignore cache errors
                }
            }
        },

        _resetFaviconPreview() {
            const faviconPlaceholder = this.faviconPreview?.querySelector('.favicon-placeholder');
            
            if (!this.faviconPreview || !this.faviconImg || !faviconPlaceholder) return;

            if (this._faviconLoadTimeout) {
                clearTimeout(this._faviconLoadTimeout);
                this._faviconLoadTimeout = null;
            }

            this.faviconPreview.classList.remove('loading');
            this.faviconImg.style.display = 'none';
            this.faviconImg.src = '';
            faviconPlaceholder.style.display = 'flex';
            faviconPlaceholder.textContent = '🌐';

            if (this.cancelBtn) {
                this.cancelBtn.disabled = false;
                this.cancelBtn.style.opacity = '1';
            }
            if (this.submitBtn) {
                this.submitBtn.disabled = true;
                this.submitBtn.style.opacity = '0.6';
            }
        }
    }

    UI_NEW_ESSENTIAL_MODAL.init();

});
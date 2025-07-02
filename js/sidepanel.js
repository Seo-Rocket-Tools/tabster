document.addEventListener('DOMContentLoaded', function() {

    console.log('SIDEPANEL LOADED...')

    /* SECTION INITIALIZATION */

    let CURRENT_USER = null;

    // Dummy spaces data
    const DUMMY_SPACES = [
        {
            id: 1,
            name: 'Work',
            description: 'Professional workspace',
            emoji: '💼',
            color: '#3B82F6',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 11231231231,
                            title: 'Gmail',
                            url: 'https://mail.google.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231232,
                            title: 'Google Calendar',
                            url: 'https://calendar.google.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://calendar.google.com/googlecalendar/images/favicon_v2014_4.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231233,
                            title: 'Slack',
                            url: 'https://app.slack.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://a.slack-edge.com/80588/img/icons/favicon-32.png',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Project Alpha',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 11231231234,
                            title: 'GitHub - Project Alpha',
                            url: 'https://github.com/company/project-alpha',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://github.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231235,
                            title: 'Figma - Alpha Designs',
                            url: 'https://www.figma.com/file/alpha-designs',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://static.figma.com/app/icon/1/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231236,
                            title: 'Jira - Alpha Board',
                            url: 'https://company.atlassian.net/jira/software/projects/ALPHA',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://company.atlassian.net/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231237,
                            title: 'Confluence - Alpha Docs',
                            url: 'https://company.atlassian.net/wiki/spaces/ALPHA',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://company.atlassian.net/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Analytics',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 11231231238,
                            title: 'Google Analytics',
                            url: 'https://analytics.google.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.google.com/analytics/web/images/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231239,
                            title: 'Mixpanel Dashboard',
                            url: 'https://mixpanel.com/report/dashboard',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://mixpanel.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 11231231240,
                            title: 'DataDog Metrics',
                            url: 'https://app.datadoghq.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://app.datadoghq.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Personal',
            description: 'Personal browsing',
            emoji: '🏠',
            color: '#10B981',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 21231231231,
                            title: 'Gmail - Personal',
                            url: 'https://mail.google.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231232,
                            title: 'Google Drive',
                            url: 'https://drive.google.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Finance',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 21231231235,
                            title: 'Bank Account',
                            url: 'https://online.mybank.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://online.mybank.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: 'Research',
            description: 'Learning and research',
            emoji: '📚',
            color: '#8B5CF6',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 31231231231,
                            title: 'Google Scholar',
                            url: 'https://scholar.google.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://scholar.google.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: 'Shopping',
            description: 'Online shopping tabs',
            emoji: '🛒',
            color: '#F59E0B',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 41231231231,
                            title: 'Amazon',
                            url: 'https://amazon.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://amazon.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        },
        {
            id: 5,
            name: 'Entertainment',
            description: 'Movies, music, and fun',
            emoji: '🎬',
            color: '#EF4444',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 51231231231,
                            title: 'Netflix',
                            url: 'https://netflix.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://netflix.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: 'Social',
            description: 'Social media and chat',
            emoji: '💬',
            color: '#06B6D4',
            folders: [
                {
                    name: 'Default Tabs',
                    isDefault: true,
                    tabs: [
                        {
                            tabId: 61231231231,
                            title: 'Twitter / X',
                            url: 'https://x.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://x.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        }
    ];

    const DUMMY_ESSENTIALS = [
        {
            url: 'https://google.com',
            title: 'Google',
            favicon: 'https://www.google.com/favicon.ico',
            fallback: 'G'
        },
        {
            url: 'https://github.com',
            title: 'GitHub', 
            favicon: 'https://github.com/favicon.ico',
            fallback: 'GH'
        },
        {
            url: 'https://gmail.com',
            title: 'Gmail',
            favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
            fallback: 'GM'
        },
        {
            url: 'https://youtube.com',
            title: 'YouTube',
            favicon: 'https://www.youtube.com/favicon.ico',
            fallback: 'YT'
        },
        {
            url: 'https://stackoverflow.com',
            title: 'Stack Overflow',
            favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
            fallback: 'SO'
        }
    ]

    /* SECTION POPUP INITIALIZATION */
    async function initializePopup() {
        if (await checkUserAuth()) {
            UI_DASHBOARD_DATA.loading();
            showScreen('dashboard');
            UI_DASHBOARD_DATA.updateData({userData: CURRENT_USER});

            setTimeout(() => {
                UI_DASHBOARD_DATA.updateData({essentials: DUMMY_ESSENTIALS, spaces: DUMMY_SPACES});
            }, 1000);
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
                setTimeout(() => {
                    // updateMainDashboard(response.userData);
                    UI_DASHBOARD_DATA.loading();
                    CURRENT_USER = response.userData;
                    console.log(CURRENT_USER);
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

    // handle logout
    document.getElementById('logout-btn-dropdown').addEventListener('click', async (e) => {
        e.preventDefault();
        await chrome.runtime.sendMessage({ type: 'signout' });
        MessageBanner.success('Signed out successfully.');
        showScreen('welcome');
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
                        const essentialItem = document.createElement('div');
                        essentialItem.className = 'essential-item';
                        essentialItem.setAttribute('data-url', essential.url);
                        essentialItem.setAttribute('title', essential.title);
                        
                        essentialItem.innerHTML = `
                            <div class="essential-icon">
                                <img src="${essential.favicon}" alt="${essential.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                <div class="fallback-icon" style="display: none;">${essential.title.substring(0, 2).toUpperCase()}</div>
                            </div>
                        `;
                        
                        this.essentialsGrid.appendChild(essentialItem);
                    });
                    
                    // Add "Add Essential" button at the end
                    const addEssentialItem = document.createElement('div');
                    addEssentialItem.className = 'essential-item add-essential';
                    addEssentialItem.setAttribute('title', 'Add Essential');
                    
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
                // Clear existing skeleton cards and populate with actual spaces
                if (this.spacesGrid) {
                    this.spacesGrid.innerHTML = ''; // Clear existing content
                    
                    // Render each space card
                    spaces.forEach(space => {
                        const spaceCard = this._createSpaceCard(space);
                        this.spacesGrid.appendChild(spaceCard);
                    });
                    
                    // Add "New Space" card at the end
                    const newSpaceCard = this._createNewSpaceCard();
                    this.spacesGrid.appendChild(newSpaceCard);
                    
                    // Initialize space interactions
                    this._initializeSpaceInteractions();
                }
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
        
        _createSpaceCard(space) {
            const card = document.createElement('div');
            card.className = 'space-card';
            card.setAttribute('data-space-id', space.id);
            
            card.innerHTML = `
                <div class="space-card-header" data-space-id="${space.id}">
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
                <div class="space-tree" style="display: none;">
                    ${space.folders ? this._createFolderTree(space.folders) : ''}
                </div>
            `;
            
            // Apply custom color styling to the space icon
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
            
            return card;
        },

        _createFolderTree(folders) {
            return folders.map((folder, folderIndex) => {
                const isFolderExpanded = folder.isDefault || false; // Default folders start expanded
                const folderState = isFolderExpanded ? 'expanded' : 'collapsed';
                const folderIcon = isFolderExpanded ? 'folder_open' : 'folder';
                
                return `
                    <div class="tree-folder ${folderState}" data-folder="${folderIndex}">
                        <div class="tree-folder-header" data-drop-zone="folder">
                            <div class="folder-drag-handle-spacer"></div>
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
                    <div class="tab-drag-handle-spacer"></div>
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
            
            // Add click event listener for creating new space
            card.addEventListener('click', () => {
                console.log('Create new space clicked'); // Placeholder for future implementation
            });
            
            return card;
        },

        _initializeSpaceInteractions() {
            if (!this.spacesGrid) return;
            
            // Remove existing event listeners to prevent duplicates
            if (this.spacesGrid._spaceClickHandler) {
                this.spacesGrid.removeEventListener('click', this.spacesGrid._spaceClickHandler);
            }
            if (this.spacesGrid._spaceErrorHandler) {
                this.spacesGrid.removeEventListener('error', this.spacesGrid._spaceErrorHandler, true);
            }
            
            // Create new click handler
            const spaceClickHandler = (e) => {
                this._handleSpaceClick(e);
            };
            
            // Create error handler for favicon images
            const spaceErrorHandler = (e) => {
                if (e.target.classList.contains('tab-favicon')) {
                    e.target.style.display = 'none';
                }
            };
            
            // Store handler references for cleanup
            this.spacesGrid._spaceClickHandler = spaceClickHandler;
            this.spacesGrid._spaceErrorHandler = spaceErrorHandler;
            
            // Add event listeners
            this.spacesGrid.addEventListener('click', spaceClickHandler);
            this.spacesGrid.addEventListener('error', spaceErrorHandler, true);
        },

        _handleSpaceClick(e) {
            const target = e.target;
            
            // Handle space card header clicks for expansion/collapse
            if (target.closest('.space-card-header') && !target.closest('.space-actions')) {
                const spaceCard = target.closest('.space-card');
                if (spaceCard && !spaceCard.classList.contains('new-space-card')) {
                    this._toggleSpaceExpansion(spaceCard);
                }
                return;
            }
            
            // Handle folder header clicks for expansion/collapse
            if (target.closest('.tree-folder-header') && !target.closest('.tree-actions')) {
                const folderElement = target.closest('.tree-folder');
                if (folderElement) {
                    this._toggleFolderExpansion(folderElement);
                }
                return;
            }
            
            // Handle action button clicks
            if (target.closest('.tree-action-btn')) {
                e.stopPropagation();
                this._handleActionButton(target.closest('.tree-action-btn'));
                return;
            }
        },

        _toggleSpaceExpansion(spaceCard) {
            const treeElement = spaceCard.querySelector('.space-tree');
            const isExpanded = treeElement.style.display !== 'none';
            
            if (isExpanded) {
                // Collapse this space
                treeElement.style.display = 'none';
                spaceCard.classList.remove('expanded');
            } else {
                // Collapse all other spaces first
                const allSpaceCards = this.spacesGrid.querySelectorAll('.space-card:not(.new-space-card)');
                allSpaceCards.forEach(otherCard => {
                    if (otherCard !== spaceCard) {
                        const otherTreeElement = otherCard.querySelector('.space-tree');
                        if (otherTreeElement && otherTreeElement.style.display !== 'none') {
                            otherTreeElement.style.display = 'none';
                            otherCard.classList.remove('expanded');
                        }
                    }
                });
                
                // Expand the clicked space
                treeElement.style.display = 'block';
                spaceCard.classList.add('expanded');
            }
        },

        _toggleFolderExpansion(folderElement) {
            const folderContent = folderElement.querySelector('.tree-folder-content');
            const folderIcon = folderElement.querySelector('.tree-icon svg');
            const isExpanded = folderContent.style.display !== 'none';
            
            if (isExpanded) {
                // Collapse folder
                folderContent.style.display = 'none';
                folderElement.classList.remove('expanded');
                folderElement.classList.add('collapsed');
                folderIcon.innerHTML = '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>';
            } else {
                // Expand folder
                folderContent.style.display = 'block';
                folderElement.classList.remove('collapsed');
                folderElement.classList.add('expanded');
                folderIcon.innerHTML = '<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z"/>';
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
        }
    }
});
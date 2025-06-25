// Minimal Tabster Sidepanel - UI Only (Authentication + Dummy Data)
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

    // Dummy spaces data
    const dummySpaces = [
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
                        },
                        {
                            tabId: 21231231233,
                            title: 'Google Photos',
                            url: 'https://photos.google.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://ssl.gstatic.com/social/photosui/images/favicon/favicon_square_32.png',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231234,
                            title: 'WhatsApp Web',
                            url: 'https://web.whatsapp.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://web.whatsapp.com/favicon.ico',
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
                        },
                        {
                            tabId: 21231231236,
                            title: 'Credit Card Portal',
                            url: 'https://creditcard.provider.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://creditcard.provider.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231237,
                            title: 'Investment Portfolio',
                            url: 'https://portfolio.investment.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://portfolio.investment.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Health',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 21231231238,
                            title: 'MyFitnessPal',
                            url: 'https://www.myfitnesspal.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.myfitnesspal.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231239,
                            title: 'Doctor Portal',
                            url: 'https://patient.myhealth.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://patient.myhealth.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231240,
                            title: 'Pharmacy Online',
                            url: 'https://www.pharmacy.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.pharmacy.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231241,
                            title: 'Meditation App',
                            url: 'https://app.headspace.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://app.headspace.com/favicon.ico',
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
                        },
                        {
                            tabId: 31231231232,
                            title: 'Wikipedia',
                            url: 'https://wikipedia.org',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://wikipedia.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231233,
                            title: 'Notion - Research Notes',
                            url: 'https://notion.so/research-workspace',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.notion.so/images/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'AI & Machine Learning',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 31231231234,
                            title: 'arXiv.org',
                            url: 'https://arxiv.org',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://arxiv.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231235,
                            title: 'Papers with Code',
                            url: 'https://paperswithcode.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://paperswithcode.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231236,
                            title: 'Hugging Face',
                            url: 'https://huggingface.co',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://huggingface.co/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231237,
                            title: 'OpenAI Documentation',
                            url: 'https://platform.openai.com/docs',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://platform.openai.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Web Development',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 31231231238,
                            title: 'MDN Web Docs',
                            url: 'https://developer.mozilla.org',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://developer.mozilla.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231239,
                            title: 'Stack Overflow',
                            url: 'https://stackoverflow.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://stackoverflow.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231240,
                            title: 'React Documentation',
                            url: 'https://react.dev',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://react.dev/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231241,
                            title: 'CSS-Tricks',
                            url: 'https://css-tricks.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://css-tricks.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231242,
                            title: 'CodePen',
                            url: 'https://codepen.io',
                            index: 4,
                            active: false,
                            pinned: false,
                            favicon: 'https://codepen.io/favicon.ico',
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
                        },
                        {
                            tabId: 41231231232,
                            title: 'Shopping Cart',
                            url: 'https://amazon.com/gp/cart',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://amazon.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231233,
                            title: 'Wishlist',
                            url: 'https://amazon.com/hz/wishlist/ls',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://amazon.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Electronics',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 41231231234,
                            title: 'Best Buy',
                            url: 'https://bestbuy.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://bestbuy.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231235,
                            title: 'B&H Photo',
                            url: 'https://bhphotovideo.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://bhphotovideo.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231236,
                            title: 'Newegg',
                            url: 'https://newegg.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://newegg.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231237,
                            title: 'Apple Store',
                            url: 'https://apple.com/store',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://apple.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Fashion',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 41231231238,
                            title: 'Nike',
                            url: 'https://nike.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://nike.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231239,
                            title: 'ASOS',
                            url: 'https://asos.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://asos.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231240,
                            title: 'Zara',
                            url: 'https://zara.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://zara.com/favicon.ico',
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
                        },
                        {
                            tabId: 51231231232,
                            title: 'Spotify',
                            url: 'https://open.spotify.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://open.spotify.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231233,
                            title: 'YouTube',
                            url: 'https://youtube.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://youtube.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231234,
                            title: 'Twitch',
                            url: 'https://twitch.tv',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://twitch.tv/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Gaming',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 51231231235,
                            title: 'Steam',
                            url: 'https://store.steampowered.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://store.steampowered.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231236,
                            title: 'Epic Games Store',
                            url: 'https://store.epicgames.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://store.epicgames.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231237,
                            title: 'IGN Reviews',
                            url: 'https://ign.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://ign.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231238,
                            title: 'GameSpot',
                            url: 'https://gamespot.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://gamespot.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Movies & TV',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 51231231239,
                            title: 'Disney+',
                            url: 'https://disneyplus.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://disneyplus.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231240,
                            title: 'HBO Max',
                            url: 'https://hbomax.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://hbomax.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231241,
                            title: 'IMDb',
                            url: 'https://imdb.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://imdb.com/favicon.ico',
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
                        },
                        {
                            tabId: 61231231232,
                            title: 'Facebook',
                            url: 'https://facebook.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://facebook.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231233,
                            title: 'Instagram',
                            url: 'https://instagram.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://instagram.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Professional',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 61231231234,
                            title: 'LinkedIn',
                            url: 'https://linkedin.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://linkedin.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231235,
                            title: 'LinkedIn Messages',
                            url: 'https://linkedin.com/messaging',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://linkedin.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231236,
                            title: 'GitHub Profile',
                            url: 'https://github.com/username',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://github.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231237,
                            title: 'Dribbble',
                            url: 'https://dribbble.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://dribbble.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Communities',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 61231231238,
                            title: 'Reddit',
                            url: 'https://reddit.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://reddit.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231239,
                            title: 'Discord',
                            url: 'https://discord.com/app',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://discord.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231240,
                            title: 'Hacker News',
                            url: 'https://news.ycombinator.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://news.ycombinator.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231241,
                            title: 'Product Hunt',
                            url: 'https://producthunt.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://producthunt.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231242,
                            title: 'Medium',
                            url: 'https://medium.com',
                            index: 4,
                            active: false,
                            pinned: false,
                            favicon: 'https://medium.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                }
            ]
        }
    ];

    // Initialize the app
    initializeTheme();
    setupNavigation();
    setupThemeToggle();
    setupUserMenu();
    
    // Check user authentication on sidepanel open
    checkUserAuthOnOpen();
    
    // Listen for close sidepanel message from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 
        switch (message.type) {
            case 'closeSidepanel':
                window.close();
                sendResponse({ success: true });
                break;
            default:
                break;
        }
    });

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

    

    // Helper function to update main dashboard with user data and dummy spaces
    function updateMainDashboard(userData) {
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
        
        // Update spaces grid with dummy data
        renderSpacesGrid();
    }

    // Helper function to create a space card element with expandable tree
    function createSpaceCard(space) {
        const card = document.createElement('div');
        card.className = 'space-card';
        card.setAttribute('data-space-id', space.id);
        card.setAttribute('data-index', dummySpaces.findIndex(s => s.id === space.id));
        
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                </button>
                <button class="space-menu-btn" disabled>⋯</button>
                </div>
            </div>
            <div class="space-tree" style="display: none;">
                ${space.folders ? createFolderTree(space.folders) : ''}
            </div>
        `;
        
        // Apply custom color styling to the space icon if space has a color
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
        
        // Add drag event listeners to the drag handle only
        const dragHandle = card.querySelector('.drag-handle');
        dragHandle.addEventListener('dragstart', handleDragStart);
        dragHandle.addEventListener('dragend', handleDragEnd);
        
        // Add drag over and drop listeners to the card for drop zones
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);
        
        // Add expand/collapse functionality
        const treeElement = card.querySelector('.space-tree');
        const cardHeader = card.querySelector('.space-card-header');
        
        cardHeader.addEventListener('click', (e) => {
            // Don't trigger expand if clicking on action buttons or drag handle
            if (e.target.closest('.space-actions') || e.target.closest('.drag-handle')) {
                return;
            }
            toggleSpaceExpansion(card);
        });
        
        return card;
    }

    // Helper function to create folder tree HTML
    function createFolderTree(folders) {
        return folders.map((folder, folderIndex) => {
            const isDefaultFolder = folder.isDefault;
            const folderState = isDefaultFolder ? 'expanded' : 'collapsed';
            const folderIcon = isDefaultFolder ? 'folder_open' : 'folder';
            
            return `
                <div class="tree-folder ${folderState}" data-folder="${folderIndex}">
                    <div class="tree-folder-header">
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
                    <div class="tree-folder-content" style="display: ${isDefaultFolder ? 'block' : 'none'};">
                        ${folder.tabs ? createTabList(folder.tabs) : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper function to create tab list HTML
    function createTabList(tabs) {
        return tabs.map(tab => `
            <div class="tree-tab" data-tab-id="${tab.tabId}">
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
    }

    // Function to toggle space expansion
    function toggleSpaceExpansion(card) {
        const treeElement = card.querySelector('.space-tree');
        const isExpanded = treeElement.style.display !== 'none';
        
        if (isExpanded) {
            // Collapse
            treeElement.style.display = 'none';
            card.classList.remove('expanded');
        } else {
            // Expand
            treeElement.style.display = 'block';
            card.classList.add('expanded');
        }
    }

    // Initialize tree functionality
    function initializeTreeFunctionality() {
        const spacesGrid = document.getElementById('workspaces-grid');
        
        // Remove existing tree event listeners to prevent duplicates
        if (spacesGrid.treeClickHandler) {
            spacesGrid.removeEventListener('click', spacesGrid.treeClickHandler);
        }
        if (spacesGrid.treeErrorHandler) {
            spacesGrid.removeEventListener('error', spacesGrid.treeErrorHandler, true);
        }
        
        // Create new event handlers
        const treeClickHandler = (e) => {
            const target = e.target;
            
            // Handle folder expansion/collapse
            if (target.closest('.tree-folder-header') && !target.closest('.tree-actions')) {
                const folderElement = target.closest('.tree-folder');
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
            }
            
            // Handle action buttons
            if (target.closest('.tree-action-btn')) {
                e.stopPropagation();
                const btn = target.closest('.tree-action-btn');
                
                if (btn.classList.contains('load-btn')) {
                    // Handle load action
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
                    // Handle add tab action (only for folders)
                    const folderElement = btn.closest('.tree-folder');
                    if (folderElement) {
                        const folderName = folderElement.querySelector('.tree-label').textContent;
                        console.log('Add tab to folder:', folderName);
                        // TODO: Implement add tab to folder functionality
                    }
                } else if (btn.classList.contains('options-btn')) {
                    // Handle options action
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
        };
        
        const treeErrorHandler = (e) => {
            if (e.target.classList.contains('tab-favicon')) {
                e.target.style.display = 'none';
            }
        };
        
        // Store handlers on the element for later removal
        spacesGrid.treeClickHandler = treeClickHandler;
        spacesGrid.treeErrorHandler = treeErrorHandler;
        
        // Add event listeners
        spacesGrid.addEventListener('click', treeClickHandler);
        spacesGrid.addEventListener('error', treeErrorHandler, true);
    }

    // Helper function to create the "New Space" card
    function createNewSpaceCard() {
        const card = document.createElement('div');
        card.className = 'space-card new-space-card';
        
        card.innerHTML = `
            <div class="new-space-icon">+</div>
            <div class="new-space-content">
                <div class="new-space-title">New Space</div>
                <div class="new-space-subtitle">Organize your tabs</div>
            </div>
        `;
        
        // Add click event listener properly
        card.addEventListener('click', () => showScreen('create-space-screen'));
        
        return card;
    }

    // SECTION ON SIDEPANEL OPEN FLOW

    // Check user authentication when sidepanel opens
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
            
            // User is authenticated - update dashboard with dummy data
            updateMainDashboard(response.userData);
            
        } catch (error) {
            showScreen('welcome');
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
                console.error('Sidepanel: Signout failed:', response.error);
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
            console.error('Sidepanel: Signout exception:', error);
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

    /* SECTION USER SIGNUP HANDLER */

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


    /* SECTION USER LOGIN HANDLER */

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
                    updateMainDashboard(response.userData);
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

    function handleDragStart(e) {
        // Get the parent card from the drag handle
        const card = e.target.closest('.space-card');
        draggedElement = card;
        draggedIndex = parseInt(card.getAttribute('data-index'));
        
        // Add dragging class for visual feedback to the card
        card.classList.add('dragging');
        
        // Add dragging class to container to prevent text selection
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid) {
            spacesGrid.classList.add('dragging');
        }
        
        // Create insertion line element
        createInsertionLine();
        
        // Set drag effect
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', card.outerHTML);
        
        // Create a custom drag image using the entire card
        try {
            const dragImage = card.cloneNode(true);
            dragImage.style.opacity = '0.8';
            dragImage.style.transform = 'scale(0.95)';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        } catch (error) {
            // Fallback to default drag image if custom fails
        }
    }

    function createInsertionLine() {
        insertionLine = document.createElement('div');
        insertionLine.className = 'insertion-line';
        insertionLine.style.position = 'absolute';
        insertionLine.style.width = 'calc(100% - 16px)';
        insertionLine.style.left = '8px';
        document.getElementById('workspaces-grid').appendChild(insertionLine);
    }

    function showInsertionLine(beforeElement) {
        if (!insertionLine || !beforeElement) return;
        
        const container = document.getElementById('workspaces-grid');
        const containerRect = container.getBoundingClientRect();
        const elementRect = beforeElement.getBoundingClientRect();
        
        // Position the line just above the target element
        const relativeTop = elementRect.top - containerRect.top;
        insertionLine.style.top = (relativeTop - 4) + 'px';
        insertionLine.classList.add('show');
    }

    function showInsertionLineAfter(afterElement) {
        if (!insertionLine || !afterElement) return;
        
        const container = document.getElementById('workspaces-grid');
        const containerRect = container.getBoundingClientRect();
        const elementRect = afterElement.getBoundingClientRect();
        
        // Position the line just below the target element
        const relativeTop = elementRect.bottom - containerRect.top;
        insertionLine.style.top = (relativeTop + 4) + 'px';
        insertionLine.classList.add('show');
    }

    function handleDragEnd(e) {
        // Clean up drag classes
        const allCards = document.querySelectorAll('.space-card');
        allCards.forEach(card => {
            card.classList.remove('dragging');
        });
        
        // Remove dragging class from container
        const spacesGrid = document.getElementById('workspaces-grid');
        if (spacesGrid) {
            spacesGrid.classList.remove('dragging');
        }
        
        // Remove insertion line
        if (insertionLine) {
            insertionLine.remove();
            insertionLine = null;
        }
        
        draggedElement = null;
        draggedIndex = null;
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        
        // Don't allow dropping on the new space card
        const newSpaceCard = e.target.closest('.new-space-card');
        if (newSpaceCard) {
            hideInsertionLine();
            return false;
        }
        
        e.dataTransfer.dropEffect = 'move';
        
        const dropTarget = e.target.closest('.space-card:not(.new-space-card):not(.dragging)');
        if (dropTarget && dropTarget !== draggedElement) {
            // Determine if we're in the top or bottom half of the target
            const rect = dropTarget.getBoundingClientRect();
            const midpoint = rect.top + (rect.height / 2);
            const isTopHalf = e.clientY < midpoint;
            
            if (isTopHalf) {
                showInsertionLine(dropTarget);
            } else {
                showInsertionLineAfter(dropTarget);
            }
        } else {
            hideInsertionLine();
        }
        
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        
        const dropTarget = e.target.closest('.space-card:not(.new-space-card)');
        
        // Don't allow dropping on the new space card or invalid targets
        if (!dropTarget || dropTarget.classList.contains('new-space-card') || dropTarget === draggedElement) {
            return false;
        }
        
        const dropIndex = parseInt(dropTarget.getAttribute('data-index'));
        
        if (draggedIndex !== null && dropIndex !== null && draggedIndex !== dropIndex) {
            // Determine insertion point based on drop position
            const rect = dropTarget.getBoundingClientRect();
            const midpoint = rect.top + (rect.height / 2);
            const isTopHalf = e.clientY < midpoint;
            
            let insertIndex = dropIndex;
            if (!isTopHalf && draggedIndex < dropIndex) {
                insertIndex = dropIndex;
            } else if (!isTopHalf && draggedIndex > dropIndex) {
                insertIndex = dropIndex + 1;
            } else if (isTopHalf && draggedIndex > dropIndex) {
                insertIndex = dropIndex;
            } else if (isTopHalf && draggedIndex < dropIndex) {
                insertIndex = dropIndex - 1;
            }
            
            // Reorder the spaces array
            const draggedSpace = dummySpaces[draggedIndex];
            dummySpaces.splice(draggedIndex, 1);
            dummySpaces.splice(insertIndex, 0, draggedSpace);
            
            // Re-render the spaces grid
            renderSpacesGrid();
            
            // Add success animation to the dropped item
            setTimeout(() => {
                const newCard = document.querySelector(`[data-space-id="${draggedSpace.id}"]`);
                if (newCard) {
                    newCard.classList.add('dropped');
                    setTimeout(() => {
                        newCard.classList.remove('dropped');
                    }, 400);
                }
            }, 50);
        }
        
        return false;
    }

    function hideInsertionLine() {
        if (insertionLine) {
            insertionLine.classList.remove('show');
        }
    }

    // Helper function to render the spaces grid
    function renderSpacesGrid() {
        const spacesGrid = document.getElementById('workspaces-grid');
        if (!spacesGrid) return;
        
        spacesGrid.innerHTML = '';
        
        // Create space cards using current dummy data order
        dummySpaces.forEach(space => {
            const spaceCard = createSpaceCard(space);
            spacesGrid.appendChild(spaceCard);
        });
        
        // Add "New Space" card at the end
        const newSpaceCard = createNewSpaceCard();
        spacesGrid.appendChild(newSpaceCard);
        
        // Re-initialize tree functionality for new elements
        initializeTreeFunctionality();
    }

    // Helper function to create a skeleton loading card
    function createSkeletonCard() {
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
}); 

/** CONTINUE_HERE
 * 1. cleanup and organize this file
 * 2. create and structure dummy space data
 * 3. work on the expand/collapse functionality of each space card
 * 4. list down tables and columns (structure the db)
 * 
 */
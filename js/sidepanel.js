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
                            url: 'https://creditcard.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://creditcard.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231237,
                            title: 'Investment Dashboard',
                            url: 'https://robinhood.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://robinhood.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231238,
                            title: 'Budgeting App',
                            url: 'https://mint.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://mint.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Health & Fitness',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 21231231239,
                            title: 'MyFitnessPal',
                            url: 'https://myfitnesspal.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://myfitnesspal.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231240,
                            title: 'Strava',
                            url: 'https://strava.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://strava.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231241,
                            title: 'Headspace',
                            url: 'https://headspace.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://headspace.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Travel',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 21231231242,
                            title: 'Google Maps',
                            url: 'https://maps.google.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://maps.google.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231243,
                            title: 'Airbnb',
                            url: 'https://airbnb.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://airbnb.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231244,
                            title: 'TripAdvisor',
                            url: 'https://tripadvisor.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://tripadvisor.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 21231231245,
                            title: 'Expedia',
                            url: 'https://expedia.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://expedia.com/favicon.ico',
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
                            title: 'ResearchGate',
                            url: 'https://researchgate.net',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://researchgate.net/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Online Learning',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 31231231234,
                            title: 'Coursera',
                            url: 'https://coursera.org',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://coursera.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231235,
                            title: 'Khan Academy',
                            url: 'https://khanacademy.org',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://khanacademy.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231236,
                            title: 'edX',
                            url: 'https://edx.org',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://edx.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231237,
                            title: 'Udemy',
                            url: 'https://udemy.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://udemy.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Tech Resources',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 31231231238,
                            title: 'Stack Overflow',
                            url: 'https://stackoverflow.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231239,
                            title: 'MDN Web Docs',
                            url: 'https://developer.mozilla.org',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://developer.mozilla.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231240,
                            title: 'GitHub',
                            url: 'https://github.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://github.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Documentation',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 31231231241,
                            title: 'React Docs',
                            url: 'https://react.dev',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://react.dev/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231242,
                            title: 'Node.js Docs',
                            url: 'https://nodejs.org',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://nodejs.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231243,
                            title: 'Python Docs',
                            url: 'https://docs.python.org',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://docs.python.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 31231231244,
                            title: 'CSS Tricks',
                            url: 'https://css-tricks.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://css-tricks.com/favicon.ico',
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
                            title: 'eBay',
                            url: 'https://ebay.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://ebay.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231233,
                            title: 'Target',
                            url: 'https://target.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://target.com/favicon.ico',
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
                            title: 'Newegg',
                            url: 'https://newegg.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://newegg.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231236,
                            title: 'B&H Photo',
                            url: 'https://bhphotovideo.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://bhphotovideo.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231237,
                            title: 'Micro Center',
                            url: 'https://microcenter.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://microcenter.com/favicon.ico',
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
                            title: 'Zara',
                            url: 'https://zara.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://zara.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231240,
                            title: 'H&M',
                            url: 'https://hm.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://hm.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Home & Garden',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 41231231241,
                            title: 'Home Depot',
                            url: 'https://homedepot.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://homedepot.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231242,
                            title: 'Lowes',
                            url: 'https://lowes.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://lowes.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231243,
                            title: 'IKEA',
                            url: 'https://ikea.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://ikea.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 41231231244,
                            title: 'Wayfair',
                            url: 'https://wayfair.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://wayfair.com/favicon.ico',
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
                            title: 'YouTube',
                            url: 'https://youtube.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.youtube.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231233,
                            title: 'Disney+',
                            url: 'https://disneyplus.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://disneyplus.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Streaming Services',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 51231231234,
                            title: 'Hulu',
                            url: 'https://hulu.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://hulu.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231235,
                            title: 'Prime Video',
                            url: 'https://primevideo.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://primevideo.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231236,
                            title: 'HBO Max',
                            url: 'https://hbomax.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://hbomax.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231237,
                            title: 'Apple TV+',
                            url: 'https://tv.apple.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://tv.apple.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Music',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 51231231238,
                            title: 'Spotify',
                            url: 'https://spotify.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://open.spotify.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231239,
                            title: 'Apple Music',
                            url: 'https://music.apple.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://music.apple.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231240,
                            title: 'YouTube Music',
                            url: 'https://music.youtube.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://music.youtube.com/favicon.ico',
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
                            tabId: 51231231241,
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
                            tabId: 51231231242,
                            title: 'Twitch',
                            url: 'https://twitch.tv',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://twitch.tv/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231243,
                            title: 'Epic Games',
                            url: 'https://epicgames.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://epicgames.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 51231231244,
                            title: 'IGN',
                            url: 'https://ign.com',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://ign.com/favicon.ico',
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
                            favicon: 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico',
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
                            favicon: 'https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhH.ico',
                            muted: false,
                            highlighted: false,
                        }
                    ]
                },
                {
                    name: 'Messaging',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 61231231234,
                            title: 'WhatsApp Web',
                            url: 'https://web.whatsapp.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://web.whatsapp.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231235,
                            title: 'Telegram Web',
                            url: 'https://web.telegram.org',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://web.telegram.org/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231236,
                            title: 'Discord',
                            url: 'https://discord.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231237,
                            title: 'Signal',
                            url: 'https://signal.org',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://signal.org/favicon.ico',
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
                            tabId: 61231231238,
                            title: 'LinkedIn',
                            url: 'https://linkedin.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231239,
                            title: 'Reddit',
                            url: 'https://reddit.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://www.redditstatic.com/shreddit/assets/favicon/64x64.png',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231240,
                            title: 'Slack',
                            url: 'https://slack.com',
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
                    name: 'Content Creation',
                    isDefault: false,
                    tabs: [
                        {
                            tabId: 61231231241,
                            title: 'TikTok',
                            url: 'https://tiktok.com',
                            index: 0,
                            active: false,
                            pinned: false,
                            favicon: 'https://tiktok.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231242,
                            title: 'Pinterest',
                            url: 'https://pinterest.com',
                            index: 1,
                            active: false,
                            pinned: false,
                            favicon: 'https://pinterest.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231243,
                            title: 'Snapchat',
                            url: 'https://snapchat.com',
                            index: 2,
                            active: false,
                            pinned: false,
                            favicon: 'https://snapchat.com/favicon.ico',
                            muted: false,
                            highlighted: false,
                        },
                        {
                            tabId: 61231231244,
                            title: 'Behance',
                            url: 'https://behance.net',
                            index: 3,
                            active: false,
                            pinned: false,
                            favicon: 'https://behance.net/favicon.ico',
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
});
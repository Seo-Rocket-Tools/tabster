// Tabster Background Script with Supabase ES Modules (Authentication Only)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


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

// SECTION SUPABASE CONFIGURATION

const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Custom storage adapter for Chrome extensions
const chromeStorageAdapter = {
    async getItem(key) {
        try {
            const result = await chrome.storage.local.get([key]);
            return result[key] || null;
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },

    async setItem(key, value) {
        try {
            await chrome.storage.local.set({ [key]: value });
        } catch (error) {
            console.error('Storage setItem error:', error);
        }
    },

    async removeItem(key) {
        try {
            await chrome.storage.local.remove([key]);
        } catch (error) {
            console.error('Storage removeItem error:', error);
        }
    }
};

// Initialize Supabase client with persistent storage configuration
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: chromeStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce'
    },
    global: {
        fetch: fetch,
    },
});

// SECTION Basic message handling for communication with sidepanel

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'ping':
            sendResponse({ status: 'pong' });
            break;
            
        case 'signin':
            handleSignin(message.email, message.password, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'signup':
            handleSignup(message.fullName, message.email, message.password, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'checkAuth':
            handleUserAuthCheck(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'signout':
            handleSignout(sendResponse);
            return true; // Keep message channel open for async response
            
        case 'addEssential':
            handleAddEssentialSubmit(message.url, message.favicon, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'getDashboardData':
            getDashboardData(sendResponse, message.fresh);
            return true; // Keep message channel open for async response

            default:
            console.log('Background: Unknown message type:', message.type);
            sendResponse({ status: 'unknown', message: 'Unknown message type' });
    }
    
    return true; // Keep message channel open
}); 


/* SECTION USER EVENT HANDLERS */

async function handleSignin(email, password, sendResponse) {
    try {
        // Sign in user to Supabase auth
        const signinResult = await signinUser(email, password);
        
        if (!signinResult.success) {
            console.log('Background: Signin failed:', signinResult.error);
            sendResponse({ success: false, error: signinResult.error });
            return;
        }
        
        const userId = signinResult.data.user.id;
        
        // Save session backup and user ID to Chrome local storage
        await Promise.all([
            saveSessionBackup(signinResult.data.session, signinResult.data.user)
        ]);
        
        // Get user data
        const userData = await getUserData(userId);
        
        // Check if operation was successful
        if (!userData.success) {
            console.error('Background: Failed to get user data:', userData.error);
            sendResponse({ success: false, error: 'Failed to load user data' });
            return;
        }
        
        // Send success response with user data only
        sendResponse({
            success: true,
            userData: userData.data
        });
        
    } catch (error) {
        console.error('Background: Signin exception:', error);
        sendResponse({ success: false, error: error.message || 'An unexpected error occurred' });
    }
}

async function handleSignout(sendResponse) {
    try {
        // Call the signout function
        const signoutResult = await signoutUser();
        if (!signoutResult.success) {
            console.error('Background: Signout failed:', signoutResult.error);
            sendResponse({ success: false, error: signoutResult.error });
            return;
        }
        
        // Clear all user data from Chrome storage
        await chrome.storage.local.remove([
            'tabster_current_user',
            'tabster_essentials',
            'tabster_spaces',
            'tabster_current_userId'
        ]);
        
        console.log('Background: Cleared user data from Chrome storage');
        
        // Send success response
        sendResponse({
            success: true,
            message: 'Signed out successfully'
        });
        
    } catch (error) {
        console.error('Background: Signout exception:', error);
        sendResponse({ success: false, error: error.message || 'Signout failed' });
    }
}

async function handleSignup(fullName, email, password, sendResponse) {
    try {
        // Sign up user to Supabase auth
        const signupResult = await signupUser(fullName, email, password);
        
        if (!signupResult.success) {
            console.log('Background: Signup failed:', signupResult.error);
            sendResponse({ success: false, error: signupResult.error });
            return;
        }
        
        console.log('Background: Signup successful');
        
        // Send success response
        sendResponse({
            success: true,
            message: 'Account created successfully! Please check your email for confirmation.'
        });
        
    } catch (error) {
        console.error('Background: Signup exception:', error);
        sendResponse({ success: false, error: error.message || 'An unexpected error occurred' });
    }
}

async function handleUserAuthCheck(sendResponse) {
    try {
        // Check user authentication with Supabase
        const authResult = await checkUserAuth();
        
        if (!authResult.success) {
            console.error('Background: Auth check failed:', authResult.error);
            sendResponse({ success: false, error: authResult.error });
            return;
        }
        
        if (!authResult.authenticated) {
            sendResponse({ success: true, authenticated: false });
            return;
        }
        
        // User is authenticated - get their data
        const userId = authResult.userId;
        
        // First check chrome storage for cached user data
        const cachedUserData = await new Promise((resolve) => {
            chrome.storage.local.get(['tabster_current_user'], (result) => {
                resolve(result.tabster_current_user || null);
            });
        });
        
        if (cachedUserData) {
            // Return cached data
            sendResponse({
                success: true,
                authenticated: true,
                userData: cachedUserData
            });
            return;
        }
        
        // No cached data, get from database
        const userData = await getUserData(userId);
        
        // Check if operation was successful
        if (!userData.success) {
            console.error('Background: Failed to get user data:', userData.error);
            sendResponse({ success: false, error: 'Failed to load user data' });
            return;
        }

        // Save user data to chrome storage for future use
        await new Promise((resolve) => {
            chrome.storage.local.set({ 'tabster_current_user': userData.data }, resolve);
        });
        
        // Send success response
        sendResponse({
            success: true,
            authenticated: true,
            userData: userData.data
        });
        
    } catch (error) {
        console.error('Background: Auth check exception:', error);
        sendResponse({ success: false, error: error.message || 'Authentication check failed' });
    }
}

async function handleStartup() {
    // set panel behavior to open on action click
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}

async function handleAddEssentialSubmit(url, favicon, sendResponse) {
    try {
        // Get current user ID
        const userId = await getCurrentUserId();
        
        if (!userId) {
            console.error('Background: No user ID found');
            sendResponse({ success: false, error: 'User not authenticated' });
            return;
        }

        // Get existing essentials count for display_order
        const essentialsResult = await getUserEssentials(userId);
        
        if (!essentialsResult.success) {
            console.error('Background: Failed to get essentials count:', essentialsResult.error);
            sendResponse({ success: false, error: 'Failed to get essentials data' });
            return;
        }

        const displayOrder = essentialsResult.data.length;

        // Create essential object
        const essential = {
            user_id: userId,
            url: url,
            favicon: favicon,
            display_order: displayOrder,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save essential to database
        const saveResult = await saveEssentialToDb(essential);
        
        if (!saveResult.success) {
            console.error('Background: Failed to save essential:', saveResult.error);
            sendResponse({ success: false, error: saveResult.error });
            return;
        }

        console.log('Background: Essential added successfully');
        sendResponse({
            success: true,
            message: 'Essential added successfully',
            data: saveResult.data
        });

    } catch (error) {
        console.error('Background: Add essential exception:', error);
        sendResponse({ success: false, error: error.message || 'Failed to add essential' });
    }
}

async function getDashboardData(sendResponse, fresh = false) {
    try {
        // Get user ID from Chrome storage
        const userId = await getCurrentUserId();
        
        if (!userId) {
            throw new Error('No authenticated user found');
        }

        let essentials, spaces;

        if (fresh) {
            // Fresh data requested - get from DB and update storage
            
            // Get fresh essentials from DB
            const essentialsResult = await getUserEssentials(userId);
            if (essentialsResult.success) {
                essentials = essentialsResult.data;
                await chrome.storage.local.set({ tabster_essentials: essentials });
            } else {
                throw new Error('Failed to get user essentials');
            }

            // Get fresh spaces from DB
            const spacesResult = await getUserSpaces(userId);
            if (spacesResult.success) {
                spaces = spacesResult.data;
                await chrome.storage.local.set({ tabster_spaces: spaces });
            } else {
                throw new Error('Failed to get user spaces');
            }

        } else {
            // Use cached data if available, fallback to DB

            // Check Chrome storage for essentials
            const essentialsStorage = await chrome.storage.local.get(['tabster_essentials']);
            if (essentialsStorage.tabster_essentials) {
                essentials = essentialsStorage.tabster_essentials;
            } else {
                // Call getUserEssentials and save to storage
                const essentialsResult = await getUserEssentials(userId);
                if (essentialsResult.success) {
                    essentials = essentialsResult.data;
                    await chrome.storage.local.set({ tabster_essentials: essentials });
                } else {
                    throw new Error('Failed to get user essentials');
                }
            }

            // Check Chrome storage for spaces
            const spacesStorage = await chrome.storage.local.get(['tabster_spaces']);
            if (spacesStorage.tabster_spaces) {
                spaces = spacesStorage.tabster_spaces;
            } else {
                // Call getUserSpaces and save to storage
                const spacesResult = await getUserSpaces(userId);
                if (spacesResult.success) {
                    spaces = spacesResult.data;
                    await chrome.storage.local.set({ tabster_spaces: spaces });
                } else {
                    throw new Error('Failed to get user spaces');
                }
            }
        }

        sendResponse({
            success: true,
            data: {
                essentials: essentials,
                spaces: spaces
            }
        });

    } catch (error) {
        console.error('getDashboardData error:', error);
        sendResponse({
            success: false,
            error: error.message || 'Failed to get dashboard data'
        });
    }
}



/* SECTION SUPABASE FUNCTIONS */

// Check user authentication status with Supabase
async function checkUserAuth() {
    try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Session check error:', error);
            return { success: false, error: error.message };
        }
        
        if (!session || !session.user) {
            return { success: true, authenticated: false };
        }
        
        return { success: true, authenticated: true, userId: session.user.id };
        
    } catch (error) {
        console.error('Auth check exception:', error);
        return { success: false, error: error.message };
    }
}

// Get current user id
async function getCurrentUserId() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return session.user.id;
}

// Sign in user to Supabase auth
async function signinUser(email, password) {
    try {
        console.log('Attempting to sign in user:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.log('Sign in error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Sign in exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign out user and clean up all stored data
async function signoutUser() {
    try {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Supabase signout error:', error);
            // Continue with cleanup even if Supabase signout fails
        }
        
        // Clear all stored data
        await Promise.all([
            clearSessionBackup(),
        ]);
        
        return { success: true };
        
    } catch (error) {
        console.error('Signout exception:', error);
        return { success: false, error: error.message };
    }
}

// Sign up user to Supabase auth
async function signupUser(fullName, email, password) {
    try {
        console.log('Attempting to sign up user:', email);
        
        // Supabase auth will handle duplicate email validation automatically
        
        // Get the confirmation page URL from the extension
        const confirmationUrl = chrome.runtime.getURL('confirmation.html');
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: confirmationUrl,
                data: {
                    full_name: fullName,
                    display_name: fullName
                }
            }
        });
        
        if (error) {
            console.log('Sign up error:', error);
            return { success: false, error: error.message };
        }
        
        // Additional validation: Check if user was created successfully
        if (!data.user) {
            console.log('Sign up failed: No user created');
            return { success: false, error: 'Account creation failed. Please try again.' };
        }
        
        // Check for other edge cases where signup appears successful but isn't
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            console.log('Sign up failed: User already exists');
            return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
        }
        
        console.log('Sign up successful:', data.user.email);
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Sign up exception:', error);
        return { success: false, error: error.message };
    }
}

// Get current user data from 'users' table
async function getUserData(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error('Get user data error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Get user data exception:', error);
        return { success: false, error: error.message };
    }
}

// get all essentials for user
async function getUserEssentials(userId) {
    try {
        const { data, error } = await supabase
            .from('essentials')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('display_order', { ascending: true });
        
        if (error) {
            console.error('Get user essentials error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data || [] };
        
    } catch (error) {
        console.error('Get user essentials exception:', error);
        return { success: false, error: error.message };
    }
}

// get all spaces for user
async function getUserSpaces(userId) {
    // return dummy data for now
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                data: DUMMY_SPACES
            });
        }, 1000);
    });
}

// save essential to database
async function saveEssentialToDb(essential) {
    try {
        const { data, error } = await supabase
            .from('essentials')
            .insert([essential])
            .select()
            .single();
        
        if (error) {
            console.error('Save essential error:', error);
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data };
        
    } catch (error) {
        console.error('Save essential exception:', error);
        return { success: false, error: error.message };
    }
}


/* SECTION Session Recovery Functions */


// Save session backup to Chrome storage
async function saveSessionBackup(session, user) {
    try {
        const sessionBackup = {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at
            },
            saved_at: Date.now()
        };
        
        await chrome.storage.local.set({ 'tabster_session_backup': sessionBackup });
        
    } catch (error) {
        console.error('Failed to save session backup:', error);
    }
}

// Restore session from Chrome storage backup
async function restoreSessionBackup() {
    try {
        return new Promise((resolve) => {
            chrome.storage.local.get(['tabster_session_backup'], async (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(false);
                    return;
                }
                
                const backup = result.tabster_session_backup;
                
                if (!backup) {
                    resolve(false);
                    return;
                }
                
                // Check if backup is expired (older than 7 days)
                const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (backup.saved_at < sevenDaysAgo) {
                    // Clean up expired backup
                    chrome.storage.local.remove(['tabster_session_backup']);
                    resolve(false);
                    return;
                }
                
                try {
                    // Try to restore session with Supabase
                    const { data, error } = await supabase.auth.setSession({
                        access_token: backup.access_token,
                        refresh_token: backup.refresh_token
                    });
                    
                    if (error) {
                        // Clean up invalid backup
                        chrome.storage.local.remove(['tabster_session_backup']);
                        resolve(false);
                        return;
                    }
                    
                    resolve(true);
                    
                } catch (error) {
                    console.error('Session restore error:', error);
                    // Clean up invalid backup
                    chrome.storage.local.remove(['tabster_session_backup']);
                    resolve(false);
                }
            });
        });
        
    } catch (error) {
        console.error('Restore session backup exception:', error);
        return false;
    }
}

// Clear session backup from Chrome storage
async function clearSessionBackup() {
    try {
        await chrome.storage.local.remove(['tabster_session_backup']);
    } catch (error) {
        console.error('Failed to clear session backup:', error);
    }
}


/* SECTION SERVICE WORKER LIFECYCLE */


// Handle extension installation, updates, and reloads
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log("❗ ON INSTALLED FIRED!")
    if (details.reason === 'install') {
        console.log('Tabster extension installed');
        handleStartup();
    } else if (details.reason === 'update') {
        console.log('Tabster extension updated');
        // Attempt session recovery on update
        attemptSessionRecovery();
        handleStartup();
    }
});

// Handle window creation / Browser startup
chrome.windows.onCreated.addListener(async (window) => {
    // Check if this is the first/only window
    const allWindows = await chrome.windows.getAll();
    if (allWindows.length <= 1) {
        console.log("❗ ON WINDOW CREATED FIRED!");
        attemptSessionRecovery();
        handleStartup();
    }
});

// Handle browser startup
chrome.runtime.onStartup.addListener(async () => {
    console.log("❗ ON STARTUP FIRED - attempting session restoration");
    await attemptSessionRecovery();
    handleStartup();
});

// Handle service worker activation (when service worker restarts during normal operation)
self.addEventListener('activate', async (event) => {
    console.log("❗ SERVICE WORKER ACTIVATED - attempting session restoration");
    event.waitUntil(attemptSessionRecovery());
});

// Attempt to recover user session on service worker startup
async function attemptSessionRecovery() {
    try {
        const recovered = await restoreSessionBackup();
        if (!recovered) {
            // Clear any stale data if recovery failed
            await Promise.all([
                clearSessionBackup(),
                new Promise((resolve) => {
                    chrome.storage.local.remove([
                        'tabster_current_userId'
                    ], resolve);
                })
            ]);
        } else {
            console.log('Session recovered successfully');
        }
    } catch (error) {
        console.error('Session recovery error:', error);
    }
}

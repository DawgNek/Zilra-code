// ===== ALTARE PORTFOLIO PREMIUM - MAIN SCRIPT =====
// Version: 2.0 - Fixed all errors
// Date: 2024

// ===== GLOBAL STATE =====
let APP_STATE = {
    theme: 'dark',
    language: 'en',
    reducedMotion: false,
    particlesActive: true,
    isInitialized: false
};

document.documentElement.setAttribute("data-theme", "dark");


// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ALTARE Portfolio - DOM Ready');
    
    // Initialize with delay to ensure all elements are loaded
    setTimeout(() => {
        initApplication();
    }, 100);
});

// ===== MAIN INITIALIZATION =====
function initApplication() {    
    try {
        console.log('🔧 Initializing application...');
        
        // Check critical elements
        if (!checkRequiredElements()) {
            console.error('❌ Critical elements missing');
            forceShowContent();
            return;
        }
        
        // Load saved preferences
        loadUserPreferences();
        
        // Initialize core features
        initThemeSystem();
        initLanguageSystem();
        initMotionPreference();
        initParticlesBackground();
        
        // Initialize UI components
        initAnimations();
        initNavigation();
        initContactForm();
        initEventListeners();
        
        // Mark as initialized
        APP_STATE.isInitialized = true;
        console.log('✅ Application initialized successfully');
        
        // Remove preloader
        setTimeout(() => {
            hidePreloader();
        }, 1000);
        
    } catch (error) {
        console.error('💥 Initialization error:', error);
        forceShowContent();
    }
}

// ===== ELEMENT VALIDATION =====
function checkRequiredElements() {
    const requiredSelectors = [
        'body',
        '.preloader',
        '.navbar',
        '.hero-title',
        '.theme-toggle'
    ];
    
    let allFound = true;
    
    requiredSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`⚠️ Element not found: ${selector}`);
            allFound = false;
        }
    });
    
    return allFound;
}

function forceShowContent() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    document.body.classList.add('loaded');
    document.body.style.opacity = '1';
}

// ===== PREFERENCE MANAGEMENT =====
function loadUserPreferences() {
    try {
        // Theme
        APP_STATE.theme = 'dark';
        
        // Language
        const savedLang = localStorage.getItem('altare_language');
        if (savedLang) {
            APP_STATE.language = savedLang;
        } else {
            const browserLang = navigator.language.slice(0, 2);
            APP_STATE.language = ['en', 'vi', 'ja', 'zh', 'de', 'ru'].includes(browserLang) 
                ? browserLang 
                : 'en';
        }
        
        // Motion preference
        const savedMotion = localStorage.getItem('altare_reduced_motion');
        if (savedMotion !== null) {
            APP_STATE.reducedMotion = savedMotion === 'true';
        } else {
            APP_STATE.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        
        console.log('📊 Loaded preferences:', APP_STATE);
        
    } catch (error) {
        console.warn('⚠️ Could not load preferences:', error);
    }
}

function saveUserPreferences() {
    try {
        localStorage.setItem('altare_theme', APP_STATE.theme);
        localStorage.setItem('altare_language', APP_STATE.language);
        localStorage.setItem('altare_reduced_motion', APP_STATE.reducedMotion);
    } catch (error) {
        console.warn('⚠️ Could not save preferences:', error);
    }
}

// ===== THEME SYSTEM =====
function initThemeSystem() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Apply saved theme
    applyTheme(APP_STATE.theme);
    
    // Setup toggle
    themeToggle.addEventListener('click', function() {
        const newTheme = APP_STATE.theme === 'dark';
        applyTheme(newTheme);
        
        // Update particles
        updateParticlesColor();
        
        // Show notification
        showNotification(`Switched to ${newTheme} mode`, 'info');
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('altare_theme') === null) {
            applyTheme(e.matches ? 'dark' : 'light');
            updateParticlesColor();
        }
    });
}

function applyTheme(theme) {
    APP_STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update particles color if active
    if (APP_STATE.particlesActive && typeof tsParticles !== 'undefined') {
        updateParticlesColor();
    }
    
    saveUserPreferences();
}

function toggleTheme() {
    const newTheme = APP_STATE.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('.theme-toggle i');
    if (!icon) return;
    
    if (APP_STATE.theme === 'light') {
        icon.className = 'fas fa-sun';
        icon.style.color = '#ff9500';
    } else {
        icon.className = 'fas fa-moon';
        icon.style.color = '#ffd700';
    }
}

// ===== LANGUAGE SYSTEM =====
const TRANSLATIONS = {
    en: {
        logo: "ALTARE",
        nav: { work: "Work", team: "Team", about: "About", contact: "Contact" },
        hero: { line1: "We create", line2: "digital", line3: "experiences", scroll: "Scroll" },
        work: { 
            title: "Selected Work",
            project1: { title: "Brand Identity", category: "Branding" },
            project2: { title: "Mobile App", category: "UI/UX Design" },
            project3: { title: "Web Platform", category: "Development" }
        },
        team: {
            title: "Our Team",
            member1: { name: "Hai Dang", role: "CEO / Founder" },
            member2: { name: "Seohwa", role: "CTO (Technical Lead)" },
            member3: { name: "Đàm Vĩnh An", role: "CTO (Technical Lead)" }
        },
        about: {
            title: "About Us",
            description1: "Zilra Technologies is a technology team with a simple goal: create websites and applications that work well, look beautiful, and truly bring value to users.",
            description2: "We specialize in designing and developing websites, mobile applications, and software systems tailored to each customer's specific needs. Whether it's a corporate website, e-commerce platform, or new startup application, Zilra always focuses on user experience, speed, and stability.",
            description3: "At Zilra Technologies, each project is carefully built from the interface to the internal system structure. We believe a good product needs not only to be beautiful but also to enhance credibility, optimize performance, and have long-term development potential.",
            description4: "Our team consists of technology enthusiasts who love creativity and are always ready to try new solutions. Zilra doesn't just write code - we analyze problems with clients, find suitable directions, and build the most effective solutions.",
            description5: "Zilra Technologies aims to become a long-term partner, accompanying businesses in their development and digital transformation journey.",
            skills: {
                design: "Design",
                designList: "UI/UX, Branding, Motion",
                development: "Development",
                developmentList: "Frontend, WebGL, Animation",
                tools: "Tools",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "Contact Us",
            description: "Interested in working together or have a project in mind? We'd love to hear from you.",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "Hy Cương Ward, Việt Trì City, Phú Thọ Province",
            form: { 
                name: "Full Name", 
                email: "Email", 
                message: "Message", 
                submit: "Send Message" 
            },
            follow: "Follow Us"
        },
        footer: {
            tagline: "Creating digital experiences since 2026",
            copyright: "© 2026 zilra. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        }
    },
    vi: {
        logo: "ALTARE",
        nav: { work: "Dự án", team: "Đội ngũ", about: "Giới thiệu", contact: "Liên hệ" },
        hero: { line1: "Chúng tôi tạo ra", line2: "trải nghiệm", line3: "số ấn tượng", scroll: "Cuộn" },
        work: { 
            title: "Dự án tiêu biểu",
            project1: { title: "Nhận diện thương hiệu", category: "Branding" },
            project2: { title: "Ứng dụng di động", category: "Thiết kế UI/UX" },
            project3: { title: "Nền tảng web", category: "Phát triển" }
        },
        team: {
            title: "Đội ngũ của chúng tôi",
            member1: { name: "Hai Dang", role: "CEO / Founder" },
            member2: { name: "Seohwa", role: "CTO (Technical Lead)" },
            member3: { name: "Đàm Vĩnh An", role: "CTO (Technical Lead)" }
        },
        about: {
            title: "Giới thiệu",
            description1: "Zilra Technologies là một đội ngũ làm công nghệ với mục tiêu đơn giản: tạo ra những website và ứng dụng hoạt động tốt, đẹp và thực sự mang lại giá trị cho người dùng.",
            description2: "Chúng tôi chuyên thiết kế và phát triển website, ứng dụng di động và các hệ thống phần mềm theo nhu cầu riêng của từng khách hàng. Dù là website giới thiệu doanh nghiệp, trang thương mại điện tử hay một ứng dụng startup mới, Zilra luôn tập trung vào trải nghiệm người dùng, tốc độ và tính ổn định.",
            description3: "Tại Zilra Technologies, mỗi dự án đều được xây dựng một cách cẩn thận từ giao diện đến cấu trúc hệ thống bên trong. Chúng tôi tin rằng một sản phẩm tốt không chỉ cần đẹp mà còn phải đem lại sức uy tín, tối ưu hiệu suất và có khả năng phát triển lâu dài.",
            description4: "Đội ngũ của chúng tôi gồm những người yêu công nghệ, thích sáng tạo và luôn sẵn sàng thử những giải pháp mới. Zilra không chỉ viết code – chúng tôi cùng khách hàng phân tích vấn đề, tìm hướng đi phù hợp và xây dựng giải pháp hiệu quả nhất.",
            description5: "Zilra Technologies mong muốn trở thành đối tác lâu dài, đồng hành cùng doanh nghiệp trong hành trình phát triển và chuyển đổi số.",
            skills: {
                design: "Thiết kế",
                designList: "UI/UX, Branding, Motion",
                development: "Phát triển",
                developmentList: "Frontend, WebGL, Animation",
                tools: "Công cụ",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "Liên hệ",
            description: "Bạn quan tâm đến hợp tác hoặc có dự án cần triển khai? Chúng tôi rất muốn lắng nghe.",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "Xã Hy Cương, Phường Việt Trì, Tỉnh Phú Thọ",
            form: { 
                name: "Họ tên", 
                email: "Email", 
                message: "Tin nhắn", 
                submit: "Gửi tin nhắn" 
            },
            follow: "Theo dõi chúng tôi"
        },
        footer: {
            tagline: "Tạo ra trải nghiệm số từ năm 2026",
            copyright: "© 2026 zilra. Đã đăng ký bản quyền.",
            privacy: "Chính sách bảo mật",
            terms: "Điều khoản dịch vụ"
        }
    },
    ja: {
        logo: "ALTARE",
        nav: { work: "作品", team: "チーム", about: "会社概要", contact: "お問い合わせ" },
        hero: { line1: "私たちは", line2: "デジタル", line3: "体験を作ります", scroll: "スクロール" },
        work: { 
            title: "選ばれた作品",
            project1: { title: "ブランドアイデンティティ", category: "ブランディング" },
            project2: { title: "モバイルアプリ", category: "UI/UXデザイン" },
            project3: { title: "ウェブプラットフォーム", category: "開発" }
        },
        team: {
            title: "私たちのチーム",
            member1: { name: "ハイ・ダング", role: "CEO / 創設者" },
            member2: { name: "ソファ", role: "CTO (技術リード)" },
            member3: { name: "ダム・ヴィン・アン", role: "CTO (技術リード)" }
        },
        about: {
            title: "会社概要",
            description1: "Zilra Technologiesは、シンプルな目標を持つ技術チームです。機能が良く、美しく、ユーザーに真の価値をもたらすウェブサイトとアプリケーションを作成します。",
            description2: "各顧客の特定のニーズに合わせたウェブサイト、モバイルアプリケーション、ソフトウェアシステムの設計と開発を専門としています。企業ウェブサイト、Eコマースプラットフォーム、新しいスタートアップアプリケーションであっても、Zilraは常にユーザー体験、速度、安定性に焦点を当てています。",
            description3: "Zilra Technologiesでは、各プロジェクトはインターフェースから内部システム構造まで注意深く構築されます。優れた製品は美しいだけでなく、信頼性を高め、パフォーマンスを最適化し、長期的な開発の可能性を持つ必要があると信じています。",
            description4: "私たちのチームは、創造性を愛し、常に新しいソリューションを試す準備ができている技術愛好家で構成されています。Zilraはコードを書くだけでなく、クライアントと問題を分析し、適切な方向性を見つけ、最も効果的なソリューションを構築します。",
            description5: "Zilra Technologiesは、企業の開発とデジタルトランスフォーメーションの旅に同行する長期的なパートナーになることを目指しています。",
            skills: {
                design: "デザイン",
                designList: "UI/UX, ブランディング, モーション",
                development: "開発",
                developmentList: "フロントエンド, WebGL, アニメーション",
                tools: "ツール",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "お問い合わせ",
            description: "一緒に働くことに興味がありますか？プロジェクトをお持ちですか？ぜひお聞かせください。",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "ヒー・クオン区、ヴィエット・トリ市、フート省",
            form: { 
                name: "名前", 
                email: "メールアドレス", 
                message: "メッセージ", 
                submit: "メッセージを送信" 
            },
            follow: "フォローする"
        },
        footer: {
            tagline: "2026年からデジタル体験を創り続けています",
            copyright: "© 2026 zilra. All rights reserved.",
            privacy: "プライバシーポリシー",
            terms: "利用規約"
        }
    },
    zh: {
        logo: "ALTARE",
        nav: { work: "作品", team: "团队", about: "关于", contact: "联系" },
        hero: { line1: "我们创造", line2: "数字", line3: "体验", scroll: "滚动" },
        work: { 
            title: "精选作品",
            project1: { title: "品牌标识", category: "品牌设计" },
            project2: { title: "移动应用", category: "UI/UX设计" },
            project3: { title: "网络平台", category: "开发" }
        },
        team: {
            title: "我们的团队",
            member1: { name: "海当", role: "CEO / 创始人" },
            member2: { name: "索法", role: "CTO (技术主管)" },
            member3: { name: "谭永安", role: "CTO (技术主管)" }
        },
        about: {
            title: "关于我们",
            description1: "Zilra Technologies是一个技术团队，拥有简单的目标：创建运行良好、外观美观并真正为用户带来价值的网站和应用程序。",
            description2: "我们专注于根据每个客户的特定需求设计和开发网站、移动应用程序和软件系统。无论是企业网站、电子商务平台还是新的初创应用程序，Zilra始终专注于用户体验、速度和稳定性。",
            description3: "在Zilra Technologies，每个项目都从界面到内部系统结构精心构建。我们相信，好的产品不仅需要美观，还需要增强信誉、优化性能并具有长期发展潜力。",
            description4: "我们的团队由热爱技术、喜欢创造并始终愿意尝试新解决方案的人员组成。Zilra不仅仅是编写代码 - 我们与客户一起分析问题，寻找合适的方向，并构建最有效的解决方案。",
            description5: "Zilra Technologies旨在成为长期合作伙伴，伴随企业的发展和数字化转型之旅。",
            skills: {
                design: "设计",
                designList: "UI/UX, 品牌设计, 动画",
                development: "开发",
                developmentList: "前端, WebGL, 动画",
                tools: "工具",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "联系我们",
            description: "有兴趣合作或有项目想法吗？我们很乐意听取您的意见。",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "羲冈坊, 越池市, 富寿省",
            form: { 
                name: "姓名", 
                email: "邮箱", 
                message: "留言", 
                submit: "发送留言" 
            },
            follow: "关注我们"
        },
        footer: {
            tagline: "自2026年起创造数字体验",
            copyright: "© 2026 zilra. 版权所有。",
            privacy: "隐私政策",
            terms: "服务条款"
        }
    },
    de: {
        logo: "ALTARE",
        nav: { work: "Arbeiten", team: "Team", about: "Über uns", contact: "Kontakt" },
        hero: { line1: "Wir schaffen", line2: "digitale", line3: "Erlebnisse", scroll: "Scrollen" },
        work: { 
            title: "Ausgewählte Arbeiten",
            project1: { title: "Markenidentität", category: "Branding" },
            project2: { title: "Mobile App", category: "UI/UX Design" },
            project3: { title: "Web-Plattform", category: "Entwicklung" }
        },
        team: {
            title: "Unser Team",
            member1: { name: "Hai Dang", role: "CEO / Gründer" },
            member2: { name: "Seohwa", role: "CTO (Technischer Leiter)" },
            member3: { name: "Đàm Vĩnh An", role: "CTO (Technischer Leiter)" }
        },
        about: {
            title: "Über uns",
            description1: "Zilra Technologies ist ein Technologieteam mit einem einfachen Ziel: Websites und Anwendungen zu erstellen, die gut funktionieren, schön aussehen und den Nutzern echten Mehrwert bieten.",
            description2: "Wir spezialisieren uns auf die Gestaltung und Entwicklung von Websites, mobilen Anwendungen und Softwaresystemen, die auf die spezifischen Bedürfnisse jedes Kunden zugeschnitten sind. Ob Unternehmenswebsite, E-Commerce-Plattform oder neue Startup-Anwendung, Zilra konzentriert sich immer auf Benutzererfahrung, Geschwindigkeit und Stabilität.",
            description3: "Bei Zilra Technologies wird jedes Projekt sorgfältig von der Oberfläche bis zur internen Systemstruktur aufgebaut. Wir glauben, dass ein gutes Produkt nicht nur schön sein muss, sondern auch die Glaubwürdigkeit stärken, die Leistung optimieren und langfristiges Entwicklungspotenzial haben muss.",
            description4: "Unser Team besteht aus Technologie-Enthusiasten, die Kreativität lieben und immer bereit sind, neue Lösungen auszuprobieren. Zilra schreibt nicht nur Code - wir analysieren Probleme mit Kunden, finden geeignete Wege und bauen die effektivsten Lösungen.",
            description5: "Zilra Technologies möchte ein langfristiger Partner werden, der Unternehmen auf ihrem Entwicklungs- und Digitalisierungsweg begleitet.",
            skills: {
                design: "Design",
                designList: "UI/UX, Branding, Motion",
                development: "Entwicklung",
                developmentList: "Frontend, WebGL, Animation",
                tools: "Werkzeuge",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "Kontaktieren Sie uns",
            description: "Interessiert an einer Zusammenarbeit oder haben Sie ein Projekt im Sinn? Wir würden uns freuen, von Ihnen zu hören.",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "Hy Cương Bezirk, Việt Trì Stadt, Phú Thọ Provinz",
            form: { 
                name: "Name", 
                email: "E-Mail", 
                message: "Nachricht", 
                submit: "Nachricht senden" 
            },
            follow: "Folgen Sie uns"
        },
        footer: {
            tagline: "Erschafft digitale Erlebnisse seit 2026",
            copyright: "© 2026 zilra. Alle Rechte vorbehalten.",
            privacy: "Datenschutzrichtlinie",
            terms: "Nutzungsbedingungen"
        }
    },
    ru: {
        logo: "ALTARE",
        nav: { work: "Работы", team: "Команда", about: "О нас", contact: "Контакты" },
        hero: { line1: "Мы создаем", line2: "цифровые", line3: "впечатления", scroll: "Прокрутить" },
        work: { 
            title: "Избранные работы",
            project1: { title: "Идентичность бренда", category: "Брендинг" },
            project2: { title: "Мобильное приложение", category: "UI/UX Дизайн" },
            project3: { title: "Веб-платформа", category: "Разработка" }
        },
        team: {
            title: "Наша команда",
            member1: { name: "Хай Данг", role: "CEO / Основатель" },
            member2: { name: "Сеофа", role: "CTO (Технический руководитель)" },
            member3: { name: "Дам Винь Ан", role: "CTO (Технический руководитель)" }
        },
        about: {
            title: "О нас",
            description1: "Zilra Technologies — это технологическая команда с простой целью: создавать веб-сайты и приложения, которые хорошо работают, красиво выглядят и действительно приносят пользу пользователям.",
            description2: "Мы специализируемся на проектировании и разработке веб-сайтов, мобильных приложений и программных систем в соответствии с конкретными потребностями каждого клиента. Будь то корпоративный сайт, платформа электронной коммерции или новое стартап-приложение, Zilra всегда уделяет внимание пользовательскому опыту, скорости и стабильности.",
            description3: "В Zilra Technologies каждый проект тщательно строится от интерфейса до внутренней структуры системы. Мы считаем, что хороший продукт должен быть не только красивым, но и повышать доверие, оптимизировать производительность и иметь долгосрочный потенциал развития.",
            description4: "Наша команда состоит из энтузиастов технологий, которые любят творчество и всегда готовы пробовать новые решения. Zilra не просто пишет код — мы анализируем проблемы с клиентами, находим подходящие направления и строим наиболее эффективные решения.",
            description5: "Zilra Technologies стремится стать долгосрочным партнером, сопровождая предприятия в их развитии и цифровой трансформации.",
            skills: {
                design: "Дизайн",
                designList: "UI/UX, Брендинг, Анимация",
                development: "Разработка",
                developmentList: "Frontend, WebGL, Анимация",
                tools: "Инструменты",
                toolsList: "Figma, Webflow, GSAP"
            }
        },
        contact: {
            title: "Свяжитесь с нами",
            description: "Заинтересованы в сотрудничестве или у вас есть проект? Мы будем рады услышать вас.",
            email: "zilra.business@gmail.com",
            phone: "+84 982397832",
            address: "Район Хи Кыонг, Город Вьетчи, Провинция Футхо",
            form: { 
                name: "Имя", 
                email: "Email", 
                message: "Сообщение", 
                submit: "Отправить сообщение" 
            },
            follow: "Подпишитесь на нас"
        },
        footer: {
            tagline: "Создаем цифровые впечатления с 2026 года",
            copyright: "© 2026 zilra. Все права защищены.",
            privacy: "Политика конфиденциальности",
            terms: "Условия использования"
        }
    }
};

function initLanguageSystem() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const footerSelect = document.getElementById('footer-lang-select');
    
    if (!langButtons.length && !footerSelect) {
        console.warn('⚠️ Language controls not found');
        return;
    }
    
    // Apply saved language
    applyLanguage(APP_STATE.language);
    
    // Setup button events
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (TRANSLATIONS[lang]) {
                applyLanguage(lang);
            }
        });
    });
    
    // Setup select event
    if (footerSelect) {
        footerSelect.addEventListener('change', function() {
            const lang = this.value;
            if (TRANSLATIONS[lang]) {
                applyLanguage(lang);
            }
        });
    }
}

function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
        console.warn(`Language not supported: ${lang}`);
        return;
    }
    
    APP_STATE.language = lang;
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update footer select
    const footerSelect = document.getElementById('footer-lang-select');
    if (footerSelect) {
        footerSelect.value = lang;
    }
    
    // Apply translations
    translateContent(lang);
    
    saveUserPreferences();
}

function translateContent(lang) {
    const data = TRANSLATIONS[lang];
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.dataset.i18n.split('.');
        let value = data;
        
        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value && element.textContent !== value) {
            element.textContent = value;
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(element => {
        const keys = element.dataset.i18nPh.split('.');
        let value = data;
        
        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value && element.placeholder !== value) {
            element.placeholder = value;
        }
    });
}

// ===== MOTION PREFERENCE =====
function initMotionPreference() {
    const motionToggle = document.querySelector('.motion-toggle');
    if (!motionToggle) return;
    
    // Apply motion preference
    applyMotionPreference(APP_STATE.reducedMotion);
    
    // Setup toggle
    motionToggle.addEventListener('click', function() {
        toggleMotionPreference();
    });
}

function applyMotionPreference(reduced) {
    APP_STATE.reducedMotion = reduced;
    
    if (reduced) {
        document.documentElement.classList.add('reduced-motion');
        updateMotionIcon(true);
        
        // Disable some animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.timeScale(0.1);
        }
    } else {
        document.documentElement.classList.remove('reduced-motion');
        updateMotionIcon(false);
        
        // Enable animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.timeScale(1);
        }
    }
    
    saveUserPreferences();
}

function toggleMotionPreference() {
    applyMotionPreference(!APP_STATE.reducedMotion);
}

function updateMotionIcon(reduced) {
    const icon = document.querySelector('.motion-toggle i');
    if (!icon) return;
    
    icon.className = reduced ? 'fas fa-pause' : 'fas fa-running';
}

// ===== PARTICLES BACKGROUND =====
function initParticlesBackground() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) {
        console.warn('⚠️ Particles container not found');
        return;
    }
    
    if (typeof tsParticles === 'undefined') {
        console.warn('⚠️ tsParticles library not loaded');
        APP_STATE.particlesActive = false;
        return;
    }
    
    try {
        const particleColor = APP_STATE.theme === 'dark' ? '#ffffff' : '#000000';
        const particleCount = APP_STATE.reducedMotion ? 30 : 80;
        
        tsParticles.load("particles-js", {
            background: {
                color: {
                    value: "transparent"
                }
            },
            fpsLimit: APP_STATE.reducedMotion ? 30 : 60,
            particles: {
                color: {
                    value: particleColor
                },
                links: {
                    color: particleColor,
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: !APP_STATE.reducedMotion,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "out"
                    }
                },
                number: {
                    value: particleCount,
                    density: {
                        enable: true,
                        area: 800
                    }
                },
                opacity: {
                    value: 0.3
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 3 }
                }
            },
            detectRetina: true
        });
        
        console.log('✅ Particles initialized');
        
    } catch (error) {
        console.error('💥 Particles error:', error);
        APP_STATE.particlesActive = false;
    }
}

function updateParticlesColor() {
    if (!APP_STATE.particlesActive || typeof tsParticles === 'undefined') return;
    
    try {
        const particleColor = APP_STATE.theme === 'dark' ? '#ffffff' : '#000000';
        const lineColor = APP_STATE.theme === 'dark' ? '#ffffff' : '#000000';
        
        // Destroy old particles
        if (tsParticles.domItem(0)) {
            tsParticles.domItem(0).destroy();
        }
        
        // Create new particles with theme color
        tsParticles.load("particles-js", {
            background: { color: "transparent" },
            fpsLimit: APP_STATE.reducedMotion ? 30 : 60,
            particles: {
                color: { value: particleColor },
                links: {
                    color: lineColor,
                    distance: 150,
                    enable: true,
                    opacity: APP_STATE.theme === 'dark' ? 0.2 : 0.1,
                    width: 1
                },
                move: {
                    enable: !APP_STATE.reducedMotion,
                    speed: 1
                },
                number: { value: APP_STATE.reducedMotion ? 30 : 80 },
                opacity: { value: APP_STATE.theme === 'dark' ? 0.3 : 0.2 },
                size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
        });
        
    } catch (error) {
        console.warn('⚠️ Could not update particles:', error);
    }
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Initialize GSAP if available
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPAnimations();
    } else {
        initFallbackAnimations();
    }
}

function initGSAPAnimations() {
    // Hero title animation
    const titleLines = gsap.utils.toArray('.title-line');
    if (titleLines.length) {
        gsap.to(titleLines, {
            y: 0,
            opacity: 1,
            duration: APP_STATE.reducedMotion ? 0.5 : 1.2,
            stagger: APP_STATE.reducedMotion ? 0.1 : 0.2,
            ease: "power3.out",
            delay: 0.5
        });
    }
    
    // Scroll animations
    const animatedElements = gsap.utils.toArray('.work-info, .team-member');
    if (animatedElements.length) {
        animatedElements.forEach((element, i) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                y: APP_STATE.reducedMotion ? 0 : 30,
                opacity: 0,
                duration: APP_STATE.reducedMotion ? 0.3 : 0.8,
                delay: APP_STATE.reducedMotion ? 0 : i * 0.1,
                ease: "power3.out"
            });
        });
    }
    
    // Gradient animations (only if not reduced motion)
    if (!APP_STATE.reducedMotion) {
        const gradients = document.querySelectorAll('.gradient-bg');
        if (gradients.length) {
            gradients.forEach((gradient, i) => {
                gsap.to(gradient, {
                    backgroundPosition: '100% 50%',
                    duration: 4 + (i * 0.5),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }
    }
}

function initFallbackAnimations() {
    // Simple CSS animations if GSAP not available
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transition = 'all 0.8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
    
    // Simple scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.work-info, .team-member, .contact-form').forEach(el => {
        observer.observe(el);
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: APP_STATE.reducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.style.transform = 'translateY(0)';
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scroll down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scroll up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        }, 1500);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#1e90ff'};
        color: white;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 250);
    });
    
    // Work item hover effects
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        if (APP_STATE.reducedMotion) return;
        
        item.addEventListener('mouseenter', () => {
            const img = item.querySelector('.gradient-bg');
            const info = item.querySelector('.work-info');
            
            if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            }
            
            if (info) {
                info.style.transform = 'translateY(-10px)';
                info.style.transition = 'transform 0.4s ease';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('.gradient-bg');
            const info = item.querySelector('.work-info');
            
            if (img) {
                img.style.transform = 'scale(1)';
            }
            
            if (info) {
                info.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        if (APP_STATE.reducedMotion) return;
        
        member.addEventListener('mouseenter', () => {
            const img = member.querySelector('.member-img');
            if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.4s ease';
            }
        });
        
        member.addEventListener('mouseleave', () => {
            const img = member.querySelector('.member-img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// ===== PRELOADER =====
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // Fade out
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease';
    
    // Remove after fade
    setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
        
        // Trigger any deferred animations
        setTimeout(() => {
            window.dispatchEvent(new Event('app-loaded'));
        }, 100);
    }, 500);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.message, e.filename, e.lineno);
    
    // Don't break the app on non-critical errors
    if (e.message.includes('particles') || 
        e.message.includes('gsap') || 
        e.message.includes('tsParticles')) {
        console.warn('Non-critical library error, continuing...');
        e.preventDefault();
    }
});

// ===== EXPORT FOR DEBUGGING =====
if (typeof window !== 'undefined') {
    window.ALTARE_APP = {
        state: APP_STATE,
        functions: {
            toggleTheme,
            setLanguage: applyLanguage,
            toggleMotion: toggleMotionPreference,
            showNotification
        }
    };
    
    console.log('🌐 ALTARE Portfolio loaded successfully');
    console.log('💡 Debug: window.ALTARE_APP available for testing');
}
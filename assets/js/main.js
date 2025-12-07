/**
 * FieldScore AI - Main JavaScript
 * Handles interactive features and dynamic content
 */

// Translations object
const translations = {
    en: {
        nav_problem: "Problem & Solution",
        nav_team: "Team",
        nav_roadmap: "Roadmap",
        nav_technical: "Technical Approach",
        nav_demo: "Try Our Demo",
        hero_title: "🌾 FieldScore AI",
        hero_tagline: "Micro-Risk Scoring for Smallholder Farmland",
        hero_subtitle: "AI-powered field reliability assessment for Agro-lenders using satellite data and weather analytics",
        section_problem_title: "Problem & Solution",
        problem_title: "The Problem",
        problem_domain: "Domain:",
        problem_domain_value: "Financial Inclusion & Agriculture",
        problem_desc: "Smallholder farmers in emerging markets face a critical credit access barrier. Over 60% of loan applications are rejected because:",
        problem_point1: "No credit history or collateral available",
        problem_point2: "Banks cannot assess farmland productivity or risk",
        problem_point3: "Manual field assessments cost $50-200 per farm",
        problem_point4: "High default rates (30-40%) discourage lending",
        problem_point5: "2 billion farmers remain excluded from formal credit",
        problem_result: "Result: Creditworthy farmers denied loans. Lenders face high losses when approving blindly.",
        solution_title: "Our Solution",
        solution_desc: "generates objective 0-100 risk scores for individual farm plots in under 10 seconds using:",
        solution_point1: "Satellite NDVI data (vegetation health trends)",
        solution_point2: "Weather risk analysis (drought/flood indicators)",
        solution_point3: "Machine learning scoring models",
        solution_point4: "Simple farmer inputs (location, crop, area)",
        solution_benefits: "Who Benefits:",
        solution_benefits_desc: "Microfinance institutions, rural banks, agricultural cooperatives, government lending programs",
        solution_impact: "Impact:",
        solution_impact_desc: "Faster decisions, lower default risk, expanded credit access for smallholders",
        stat1_value: "90%",
        stat1_label: "Faster Loan Processing<br>(weeks → minutes)",
        stat2_value: "20-30%",
        stat2_label: "Reduction in<br>Default Risk",
        stat3_value: "$0.10",
        stat3_label: "Cost per Assessment<br>(vs $50-200)",
        // Team section
        team_title: "Our Team",
        team_role_ml: "ML Engineer",
        team_role_backend: "Backend Developer",
        team_role_data: "Data Scientist",
        // Roadmap section
        roadmap_title: "Roadmap & Current Stage",
        roadmap_current: "Current Stage: PROTOTYPE",
        roadmap_desc: "Working proof-of-concept with satellite data retrieval, NDVI calculation, and basic scoring logic validated",
        roadmap_phase1: "Feature Engineering",
        roadmap_phase2: "API & Deployment",
        roadmap_phase3: "Production Ready",
        roadmap_duration1: "Days 1-6",
        roadmap_duration2: "Days 7-12",
        roadmap_duration3: "Days 13-21",
        // Solution approach section
        solution_approach_title: "How We Plan to Solve It",
        solution_approach_subtitle: "Data-driven approach combining satellite imagery, weather analytics, and machine learning",
        data_sources_title: "Data Sources",
        feature_engineering_title: "Feature Engineering",
        tech_stack_title: "Technology Stack",
        // Demo Video section
        demo_video_title: "Demo Video",
        demo_video_subtitle: "Watch how to use FieldScore AI to assess farm plot risk in seconds",
        demo_video_guide_title: "How to Use FieldScore AI:",
        demo_step1: "<strong>Navigate to the Demo:</strong> Click the 'Try Our Demo' button in the navigation bar or at the bottom of this page",
        demo_step2: "<strong>Enter Farm Location:</strong> Provide the latitude and longitude coordinates of the farm plot you want to assess",
        demo_step3: "<strong>Specify Crop Type:</strong> Select the crop being grown (e.g., wheat, corn, rice)",
        demo_step4: "<strong>Input Farm Size:</strong> Enter the total area of the farm plot in hectares",
        demo_step5: "<strong>Submit for Analysis:</strong> Click the submit button to process the request",
        demo_step6: "<strong>View Risk Score:</strong> Receive a comprehensive risk score (0-100) along with satellite data visualization and recommendations",
        demo_cta: "Try Our Demo",
        // CTA section
        cta_title: "Ready to Transform Agricultural Lending",
        cta_button: "Learn More About FieldScore AI",
        // Footer
        footer_attribution: "Icons by"
    },
    uz: {
        nav_problem: "Muammo va Yechim",
        nav_team: "Jamoa",
        nav_roadmap: "Yo'l Xaritasi",
        nav_technical: "Texnik Yondashuv",
        nav_demo: "Demoni Sinab Ko'ring",
        hero_title: "🌾 FieldScore AI",
        hero_tagline: "Kichik Fermer Xo'jaliklari uchun Mikro-Xavf Baholash",
        hero_subtitle: "Sun'iy yo'ldosh ma'lumotlari va ob-havo tahlili yordamida agro-kreditorlar uchun AI-asosli dala ishonchlilik baholash",
        section_problem_title: "Muammo va Yechim",
        problem_title: "Muammo",
        problem_domain: "Soha:",
        problem_domain_value: "Moliyaviy Inklyuziya va Qishloq Xo'jaligi",
        problem_desc: "Rivojlanayotgan bozorlardagi kichik fermerlar tanqidiy kredit muammosiga duch kelmoqdalar. Kredit arizalarining 60% dan ortig'i rad etiladi, chunki:",
        problem_point1: "Kredit tarixi yoki garov mavjud emas",
        problem_point2: "Banklar fermer xo'jaligi samaradorligini yoki xavfini baholay olmaydi",
        problem_point3: "Qo'lda dala baholash har bir ferma uchun $50-200 turadi",
        problem_point4: "Yuqori defolt darajalari (30-40%) kreditni to'xtatadi",
        problem_point5: "2 milliard fermer rasmiy kreditdan chetda qolgan",
        problem_result: "Natija: Kredit olishga layoqatli fermerlar rad etiladi. Kreditorlar ko'r-ko'rona tasdiqlashda katta zarar ko'radi.",
        solution_title: "Bizning Yechimimiz",
        solution_desc: "quyidagilardan foydalanib, 10 soniyadan kamroq vaqtda alohida fermer xo'jaliklari uchun ob'ektiv 0-100 xavf ballini yaratadi:",
        solution_point1: "Sun'iy yo'ldosh NDVI ma'lumotlari (o'simlik salomatligi tendentsiyalari)",
        solution_point2: "Ob-havo xavf tahlili (qurg'oqchilik/toshqin ko'rsatkichlari)",
        solution_point3: "Mashina o'rganish baholash modellari",
        solution_point4: "Oddiy fermer ma'lumotlari (joylashuv, ekin, maydon)",
        solution_benefits: "Kimlar Foyda Ko'radi:",
        solution_benefits_desc: "Mikrokredit institutlari, qishloq banklari, qishloq xo'jaligi kooperativlari, davlat kredit dasturlari",
        solution_impact: "Ta'sir:",
        solution_impact_desc: "Tezroq qarorlar, kamroq defolt xavfi, kichik fermerlar uchun kengaytirilgan kredit",
        stat1_value: "90%",
        stat1_label: "Tezroq Kredit Jarayoni<br>(haftalar → daqiqalar)",
        stat2_value: "20-30%",
        stat2_label: "Defolt Xavfini<br>Kamaytirish",
        stat3_value: "$0.10",
        stat3_label: "Baholash Narxi<br>($50-200 o'rniga)",
        // Team section
        team_title: "Bizning Jamoa",
        team_role_ml: "ML Muhandisi",
        team_role_backend: "Backend Dasturchi",
        team_role_data: "Ma'lumotlar Olimi",
        // Roadmap section
        roadmap_title: "Yo'l Xaritasi va Joriy Bosqich",
        roadmap_current: "Joriy Bosqich: PROTOTIP",
        roadmap_desc: "Sun'iy yo'ldosh ma'lumotlarini olish, NDVI hisoblash va asosiy baholash mantiqini tekshirish bilan ishlaydigan konsept isboti",
        roadmap_phase1: "Xususiyatlarni Ishlab Chiqish",
        roadmap_phase2: "API va Joylashtirish",
        roadmap_phase3: "Ishlab Chiqarishga Tayyor",
        roadmap_duration1: "1-6 Kunlar",
        roadmap_duration2: "7-12 Kunlar",
        roadmap_duration3: "13-21 Kunlar",
        // Solution approach section
        solution_approach_title: "Biz Buni Qanday Hal Qilishni Rejalashtirmoqdamiz",
        solution_approach_subtitle: "Sun'iy yo'ldosh tasvirlari, ob-havo tahlillari va mashina o'rganishni birlashtirgan ma'lumotlarga asoslangan yondashuv",
        data_sources_title: "Ma'lumot Manbalari",
        feature_engineering_title: "Xususiyatlarni Ishlab Chiqish",
        tech_stack_title: "Texnologiya To'plami",
        // Demo Video section
        demo_video_title: "Demo Video",
        demo_video_subtitle: "FieldScore AI yordamida fermer maydonining xavfini soniyalar ichida qanday baholash kerakligini tomosha qiling",
        demo_video_guide_title: "FieldScore AI dan Qanday Foydalanish Kerak:",
        demo_step1: "<strong>Demoga O'ting:</strong> Navigatsiya panelidagi 'Demoni Sinab Ko'ring' tugmasini yoki sahifa pastidagi tugmani bosing",
        demo_step2: "<strong>Fermer Joylashuvini Kiriting:</strong> Baholamoqchi bo'lgan fermer maydonining kenglik va uzunlik koordinatalarini kiriting",
        demo_step3: "<strong>Ekin Turini Ko'rsating:</strong> Yetishtiriladigan ekinni tanlang (masalan, bug'doy, makkajo'xori, sholi)",
        demo_step4: "<strong>Fermer Hajmini Kiriting:</strong> Fermer maydonining umumiy yuzasini gektarlarda kiriting",
        demo_step5: "<strong>Tahlil uchun Yuboring:</strong> So'rovni qayta ishlash uchun yuborish tugmasini bosing",
        demo_step6: "<strong>Xavf Ballini Ko'ring:</strong> Sun'iy yo'ldosh ma'lumotlarini vizualizatsiya qilish va tavsiyalar bilan birga keng qamrovli xavf ballini (0-100) oling",
        demo_cta: "Demoni Sinab Ko'ring",
        // CTA section
        cta_title: "Qishloq Xo'jaligi Kreditini O'zgartirishga Tayyormisiz",
        cta_button: "FieldScore AI Haqida Ko'proq Bilib Oling",
        // Footer
        footer_attribution: "Ikonlar tomonidan"
    },
    ru: {
        nav_problem: "Проблема и Решение",
        nav_team: "Команда",
        nav_roadmap: "Дорожная Карта",
        nav_technical: "Технический Подход",
        nav_demo: "Попробовать Демо",
        hero_title: "🌾 FieldScore AI",
        hero_tagline: "Микро-Оценка Рисков для Мелких Фермерских Хозяйств",
        hero_subtitle: "AI-оценка надежности полей для агрокредиторов с использованием спутниковых данных и анализа погоды",
        section_problem_title: "Проблема и Решение",
        problem_title: "Проблема",
        problem_domain: "Область:",
        problem_domain_value: "Финансовая Инклюзия и Сельское Хозяйство",
        problem_desc: "Мелкие фермеры на развивающихся рынках сталкиваются с критическим барьером доступа к кредитам. Более 60% заявок на кредит отклоняются, потому что:",
        problem_point1: "Нет кредитной истории или залога",
        problem_point2: "Банки не могут оценить производительность или риск фермы",
        problem_point3: "Ручная оценка полей стоит $50-200 за ферму",
        problem_point4: "Высокие ставки дефолта (30-40%) отпугивают кредиторов",
        problem_point5: "2 миллиарда фермеров остаются вне формального кредитования",
        problem_result: "Результат: Кредитоспособные фермеры получают отказ. Кредиторы несут большие потери при слепом одобрении.",
        solution_title: "Наше Решение",
        solution_desc: "создает объективные оценки рисков 0-100 для отдельных фермерских участков менее чем за 10 секунд, используя:",
        solution_point1: "Спутниковые данные NDVI (тренды здоровья растительности)",
        solution_point2: "Анализ погодных рисков (индикаторы засухи/наводнений)",
        solution_point3: "Модели машинного обучения для оценки",
        solution_point4: "Простые данные фермера (местоположение, культура, площадь)",
        solution_benefits: "Кто Получает Выгоду:",
        solution_benefits_desc: "Микрофинансовые организации, сельские банки, сельскохозяйственные кооперативы, государственные кредитные программы",
        solution_impact: "Эффект:",
        solution_impact_desc: "Быстрые решения, меньший риск дефолта, расширенный доступ к кредитам для мелких фермеров",
        stat1_value: "90%",
        stat1_label: "Быстрее Обработка<br>(недели → минуты)",
        stat2_value: "20-30%",
        stat2_label: "Снижение Риска<br>Дефолта",
        stat3_value: "$0.10",
        stat3_label: "Стоимость Оценки<br>(вместо $50-200)",
        // Team section
        team_title: "Наша Команда",
        team_role_ml: "ML Инженер",
        team_role_backend: "Backend Разработчик",
        team_role_data: "Специалист по Данным",
        // Roadmap section
        roadmap_title: "Дорожная Карта и Текущий Этап",
        roadmap_current: "Текущий Этап: ПРОТОТИП",
        roadmap_desc: "Рабочая концепция с получением спутниковых данных, расчетом NDVI и проверенной базовой логикой оценки",
        roadmap_phase1: "Разработка Признаков",
        roadmap_phase2: "API и Развертывание",
        roadmap_phase3: "Готов к Продакшену",
        roadmap_duration1: "Дни 1-6",
        roadmap_duration2: "Дни 7-12",
        roadmap_duration3: "Дни 13-21",
        // Solution approach section
        solution_approach_title: "Как Мы Планируем Решить Это",
        solution_approach_subtitle: "Подход на основе данных, объединяющий спутниковые снимки, анализ погоды и машинное обучение",
        data_sources_title: "Источники Данных",
        feature_engineering_title: "Разработка Признаков",
        tech_stack_title: "Технологический Стек",
        // Demo Video section
        demo_video_title: "Демо Видео",
        demo_video_subtitle: "Посмотрите, как использовать FieldScore AI для оценки риска участка фермы за секунды",
        demo_video_guide_title: "Как Использовать FieldScore AI:",
        demo_step1: "<strong>Перейдите к Демо:</strong> Нажмите кнопку 'Попробовать Демо' на панели навигации или внизу этой страницы",
        demo_step2: "<strong>Введите Местоположение Фермы:</strong> Укажите координаты широты и долготы участка фермы, который вы хотите оценить",
        demo_step3: "<strong>Укажите Тип Культуры:</strong> Выберите выращиваемую культуру (например, пшеница, кукуруза, рис)",
        demo_step4: "<strong>Введите Размер Фермы:</strong> Введите общую площадь участка фермы в гектарах",
        demo_step5: "<strong>Отправить на Анализ:</strong> Нажмите кнопку отправки для обработки запроса",
        demo_step6: "<strong>Посмотреть Оценку Риска:</strong> Получите комплексную оценку риска (0-100) вместе с визуализацией спутниковых данных и рекомендациями",
        demo_cta: "Попробовать Демо",
        // CTA section
        cta_title: "Готовы Трансформировать Сельскохозяйственное Кредитование",
        cta_button: "Узнать Больше о FieldScore AI",
        // Footer
        footer_attribution: "Иконки от"
    }
};

// Current language
let currentLanguage = localStorage.getItem('fieldscoreLanguage') || 'en';

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    handleDemoRoute(); // Handle /demo route and hash navigation
    initDemoVideo(); // Check and display demo video if uploaded
    initLanguageSwitcher();
    initSmoothScroll();
    initAnimations();
    initNavigation();
    initMobileMenu();
    initDemoModal();
    initDemoForm();
    initChatbot();
    
    // Apply saved language
    applyLanguage(currentLanguage);
});

/**
 * Handle /demo route navigation
 */
function handleDemoRoute() {
    const path = window.location.pathname;
    if (path === '/demo' || path === '/demo/') {
        // Small delay to ensure page is loaded
        setTimeout(() => {
            const demoSection = document.getElementById('demo');
            if (demoSection) {
                const offsetTop = demoSection.offsetTop - 20;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }, 100);
    }
    
    // Also handle hash navigation
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 20;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }, 100);
    }
}

/**
 * Check if demo video exists and show it
 */
function initDemoVideo() {
    const video = document.getElementById('demoVideo');
    const placeholder = document.getElementById('videoPlaceholder');
    
    if (!video || !placeholder) return;
    
    // Try to load the video
    const videoSource = video.querySelector('source');
    if (videoSource) {
        // Create a test request to check if video exists
        fetch(videoSource.src, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Video exists, show it and hide placeholder
                    video.style.display = 'block';
                    placeholder.style.display = 'none';
                }
            })
            .catch(() => {
                // Video doesn't exist, keep placeholder visible
                video.style.display = 'none';
                placeholder.style.display = 'block';
            });
    }
}

/**
 * Smooth scroll to sections
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#top') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 20;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

/**
 * Animate elements on scroll
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards, team members, and roadmap phases
    const elementsToAnimate = document.querySelectorAll('.card, .team-member, .roadmap-phase, .stat-box');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Add CSS class for animated elements
 */
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/**
 * Sticky navigation with scroll indicator
 */
function initNavigation() {
    let lastScroll = 0;
    const nav = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to hero on scroll
        if (currentScroll > 100 && nav) {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else if (nav) {
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mobileBreakpoint = 768;
    
    if (!navToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Reset mobile menu state on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > mobileBreakpoint) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Language switcher functionality
 */
function initLanguageSwitcher() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLangSpan = document.querySelector('.current-lang');
    
    if (!languageBtn || !languageDropdown) {
        console.warn('Language selector not found');
        return;
    }
    
    // Language names map
    const langNames = {
        'en': 'EN - English',
        'uz': 'UZ - O\'zbek',
        'ru': 'RU - Русский'
    };
    
    // Set initial language display
    currentLangSpan.textContent = langNames[currentLanguage] || langNames['en'];
    
    // Mark current language as selected
    languageOptions.forEach(option => {
        if (option.dataset.lang === currentLanguage) {
            option.classList.add('selected');
        }
    });
    
    // Toggle dropdown
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageBtn.classList.toggle('active');
        languageDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageBtn.classList.remove('active');
            languageDropdown.classList.remove('active');
        }
    });
    
    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const newLanguage = this.dataset.lang;
            
            // Update selected state
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update button text
            currentLangSpan.textContent = langNames[newLanguage];
            
            // Close dropdown
            languageBtn.classList.remove('active');
            languageDropdown.classList.remove('active');
            
            // Apply language
            currentLanguage = newLanguage;
            localStorage.setItem('fieldscoreLanguage', newLanguage);
            applyLanguage(newLanguage);
            
            // Update chatbot language if open
            const chatLanguageSelector = document.getElementById('chatLanguage');
            if (chatLanguageSelector) {
                chatLanguageSelector.value = newLanguage;
            }
        });
    });
}

/**
 * Apply language translations to the page
 */
function applyLanguage(lang) {
    const translation = translations[lang] || translations['en'];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translation[key]) {
            element.innerHTML = translation[key];
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = lang === 'uz' ? 'uz' : (lang === 'ru' ? 'ru' : 'en');
}

/**
 * Copy to clipboard functionality
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

/**
 * Show notification message
 */
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #2d8659;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Add animations CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

/**
 * Handle external links
 */
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.startsWith('#')) {
        const url = new URL(e.target.href);
        if (url.hostname !== window.location.hostname) {
            e.target.setAttribute('target', '_blank');
            e.target.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

/**
 * Performance monitoring
 */
window.addEventListener('load', () => {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

/**
 * Contact Form Handler (for future implementation)
 */
function handleContactForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Process form data
    const data = Object.fromEntries(formData);
    console.log('Form submitted:', data);
    
    showNotification('Thank you! We will contact you soon.');
    event.target.reset();
}

/**
 * Dynamic year for copyright
 */
window.addEventListener('DOMContentLoaded', () => {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
});

/**
 * Initialize Demo Modal
 */
function initDemoModal() {
    const modal = document.getElementById('demoModal');
    const tryDemoBtn = document.getElementById('tryDemoBtn');
    const tryDemoFromVideo = document.getElementById('tryDemoFromVideo');
    const modalClose = document.getElementById('modalClose');
    
    // Open modal
    if (tryDemoBtn) {
        tryDemoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open modal from video section
    if (tryDemoFromVideo) {
        tryDemoFromVideo.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialize Demo Form
 */
function initDemoForm() {
    const form = document.getElementById('demoForm');
    const fillSampleBtn = document.getElementById('fillSampleBtn');
    const predictBtn = document.getElementById('predictBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const resultSection = document.getElementById('resultSection');
    
    // Fill sample data
    if (fillSampleBtn) {
        fillSampleBtn.addEventListener('click', () => {
            fillSampleData();
            showNotification('Sample data filled!');
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable button and show loader
            predictBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            
            // Collect form data
            const formData = {
                latitude: parseFloat(document.getElementById('latitude').value),
                longitude: parseFloat(document.getElementById('longitude').value),
                crop_type: document.getElementById('cropType').value,
                farm_area_hectares: parseFloat(document.getElementById('farmArea').value),
                ndvi_mean_12mo: parseFloat(document.getElementById('ndviMean').value),
                ndvi_slope: parseFloat(document.getElementById('ndviSlope').value),
                ndvi_14day_delta: parseFloat(document.getElementById('ndviDelta').value),
                ndvi_anomaly_zscore: parseFloat(document.getElementById('ndviAnomaly').value),
                rainfall_deficit_30day: parseFloat(document.getElementById('rainfallDeficit').value),
                coefficient_of_variation: parseFloat(document.getElementById('coefficientVariation').value),
                soil_organic_carbon: parseFloat(document.getElementById('soilCarbon').value),
                loan_amount_usd: parseFloat(document.getElementById('loanAmount').value)
            };
            
            try {
                // Call prediction API
                const result = await predictRiskScore(formData);
                
                // Display result
                displayResult(result);
                
                // Scroll to result
                resultSection.style.display = 'block';
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            } catch (error) {
                console.error('Prediction error:', error);
                showNotification('Error: ' + error.message, 5000);
            } finally {
                // Re-enable button
                predictBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }
}

/**
 * Fill sample data into form
 */
function fillSampleData() {
    document.getElementById('latitude').value = '-1.2921';
    document.getElementById('longitude').value = '36.8219';
    document.getElementById('cropType').value = 'maize';
    document.getElementById('farmArea').value = '2.5';
    document.getElementById('ndviMean').value = '0.72';
    document.getElementById('ndviSlope').value = '0.015';
    document.getElementById('ndviDelta').value = '-0.02';
    document.getElementById('ndviAnomaly').value = '-0.35';
    document.getElementById('rainfallDeficit').value = '15.2';
    document.getElementById('coefficientVariation').value = '0.18';
    document.getElementById('soilCarbon').value = '1.8';
    document.getElementById('loanAmount').value = '1500';
}

/**
 * Call prediction API
 */
async function predictRiskScore(data) {
    // API endpoint - change this to your deployed backend URL
    const API_URL = '/api/predict';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        // If API is not available, use mock prediction for demo
        console.warn('API not available, using mock prediction');
        return mockPrediction(data);
    }
}

/**
 * Mock prediction for demo (when API is not available)
 */
function mockPrediction(data) {
    // Simple scoring logic based on key features
    let score = 50; // Base score
    
    // NDVI mean contribution (0-25 points)
    score += (data.ndvi_mean_12mo - 0.5) * 50;
    
    // NDVI slope contribution (0-15 points)
    score += data.ndvi_slope * 300;
    
    // Rainfall deficit penalty (0 to -20 points)
    score -= Math.min(data.rainfall_deficit_30day / 3, 20);
    
    // Coefficient of variation penalty (0 to -15 points)
    score -= data.coefficient_of_variation * 30;
    
    // NDVI anomaly contribution (-10 to +10 points)
    score += data.ndvi_anomaly_zscore * 5;
    
    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));
    
    // Determine category
    let category, categoryClass, recommendation;
    
    if (score < 30) {
        category = 'High Risk';
        categoryClass = 'high-risk';
        recommendation = 'Loan application should be rejected or require additional collateral and high interest rate due to poor vegetation health and high environmental risk factors.';
    } else if (score < 60) {
        category = 'Medium Risk';
        categoryClass = 'medium-risk';
        recommendation = 'Loan application can be approved with standard terms. Monitor farm performance closely during the loan period.';
    } else {
        category = 'Low Risk';
        categoryClass = 'low-risk';
        recommendation = 'Loan application should be approved with favorable terms. Farm shows excellent vegetation health and stable production patterns.';
    }
    
    return {
        risk_score: score,
        risk_category: category,
        category_class: categoryClass,
        recommendation: recommendation,
        confidence: 0.85 + Math.random() * 0.1,
        features: {
            ndvi_health: data.ndvi_mean_12mo > 0.7 ? 'Excellent' : data.ndvi_mean_12mo > 0.6 ? 'Good' : 'Poor',
            trend: data.ndvi_slope > 0.01 ? 'Improving' : data.ndvi_slope < -0.01 ? 'Declining' : 'Stable',
            drought_status: data.rainfall_deficit_30day < 30 ? 'Low' : data.rainfall_deficit_30day < 60 ? 'Moderate' : 'Severe',
            stability: data.coefficient_of_variation < 0.25 ? 'High' : data.coefficient_of_variation < 0.4 ? 'Moderate' : 'Low'
        }
    };
}

/**
 * Display prediction result
 */
function displayResult(result) {
    const resultContent = document.getElementById('resultContent');
    
    const html = `
        <div class="result-score">
            <div class="score-value ${result.category_class}">${result.risk_score}</div>
            <div class="score-label">Risk Score (0-100)</div>
            <div class="score-category ${result.category_class}">${result.risk_category}</div>
        </div>
        
        <div class="result-details">
            <div class="result-item">
                <strong>Vegetation Health</strong>
                <span>${result.features.ndvi_health}</span>
            </div>
            <div class="result-item">
                <strong>Trend Direction</strong>
                <span>${result.features.trend}</span>
            </div>
            <div class="result-item">
                <strong>Drought Status</strong>
                <span>${result.features.drought_status}</span>
            </div>
            <div class="result-item">
                <strong>Production Stability</strong>
                <span>${result.features.stability}</span>
            </div>
        </div>
        
        <div class="result-recommendation">
            <h4>📋 Loan Recommendation</h4>
            <p>${result.recommendation}</p>
            <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(1)}%
            </p>
        </div>
    `;
    
    resultContent.innerHTML = html;
}

/**
 * Initialize AI Chatbot
 */
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatLanguage = document.getElementById('chatLanguage');
    
    // Sync chatbot language with main language selector
    if (chatLanguage) {
        chatLanguage.value = currentLanguage;
    }
    
    // Toggle chatbot window
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatbotInput.focus();
                // Sync language when opening
                if (chatLanguage) {
                    chatLanguage.value = currentLanguage;
                }
            }
        });
    }
    
    // Close chatbot
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }
    
    // Send message on button click
    if (chatbotSend) {
        chatbotSend.addEventListener('click', () => {
            sendChatMessage();
        });
    }
    
    // Send message on Enter key (Shift+Enter for new line)
    if (chatbotInput) {
        chatbotInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        // Auto-resize textarea
        chatbotInput.addEventListener('input', () => {
            chatbotInput.style.height = 'auto';
            chatbotInput.style.height = chatbotInput.scrollHeight + 'px';
        });
    }
}

/**
 * Send chat message
 */
async function sendChatMessage() {
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatLanguage = document.getElementById('chatLanguage');
    
    const message = chatbotInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    
    // Clear input
    chatbotInput.value = '';
    chatbotInput.style.height = 'auto';
    
    // Disable send button
    chatbotSend.disabled = true;
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
        // Call OpenAI API with selected language
        const response = await getChatbotResponse(message, chatLanguage.value);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add bot response
        addChatMessage(response, 'bot');
        
    } catch (error) {
        console.error('Chatbot error:', error);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Show error message
        const errorMessages = {
            'en': "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team.",
            'uz': "Kechirasiz, hozir ulanishda muammo bor. Iltimos, qaytadan urinib ko'ring yoki qo'llab-quvvatlash guruhimizga murojaat qiling.",
            'ru': "Извините, у меня проблемы с подключением. Пожалуйста, попробуйте снова или свяжитесь с нашей службой поддержки."
        };
        addChatMessage(
            errorMessages[chatLanguage.value] || errorMessages['en'],
            'bot'
        );
    } finally {
        // Re-enable send button
        chatbotSend.disabled = false;
    }
}

/**
 * Add message to chat
 */
function addChatMessage(text, sender) {
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${text.replace(/\n/g, '<br>')}</p>
        </div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.id = 'typing-indicator-' + Date.now();
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="chatbot-typing">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return typingDiv.id;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
        typingDiv.remove();
    }
}

/**
 * Get chatbot response from OpenAI API
 */
async function getChatbotResponse(userMessage, language = 'en') {
    // Call backend API for chatbot responses
    const CHAT_API_URL = '/api/chat';
    
    console.log('Sending message to chatbot API:', userMessage, 'Language:', language);
    
    try {
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                message: userMessage,
                language: language
            })
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Chat API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response data:', data);
        return data.response;
        
    } catch (error) {
        console.error('Chat API error:', error);
        
        // Fallback to rule-based responses if API fails
        return getFallbackResponse(userMessage, language);
    }
}

/**
 * Fallback responses when OpenAI API is not available
 */
function getFallbackResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Rule-based responses for common questions
    if (message.includes('ndvi') || message.includes('satellite')) {
        return "NDVI (Normalized Difference Vegetation Index) measures plant health using satellite imagery. Healthy vegetation reflects more near-infrared light. We use Sentinel-2 satellite data at 10m resolution, updated every 5 days, to track farm productivity over 12 months.";
    }
    
    if (message.includes('risk score') || message.includes('how does it work')) {
        return "Our AI model analyzes 12 features including vegetation health (NDVI), rainfall patterns, soil fertility, and farm characteristics. It outputs a 0-100 risk score: Low Risk (61-100) = approve with favorable terms, Medium (31-60) = standard terms, High (0-30) = reject or require collateral.";
    }
    
    if (message.includes('demo') || message.includes('try') || message.includes('test')) {
        return "Click the 'Try Our Demo' button in the navigation bar! You can either fill in farm details manually or click 'Fill Sample Data' for a quick test. The system will instantly generate a risk assessment based on vegetation health, weather, and soil data.";
    }
    
    if (message.includes('price') || message.includes('cost')) {
        return "FieldScore AI costs just $0.10 per farm assessment, compared to $50-200 for traditional manual field visits. This makes credit assessment affordable and scalable for microfinance institutions serving thousands of smallholder farmers.";
    }
    
    if (message.includes('data') || message.includes('source')) {
        return "We use three main data sources: 1) Sentinel-2 satellite imagery for NDVI, 2) ERA5 weather data for rainfall and temperature, and 3) SoilGrids for soil properties. All data is automatically retrieved via APIs—no manual collection needed.";
    }
    
    if (message.includes('accuracy') || message.includes('reliable')) {
        return "Our model targets AUC-ROC > 0.75 and precision > 0.70. The current prototype uses gradient boosting (XGBoost) trained on synthetic data. With real loan performance data from partner institutions, we expect to achieve 20-30% reduction in default rates.";
    }
    
    // Default response
    return "I can help you understand FieldScore AI's farm risk scoring system! Ask me about NDVI, satellite data, how the risk scoring works, using the demo, data sources, pricing, or technical details about our model.";
}

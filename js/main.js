document.addEventListener('DOMContentLoaded', () => {
    // --- State & Preferences ---
    const STORAGE_KEY_THEME = 'theme';
    const STORAGE_KEY_LANG = 'lang';
    
    // --- Elements ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const languageToggle = document.getElementById('languageToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    // --- Theme Logic ---
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY_THEME, theme);
        updateThemeIcon(theme);
    }
    
    function updateThemeIcon(theme) {
        // Toggle visibility of icons if they exist in SVG form, or manage classes
        // Assuming the HTML structure has both icons and CSS handles visibility?
        // Let's rely on CSS or simple display toggling if IDs exist, 
        // but robustly, we toggle class 'hidden' or similar.
        // For now, let's just make sure the attribute is set.
        const sunIcon = darkModeToggle.querySelector('.sun-icon');
        const moonIcon = darkModeToggle.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }
    }
    
    function toggleTheme() {
        const currentTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    // Initialize Theme
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }
    
    // --- Language Logic ---
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem(STORAGE_KEY_LANG, lang);
        
        // Toggle specific elements
        document.querySelectorAll('.lang-content').forEach(el => {
            if (el.classList.contains(`lang-${lang}`)) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        
        // Update Toggle Button Text
        if (languageToggle) {
            languageToggle.textContent = lang === 'en' ? 'KO' : 'ENG';
        }
    }
    
    function toggleLanguage() {
        const currentLang = localStorage.getItem(STORAGE_KEY_LANG) || 'ko';
        const newLang = currentLang === 'ko' ? 'en' : 'ko';
        setLanguage(newLang);
    }
    
    // Initialize Language
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG) || 'ko';
    setLanguage(savedLang);
    
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    // --- Mobile Menu ---
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

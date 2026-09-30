/**
 * Lumina Photo Gallery — Interaction Engine
 * Lightweight, zero-dependency, modern JavaScript module.
 * Accessible native <dialog> lightbox, theme toggling, and category filters.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initCategoryFilters();
    initLightbox();
    initScrollSpy();
});

/* ==========================================================================
   1. Theme Toggle Management
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const savedTheme = localStorage.getItem('lumina-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply saved theme or defer to OS preference
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeAria(savedTheme);
    } else {
        updateThemeAria(prefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme;

        if (currentTheme) {
            newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        } else {
            newTheme = prefersDark ? 'light' : 'dark';
        }

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('lumina-theme', newTheme);
        updateThemeAria(newTheme);
    });

    function updateThemeAria(theme) {
        themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

/* ==========================================================================
   2. Responsive Mobile Navigation
   ========================================================================== */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (!navToggle || !mainNav) return;

    function toggleNav(open) {
        const isOpen = open !== undefined ? open : !mainNav.classList.contains('is-open');
        mainNav.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    }

    navToggle.addEventListener('click', () => toggleNav());

    // Close on link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleNav(false);
            }
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && mainNav.classList.contains('is-open')) {
            if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
                toggleNav(false);
            }
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
            toggleNav(false);
            navToggle.focus();
        }
    });
}

/* ==========================================================================
   3. Gallery Category Filter System
   ========================================================================== */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allCards = document.querySelectorAll('.gallery__card');
    if (!filterButtons.length || !allCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');

            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-pressed', 'true');

            // Filter items
            allCards.forEach(card => {
                const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
                if (category === 'all' || cardCat === category) {
                    card.style.display = '';
                    card.removeAttribute('aria-hidden');
                } else {
                    card.style.display = 'none';
                    card.setAttribute('aria-hidden', 'true');
                }
            });
        });
    });
}

/* ==========================================================================
   4. Native Accessible Lightbox Modal (<dialog>)
   ========================================================================== */
function initLightbox() {
    const dialog = document.getElementById('lightbox-dialog');
    if (!dialog) return;

    const imgElem = dialog.querySelector('.lightbox-img');
    const titleElem = dialog.querySelector('.lightbox-title');
    const catElem = dialog.querySelector('.lightbox-badge');
    const locElem = dialog.querySelector('.lightbox-location-text');
    const counterElem = dialog.querySelector('.lightbox-counter');
    const closeBtn = dialog.querySelector('.lightbox-close');
    const prevBtn = dialog.querySelector('.prev-btn');
    const nextBtn = dialog.querySelector('.next-btn');

    let activeCardIndex = 0;
    let visibleCards = [];
    let lastActiveTrigger = null;

    function getVisibleCards() {
        return Array.from(document.querySelectorAll('.gallery__card')).filter(card => {
            return card.style.display !== 'none';
        });
    }

    function renderLightboxItem(index) {
        visibleCards = getVisibleCards();
        if (!visibleCards.length) return;

        if (index < 0) index = visibleCards.length - 1;
        if (index >= visibleCards.length) index = 0;
        activeCardIndex = index;

        const card = visibleCards[activeCardIndex];
        const img = card.querySelector('.gallery__image');
        const title = card.querySelector('.gallery__title')?.textContent || 'Untitled';
        const category = card.querySelector('.gallery__category')?.textContent || 'Gallery';
        const location = card.querySelector('.gallery__location')?.textContent.trim() || 'Worldwide';

        const highResUrl = card.getAttribute('data-highres') || img?.src || '';

        imgElem.src = highResUrl;
        imgElem.alt = img?.alt || title;
        titleElem.textContent = title;
        catElem.textContent = category;
        locElem.textContent = location;
        counterElem.textContent = `${activeCardIndex + 1} / ${visibleCards.length}`;
    }

    function openLightbox(triggerCard) {
        lastActiveTrigger = triggerCard;
        visibleCards = getVisibleCards();
        const cardIndex = visibleCards.indexOf(triggerCard);
        renderLightboxItem(cardIndex >= 0 ? cardIndex : 0);
        
        dialog.showModal();
        closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        dialog.close();
        document.body.style.overflow = '';
        if (lastActiveTrigger) {
            lastActiveTrigger.focus();
        }
    }

    // Attach click events to gallery cards
    document.querySelectorAll('.gallery__card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(card);
        });

        // Accessible Keyboard activation via Enter/Space
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(card);
            }
        });
    });

    // Close button & backdrop handling
    closeBtn?.addEventListener('click', () => closeLightbox());

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeLightbox();
        }
    });

    dialog.addEventListener('close', () => {
        document.body.style.overflow = '';
    });

    // Navigation buttons
    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        renderLightboxItem(activeCardIndex - 1);
    });

    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        renderLightboxItem(activeCardIndex + 1);
    });

    // Arrow keys inside dialog
    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            renderLightboxItem(activeCardIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            renderLightboxItem(activeCardIndex + 1);
        }
    });
}

/* ==========================================================================
   5. Active Section Scroll Spy
   ========================================================================== */
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.site-header .nav-link');
    const sections = document.querySelectorAll('main > section[id]');
    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('is-active');
                    } else {
                        link.classList.remove('is-active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
}

/* ============================================
   main.js — Portfolio interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // --- 1. CURRENT YEAR ---
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- 2. THEME TOGGLE ---
    function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const html = document.documentElement;
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!toggleBtn) return;

        // Load saved preference or respect system preference
        const saved = localStorage.getItem('theme');
        if (saved) {
            html.setAttribute('data-theme', saved);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }

        updateMetaColor();

        toggleBtn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateMetaColor();
        });

        function updateMetaColor() {
            if (!metaThemeColor) return;
            const theme = html.getAttribute('data-theme');
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f8f9fa');
        }
    }

    initThemeToggle();

    // --- 3. MOBILE NAV TOGGLE ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // --- 4. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 5. SCROLL ANIMATIONS ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .scale-in');

        if (prefersReducedMotion.matches) {
            animatedElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    initScrollAnimations();

    // --- 6. ACTIVE NAV HIGHLIGHTING ---
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    initActiveNav();

    // --- 7. TYPEWRITER EFFECT ---
    function initTypewriter() {
        const typewriterEl = document.querySelector('.hero__role-text');
        if (!typewriterEl) return;

        const roles = [
            'Backend Python Engineer',
            'Django & FastAPI Developer',
            'Open Source Contributor',
            'API Architect'
        ];

        // Keep aria-label in sync
        const parentEl = document.querySelector('.hero__role-dynamic');
        if (parentEl) {
            parentEl.setAttribute('aria-label', roles.join(', '));
        }

        if (prefersReducedMotion.matches) {
            typewriterEl.textContent = roles[0];
            return;
        }

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const TYPING_SPEED = 80;
        const DELETING_SPEED = 40;
        const PAUSE_AFTER_TYPING = 2000;
        const PAUSE_AFTER_DELETING = 500;

        function type() {
            const currentRole = roles[roleIndex];

            if (!isDeleting) {
                typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentRole.length) {
                    isDeleting = true;
                    setTimeout(type, PAUSE_AFTER_TYPING);
                    return;
                }
                setTimeout(type, TYPING_SPEED);
            } else {
                typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(type, PAUSE_AFTER_DELETING);
                    return;
                }
                setTimeout(type, DELETING_SPEED);
            }
        }

        setTimeout(type, 1200);
    }

    initTypewriter();

    // --- 8. STAT COUNTER ANIMATION ---
    function initStatCounters() {
        const statNumbers = document.querySelectorAll('.about__stat-number[data-target]');

        if (prefersReducedMotion.matches) {
            statNumbers.forEach(el => {
                el.textContent = el.getAttribute('data-target');
            });
            return;
        }

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'), 10);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(element, target) {
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            element.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    initStatCounters();

    // --- 9. BACK-TO-TOP BUTTON ---
    function initBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        const scrollThreshold = 500;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initBackToTop();

    // --- 10. PROJECT CAROUSEL — clone cards for infinite loop ---
    function initProjectCarousel() {
        const track = document.querySelector('.projects__track');
        if (!track) return;

        const cards = track.querySelectorAll('.project-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    initProjectCarousel();

    // --- 11. PACKAGE CAROUSEL — clone cards for infinite loop ---
    function initPackageCarousel() {
        const track = document.querySelector('.packages__track');
        if (!track) return;

        const cards = track.querySelectorAll('.package-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
    }

    initPackageCarousel();

    // --- 12. CERTIFICATE LIGHTBOX ---
    function initCertLightbox() {
        const lightbox = document.getElementById('cert-lightbox');
        if (!lightbox) return;

        const lightboxImg = document.getElementById('cert-lightbox-img');
        const lightboxTitle = document.getElementById('cert-lightbox-title');
        const backdrop = lightbox.querySelector('.cert-lightbox__backdrop');
        const closeBtn = lightbox.querySelector('.cert-lightbox__close');
        let triggerEl = null;

        function openLightbox(src, title, trigger) {
            triggerEl = trigger;
            lightboxImg.src = src;
            lightboxImg.alt = title + ' certificate';
            lightboxTitle.textContent = title;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            document.body.style.overflow = '';
            lightboxImg.src = '';
            if (triggerEl) {
                triggerEl.focus();
                triggerEl = null;
            }
        }

        document.querySelectorAll('.cert-card__zoom-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openLightbox(
                    btn.getAttribute('data-cert-src'),
                    btn.getAttribute('data-cert-title'),
                    btn
                );
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }

    initCertLightbox();

});

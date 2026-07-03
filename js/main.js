/* ==========================================================================
   PREMIUM CLINIC INTERACTIVE LOGIC (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initTheme();
    initCustomCursor();
    initNavbar();
    initScrollProgress();
    initScrollReveal();
    initCounters();
    initSliders();
    initDepartments();
    initDoctorFilters();
    initRippleButtons();
    initFormValidations();
    initBackToTop();
    initFieldFilters();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflowY = 'auto'; // Re-enable scroll
        }, 600); // Small delay for visual pleasure
    });
}

/* ==========================================================================
   2. THEME SWITCHER (DARK/LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.querySelector('.theme-switch');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme');
    
    // Check local storage or system preference
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

/* ==========================================================================
   3. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !cursorDot) return;

    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;     // Current mouse pos
    let cursorX = 0, cursorY = 0;   // Interpolated outer circle pos
    const speed = 0.15;             // Lag/Lerp coefficient

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the inner dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Lerp loop for organic outer circle motion
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover styles for links/interactive elements
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .accordion-header, .slider-dot, .dept-tab-btn, .doc-filter-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

/* ==========================================================================
   4. STICKY NAVBAR & MOBILE TOGGLE
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, header');

    if (!header) return;

    // Scroll Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Nav link on scroll highlight
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id') || '';
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` || 
                (currentSectionId === 'hero' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Menu
    if (menuToggle && navbar) {
        // Create or find overlay element
        let overlay = document.querySelector('.drawer-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'drawer-overlay';
            document.body.appendChild(overlay);
        }

        const openMenu = () => {
            navbar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
            document.documentElement.classList.add('menu-open');
            
            const drawerHeader = navbar.querySelector('.drawer-header');
            if (drawerHeader) {
                drawerHeader.style.setProperty('display', 'flex', 'important');
            }
            
            const lines = menuToggle.querySelectorAll('line');
            lines[0].setAttribute('x1', '5'); lines[0].setAttribute('y1', '5'); lines[0].setAttribute('x2', '19'); lines[0].setAttribute('y2', '19');
            lines[1].style.opacity = '0';
            lines[2].setAttribute('x1', '5'); lines[2].setAttribute('y1', '19'); lines[2].setAttribute('x2', '19'); lines[2].setAttribute('y2', '5');
        };

        const closeMenu = () => {
            navbar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
            
            const drawerHeader = navbar.querySelector('.drawer-header');
            if (drawerHeader) {
                drawerHeader.style.setProperty('display', 'none');
            }
            
            const lines = menuToggle.querySelectorAll('line');
            lines[0].setAttribute('x1', '4'); lines[0].setAttribute('y1', '6'); lines[0].setAttribute('x2', '20'); lines[0].setAttribute('y2', '6');
            lines[1].style.opacity = '1';
            lines[2].setAttribute('x1', '4'); lines[2].setAttribute('y1', '18'); lines[2].setAttribute('x2', '20'); lines[2].setAttribute('y2', '18');
        };

        menuToggle.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on overlay click
        overlay.addEventListener('click', closeMenu);

        // Close on drawer-close click
        const drawerClose = navbar.querySelector('.drawer-close');
        if (drawerClose) {
            drawerClose.addEventListener('click', closeMenu);
        }

        // Close navbar on link click (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    closeMenu();
                }
            });
        });
    }
}

/* ==========================================================================
   5. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
}

/* ==========================================================================
   6. SCROLL REVEAL EFFECT (CUSTOM LIGHTWEIGHT AOS)
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   7. STAT COUNTERS ANIMATION
   ========================================================================== */
function initCounters() {
    const statSection = document.querySelector('.hero-stats, .about-experience-card');
    const counters = document.querySelectorAll('[data-target]');
    if (!statSection || counters.length === 0) return;

    let started = false;

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                counters.forEach(counter => {
                    animateCount(counter);
                });
            }
        });
    }, { threshold: 0.5 });

    countObserver.observe(statSection);

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        let startTime = null;

        function update(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // EaseOutQuad function
            const easeProgress = progress * (2 - progress);
            const value = Math.floor(easeProgress * target);
            
            // Format number or add unit badge
            if (target >= 1000) {
                el.innerText = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k+';
            } else if (el.innerText.includes('%')) {
                el.innerText = value + '%';
            } else if (el.innerText.includes('+')) {
                el.innerText = value + '+';
            } else {
                el.innerText = value;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure target value is explicitly reached
                if (target >= 1000) {
                    el.innerText = (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'k+';
                } else if (el.innerText.includes('%')) {
                    el.innerText = target + '%';
                } else if (el.innerText.includes('+')) {
                    el.innerText = target + '+';
                } else {
                    el.innerText = target;
                }
            }
        }

        requestAnimationFrame(update);
    }
}

/* ==========================================================================
   8. DRAGGABLE SLIDERS (SERVICES & TESTIMONIALS)
   ========================================================================== */
function initSliders() {
    setupDraggableSlider('services-slider', 'services-prev', 'services-next', 'services-dots');
    setupDraggableSlider('testimonials-slider', 'testimonials-prev', 'testimonials-next', 'testimonials-dots');
}

function setupDraggableSlider(sliderId, prevBtnId, nextBtnId, dotsContainerId) {
    const slider = document.getElementById(sliderId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    if (!slider) return;

    const cards = slider.children;
    if (cards.length === 0) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let cardWidth = cards[0].offsetWidth + 32; // card width + gap
    let currentIndex = 0;

    // Generate pagination dots
    const itemsPerScreen = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    const totalDots = Math.max(1, cards.length - itemsPerScreen + 1);

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                scrollToIndex(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.children;
        Array.from(dots).forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function scrollToIndex(idx) {
        currentIndex = Math.max(0, Math.min(idx, totalDots - 1));
        const targetScroll = currentIndex * (slider.scrollWidth / cards.length);
        slider.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
        updateDots();
    }

    // Drag events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    slider.addEventListener('mouseup', () => {
        isDragging = false;
        // Snap to nearest card
        cardWidth = cards[0].offsetWidth + 32;
        const index = Math.round(slider.scrollLeft / cardWidth);
        scrollToIndex(index);
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
        isDragging = false;
        cardWidth = cards[0].offsetWidth + 32;
        const index = Math.round(slider.scrollLeft / cardWidth);
        scrollToIndex(index);
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Buttons navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToIndex(currentIndex + 1);
        });
    }

    // Adapt to window resizing
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + 32;
    });
}

/* ==========================================================================
   9. DEPARTMENTS TAB COMPONENT
   ========================================================================== */
function initDepartments() {
    const tabBtns = document.querySelectorAll('.dept-tab-btn');
    const panels = document.querySelectorAll('.dept-panel');

    if (tabBtns.length === 0 || panels.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // Switch buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch panels
            panels.forEach(p => {
                p.classList.remove('active');
                if (p.getAttribute('id') === target) {
                    p.classList.add('active');
                }
            });
        });
    });
}

/* ==========================================================================
   10. MEET DOCTORS FILTER & SEARCH
   ========================================================================== */
function initDoctorFilters() {
    const filterBtns = document.querySelectorAll('.doc-filter-btn');
    const docCards = document.querySelectorAll('.doctor-card');
    const searchInput = document.getElementById('doctor-search');

    if (docCards.length === 0) return;

    let currentFilter = 'all';
    let searchQuery = '';

    // Filter Buttons Click
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Search input change
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    function applyFilters() {
        docCards.forEach(card => {
            const docDept = card.getAttribute('data-dept');
            const docName = card.querySelector('h4').innerText.toLowerCase();
            
            const matchesFilter = (currentFilter === 'all' || docDept === currentFilter);
            const matchesSearch = (docName.includes(searchQuery) || docDept.includes(searchQuery));

            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Matches transition duration
            }
        });
    }
}

/* ==========================================================================
   11. RIPPLE BUTTON EFFECT
   ========================================================================== */
function initRippleButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ==========================================================================
   12. FORM VALIDATION & POPUP CONFIRMATION
   ========================================================================== */
function initFormValidations() {
    // 12.1 Accordion Panel Toggle (placed here to support interactive FAQs)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close other items
            const parent = item.parentElement;
            parent.querySelectorAll('.accordion-item').forEach(child => {
                child.classList.remove('active');
                child.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 12.2 Booking Form Validation
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(bookingForm)) {
                // Populate success modal confirmation details
                const patientName = document.getElementById('booking-name').value;
                const docSelect = document.getElementById('booking-doctor');
                const selectedDoctorName = docSelect.options[docSelect.selectedIndex].text;
                const bookingDate = document.getElementById('booking-date').value;

                document.getElementById('ticket-patient').innerText = patientName;
                document.getElementById('ticket-doctor').innerText = selectedDoctorName;
                document.getElementById('ticket-date').innerText = new Date(bookingDate).toLocaleDateString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                });
                document.getElementById('ticket-id').innerText = '#' + Math.floor(100000 + Math.random() * 900000);

                // Show Success Modal
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                
                bookingForm.reset();
            }
        });
    }

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                alertCustom("Thank you! Your message has been sent successfully. We will get back to you shortly.");
                contactForm.reset();
            }
        });
    }

    // Newsletter Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value.trim() && validateEmail(input.value.trim())) {
                alertCustom("Subscribed successfully! Thank you for joining our newsletter.");
                input.value = '';
            } else {
                alertCustom("Please enter a valid email address.", true);
            }
        });
    }

    // Login Form Validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = loginForm.querySelectorAll('[required]');
            let hasEmpty = false;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    hasEmpty = true;
                    input.closest('.form-group').classList.add('invalid');
                }
            });
            if (hasEmpty) {
                alertCustom("Please fill in all required fields.", true);
                return;
            }

            const emailInput = document.getElementById('login-email');
            if (emailInput && !validateEmail(emailInput.value.trim())) {
                emailInput.closest('.form-group').classList.add('invalid');
                alertCustom("Please enter a valid email address.", true);
                return;
            }

            const passVal = document.getElementById('login-password').value;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;\"<>,.?/~`-]{8,}$/;
            if (!passwordRegex.test(passVal)) {
                alertCustom("Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.", true);
                const group = document.getElementById('login-password').closest('.form-group');
                group.classList.add('invalid');
                return;
            }
            const roleVal = document.getElementById('login-role').value;
            alertCustom(`Login successful! Welcome back to Stackly.`);
            setTimeout(() => {
                if (roleVal === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'patient-dashboard.html';
                }
            }, 1500);
        });
    }

    // Register Form Validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = registerForm.querySelectorAll('[required]');
            let hasEmpty = false;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    hasEmpty = true;
                    input.closest('.form-group').classList.add('invalid');
                }
            });
            if (hasEmpty) {
                alertCustom("Please fill in all required fields.", true);
                return;
            }

            const emailInput = document.getElementById('register-email');
            if (emailInput && !validateEmail(emailInput.value.trim())) {
                emailInput.closest('.form-group').classList.add('invalid');
                alertCustom("Please enter a valid email address.", true);
                return;
            }

            const phoneInput = document.getElementById('register-phone');
            if (phoneInput && !validatePhone(phoneInput.value.trim())) {
                phoneInput.closest('.form-group').classList.add('invalid');
                alertCustom("Please enter a valid phone number.", true);
                return;
            }

            const termsCheckbox = document.getElementById('register-terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                alertCustom("Please agree to the Terms & Conditions to register.", true);
                return;
            }

            const pass = document.getElementById('register-password').value;
            const confirmPass = document.getElementById('register-confirm').value;

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;\"<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]|\\:;\"<>,.?/~`-]{8,}$/;
            if (!passwordRegex.test(pass)) {
                alertCustom("Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.", true);
                const group = document.getElementById('register-password').closest('.form-group');
                group.classList.add('invalid');
                return;
            }

            if (pass !== confirmPass) {
                const group = document.getElementById('register-confirm').closest('.form-group');
                group.classList.add('invalid');
                alertCustom("Passwords do not match.", true);
                return;
            }

            alertCustom("Registration successful! Welcome to Stackly.");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
}

// Field Validator
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');

    inputs.forEach(input => {
        const group = input.closest('.form-group');
        let isFieldValid = true;

        if (!input.value.trim()) {
            isFieldValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value.trim())) {
            isFieldValid = false;
        } else if (input.type === 'tel' && !validatePhone(input.value.trim())) {
            isFieldValid = false;
        }

        if (!isFieldValid) {
            group.classList.add('invalid');
            isValid = false;
        } else {
            group.classList.remove('invalid');
        }

        // Real-time error clean
        input.addEventListener('input', () => {
            group.classList.remove('invalid');
        });
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                group.classList.remove('invalid');
            });
        }
    });

    return isValid;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    // Basic phone regex (minimum 7 characters, allows +, -, spaces, parentheses)
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return re.test(phone);
}

// Premium custom replacement for standard alert()
function alertCustom(message, isError = false) {
    const alertOverlay = document.createElement('div');
    alertOverlay.style.position = 'fixed';
    alertOverlay.style.top = '0';
    alertOverlay.style.left = '0';
    alertOverlay.style.width = '100%';
    alertOverlay.style.height = '100%';
    alertOverlay.style.backgroundColor = 'rgba(11, 15, 25, 0.4)';
    alertOverlay.style.backdropFilter = 'blur(6px)';
    alertOverlay.style.display = 'flex';
    alertOverlay.style.alignItems = 'center';
    alertOverlay.style.justifyContent = 'center';
    alertOverlay.style.zIndex = '2000';
    alertOverlay.style.opacity = '0';
    alertOverlay.style.transition = 'opacity 0.3s ease';

    const alertBox = document.createElement('div');
    alertBox.style.background = 'var(--bg-secondary)';
    alertBox.style.border = '1px solid var(--border-glass)';
    alertBox.style.borderRadius = 'var(--radius-md)';
    alertBox.style.padding = '2.5rem 2rem';
    alertBox.style.maxWidth = '400px';
    alertBox.style.width = '90%';
    alertBox.style.boxShadow = 'var(--shadow-lg)';
    alertBox.style.textAlign = 'center';
    alertBox.style.transform = 'scale(0.9)';
    alertBox.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    const icon = document.createElement('div');
    icon.style.width = '60px';
    icon.style.height = '60px';
    icon.style.borderRadius = '50%';
    icon.style.backgroundColor = isError ? 'var(--emergency-glow)' : 'var(--success-glow)';
    icon.style.color = isError ? 'var(--emergency)' : 'var(--success)';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    icon.style.fontSize = '1.8rem';
    icon.style.margin = '0 auto 1.2rem auto';
    icon.innerHTML = isError ? 
        `<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` : 
        `<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="20 6 9 17 4 12"/></svg>`;

    const text = document.createElement('p');
    text.style.color = 'var(--text-main)';
    text.style.fontWeight = '600';
    text.style.fontSize = '1rem';
    text.style.marginBottom = '1.5rem';
    text.innerText = message;

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.padding = '0.6rem 1.8rem';
    btn.innerText = 'OK';
    btn.addEventListener('click', () => {
        alertOverlay.style.opacity = '0';
        alertBox.style.transform = 'scale(0.9)';
        setTimeout(() => {
            alertOverlay.remove();
        }, 300);
    });

    alertBox.appendChild(icon);
    alertBox.appendChild(text);
    alertBox.appendChild(btn);
    alertOverlay.appendChild(alertBox);
    document.body.appendChild(alertOverlay);

    // Fade in
    setTimeout(() => {
        alertOverlay.style.opacity = '1';
        alertBox.style.transform = 'scale(1)';
    }, 50);
}

/* ==========================================================================
   13. BACK TO TOP BUTTON WITH CIRCLE PROGRESS
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    const progressCircle = document.querySelector('.btt-circle');
    
    if (!backToTopBtn || !progressCircle) return;

    const circumference = 2 * Math.PI * 22; // 2 * pi * r (r=22)
    progressCircle.style.strokeDasharray = `${circumference}`;

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPos = window.scrollY;

        // Progress calculation
        if (scrollHeight > 0) {
            const progress = scrollPos / scrollHeight;
            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = `${offset}`;
        }

        // Toggle visibility
        if (scrollPos > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   14. FIELD FILTERS (Name alphabets, Phone digits)
   ========================================================================== */
function initFieldFilters() {
    // Names: filter to alphabets only
    const nameInputs = document.querySelectorAll('input[id*="name"]');
    nameInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^a-zA-Z\s]/g, '');
        });
    });

    // Phones: filter to digits only
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[id*="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    });
}

// Initialize Dashboard sidebar trigger
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('.dash-menu-trigger');
    const sidebar = document.querySelector('.dash-sidebar');
    if (trigger && sidebar) {
        const toggleSidebar = () => {
            const isOpen = sidebar.classList.toggle('active');
            if (isOpen) {
                document.body.classList.add('menu-open');
                document.documentElement.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
                document.documentElement.classList.remove('menu-open');
            }
        };

        const closeSidebar = () => {
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        };

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
        
        // Close sidebar when clicking outside on content area
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !trigger.contains(e.target)) {
                closeSidebar();
            }
        });
    }
});


/**
 * CreativeFlow - Premium Digital Agency Landing Page
 * Advanced JavaScript with Industry Best Practices
 * Features: Form validation, animations, performance optimization
 */

'use strict';

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const CONFIG = {
    // Animation settings
    ANIMATION_DELAY: 100,
    SCROLL_THRESHOLD: 100,
    
    // Form validation settings
    EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    
    // API endpoints (replace with actual endpoints)
    ENDPOINTS: {
        CONTACT_FORM: '/api/contact',
        NEWSLETTER: '/api/newsletter',
        LEAD_FORM: '/api/leads'
    },
    
    // Timing constants
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

class Utils {
    /**
     * Debounce function to limit function calls
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    static isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const verticalCheck = (rect.bottom >= windowHeight * threshold) && 
                             (rect.top <= windowHeight * (1 - threshold));
        const horizontalCheck = (rect.right >= windowWidth * threshold) && 
                               (rect.left <= windowWidth * (1 - threshold));
        
        return verticalCheck && horizontalCheck;
    }

    /**
     * Smooth scroll to element
     */
    static smoothScrollTo(element, offset = 80) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Add CSS class with animation support
     */
    static addClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    }

    /**
     * Format phone number for validation
     */
    static formatPhoneNumber(phone) {
        return phone.replace(/[^\d+]/g, '');
    }

    /**
     * Sanitize input to prevent XSS
     */
    static sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Show/hide loading state
     */
    static toggleLoading(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }
}

// =============================================================================
// NAVIGATION FUNCTIONALITY
// =============================================================================

class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navLinks = document.getElementById('navLinks');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinkElements = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupActiveNavigation();
        this.setupSmoothScrolling();
    }

    setupScrollEffect() {
        const handleScroll = Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, CONFIG.THROTTLE_DELAY);

        window.addEventListener('scroll', handleScroll);
    }

    setupMobileMenu() {
        if (!this.mobileMenu || !this.navLinks) return;

        this.mobileMenu.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking on nav links
        this.navLinkElements.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        
        // Toggle aria attributes for accessibility
        const isExpanded = this.navLinks.classList.contains('active');
        this.mobileMenu.setAttribute('aria-expanded', isExpanded);
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.navLinks.classList.remove('active');
        this.mobileMenu.setAttribute('aria-expanded', 'false');
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScroll = Utils.throttle(() => {
            let current = '';
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinkElements.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, CONFIG.THROTTLE_DELAY);

        window.addEventListener('scroll', handleScroll);
    }

    setupSmoothScrolling() {
        this.navLinkElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    Utils.smoothScrollTo(targetElement);
                }
            });
        });
    }
}

// =============================================================================
// FORM VALIDATION & SUBMISSION
// =============================================================================

class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value.trim() !== '',
            email: (value) => CONFIG.EMAIL_REGEX.test(value),
            phone: (value) => CONFIG.PHONE_REGEX.test(Utils.formatPhoneNumber(value)),
            minLength: (value, length) => value.length >= length
        };
    }

    validateField(field, rules = []) {
        const value = field.value.trim();
        const errors = [];

        rules.forEach(rule => {
            if (typeof rule === 'string') {
                if (rule === 'required' && !this.rules.required(value)) {
                    errors.push('This field is required');
                } else if (rule === 'email' && value && !this.rules.email(value)) {
                    errors.push('Please enter a valid email address');
                } else if (rule === 'phone' && value && !this.rules.phone(value)) {
                    errors.push('Please enter a valid phone number');
                }
            } else if (typeof rule === 'object') {
                if (rule.type === 'minLength' && !this.rules.minLength(value, rule.value)) {
                    errors.push(`Minimum ${rule.value} characters required`);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    showFieldError(field, errors) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        if (errors.length > 0) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            if (errorElement) {
                errorElement.textContent = errors[0];
                errorElement.classList.add('show');
            }
        } else {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        formGroup.classList.remove('error', 'success');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
}

class FormHandler {
    constructor() {
        this.validator = new FormValidator();
        this.forms = {
            hero: document.getElementById('leadForm'),
            contact: document.getElementById('contactForm'),
            newsletter: document.getElementById('newsletterForm')
        };
        
        this.init();
    }

    init() {
        this.setupHeroForm();
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupRealTimeValidation();
    }

    setupHeroForm() {
        const form = this.forms.hero;
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, 'lead');
        });
    }

    setupContactForm() {
        const form = this.forms.contact;
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, 'contact');
        });
    }

    setupNewsletterForm() {
        const form = this.forms.newsletter;
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmission(form, 'newsletter');
        });
    }

    setupRealTimeValidation() {
        // Real-time validation for all forms
        Object.values(this.forms).forEach(form => {
            if (!form) return;

            const fields = form.querySelectorAll('input, textarea, select');
            
            fields.forEach(field => {
                // Validate on blur
                field.addEventListener('blur', () => {
                    this.validateSingleField(field);
                });

                // Clear errors on focus
                field.addEventListener('focus', () => {
                    this.validator.clearFieldError(field);
                });

                // Real-time validation for email and phone
                if (field.type === 'email' || field.type === 'tel') {
                    const debouncedValidation = Utils.debounce(() => {
                        this.validateSingleField(field);
                    }, CONFIG.DEBOUNCE_DELAY);
                    
                    field.addEventListener('input', debouncedValidation);
                }
            });
        });
    }

    validateSingleField(field) {
        const rules = this.getValidationRules(field);
        const validation = this.validator.validateField(field, rules);
        this.validator.showFieldError(field, validation.errors);
        return validation.isValid;
    }

    getValidationRules(field) {
        const rules = [];
        
        if (field.hasAttribute('required')) {
            rules.push('required');
        }
        
        if (field.type === 'email') {
            rules.push('email');
        }
        
        if (field.type === 'tel') {
            rules.push('phone');
        }
        
        const minLength = field.getAttribute('minlength');
        if (minLength) {
            rules.push({ type: 'minLength', value: parseInt(minLength) });
        }
        
        return rules;
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        fields.forEach(field => {
            const fieldValid = this.validateSingleField(field);
            if (!fieldValid) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async handleFormSubmission(form, type) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate form
        if (!this.validateForm(form)) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }
        
        // Show loading state
        Utils.toggleLoading(submitButton, true);
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Sanitize data
            Object.keys(data).forEach(key => {
                data[key] = Utils.sanitizeInput(data[key]);
            });
            
            // Add metadata
            data.timestamp = new Date().toISOString();
            data.userAgent = navigator.userAgent;
            data.referrer = document.referrer;
            data.formType = type;
            
            // Submit form (simulate API call)
            const success = await this.submitToAPI(data, type);
            
            if (success) {
                this.handleSuccessfulSubmission(form, type);
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            Utils.toggleLoading(submitButton, false);
        }
    }

    async submitToAPI(data, type) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', { type, data });
                
                // Simulate success/failure (90% success rate)
                const success = Math.random() > 0.1;
                resolve(success);
            }, 1500);
        });
        
        // Actual API implementation would look like:
        /*
        try {
            const endpoint = CONFIG.ENDPOINTS[type.toUpperCase() + '_FORM'] || CONFIG.ENDPOINTS.CONTACT_FORM;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('API submission error:', error);
            return false;
        }
        */
    }

    handleSuccessfulSubmission(form, type) {
        // Reset form
        form.reset();
        
        // Clear all validation states
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorElement = group.querySelector('.form-error');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
        
        // Show success message based on form type
        let message;
        switch (type) {
            case 'lead':
                message = 'Thank you! We\'ll get back to you within 24 hours.';
                break;
            case 'contact':
                message = 'Message sent successfully! We\'ll respond soon.';
                break;
            case 'newsletter':
                message = 'Successfully subscribed to our newsletter!';
                break;
            default:
                message = 'Thank you for your submission!';
        }
        
        // Show modal for main forms, notification for newsletter
        if (type === 'newsletter') {
            this.showNotification(message, 'success');
        } else {
            this.showSuccessModal(message);
        }
        
        // Track conversion (replace with actual analytics)
        this.trackConversion(type);
    }

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        if (!modal) return;
        
        const messageElement = modal.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        modal.classList.add('show');
        
        // Focus management for accessibility
        const closeButton = modal.querySelector('button');
        if (closeButton) {
            closeButton.focus();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1060;
            max-width: 350px;
            font-size: 14px;
            line-height: 1.5;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    trackConversion(type) {
        // Google Analytics 4 tracking (replace with your tracking ID)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                form_type: type,
                timestamp: new Date().toISOString()
            });
        }
        
        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                form_type: type
            });
        }
        
        // Console log for development
        console.log('Conversion tracked:', { type, timestamp: new Date().toISOString() });
    }
}

// =============================================================================
// SCROLL ANIMATIONS
// =============================================================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.setupScrollListener();
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * CONFIG.ANIMATION_DELAY);
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }

    setupScrollListener() {
        const animateElements = Utils.throttle(() => {
            this.elements.forEach((element, index) => {
                if (!element.classList.contains('animated') && Utils.isInViewport(element)) {
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, index * CONFIG.ANIMATION_DELAY);
                }
            });
        }, CONFIG.THROTTLE_DELAY);

        window.addEventListener('scroll', animateElements);
        // Initial check
        animateElements();
    }
}

// =============================================================================
// BACK TO TOP FUNCTIONALITY
// =============================================================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        this.setupScrollListener();
        this.setupClickHandler();
    }

    setupScrollListener() {
        const handleScroll = Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            if (scrollY > CONFIG.SCROLL_THRESHOLD) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }, CONFIG.THROTTLE_DELAY);

        window.addEventListener('scroll', handleScroll);
    }

    setupClickHandler() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =============================================================================
// MODAL FUNCTIONALITY
// =============================================================================

class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Close modal when clicking outside
        this.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
            
            // Close button
            const closeBtn = modal.querySelector('button');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        
        // Return focus to the element that opened the modal
        const focusReturn = document.querySelector('[data-modal-trigger]');
        if (focusReturn) {
            focusReturn.focus();
        }
    }
}

// Global function for closing modal (called from HTML)
function closeModal() {
    const modal = document.querySelector('.modal.show');
    if (modal) {
        modal.classList.remove('show');
    }
}

// =============================================================================
// PERFORMANCE OPTIMIZATION
// =============================================================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.preloadCriticalResources();
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    preloadCriticalResources() {
        // Preload hero background image
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const img = new Image();
            img.src = '/images/hero-bg.jpg'; // Replace with actual image path
        }
    }

    lazyLoadImages() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading support
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback with Intersection Observer
            this.setupImageLazyLoading();
        }
    }

    setupImageLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.classList.add('reduce-animations');
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            const animatedElements = document.querySelectorAll('[style*="animation"]');
            animatedElements.forEach(element => {
                if (document.hidden) {
                    element.style.animationPlayState = 'paused';
                } else {
                    element.style.animationPlayState = 'running';
                }
            });
        });
    }
}

// =============================================================================
// ACCESSIBILITY ENHANCEMENTS
// =============================================================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.setupReducedMotionSupport();
    }

    setupKeyboardNavigation() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#main-content') || document.querySelector('main');
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
    }

    setupFocusManagement() {
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            const openModal = document.querySelector('.modal.show');
            if (openModal && e.key === 'Tab') {
                this.trapFocus(e, openModal);
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupScreenReaderSupport() {
        // Add ARIA labels where needed
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.hasAttribute('aria-label')) {
                const heading = form.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                    form.setAttribute('aria-labelledby', heading.id || 'form-heading');
                }
            }
        });

        // Announce form validation errors
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    if (element.classList.contains('show') && element.classList.contains('form-error')) {
                        element.setAttribute('aria-live', 'polite');
                        element.setAttribute('role', 'alert');
                    }
                }
            });
        });

        document.querySelectorAll('.form-error').forEach(error => {
            observer.observe(error, { attributes: true });
        });
    }

    setupReducedMotionSupport() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduce-motion');
            
            // Disable smooth scrolling
            document.querySelectorAll('*').forEach(element => {
                element.style.scrollBehavior = 'auto';
            });
        }

        // Listen for changes in motion preference
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduce-motion');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }
        });
    }
}

// =============================================================================
// ANALYTICS & TRACKING
// =============================================================================

class Analytics {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageTracking();
        this.setupInteractionTracking();
        this.setupScrollTracking();
        this.setupFormTracking();
    }

    setupPageTracking() {
        // Page load tracking
        window.addEventListener('load', () => {
            this.track('page_load', {
                page_title: document.title,
                page_url: window.location.href,
                load_time: performance.now(),
                user_agent: navigator.userAgent
            });
        });
    }

    setupInteractionTracking() {
        // Button click tracking
        document.querySelectorAll('.btn, .cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.track('button_click', {
                    button_text: button.textContent.trim(),
                    button_href: button.href || null,
                    section: this.getSection(button)
                });
            });
        });

        // Navigation click tracking
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.track('navigation_click', {
                    link_text: link.textContent.trim(),
                    target_section: link.getAttribute('href')
                });
            });
        });
    }

    setupScrollTracking() {
        let scrollDepth = 0;
        const milestones = [25, 50, 75, 100];
        
        const trackScrollDepth = Utils.throttle(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.scrollY;
            const currentDepth = Math.round((scrollTop / documentHeight) * 100);
            
            milestones.forEach(milestone => {
                if (currentDepth >= milestone && scrollDepth < milestone) {
                    this.track('scroll_depth', {
                        depth: milestone,
                        page_url: window.location.href
                    });
                    scrollDepth = milestone;
                }
            });
        }, 1000);

        window.addEventListener('scroll', trackScrollDepth);
    }

    setupFormTracking() {
        // Form start tracking
        document.querySelectorAll('form').forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            let formStarted = false;
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (!formStarted) {
                        this.track('form_start', {
                            form_id: form.id || 'unknown',
                            form_type: form.dataset.formType || 'unknown'
                        });
                        formStarted = true;
                    }
                });
            });
        });
    }

    getSection(element) {
        const section = element.closest('section');
        return section ? section.id || section.className : 'unknown';
    }

    track(eventName, data = {}) {
        // Console logging for development
        console.log('Analytics Event:', eventName, data);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom analytics endpoint
        this.sendToCustomAnalytics(eventName, data);
    }

    async sendToCustomAnalytics(eventName, data) {
        try {
            // Replace with your analytics endpoint
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: eventName,
                    data: data,
                    timestamp: new Date().toISOString(),
                    page_url: window.location.href,
                    user_agent: navigator.userAgent
                })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }
}

// =============================================================================
// MAIN APPLICATION CLASS
// =============================================================================

class CreativeFlowApp {
    constructor() {
        this.modules = {
            navigation: null,
            formHandler: null,
            scrollAnimations: null,
            backToTop: null,
            modalManager: null,
            performanceOptimizer: null,
            accessibilityManager: null,
            analytics: null
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeModules();
            });
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize all modules
            this.modules.navigation = new Navigation();
            this.modules.formHandler = new FormHandler();
            this.modules.scrollAnimations = new ScrollAnimations();
            this.modules.backToTop = new BackToTop();
            this.modules.modalManager = new ModalManager();
            this.modules.performanceOptimizer = new PerformanceOptimizer();
            this.modules.accessibilityManager = new AccessibilityManager();
            this.modules.analytics = new Analytics();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            // Setup service worker for offline functionality
            this.setupServiceWorker();
            
            console.log('CreativeFlow App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing CreativeFlow App:', error);
        }
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            
            // Track errors in analytics
            if (this.modules.analytics) {
                this.modules.analytics.track('javascript_error', {
                    message: e.message,
                    filename: e.filename,
                    lineno: e.lineno,
                    colno: e.colno
                });
            }
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            
            if (this.modules.analytics) {
                this.modules.analytics.track('promise_rejection', {
                    reason: e.reason.toString()
                });
            }
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
}

// =============================================================================
// ADDITIONAL CSS ANIMATIONS (INJECTED VIA JAVASCRIPT)
// =============================================================================

function injectAdditionalAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .reduce-animations * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
        
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(style);
}

// Fades out the scroll-down arrow after user scrolls
document.addEventListener('scroll', () => {
  const scroll = window.scrollY || window.pageYOffset;
  const el = document.querySelector('.hero-scroll');
  if (el) el.style.opacity = scroll > 60 ? '0' : '1';
});

// =============================================================================
// INITIALIZATION
// =============================================================================

// Inject additional animations
injectAdditionalAnimations();

// Initialize the application
const app = new CreativeFlowApp();

// Make app globally accessible for debugging
window.CreativeFlowApp = app;
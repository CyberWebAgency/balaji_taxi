/**
 * Balaji Taxi & Tempo Traveler - Main JavaScript File
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle) {
        // Create menu close button if it doesn't exist
        let menuClose = menu.querySelector('.menu-close');
        if (!menuClose) {
            menuClose = document.createElement('span');
            menuClose.classList.add('menu-close');
            menuClose.innerHTML = '<i class="fas fa-times"></i>';
            menu.appendChild(menuClose);
        }
        
        // Toggle menu
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
        
        // Close menu
        menuClose.addEventListener('click', function() {
            menu.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when a menu item is clicked
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Quick Enquiry Form
    const enquiryForm = document.getElementById('enquiryForm');
    const closeForm = document.querySelector('.close-form');
    
    // Create a button to open the enquiry form
    const openEnquiryBtn = document.createElement('div');
    openEnquiryBtn.className = 'enquiry-btn';
    openEnquiryBtn.innerHTML = '<i class="fas fa-envelope"></i>';
    document.querySelector('.floating-contact').appendChild(openEnquiryBtn);

    if (openEnquiryBtn) {
        openEnquiryBtn.addEventListener('click', function() {
            enquiryForm.classList.add('active');
        });
    }

    if (closeForm) {
        closeForm.addEventListener('click', function() {
            enquiryForm.classList.remove('active');
        });
    }

    // Close form when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.enquiry-form') && !event.target.closest('.enquiry-btn') && enquiryForm.classList.contains('active')) {
            enquiryForm.classList.remove('active');
        }
    });

    // Sticky header on scroll
    const header = document.querySelector('header');
    const topBar = document.querySelector('.top-bar');
    let topBarHeight = topBar ? topBar.offsetHeight : 0;
    let lastScrollY = 0;

    function updateHeaderState() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > topBarHeight) {
            header.classList.add('sticky');
            // For mobile, ensure the header doesn't hide under content
            document.body.style.paddingTop = header.offsetHeight + 'px';
            
            // Hide header on scroll down, show on scroll up (for mobile)
            if (window.innerWidth < 992) {
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
        } else {
            header.classList.remove('sticky');
            header.style.transform = 'translateY(0)';
            document.body.style.paddingTop = '0';
        }
        
        lastScrollY = currentScrollY;
    }

    // Initialize header state
    updateHeaderState();
    
    window.addEventListener('scroll', updateHeaderState);
    window.addEventListener('resize', function() {
        topBarHeight = topBar ? topBar.offsetHeight : 0;
        updateHeaderState();
    });

    // Execute on load to set initial state
    window.addEventListener('load', updateHeaderState);

    // Smooth scroll for anchor links with offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to current navigation item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.menu a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation || 
            (currentLocation === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Enhance form validation with improved visual feedback
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add real-time validation feedback
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateInput(field)) {
                    valid = false;
                }
            });
            
            if (!valid) {
                e.preventDefault();
                // Focus the first invalid field
                form.querySelector('.error').focus();
            }
        });
    });
    
    function validateInput(field) {
        let isValid = true;
        const errorElement = field.parentElement.querySelector('.error-message');
        
        // Remove any existing error message
        if (errorElement) {
            errorElement.remove();
        }
        
        // Check if empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            showError(field, 'This field is required');
        }
        // Email validation
        else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                showError(field, 'Please enter a valid email address');
            }
        }
        // Phone validation
        else if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[0-9]{10,}$/;
            if (!phoneRegex.test(field.value.replace(/[^0-9]/g, ''))) {
                isValid = false;
                showError(field, 'Please enter a valid phone number');
            }
        }
        
        if (isValid) {
            field.classList.remove('error');
        }
        
        return isValid;
    }
    
    function showError(field, message) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
    }

    // Back to top button with smooth scroll
    const scrollTopButton = document.createElement('div');
    scrollTopButton.classList.add('scroll-top-btn');
    scrollTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopButton);
    
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide the back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopButton.classList.add('active');
        } else {
            scrollTopButton.classList.remove('active');
        }
    });
    
    // Add CSS for the scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background-color: #f39c12;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 99;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .scroll-top-btn.active {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top-btn:hover {
            background-color: #e67e22;
            transform: translateY(-5px);
        }
        
        @media (max-width: 576px) {
            .scroll-top-btn {
                bottom: 70px;
                right: 15px;
                width: 35px;
                height: 35px;
                font-size: 12px;
            }
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
        }
        
        .error {
            border-color: #e74c3c !important;
        }
        
        .gallery-item.show-overlay .gallery-overlay {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', function() {
                // Toggle current item
                item.classList.toggle('active');
                
                // Update toggle icon
                const icon = item.querySelector('.faq-toggle i');
                if (item.classList.contains('active')) {
                    icon.classList.replace('fa-plus', 'fa-minus');
                } else {
                    icon.classList.replace('fa-minus', 'fa-plus');
                }
            });
        });
    }
    
    // Improved testimonial slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        if (testimonials.length > 1) {
            let currentIndex = 0;
            let autoScrollInterval;
            
            function showTestimonial(index) {
                const testimonialWidth = testimonials[0].offsetWidth;
                const marginRight = parseInt(window.getComputedStyle(testimonials[0]).marginRight);
                testimonialSlider.scrollTo({
                    left: index * (testimonialWidth + marginRight),
                    behavior: 'smooth'
                });
            }
            
            function startAutoScroll() {
                autoScrollInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % testimonials.length;
                    showTestimonial(currentIndex);
                }, 5000);
            }
            
            // Start auto-scrolling
            startAutoScroll();
            
            // Handle touch events for mobile swiping
            let touchStartX = 0;
            let touchEndX = 0;
            
            testimonialSlider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(autoScrollInterval);
            }, { passive: true });
            
            testimonialSlider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startAutoScroll();
            }, { passive: true });
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    // Swipe left
                    currentIndex = (currentIndex + 1) % testimonials.length;
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe right
                    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                }
                showTestimonial(currentIndex);
            }
            
            // Pause on hover
            testimonialSlider.addEventListener('mouseenter', () => {
                clearInterval(autoScrollInterval);
            });
            
            // Resume on mouse leave
            testimonialSlider.addEventListener('mouseleave', () => {
                startAutoScroll();
            });
        }
    }
    
    // Enhance gallery for mobile devices
    if (document.querySelector('.gallery-container')) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth < 768) {
                    // For touch devices, first click shows overlay, second click follows link
                    if (!this.classList.contains('show-overlay')) {
                        e.preventDefault();
                        // First reset all items
                        galleryItems.forEach(g => g.classList.remove('show-overlay'));
                        // Then show this one
                        this.classList.add('show-overlay');
                    }
                }
            });
        });
        
        // Reset on click outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.gallery-item')) {
                galleryItems.forEach(item => item.classList.remove('show-overlay'));
            }
        });
    }

    // Enhance responsiveness for dynamic content
    function updateContentBasedOnViewport() {
        // Adjust any content based on viewport size
        const isMobile = window.innerWidth < 768;
        
        // Simplify long text on mobile
        document.querySelectorAll('.mobile-simplify').forEach(element => {
            if (isMobile) {
                element.dataset.fullText = element.dataset.fullText || element.textContent;
                element.textContent = element.dataset.simplifiedText || element.dataset.fullText.substring(0, 100) + '...';
            } else if (element.dataset.fullText) {
                element.textContent = element.dataset.fullText;
            }
        });
    }
    
    // Run on load and resize
    updateContentBasedOnViewport();
    window.addEventListener('resize', updateContentBasedOnViewport);
}); 
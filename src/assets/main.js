// Astro main.js: handles interactivity for code blocks, nav, cards, and forms

document.addEventListener('DOMContentLoaded', function() {
    // === Code Highlighting & Copy Button ===
    document.querySelectorAll('pre code').forEach((block) => {
        // Add loading state
        block.parentElement.classList.add('loading');
        // Detect language
        const language = block.className.replace('language-', '');
        block.parentElement.setAttribute('data-language', language);
        // Add copy button
        addCopyButton(block.parentElement);
        // Remove loading state
        block.parentElement.classList.remove('loading');
    });

    // === Smooth Scrolling for Navigation Links ===
    const navLinks = document.querySelectorAll('nav a, .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Offset for fixed nav
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // === Contact Form Handling ===
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            if (!name || !email || !message) {
                alert('Please fill out all fields');
                return;
            }
            alert('Thanks for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // === Animated Entrance for Cards ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const cards = document.querySelectorAll('.content-card, .article-card, .catalog-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // === Mobile Navigation Toggle ===
    const menuToggle = document.querySelector('.menu-toggle');
    const navButtons = document.querySelector('.nav-buttons');
    if (menuToggle && navButtons) {
        menuToggle.addEventListener('click', function() {
            navButtons.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navButtons.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        // Close menu when clicking a nav link
        navButtons.querySelectorAll('.nav-btn').forEach(link => {
            link.addEventListener('click', function() {
                navButtons.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // === Library Search and Tag Filtering ===
    const searchInput = document.getElementById('articleSearch');
    const articlesList = document.getElementById('articlesList');
    const articleCards = articlesList ? articlesList.querySelectorAll('.article-card') : null;
    const noResults = document.getElementById('noResults');
    const categoryTags = document.querySelectorAll('.category-tag');

    if (searchInput && articlesList && articleCards) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            let resultsFound = false;
            articleCards.forEach(card => {
                const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                const cardContent = card.querySelector('p').textContent.toLowerCase();
                const cardTags = card.getAttribute('data-tags').toLowerCase();
                if (
                    cardTitle.includes(searchTerm) ||
                    cardContent.includes(searchTerm) ||
                    cardTags.includes(searchTerm)
                ) {
                    card.style.display = 'block';
                    resultsFound = true;
                } else {
                    card.style.display = 'none';
                }
            });
            if (noResults) {
                noResults.style.display = resultsFound ? 'none' : 'block';
            }
        });
    }

    if (categoryTags.length && articleCards) {
        categoryTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all tags
                categoryTags.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tag
                tag.classList.add('active');
                const category = tag.getAttribute('data-category');
                // Show all articles if "All Topics" is selected
                if (category === 'all') {
                    articleCards.forEach(card => {
                        card.style.display = 'block';
                    });
                    if (noResults) {
                        noResults.style.display = 'none';
                    }
                    return;
                }
                // Filter articles by category
                let resultsFound = false;
                articleCards.forEach(card => {
                    const cardTags = card.getAttribute('data-tags').toLowerCase();
                    if (cardTags.includes(category)) {
                        card.style.display = 'block';
                        resultsFound = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                if (noResults) {
                    noResults.style.display = resultsFound ? 'none' : 'block';
                }
            });
        });
        // Set "All Topics" as active by default
        const allTopicsTag = document.querySelector('.category-tag[data-category="all"]');
        if (allTopicsTag) {
            allTopicsTag.classList.add('active');
        }
    }
});

// === Highlight.js dynamic loading and initialization ===
(function loadAndInitHighlightJS() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    script.onload = () => {
        if (window.hljs) {
            window.hljs.configure({
                languages: [
                    'javascript', 'html', 'css', 'http', 'bash', 'json', 'sql', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'xml', 'yaml', 'markdown', 'shell', 'powershell', 'dockerfile', 'ini', 'nginx', 'apache', 'diff', 'git', 'makefile', 'plaintext'
                ]
            });
            document.querySelectorAll('pre code').forEach((block) => {
                window.hljs.highlightElement(block);
            });
        }
    };
    document.head.appendChild(script);
})();

// Add copy button to code blocks
function addCopyButton(preElement) {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.addEventListener('click', async () => {
        const code = preElement.querySelector('code').textContent;
        try {
            await navigator.clipboard.writeText(code);
            button.textContent = 'Copied!';
            setTimeout(() => { button.textContent = 'Copy'; }, 2000);
        } catch (err) {
            button.textContent = 'Failed to copy';
            setTimeout(() => { button.textContent = 'Copy'; }, 2000);
        }
    });
    preElement.appendChild(button);
} 
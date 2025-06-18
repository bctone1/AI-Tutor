// AI Tutor JavaScript Functions

// DOM Elements
const tabProblems = document.getElementById('tab-problems');
const tabReference = document.getElementById('tab-reference');
const contentProblems = document.getElementById('content-problems');
const contentReference = document.getElementById('content-reference');

// Tab switching functionality
function initializeTabs() {
    if (tabProblems && tabReference && contentProblems && contentReference) {
        
        // Problems tab click handler
        tabProblems.addEventListener('click', function() {
            // Update tab styles
            tabProblems.classList.add('active');
            tabReference.classList.remove('active');
            
            // Show/hide content
            contentProblems.style.display = 'block';
            contentReference.style.display = 'none';
        });

        // Reference tab click handler
        tabReference.addEventListener('click', function() {
            // Update tab styles
            tabReference.classList.add('active');
            tabProblems.classList.remove('active');
            
            // Show/hide content
            contentReference.style.display = 'block';
            contentProblems.style.display = 'none';
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.feature-card, .tech-card, .user-type-card, .new-dashboard-card, .chat-message'
    );

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Progress bar animations
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width and animate
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

// Chat simulation
function initializeChatSimulation() {
    const chatInput = document.querySelector('.chat-input input');
    const chatContent = document.querySelector('.chat-content');
    
    if (chatInput && chatContent) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                simulateUserMessage(this.value.trim());
                this.value = '';
            }
        });
    }
}

function simulateUserMessage(message) {
    const chatContent = document.querySelector('.chat-content');
    
    // Add user message
    const userMessage = createChatMessage('user', message);
    chatContent.appendChild(userMessage);
    
    // Simulate AI response after delay
    setTimeout(() => {
        let aiResponse = '';
        
        if (message.toLowerCase().includes('다음') || message.toLowerCase().includes('next')) {
            aiResponse = `
                <p><strong>문제 2:</strong> 다음 중 말초신경계의 구성 요소가 아닌 것은?</p>
                <div class="question-options">
                    <div>① 뇌신경</div>
                    <div>② 척수신경</div>
                    <div>③ 자율신경</div>
                    <div>④ 소뇌</div>
                    <div>⑤ 감각신경</div>
                </div>
            `;
        } else if (message === '4') {
            aiResponse = `
                <p>정답입니다! ④ 소뇌는 말초신경계가 아닌 중추신경계에 속합니다.</p>
                <p><strong>해설:</strong> 말초신경계는 뇌신경, 척수신경, 자율신경, 감각신경 등으로 구성됩니다. 소뇌는 뇌의 일부로 중추신경계에 속합니다.</p>
                <p>훌륭합니다! 계속해서 학습을 진행해보세요.</p>
            `;
        } else {
            aiResponse = `
                <p>좋은 질문이네요! "${message}"에 대해 더 자세히 설명해드릴게요.</p>
                <p>궁금한 점이 있으시면 언제든 물어보세요. 함께 학습해나가요! 😊</p>
            `;
        }
        
        const aiMessage = createChatMessage('ai', aiResponse);
        chatContent.appendChild(aiMessage);
        
        // Scroll to bottom
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 1000);
    
    // Scroll to bottom
    chatContent.scrollTop = chatContent.scrollHeight;
}

function createChatMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const senderDiv = document.createElement('div');
    senderDiv.className = 'chat-sender';
    senderDiv.textContent = type === 'user' ? '나' : 'AI 튜터';
    if (type === 'ai') {
        senderDiv.classList.add('ai-sender');
    }
    
    const textDiv = document.createElement('div');
    textDiv.className = 'chat-text';
    textDiv.innerHTML = content;
    
    messageDiv.appendChild(senderDiv);
    messageDiv.appendChild(textDiv);
    
    return messageDiv;
}

// File upload simulation
function initializeFileUpload() {
    const uploadBtns = document.querySelectorAll('.upload-btn');
    
    uploadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Create invisible file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            
            if (this.classList.contains('primary')) {
                fileInput.accept = '.xlsx,.csv,.docx';
            } else if (this.classList.contains('success')) {
                fileInput.accept = '.pdf,.txt';
            }
            
            fileInput.addEventListener('change', function(e) {
                const files = Array.from(e.target.files);
                simulateFileUpload(files, btn.classList.contains('success'));
            });
            
            fileInput.click();
        });
    });
}

function simulateFileUpload(files, isReference = false) {
    if (files.length === 0) return;
    
    files.forEach(file => {
        // Simulate upload progress
        console.log(`Uploading ${file.name}...`);
        
        // Add file to list (in a real app, this would be handled by the server)
        setTimeout(() => {
            console.log(`${file.name} uploaded successfully!`);
            // Here you would typically refresh the file list or add the new file to the UI
        }, 1000);
    });
}

// Button hover effects
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Cards hover effects
function initializeCardEffects() {
    const cards = document.querySelectorAll('.feature-card, .tech-card, .user-type-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
}

// Dashboard interaction
function initializeDashboardInteractions() {
    const continueBtn = document.querySelector('.continue-learning-btn');
    const progressItems = document.querySelectorAll('.progress-item');
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            alert('학습을 시작합니다! 🚀');
        });
    }
    
    progressItems.forEach(item => {
        item.addEventListener('click', function() {
            const subject = this.querySelector('.progress-header span').textContent;
            console.log(`${subject} 학습 상세 정보를 확인합니다.`);
        });
    });
    
    recommendationItems.forEach(item => {
        item.addEventListener('click', function() {
            const subject = this.textContent;
            console.log(`${subject} 집중 학습을 시작합니다.`);
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder*="검색"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            console.log(`검색어: ${searchTerm}`);
            // In a real app, this would trigger a search API call
        });
    });
}

// Professor management functions
function initializeProfessorManagement() {
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('문제 수정 모달이 열립니다.');
        });
    });
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('정말 삭제하시겠습니까?')) {
                console.log('파일이 삭제되었습니다.');
            }
        });
    });
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('파일 다운로드를 시작합니다.');
        });
    });
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        font-size: 20px;
        font-weight: bold;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    const toggleScrollBtn = throttle(() => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
        } else {
            scrollBtn.style.opacity = '0';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleScrollBtn);
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor scroll performance
    let scrollCount = 0;
    const monitorScroll = throttle(() => {
        scrollCount++;
        if (scrollCount % 50 === 0) {
            console.log(`Scroll events: ${scrollCount}`);
        }
    }, 100);
    
    window.addEventListener('scroll', monitorScroll);
}

// Error handling
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
}

// Main initialization function
function initializeApp() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
        return;
    }
    
    try {
        // Initialize all features
        initializeTabs();
        initializeSmoothScrolling();
        initializeScrollAnimations();
        animateProgressBars();
        initializeChatSimulation();
        initializeFileUpload();
        initializeButtonEffects();
        initializeCardEffects();
        initializeDashboardInteractions();
        initializeSearch();
        initializeProfessorManagement();
        initializeScrollToTop();
        initializePerformanceMonitoring();
        initializeErrorHandling();
        
        console.log('AI Tutor application initialized successfully! 🎉');
        
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application
initializeApp();
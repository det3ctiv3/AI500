/**
 * FieldScore AI - Main JavaScript
 * Handles interactive features and dynamic content
 */

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScroll();
    initAnimations();
    initNavigation();
    initMobileMenu();
    initDemoModal();
    initDemoForm();
    initChatbot();
});

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
 * Mobile menu functionality (for future navigation bar)
 */
function initMobileMenu() {
    // Placeholder for mobile menu - can be expanded when nav is added
    const mobileBreakpoint = 768;
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > mobileBreakpoint) {
            // Reset mobile menu state
            document.body.style.overflow = '';
        }
    });
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
    const modalClose = document.getElementById('modalClose');
    
    // Open modal
    if (tryDemoBtn) {
        tryDemoBtn.addEventListener('click', (e) => {
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
    
    // Toggle chatbot window
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                chatbotInput.focus();
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
        // Call OpenAI API
        const response = await getChatbotResponse(message);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Add bot response
        addChatMessage(response, 'bot');
        
    } catch (error) {
        console.error('Chatbot error:', error);
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Show error message
        addChatMessage(
            "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team.",
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
async function getChatbotResponse(userMessage) {
    // Call backend API for chatbot responses
    const CHAT_API_URL = '/api/chat';
    
    console.log('Sending message to chatbot API:', userMessage);
    
    try {
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                message: userMessage
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
        return getFallbackResponse(userMessage);
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

// Mental Health Chatbot Application
class MentalHealthChatbot {
    constructor() {
        // Data from provided JSON
        this.crisisKeywords = [
            "kill myself", "end my life", "suicide", "hurt myself", "end it all", 
            "no point living", "better off dead", "can't go on", "want to die",
            "worthless", "hopeless", "no one cares", "give up", "self harm",
            "cut myself", "overdose", "jump off", "hang myself"
        ];

        this.moodKeywords = {
            positive: ["happy", "great", "good", "excited", "joyful", "grateful", "awesome", "fantastic", "wonderful", "amazing"],
            negative: ["sad", "depressed", "down", "low", "upset", "hurt", "disappointed", "lonely", "empty", "numb"],
            anxious: ["anxious", "worried", "nervous", "stressed", "panic", "overwhelmed", "scared", "afraid", "tense", "restless"],
            angry: ["angry", "mad", "furious", "frustrated", "irritated", "rage", "annoyed"]
        };

        this.cbtExercises = [
            {
                name: "Thought Challenge",
                description: "Question negative thoughts",
                prompt: "What thought is bothering you? Let's examine if it's realistic and helpful.",
                steps: ["Identify the thought", "What evidence supports this?", "What evidence challenges this?", "What would you tell a friend?", "What's a more balanced thought?"]
            },
            {
                name: "Breathing Exercise",
                description: "Calm your nervous system",
                prompt: "Let's practice deep breathing together. Follow the countdown.",
                instructions: "Breathe in for 4, hold for 4, breathe out for 6. Repeat 5 times."
            },
            {
                name: "5-4-3-2-1 Grounding",
                description: "Ground yourself in the present",
                prompt: "Let's ground you in the present moment using your senses.",
                steps: ["5 things you can see", "4 things you can touch", "3 things you can hear", "2 things you can smell", "1 thing you can taste"]
            },
            {
                name: "Gratitude Practice",
                description: "Shift focus to positive aspects",
                prompt: "What are 3 things you're grateful for today, even small ones?",
                instructions: "Think of anything - a warm cup of coffee, a text from a friend, or simply having a roof over your head."
            }
        ];

        this.crisisResources = [
            {
                name: "988 Suicide & Crisis Lifeline",
                description: "Free, confidential crisis support 24/7",
                phone: "988",
                url: "https://988lifeline.org/chat/",
                text: "Available via phone, chat, or text"
            },
            {
                name: "Crisis Text Line",
                description: "Text-based crisis support",
                text: "Text HOME to 741741",
                url: "https://www.crisistextline.org/"
            },
            {
                name: "Emergency Services",
                description: "For immediate danger",
                phone: "911",
                text: "Call 911 if you're in immediate danger"
            },
            {
                name: "SAMHSA Helpline",
                description: "Treatment referral service",
                phone: "1-800-662-4357",
                url: "https://www.samhsa.gov/find-help/national-helpline"
            }
        ];

        this.empathicResponses = {
            crisis: [
                "I'm really concerned about you right now. Your life has value, and you deserve support.",
                "What you're feeling sounds incredibly difficult. Please know that you don't have to go through this alone.",
                "I can hear that you're in a lot of pain. There are people trained to help you through this."
            ],
            sad: [
                "I hear that you're going through a tough time. It's okay to feel sad.",
                "That sounds really difficult. Thank you for sharing that with me.",
                "I can sense you're hurting. Your feelings are valid."
            ],
            anxious: [
                "It sounds like you're feeling overwhelmed. Anxiety can be really challenging.",
                "I understand you're feeling worried. Let's see if we can work through this together.",
                "That sounds stressful. Would you like to try a calming exercise?"
            ],
            positive: [
                "I'm so glad to hear you're feeling good! That's wonderful.",
                "It's great that you're having a positive day. What's contributing to these good feelings?",
                "That sounds really nice. I love hearing when you're doing well."
            ],
            angry: [
                "I can hear that you're feeling frustrated. Those feelings are completely valid.",
                "It sounds like you're dealing with some difficult emotions right now.",
                "Anger can be overwhelming. Would it help to talk through what's making you feel this way?"
            ]
        };

        this.supportivePhrases = [
            "I'm here to listen.",
            "That sounds really challenging.",
            "Thank you for sharing that with me.",
            "Your feelings are valid.",
            "You're not alone in this.",
            "It makes sense that you'd feel that way.",
            "How can I best support you right now?",
            "What do you think might help?"
        ];

        // Application state
        this.userName = '';
        this.isAnonymous = true;
        this.saveHistory = false;
        this.conversations = [];
        this.currentMood = null;
        this.dailyCheckin = false;
        
        // Initialize the application
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up application...');
        this.setupWelcomeScreen();
        this.setupChatInterface();
        this.populateCrisisResources();
        this.populateExerciseButtons();
        this.loadSettings();
        this.checkDailyReminder();
    }

    setupWelcomeScreen() {
        console.log('Setting up welcome screen...');
        
        // User type change handler
        const userTypeRadios = document.querySelectorAll('input[name="userType"]');
        userTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('User type changed to:', e.target.value);
                this.handleUserTypeChange();
            });
        });

        // Consent checkbox handler
        const consentCheckbox = document.getElementById('consent');
        if (consentCheckbox) {
            consentCheckbox.addEventListener('change', (e) => {
                console.log('Consent changed to:', e.target.checked);
                this.handleConsentChange();
            });
        }

        // Start chat button handler
        const startChatBtn = document.getElementById('start-chat');
        if (startChatBtn) {
            console.log('Setting up start chat button...');
            startChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start chat clicked!');
                this.startChat();
            });
        } else {
            console.error('Start chat button not found!');
        }

        // Initialize consent state
        this.handleConsentChange();
    }

    setupChatInterface() {
        console.log('Setting up chat interface...');
        
        // Send message button
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Message input
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Header buttons
        const moodTrackerBtn = document.getElementById('mood-tracker-btn');
        const crisisResourcesBtn = document.getElementById('crisis-resources-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (moodTrackerBtn) {
            moodTrackerBtn.addEventListener('click', () => this.showModal('mood-modal'));
        }
        if (crisisResourcesBtn) {
            crisisResourcesBtn.addEventListener('click', () => this.showModal('crisis-modal'));
        }
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showModal('settings-modal'));
        }

        // Modal handlers
        this.setupModalHandlers();
    }

    setupModalHandlers() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.dataset.modal;
                if (modalId) {
                    this.hideModal(modalId);
                }
            });
        });

        // Modal backgrounds (close on click)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Mood tracking
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const mood = e.currentTarget.dataset.mood;
                this.recordMood(mood);
            });
        });

        // Crisis modal buttons
        const crisisContinueBtn = document.getElementById('crisis-continue');
        const crisisCloseBtn = document.getElementById('crisis-close');

        if (crisisContinueBtn) {
            crisisContinueBtn.addEventListener('click', () => {
                this.hideModal('crisis-modal');
            });
        }

        if (crisisCloseBtn) {
            crisisCloseBtn.addEventListener('click', () => {
                this.hideModal('crisis-modal');
                this.addBotMessage("I'm glad you're safe. Remember, I'm here whenever you need to talk. If you change your mind and need help, those resources are always available.");
            });
        }

        // Settings
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearHistory();
            });
        }
    }

    handleUserTypeChange() {
        const selectedType = document.querySelector('input[name="userType"]:checked');
        if (!selectedType) return;

        const usernameInput = document.getElementById('username-input');
        
        if (selectedType.value === 'username') {
            usernameInput.classList.remove('hidden');
            this.isAnonymous = false;
        } else {
            usernameInput.classList.add('hidden');
            this.isAnonymous = true;
        }
    }

    handleConsentChange() {
        const consent = document.getElementById('consent');
        const startBtn = document.getElementById('start-chat');
        
        if (consent && startBtn) {
            const isConsented = consent.checked;
            console.log('Consent state:', isConsented);
            startBtn.disabled = !isConsented;
            
            // Add visual feedback
            if (isConsented) {
                startBtn.classList.remove('btn--disabled');
            } else {
                startBtn.classList.add('btn--disabled');
            }
        }
    }

    startChat() {
        console.log('Starting chat transition...');
        
        // Validate consent
        const consentCheckbox = document.getElementById('consent');
        if (!consentCheckbox || !consentCheckbox.checked) {
            console.log('Consent not given');
            alert('Please read and accept the disclaimer to continue.');
            return;
        }

        // Get user preferences
        const usernameField = document.getElementById('userNameField');
        const saveHistoryCheckbox = document.getElementById('saveHistory');
        
        if (!this.isAnonymous && usernameField && usernameField.value.trim()) {
            this.userName = usernameField.value.trim();
            console.log('Username set to:', this.userName);
        }
        
        if (saveHistoryCheckbox) {
            this.saveHistory = saveHistoryCheckbox.checked;
            console.log('Save history:', this.saveHistory);
        }
        
        // Save settings
        this.saveSettings();
        
        // Hide welcome screen and show chat
        const welcomeScreen = document.getElementById('welcome-screen');
        const chatInterface = document.getElementById('chat-interface');
        
        if (!welcomeScreen || !chatInterface) {
            console.error('Cannot find welcome screen or chat interface elements');
            return;
        }

        console.log('Hiding welcome screen...');
        welcomeScreen.style.display = 'none';
        
        console.log('Showing chat interface...');
        chatInterface.classList.remove('hidden');
        chatInterface.style.display = 'flex';
        
        // Send initial greeting
        console.log('Scheduling initial greeting...');
        setTimeout(() => {
            this.sendInitialGreeting();
        }, 500);
    }

    sendInitialGreeting() {
        console.log('Sending initial greeting...');
        
        const greeting = this.isAnonymous 
            ? "Hello! I'm here to provide a safe space for you to share what's on your mind. I'm an AI companion designed to listen and offer support, though I'm not a replacement for professional therapy."
            : `Hello ${this.userName}! I'm here to provide a safe space for you to share what's on your mind. I'm an AI companion designed to listen and offer support, though I'm not a replacement for professional therapy.`;
        
        this.addBotMessage(greeting, false, false);
        
        setTimeout(() => {
            this.addBotMessage("How are you feeling today? Feel free to share whatever is on your mind - there's no judgment here.", false, false);
        }, 1500);
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        if (!input) return;

        const message = input.value.trim();
        
        if (!message) return;
        
        console.log('User message:', message);
        
        // Add user message
        this.addUserMessage(message);
        input.value = '';
        
        // Process message
        setTimeout(() => {
            this.processMessage(message);
        }, 800);
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for crisis keywords
        if (this.detectCrisis(lowerMessage)) {
            console.log('Crisis detected in message');
            this.handleCrisis();
            return;
        }
        
        // Detect mood
        const mood = this.detectMood(lowerMessage);
        console.log('Detected mood:', mood);
        
        // Generate empathetic response
        const response = this.generateResponse(lowerMessage, mood);
        this.addBotMessage(response);
        
        // Save conversation if enabled
        if (this.saveHistory) {
            this.saveConversation(message, response);
        }
    }

    detectCrisis(message) {
        return this.crisisKeywords.some(keyword => message.includes(keyword));
    }

    detectMood(message) {
        const moods = Object.keys(this.moodKeywords);
        
        for (const mood of moods) {
            const keywords = this.moodKeywords[mood];
            if (keywords.some(keyword => message.includes(keyword))) {
                return mood;
            }
        }
        
        return 'neutral';
    }

    generateResponse(message, mood) {
        let response = '';
        
        // Get empathetic response based on mood
        if (mood !== 'neutral' && this.empathicResponses[mood]) {
            const responses = this.empathicResponses[mood];
            response = responses[Math.floor(Math.random() * responses.length)];
        } else {
            // Use general supportive phrases
            response = this.supportivePhrases[Math.floor(Math.random() * this.supportivePhrases.length)];
        }
        
        // Add follow-up questions or suggestions
        const followups = this.getFollowupSuggestions(mood, message);
        if (followups) {
            response += ' ' + followups;
        }
        
        return response;
    }

    getFollowupSuggestions(mood, message) {
        const suggestions = {
            anxious: [
                "Would you like to try a breathing exercise to help calm your mind?",
                "Sometimes grounding exercises can help when we're feeling overwhelmed. Would you like to try one?",
                "What's one thing that usually helps you feel more at ease?"
            ],
            sad: [
                "Would it help to talk about what's contributing to these feelings?",
                "Sometimes when we're feeling down, it can help to focus on small things we're grateful for. What's one thing that brought you even a tiny bit of comfort today?",
                "You don't have to carry these feelings alone. What kind of support would feel most helpful right now?"
            ],
            positive: [
                "That's wonderful to hear! What's been the highlight of your day?",
                "I love that you're feeling good. What do you think has contributed to these positive feelings?",
                "It's great to celebrate the good moments. How can you carry this feeling with you?"
            ],
            angry: [
                "It sounds like you're dealing with something really frustrating. Do you want to tell me more about what happened?",
                "Anger often comes from feeling hurt or unheard. What's underneath these feelings for you?",
                "Would it help to explore some healthy ways to process these intense emotions?"
            ]
        };
        
        if (suggestions[mood]) {
            return suggestions[mood][Math.floor(Math.random() * suggestions[mood].length)];
        }
        
        return "What's been on your mind lately?";
    }

    handleCrisis() {
        console.log('Handling crisis situation...');
        const crisisResponse = this.empathicResponses.crisis[Math.floor(Math.random() * this.empathicResponses.crisis.length)];
        
        // Add crisis-styled message
        this.addBotMessage(crisisResponse, true);
        
        // Show crisis modal immediately
        setTimeout(() => {
            this.showCrisisModal();
        }, 1500);
    }

    showCrisisModal() {
        console.log('Showing crisis modal...');
        
        // Populate crisis resources in modal
        const container = document.getElementById('crisis-modal-resources');
        if (!container) return;

        container.innerHTML = '';
        
        this.crisisResources.forEach(resource => {
            const div = document.createElement('div');
            div.className = 'crisis-resource';
            
            let html = `<h5>${resource.name}</h5><p>${resource.description}</p>`;
            
            if (resource.phone) {
                html += `<a href="tel:${resource.phone}" target="_blank">Call: ${resource.phone}</a><br>`;
            }
            if (resource.text) {
                html += `<span>${resource.text}</span><br>`;
            }
            if (resource.url) {
                html += `<a href="${resource.url}" target="_blank">Online Support</a>`;
            }
            
            div.innerHTML = html;
            container.appendChild(div);
        });
        
        this.showModal('crisis-modal');
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message message--user';
        
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(message)}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message, isCrisis = false, showTyping = true) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }

        if (showTyping) {
            // Show typing indicator
            this.showTypingIndicator();
        }
        
        const delay = showTyping ? 1200 : 100;
        
        setTimeout(() => {
            if (showTyping) {
                this.hideTypingIndicator();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message message--bot';
            
            const bubbleClass = isCrisis ? 'message-bubble crisis-message-bubble' : 'message-bubble';
            
            messageDiv.innerHTML = `
                <div class="${bubbleClass}">${this.escapeHtml(message)}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            this.scrollToBottom();
        }, delay);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const existingIndicator = document.getElementById('typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message message--bot';
        
        typingDiv.innerHTML = `
            <div class="message-bubble typing-indicator">
                <span>AI is typing</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    recordMood(mood) {
        this.currentMood = mood;
        
        const moodNames = ['Very Low', 'Low', 'Neutral', 'Good', 'Very Good'];
        const moodName = moodNames[mood - 1];
        
        this.hideModal('mood-modal');
        
        // Add supportive message based on mood
        setTimeout(() => {
            let response = `Thank you for sharing that you're feeling ${moodName.toLowerCase()} today. `;
            
            if (mood <= 2) {
                response += "I'm here to listen and support you. Would you like to talk about what's contributing to these feelings?";
            } else if (mood === 3) {
                response += "That's okay - not every day has to be amazing. How can I support you today?";
            } else {
                response += "I'm glad you're having a good day! What's been going well for you?";
            }
            
            this.addBotMessage(response);
        }, 500);
        
        // Save mood if history is enabled
        if (this.saveHistory) {
            this.saveMood(mood);
        }
    }

    populateCrisisResources() {
        const container = document.getElementById('crisis-resources-list');
        if (!container) return;

        container.innerHTML = '';
        
        this.crisisResources.forEach(resource => {
            const div = document.createElement('div');
            div.className = 'crisis-resource';
            
            let html = `<h5>${resource.name}</h5><p>${resource.description}</p>`;
            
            if (resource.phone) {
                html += `<a href="tel:${resource.phone}" target="_blank">${resource.phone}</a><br>`;
            }
            if (resource.text) {
                html += `<span>${resource.text}</span><br>`;
            }
            if (resource.url) {
                html += `<a href="${resource.url}" target="_blank">Get Help</a>`;
            }
            
            div.innerHTML = html;
            container.appendChild(div);
        });
    }

    populateExerciseButtons() {
        const container = document.getElementById('exercise-buttons');
        if (!container) return;

        container.innerHTML = '';
        
        this.cbtExercises.forEach((exercise, index) => {
            const button = document.createElement('button');
            button.className = 'exercise-btn';
            button.innerHTML = `
                <h6>${exercise.name}</h6>
                <p>${exercise.description}</p>
            `;
            button.addEventListener('click', () => this.startExercise(index));
            container.appendChild(button);
        });
    }

    startExercise(exerciseIndex) {
        const exercise = this.cbtExercises[exerciseIndex];
        this.showExerciseModal(exercise);
    }

    showExerciseModal(exercise) {
        const title = document.getElementById('exercise-title');
        const content = document.getElementById('exercise-content');
        
        if (!title || !content) return;

        title.textContent = exercise.name;
        
        let html = `<p><strong>${exercise.prompt}</strong></p>`;
        
        if (exercise.steps) {
            html += '<div class="exercise-steps">';
            exercise.steps.forEach((step, index) => {
                html += `<div class="exercise-step">${index + 1}. ${step}</div>`;
            });
            html += '</div>';
        }
        
        if (exercise.instructions) {
            if (exercise.name === 'Breathing Exercise') {
                html += this.createBreathingTimer();
            } else {
                html += `<p><em>${exercise.instructions}</em></p>`;
            }
        }
        
        content.innerHTML = html;
        this.showModal('exercise-modal');
        
        // Start breathing exercise if applicable
        if (exercise.name === 'Breathing Exercise') {
            this.startBreathingExercise();
        }
    }

    createBreathingTimer() {
        return `
            <div class="breathing-timer">
                <div class="breathing-circle" id="breathing-circle">4</div>
                <div class="breathing-instruction" id="breathing-instruction">Get ready...</div>
                <button id="start-breathing" class="btn btn--primary">Start Exercise</button>
            </div>
        `;
    }

    startBreathingExercise() {
        setTimeout(() => {
            const startBtn = document.getElementById('start-breathing');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.runBreathingCycle();
                    startBtn.style.display = 'none';
                });
            }
        }, 100);
    }

    runBreathingCycle() {
        const circle = document.getElementById('breathing-circle');
        const instruction = document.getElementById('breathing-instruction');
        if (!circle || !instruction) return;

        let cycle = 0;
        
        const breathingPattern = [
            { phase: 'inhale', duration: 4000, text: 'Breathe In', count: 4 },
            { phase: 'hold', duration: 4000, text: 'Hold', count: 4 },
            { phase: 'exhale', duration: 6000, text: 'Breathe Out', count: 6 }
        ];
        
        const runPattern = () => {
            if (cycle >= 5) {
                instruction.textContent = 'Great job! How do you feel?';
                circle.textContent = '✓';
                circle.className = 'breathing-circle';
                return;
            }
            
            let patternIndex = 0;
            
            const nextPhase = () => {
                if (patternIndex >= breathingPattern.length) {
                    cycle++;
                    setTimeout(runPattern, 1000);
                    return;
                }
                
                const phase = breathingPattern[patternIndex];
                instruction.textContent = phase.text;
                circle.className = `breathing-circle ${phase.phase}`;
                
                let countdown = phase.count;
                circle.textContent = countdown;
                
                const countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown > 0) {
                        circle.textContent = countdown;
                    } else {
                        clearInterval(countdownInterval);
                        patternIndex++;
                        setTimeout(nextPhase, 500);
                    }
                }, phase.duration / phase.count);
            };
            
            nextPhase();
        };
        
        runPattern();
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveSettings() {
        const settings = {
            userName: this.userName,
            isAnonymous: this.isAnonymous,
            saveHistory: this.saveHistory,
            dailyCheckin: this.dailyCheckin
        };
        
        try {
            localStorage.setItem('mentalHealthChatbotSettings', JSON.stringify(settings));
        } catch (e) {
            console.log('Settings could not be saved - localStorage not available');
        }
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('mentalHealthChatbotSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.userName = parsed.userName || '';
                this.isAnonymous = parsed.isAnonymous !== false;
                this.saveHistory = parsed.saveHistory || false;
                this.dailyCheckin = parsed.dailyCheckin || false;
                
                // Update UI
                const saveHistoryCheckbox = document.getElementById('settings-save-history');
                const dailyCheckinCheckbox = document.getElementById('daily-checkin');
                
                if (saveHistoryCheckbox) saveHistoryCheckbox.checked = this.saveHistory;
                if (dailyCheckinCheckbox) dailyCheckinCheckbox.checked = this.dailyCheckin;
            }
        } catch (e) {
            console.log('Settings could not be loaded - localStorage not available');
        }
    }

    saveConversation(userMessage, botResponse) {
        if (!this.saveHistory) return;
        
        const conversation = {
            timestamp: new Date().toISOString(),
            userMessage,
            botResponse,
            mood: this.currentMood
        };
        
        this.conversations.push(conversation);
        
        try {
            localStorage.setItem('mentalHealthConversations', JSON.stringify(this.conversations));
        } catch (e) {
            console.log('Conversation could not be saved - localStorage not available');
        }
    }

    saveMood(mood) {
        const moodEntry = {
            timestamp: new Date().toISOString(),
            mood: parseInt(mood),
            date: new Date().toDateString()
        };
        
        try {
            const moods = JSON.parse(localStorage.getItem('mentalHealthMoods') || '[]');
            moods.push(moodEntry);
            localStorage.setItem('mentalHealthMoods', JSON.stringify(moods));
        } catch (e) {
            console.log('Mood could not be saved - localStorage not available');
        }
    }

    clearHistory() {
        this.conversations = [];
        try {
            localStorage.removeItem('mentalHealthConversations');
            localStorage.removeItem('mentalHealthMoods');
            alert('Conversation history cleared successfully.');
        } catch (e) {
            console.log('History could not be cleared - localStorage not available');
        }
    }

    checkDailyReminder() {
        if (!this.dailyCheckin) return;
        
        try {
            const lastCheckin = localStorage.getItem('lastDailyCheckin');
            const today = new Date().toDateString();
            
            if (lastCheckin !== today) {
                // Show daily check-in after app loads
                setTimeout(() => {
                    this.showModal('mood-modal');
                    localStorage.setItem('lastDailyCheckin', today);
                }, 3000);
            }
        } catch (e) {
            console.log('Daily reminder check failed - localStorage not available');
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        const container = document.querySelector('.chat-messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing chatbot...');
    window.mentalHealthChatbot = new MentalHealthChatbot();
});
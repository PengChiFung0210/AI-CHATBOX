// UI 相关函数
const UI = {
    // Toast 通知
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // 隐藏欢迎屏幕
    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
    },

    // 显示欢迎屏幕
    showWelcomeScreen() {
        const chatMessages = document.getElementById('chatMessages');
        const welcomeHTML = `
            <div class="welcome-screen" id="welcomeScreen">
                <h2>Hello! I'm your AI Assistant</h2>
                <p>I can help you answer questions, provide suggestions, and assist with creative tasks. Try one of these suggestions to get started!</p>
                <div class="suggestion-chips">
                    <div class="chip" data-text="Write me a poem about spring">Write a poem</div>
                    <div class="chip" data-text="Explain the basics of quantum computing">Explain quantum computing</div>
                    <div class="chip" data-text="Recommend resources for learning programming">Learn programming</div>
                    <div class="chip" data-text="How can I improve my productivity?">Improve productivity</div>
                </div>
            </div>
        `;
        chatMessages.innerHTML = welcomeHTML;
        
        // 重新绑定芯片事件
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const text = chip.getAttribute('data-text');
                Chat.sendMessage(text);
            });
        });
    },

    // 格式化消息
    formatMessage(content) {
        let formatted = content;
        
        // 代码块
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // 行内代码
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 段落
        formatted = formatted.split('\n\n').map(p => `<p>${p}</p>`).join('');
        
        return formatted;
    },

    // 添加消息到界面
    addMessage(content, isUser, withActions = true) {
        this.hideWelcomeScreen();
        
        const chatMessages = document.getElementById('chatMessages');
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${isUser ? 'user' : 'ai'}`;
        
        const avatar = document.createElement('div');
        avatar.className = `avatar ${isUser ? 'user' : 'ai'}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        if (isUser) {
            messageDiv.textContent = content;
        } else {
            messageDiv.innerHTML = this.formatMessage(content);
        }
        
        wrapper.appendChild(avatar);
        wrapper.appendChild(messageDiv);
        
        // 添加操作按钮
        if (withActions && !isUser) {
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="action-btn copy-btn" title="Copy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <button class="action-btn speak-btn" title="Read aloud">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                </button>
                <button class="action-btn regenerate-btn" title="Regenerate">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                </button>
            `;
            messageDiv.appendChild(actions);
            
            // 复制按钮
            actions.querySelector('.copy-btn').addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                const btn = actions.querySelector('.copy-btn');
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            });
            
            // 朗读按钮
            actions.querySelector('.speak-btn').addEventListener('click', () => {
                const btn = actions.querySelector('.speak-btn');
                if (TTS.isSpeaking() && TTS.currentUtterance) {
                    TTS.stop();
                    btn.classList.remove('speaking');
                } else {
                    TTS.speak(content);
                    btn.classList.add('speaking');
                    
                    // 朗读结束后移除样式
                    setTimeout(() => {
                        const checkEnd = setInterval(() => {
                            if (!TTS.isSpeaking()) {
                                btn.classList.remove('speaking');
                                clearInterval(checkEnd);
                            }
                        }, 100);
                    }, 100);
                }
            });
            
            // 重新生成按钮
            actions.querySelector('.regenerate-btn').addEventListener('click', () => {
                if (appState.conversationHistory.length >= 2) {
                    appState.conversationHistory.pop();
                    const lastUserMsg = appState.conversationHistory[appState.conversationHistory.length - 1];
                    wrapper.remove();
                    Chat.sendMessage(lastUserMsg.content);
                }
            });
        }
        
        chatMessages.appendChild(wrapper);
        
        if (appState.settings.autoScroll) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        return messageDiv;
    },

    // 显示打字指示器
    showTypingIndicator() {
        this.hideWelcomeScreen();
        
        const chatMessages = document.getElementById('chatMessages');
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper ai';
        wrapper.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar ai';
        
        const indicator = document.createElement('div');
        indicator.className = 'message ai-message typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        
        wrapper.appendChild(avatar);
        wrapper.appendChild(indicator);
        chatMessages.appendChild(wrapper);
        
        if (appState.settings.autoScroll) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },

    // 移除打字指示器
    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    },

    // 更新字符计数
    updateCharCount(count) {
        const charCount = document.getElementById('charCount');
        charCount.textContent = `${count} / ${CONFIG.MAX_INPUT_LENGTH}`;
        charCount.style.color = count > CONFIG.MAX_INPUT_LENGTH ? '#ef4444' : '#9ca3af';
    }
};

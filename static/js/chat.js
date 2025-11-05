// 聊天功能
const Chat = {
    // 发送消息
    async sendMessage(text = null) {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const stopBtn = document.getElementById('stopBtn');
        const modelSelector = document.getElementById('modelSelector');
        const tempSlider = document.getElementById('tempSlider');
        
        const message = text || messageInput.value.trim();
        if (!message || appState.isTyping) return;

        appState.addMessage('user', message);
        UI.addMessage(message, true);
        
        if (!text) {
            messageInput.value = '';
            messageInput.style.height = 'auto';
            UI.updateCharCount(0);
        }
        
        appState.isTyping = true;
        sendButton.disabled = true;
        stopBtn.style.display = 'flex';
        UI.showTypingIndicator();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    model: modelSelector.value,
                    history: appState.conversationHistory.slice(-CONFIG.MAX_CONTEXT_MESSAGES),
                    temperature: parseFloat(tempSlider.value),
                    systemPrompt: appState.settings.systemPrompt,
                    apiKey: appState.settings.apiKey,
                    openaiApiKey: appState.settings.openaiApiKey,
                    geminiApiKey: appState.settings.geminiApiKey,
                    deepseekApiKey: appState.settings.deepseekApiKey,
                    maxTokens: appState.settings.maxTokens
                })
            });

            UI.removeTypingIndicator();
            const aiMessageDiv = UI.addMessage('', false);
            
            appState.currentReader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';

            while (true) {
                const { done, value } = await appState.currentReader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                aiResponse += data.content;
                                aiMessageDiv.innerHTML = UI.formatMessage(aiResponse);
                                if (appState.settings.autoScroll) {
                                    const chatMessages = document.getElementById('chatMessages');
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                }
                            }
                            if (data.error) {
                                aiMessageDiv.textContent = 'Error: ' + data.error;
                                aiMessageDiv.style.color = '#ef4444';
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }
            
            if (aiResponse) {
                appState.addMessage('assistant', aiResponse);
                appState.createNewSession();
                Sidebar.update();
                
                // 自动朗读
                if (appState.settings.autoSpeak) {
                    TTS.speak(aiResponse);
                }
            }
        } catch (error) {
            UI.removeTypingIndicator();
            const errorMsg = UI.addMessage('Error: Unable to connect to AI service', false);
            errorMsg.style.color = '#ef4444';
            console.error('Error:', error);
        } finally {
            appState.isTyping = false;
            sendButton.disabled = false;
            stopBtn.style.display = 'none';
            appState.currentReader = null;
            messageInput.focus();
        }
    },

    // 停止生成
    stopGeneration() {
        if (appState.currentReader) {
            appState.currentReader.cancel();
            appState.currentReader = null;
            appState.isTyping = false;
            document.getElementById('sendButton').disabled = false;
            document.getElementById('stopBtn').style.display = 'none';
            UI.removeTypingIndicator();
        }
    },

    // 清空对话
    clearChat() {
        if (!confirm('Are you sure you want to clear all conversations?')) return;
        
        appState.clearHistory();
        appState.currentSessionId = null;
        UI.showWelcomeScreen();
    },

    // 恢复聊天记录
    restoreChat() {
        if (appState.conversationHistory.length > 0) {
            UI.hideWelcomeScreen();
            appState.conversationHistory.forEach(msg => {
                UI.addMessage(msg.content, msg.role === 'user', true);
            });
        }
    }
};

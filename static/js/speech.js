// 语音识别功能
const Speech = {
    recognition: null,
    isRecording: false,
    currentLanguage: 'zh-CN',

    // 初始化语音识别
    init() {
        // 检查浏览器支持
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Browser does not support speech recognition');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = this.currentLanguage;

        // 识别结果
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // 更新输入框
            const messageInput = document.getElementById('messageInput');
            if (finalTranscript) {
                const currentText = messageInput.value;
                messageInput.value = currentText + (currentText ? ' ' : '') + finalTranscript;
                messageInput.dispatchEvent(new Event('input'));
            } else if (interimTranscript) {
                // 显示临时识别结果
                this.showInterimResult(interimTranscript);
            }
        };

        // 识别错误
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopRecording();
            
            let errorMsg = 'Speech recognition failed';
            switch (event.error) {
                case 'no-speech':
                    errorMsg = 'No speech detected';
                    break;
                case 'audio-capture':
                    errorMsg = 'Cannot access microphone';
                    break;
                case 'not-allowed':
                    errorMsg = 'Microphone permission denied';
                    break;
                case 'network':
                    errorMsg = 'Network error';
                    break;
            }
            console.error(errorMsg);
        };

        // 识别结束
        this.recognition.onend = () => {
            this.stopRecording();
        };

        return true;
    },

    // 开始录音
    startRecording() {
        if (!this.recognition) {
            if (!this.init()) {
                console.error('Browser does not support speech recognition');
                return;
            }
        }

        if (this.isRecording) {
            this.stopRecording();
            return;
        }

        try {
            this.recognition.lang = this.currentLanguage;
            this.recognition.start();
            this.isRecording = true;
            
            // 更新按钮状态
            const voiceBtn = document.getElementById('voiceBtn');
            voiceBtn.classList.add('recording');
            
            // 显示录音提示
            this.showRecordingIndicator();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
        }
    },

    // 停止录音
    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
        
        this.isRecording = false;
        
        // 更新按钮状态
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
        }
        
        // 隐藏录音提示
        this.hideRecordingIndicator();
    },

    // 显示语言选择菜单
    showLanguageMenu() {
        // 创建语言选择菜单
        let menu = document.getElementById('speechLanguageMenu');
        
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'speechLanguageMenu';
            menu.className = 'speech-language-menu';
            
            const menuContent = document.createElement('div');
            menuContent.className = 'speech-language-content';
            
            const header = document.createElement('div');
            header.className = 'speech-language-header';
            header.innerHTML = `
                <h4>Select Speech Recognition Language</h4>
                <button class="close-btn" id="closeSpeechMenu">&times;</button>
            `;
            
            const search = document.createElement('input');
            search.type = 'text';
            search.className = 'speech-language-search';
            search.placeholder = 'Search language...';
            
            const list = document.createElement('div');
            list.className = 'speech-language-list';
            
            SPEECH_LANGUAGES.forEach(lang => {
                const item = document.createElement('div');
                item.className = `speech-language-item ${lang.code === this.currentLanguage ? 'active' : ''}`;
                item.innerHTML = `
                    <span class="lang-flag">${lang.flag}</span>
                    <span class="lang-name">${lang.name}</span>
                    ${lang.code === this.currentLanguage ? '<span class="lang-check">✓</span>' : ''}
                `;
                item.addEventListener('click', () => {
                    this.setLanguage(lang.code);
                    menu.classList.remove('active');
                });
                list.appendChild(item);
            });
            
            // 搜索功能
            search.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                list.querySelectorAll('.speech-language-item').forEach(item => {
                    const name = item.querySelector('.lang-name').textContent.toLowerCase();
                    item.style.display = name.includes(query) ? 'flex' : 'none';
                });
            });
            
            menuContent.appendChild(header);
            menuContent.appendChild(search);
            menuContent.appendChild(list);
            menu.appendChild(menuContent);
            document.body.appendChild(menu);
            
            // 关闭按钮
            document.getElementById('closeSpeechMenu').addEventListener('click', () => {
                menu.classList.remove('active');
            });
            
            // 点击外部关闭
            menu.addEventListener('click', (e) => {
                if (e.target === menu) {
                    menu.classList.remove('active');
                }
            });
        }
        
        menu.classList.add('active');
    },

    // 设置语言
    setLanguage(langCode) {
        this.currentLanguage = langCode;
        
        if (this.recognition) {
            this.recognition.lang = langCode;
        }
        
        const lang = SPEECH_LANGUAGES.find(l => l.code === langCode);
        const langName = lang ? lang.name : langCode;
        
        // 更新按钮提示
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.title = `Voice input (${langName})`;
        }
        
        // 保存语言设置
        appState.saveSettings({ speechLanguage: this.currentLanguage });
    },

    // 显示录音指示器
    showRecordingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        
        // 移除已存在的指示器
        this.hideRecordingIndicator();
        
        const indicator = document.createElement('div');
        indicator.id = 'recordingIndicator';
        indicator.className = 'recording-indicator';
        indicator.innerHTML = `
            <div class="recording-pulse"></div>
            <div class="recording-text">
                <span>Recording...</span>
                <small>Please speak near the microphone</small>
            </div>
        `;
        
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    // 隐藏录音指示器
    hideRecordingIndicator() {
        const indicator = document.getElementById('recordingIndicator');
        if (indicator) {
            indicator.remove();
        }
        
        const interimResult = document.getElementById('interimResult');
        if (interimResult) {
            interimResult.remove();
        }
    },

    // 显示临时识别结果
    showInterimResult(text) {
        let interimResult = document.getElementById('interimResult');
        
        if (!interimResult) {
            const chatMessages = document.getElementById('chatMessages');
            interimResult = document.createElement('div');
            interimResult.id = 'interimResult';
            interimResult.className = 'interim-result';
            chatMessages.appendChild(interimResult);
        }
        
        interimResult.innerHTML = `
            <div class="interim-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
                <span>${text}</span>
            </div>
        `;
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    // 加载语言设置
    loadLanguage() {
        const settings = appState.loadSettings();
        if (settings.speechLanguage) {
            this.currentLanguage = settings.speechLanguage;
        }
        
        // 更新按钮提示
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            const lang = SPEECH_LANGUAGES.find(l => l.code === this.currentLanguage);
            const langName = lang ? lang.name : this.currentLanguage;
            voiceBtn.title = `Voice input (${langName})`;
        }
    }
};

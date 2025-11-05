// 事件绑定
function initializeEvents() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');
    const exportMenu = document.getElementById('exportMenu');
    const themeBtn = document.getElementById('themeBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const resetSettings = document.getElementById('resetSettings');
    const newChatBtn = document.getElementById('newChatBtn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');

    // 输入框自动调整高度
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        UI.updateCharCount(this.value.length);
    });

    // 发送消息
    sendButton.addEventListener('click', () => Chat.sendMessage());

    // 键盘事件
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            Chat.sendMessage();
        }
    });

    // 停止生成
    stopBtn.addEventListener('click', () => Chat.stopGeneration());

    // 清空对话
    clearBtn.addEventListener('click', () => Chat.clearChat());

    // 导出菜单
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        exportMenu.classList.remove('active');
    });

    exportMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 导出功能
    document.querySelectorAll('.export-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const format = item.getAttribute('data-format');
            if (format === 'txt') Export.exportAsText();
            else if (format === 'json') Export.exportAsJSON();
            else if (format === 'md') Export.exportAsMarkdown();
            exportMenu.classList.remove('active');
        });
    });

    // 主题切换
    themeBtn.addEventListener('click', () => Settings.toggleTheme());

    // 设置面板
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    saveSettings.addEventListener('click', () => {
        Settings.save();
        settingsModal.classList.remove('active');
    });

    resetSettings.addEventListener('click', () => Settings.reset());

    // 新建对话
    newChatBtn.addEventListener('click', () => Sidebar.newChat());

    // 移动端侧边栏切换
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('mobile-active');
            sidebarOverlay.classList.toggle('active');
        });
    }

    sidebarOverlay.addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('mobile-active');
        sidebarOverlay.classList.remove('active');
    });

    // 温度滑块
    tempSlider.addEventListener('input', function() {
        tempValue.textContent = this.value;
    });

    // 建议芯片点击
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.getAttribute('data-text');
            Chat.sendMessage(text);
        });
    });

    // 快速回复按钮点击
    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            Chat.sendMessage(text);
        });
    });

    // 语音输入
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        // 单击开始/停止录音
        voiceBtn.addEventListener('click', () => {
            Speech.startRecording();
        });

        // 长按显示语言选择菜单
        let pressTimer;
        voiceBtn.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                Speech.showLanguageMenu();
            }, 800);
        });

        voiceBtn.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });

        voiceBtn.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });

        // 移动端触摸事件
        voiceBtn.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                Speech.showLanguageMenu();
            }, 800);
        });

        voiceBtn.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
    }
}

// 设置管理
const Settings = {
    // 加载设置到界面
    loadToUI() {
        const settings = appState.loadSettings();
        document.getElementById('apiKeyInput').value = settings.apiKey;
        document.getElementById('openaiApiKeyInput').value = settings.openaiApiKey || '';
        document.getElementById('geminiApiKeyInput').value = settings.geminiApiKey || '';
        document.getElementById('deepseekApiKeyInput').value = settings.deepseekApiKey || '';
        document.getElementById('systemPrompt').value = settings.systemPrompt;
        document.getElementById('autoSave').checked = settings.autoSave;
        document.getElementById('streamMode').checked = settings.streamMode;
        document.getElementById('maxTokens').value = settings.maxTokens;
        document.getElementById('soundEnabled').checked = settings.soundEnabled;
        document.getElementById('autoScroll').checked = settings.autoScroll;
        
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    },

    // 保存设置
    save() {
        const newSettings = {
            apiKey: document.getElementById('apiKeyInput').value,
            openaiApiKey: document.getElementById('openaiApiKeyInput').value,
            geminiApiKey: document.getElementById('geminiApiKeyInput').value,
            deepseekApiKey: document.getElementById('deepseekApiKeyInput').value,
            systemPrompt: document.getElementById('systemPrompt').value,
            autoSave: document.getElementById('autoSave').checked,
            streamMode: document.getElementById('streamMode').checked,
            maxTokens: parseInt(document.getElementById('maxTokens').value),
            soundEnabled: document.getElementById('soundEnabled').checked,
            autoScroll: document.getElementById('autoScroll').checked
        };
        
        appState.saveSettings(newSettings);
    },

    // 重置设置
    reset() {
        if (!confirm('确定要重置所有设置吗？')) return;
        
        localStorage.removeItem('chatSettings');
        localStorage.removeItem('chatHistory');
        localStorage.removeItem('chatSessions');
        setTimeout(() => location.reload(), 500);
    },

    // 切换主题
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        appState.saveSettings({ theme });
    }
};

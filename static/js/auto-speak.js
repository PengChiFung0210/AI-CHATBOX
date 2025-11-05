// 自动朗读功能
function initAutoSpeakToggle() {
    const autoSpeakToggle = document.getElementById('autoSpeakToggle');
    
    if (!autoSpeakToggle) return;

    // 加载设置
    const settings = appState.loadSettings();
    if (settings.autoSpeak) {
        autoSpeakToggle.classList.add('active');
        autoSpeakToggle.title = '自动朗读已开启（点击关闭）';
    } else {
        autoSpeakToggle.title = '自动朗读已关闭（点击开启）';
    }

    // 切换自动朗读
    autoSpeakToggle.addEventListener('click', () => {
        const isActive = autoSpeakToggle.classList.toggle('active');
        appState.saveSettings({ autoSpeak: isActive });
        
        if (isActive) {
            autoSpeakToggle.title = '自动朗读已开启（点击关闭）';
        } else {
            autoSpeakToggle.title = '自动朗读已关闭（点击开启）';
            // 关闭时停止当前朗读
            TTS.stop();
        }
    });
}

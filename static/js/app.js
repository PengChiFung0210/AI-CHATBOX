// 应用初始化
function initializeApp() {
    // 加载设置
    Settings.loadToUI();
    
    // 加载会话历史
    appState.loadSessions();
    Sidebar.update();
    
    // 加载当前对话
    appState.loadHistory();
    if (appState.conversationHistory.length > 0) {
        Chat.restoreChat();
    }
    
    // 初始化语音识别
    Speech.init();
    Speech.loadLanguage();
    
    // 初始化文件上传
    FileUpload.init();
    
    // 初始化提示词库
    PromptLibrary.init();
    
    // 初始化消息搜索
    MessageSearch.init();
    
    // 初始化 TTS
    TTS.init();
    
    // 初始化自动朗读按钮
    initAutoSpeakToggle();
    
    // 绑定事件
    initializeEvents();
    
    // 聚焦输入框
    document.getElementById('messageInput').focus();
    
    console.log('AI Chat App initialized');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeApp);

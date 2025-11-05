// 全局状态管理
class AppState {
    constructor() {
        this.conversationHistory = [];
        this.chatSessions = [];
        this.currentSessionId = null;
        this.isTyping = false;
        this.currentReader = null;
        this.isRecording = false;
        this.recognition = null;
        this.settings = { ...DEFAULT_SETTINGS };
    }

    // 设置相关
    loadSettings() {
        const saved = localStorage.getItem('chatSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        return this.settings;
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('chatSettings', JSON.stringify(this.settings));
    }

    // 会话相关
    loadSessions() {
        const saved = localStorage.getItem('chatSessions');
        if (saved) {
            this.chatSessions = JSON.parse(saved);
        }
        return this.chatSessions;
    }

    saveSessions() {
        localStorage.setItem('chatSessions', JSON.stringify(this.chatSessions));
    }

    addSession(session) {
        const index = this.chatSessions.findIndex(s => s.id === session.id);
        if (index >= 0) {
            this.chatSessions[index] = session;
        } else {
            this.chatSessions.unshift(session);
        }
        this.chatSessions = this.chatSessions.slice(0, CONFIG.MAX_HISTORY_SESSIONS);
        this.saveSessions();
    }

    deleteSession(sessionId) {
        this.chatSessions = this.chatSessions.filter(s => s.id !== sessionId);
        this.saveSessions();
    }

    getSession(sessionId) {
        return this.chatSessions.find(s => s.id === sessionId);
    }

    // 对话历史相关
    loadHistory() {
        if (this.settings.autoSave) {
            const saved = localStorage.getItem('chatHistory');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        }
        return this.conversationHistory;
    }

    saveHistory() {
        if (this.settings.autoSave) {
            localStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
        }
    }

    addMessage(role, content) {
        this.conversationHistory.push({ role, content });
        this.saveHistory();
    }

    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('chatHistory');
    }

    // 会话管理
    createNewSession() {
        if (this.conversationHistory.length === 0) return;
        
        const sessionId = this.currentSessionId || Date.now().toString();
        const title = this.conversationHistory[0]?.content.slice(0, 50) || 'New Chat';
        
        const session = {
            id: sessionId,
            title: title,
            date: new Date().toISOString(),
            history: this.conversationHistory
        };
        
        this.addSession(session);
        this.currentSessionId = sessionId;
    }
}

// 创建全局状态实例
const appState = new AppState();

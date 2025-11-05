// 侧边栏管理
const Sidebar = {
    // 更新侧边栏
    update() {
        const sidebarContent = document.getElementById('sidebarContent');
        
        if (appState.chatSessions.length === 0) {
            sidebarContent.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 20px;">No history yet</p>';
            return;
        }
        
        sidebarContent.innerHTML = appState.chatSessions.map(session => `
            <div class="history-item ${session.id === appState.currentSessionId ? 'active' : ''}" data-id="${session.id}">
                <div class="history-item-title">${session.title}</div>
                <div class="history-item-date">${new Date(session.date).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div class="history-item-actions">
                    <button class="history-action-btn delete-btn" title="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // 绑定点击事件
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.delete-btn')) {
                    e.stopPropagation();
                    const sessionId = item.getAttribute('data-id');
                    this.deleteSession(sessionId);
                } else {
                    const sessionId = item.getAttribute('data-id');
                    this.loadSession(sessionId);
                }
            });
        });
    },

    // 加载会话
    loadSession(sessionId) {
        const session = appState.getSession(sessionId);
        if (!session) return;
        
        appState.conversationHistory = session.history;
        appState.currentSessionId = sessionId;
        document.getElementById('chatMessages').innerHTML = '';
        Chat.restoreChat();
        this.update();
        
        // 移动端关闭侧边栏
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('mobile-active');
            document.getElementById('sidebarOverlay').classList.remove('active');
        }
    },

    // 删除会话
    deleteSession(sessionId) {
        if (!confirm('Are you sure you want to delete this conversation?')) return;
        
        appState.deleteSession(sessionId);
        
        if (appState.currentSessionId === sessionId) {
            appState.clearHistory();
            appState.currentSessionId = null;
            UI.showWelcomeScreen();
        }
        
        this.update();
    },

    // 新建对话
    newChat() {
        if (appState.conversationHistory.length > 0) {
            if (!confirm('Start a new conversation? The current conversation will be saved.')) return;
        }
        
        appState.clearHistory();
        appState.currentSessionId = null;
        UI.showWelcomeScreen();
        this.update();
    }
};

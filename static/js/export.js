// 导出功能
const Export = {
    // 导出为文本
    exportAsText() {
        if (appState.conversationHistory.length === 0) {
            return;
        }
        
        const content = appState.conversationHistory.map(msg => 
            `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
        ).join('\n\n');
        
        this.download(content, `chat-${this.getDateString()}.txt`, 'text/plain');
    },

    // 导出为 JSON
    exportAsJSON() {
        if (appState.conversationHistory.length === 0) {
            return;
        }
        
        const content = JSON.stringify(appState.conversationHistory, null, 2);
        this.download(content, `chat-${this.getDateString()}.json`, 'application/json');
    },

    // 导出为 Markdown
    exportAsMarkdown() {
        if (appState.conversationHistory.length === 0) {
            return;
        }
        
        let content = '# AI Chat Export\n\n';
        appState.conversationHistory.forEach(msg => {
            const role = msg.role === 'user' ? 'User' : 'AI Assistant';
            content += `## ${role}\n\n${msg.content}\n\n---\n\n`;
        });
        
        this.download(content, `chat-${this.getDateString()}.md`, 'text/markdown');
    },

    // 下载文件
    download(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    // 获取日期字符串
    getDateString() {
        return new Date().toISOString().slice(0, 10);
    }
};

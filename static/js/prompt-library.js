// 提示词库功能
const PromptLibrary = {
    customPrompts: [],
    currentCategory: 'all',

    // 初始化
    init() {
        const promptLibraryBtn = document.getElementById('promptLibraryBtn');
        const promptLibraryModal = document.getElementById('promptLibraryModal');
        const closePromptLibrary = document.getElementById('closePromptLibrary');
        const promptSearch = document.getElementById('promptSearch');

        // 加载自定义提示词
        this.loadCustomPrompts();

        // 打开提示词库
        if (promptLibraryBtn) {
            promptLibraryBtn.addEventListener('click', () => {
                this.showLibrary();
            });
        }

        // 关闭提示词库
        if (closePromptLibrary) {
            closePromptLibrary.addEventListener('click', () => {
                promptLibraryModal.classList.remove('active');
            });
        }

        promptLibraryModal.addEventListener('click', (e) => {
            if (e.target === promptLibraryModal) {
                promptLibraryModal.classList.remove('active');
            }
        });

        // 搜索功能
        if (promptSearch) {
            promptSearch.addEventListener('input', (e) => {
                this.filterPrompts(e.target.value);
            });
        }

        // 分类按钮
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.getAttribute('data-category');
                this.renderPrompts();
            });
        });
    },

    // 显示提示词库
    showLibrary() {
        const promptLibraryModal = document.getElementById('promptLibraryModal');
        promptLibraryModal.classList.add('active');
        this.renderPrompts();
    },

    // 渲染提示词列表
    renderPrompts() {
        const promptList = document.getElementById('promptList');
        
        // 合并内置和自定义提示词
        let allPrompts = [...PROMPT_LIBRARY, ...this.customPrompts];
        
        // 按分类过滤
        if (this.currentCategory !== 'all') {
            allPrompts = allPrompts.filter(p => p.category === this.currentCategory);
        }

        if (allPrompts.length === 0) {
            promptList.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 20px;">No prompts available</p>';
            return;
        }

        promptList.innerHTML = allPrompts.map(prompt => `
            <div class="prompt-item" data-id="${prompt.id}">
                <div class="prompt-item-header">
                    <div class="prompt-item-title">${prompt.title}</div>
                    ${prompt.custom ? '<span class="prompt-badge">Custom</span>' : ''}
                </div>
                <div class="prompt-item-desc">${prompt.desc}</div>
                <div class="prompt-item-actions">
                    <button class="prompt-action-btn use-btn" title="Use">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        Use
                    </button>
                    <button class="prompt-action-btn preview-btn" title="Preview">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Preview
                    </button>
                    ${prompt.custom ? `
                        <button class="prompt-action-btn delete-btn" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // 绑定事件
        promptList.querySelectorAll('.prompt-item').forEach(item => {
            const promptId = parseInt(item.getAttribute('data-id'));
            const prompt = allPrompts.find(p => p.id === promptId);

            // 使用按钮
            item.querySelector('.use-btn').addEventListener('click', () => {
                this.usePrompt(prompt);
            });

            // 预览按钮
            item.querySelector('.preview-btn').addEventListener('click', () => {
                this.previewPrompt(prompt);
            });

            // 删除按钮
            const deleteBtn = item.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deletePrompt(promptId);
                });
            }
        });
    },

    // 过滤提示词
    filterPrompts(query) {
        const promptList = document.getElementById('promptList');
        const items = promptList.querySelectorAll('.prompt-item');
        
        items.forEach(item => {
            const title = item.querySelector('.prompt-item-title').textContent.toLowerCase();
            const desc = item.querySelector('.prompt-item-desc').textContent.toLowerCase();
            const match = title.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
            item.style.display = match ? 'block' : 'none';
        });
    },

    // 使用提示词
    usePrompt(prompt) {
        const messageInput = document.getElementById('messageInput');
        
        // 如果提示词包含占位符，显示输入对话框
        if (prompt.prompt.includes('{')) {
            this.showPromptDialog(prompt);
        } else {
            messageInput.value = prompt.prompt;
            messageInput.dispatchEvent(new Event('input'));
            document.getElementById('promptLibraryModal').classList.remove('active');
            messageInput.focus();
        }
    },

    // 显示提示词对话框（处理占位符）
    showPromptDialog(prompt) {
        const placeholders = prompt.prompt.match(/\{(\w+)\}/g);
        if (!placeholders) {
            this.usePrompt(prompt);
            return;
        }

        let promptText = prompt.prompt;
        
        // 简单处理：直接替换占位符为空
        placeholders.forEach(placeholder => {
            const key = placeholder.slice(1, -1);
            const value = window.prompt(`Please enter ${key}:`, '');
            if (value !== null) {
                promptText = promptText.replace(placeholder, value);
            }
        });

        const messageInput = document.getElementById('messageInput');
        messageInput.value = promptText;
        messageInput.dispatchEvent(new Event('input'));
        document.getElementById('promptLibraryModal').classList.remove('active');
        messageInput.focus();
    },

    // 预览提示词
    previewPrompt(prompt) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>${prompt.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="color: #6b7280; margin-bottom: 16px;">${prompt.desc}</p>
                    <div style="background: #f9fafb; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${prompt.prompt}</div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button class="btn-primary" onclick="PromptLibrary.usePrompt(${JSON.stringify(prompt).replace(/"/g, '&quot;')}); this.closest('.modal').remove();">Use</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    // 删除自定义提示词
    deletePrompt(promptId) {
        if (!confirm('Are you sure you want to delete this prompt?')) return;
        
        this.customPrompts = this.customPrompts.filter(p => p.id !== promptId);
        this.saveCustomPrompts();
        this.renderPrompts();
    },

    // 添加自定义提示词
    addCustomPrompt() {
        const title = window.prompt('Prompt title:');
        if (!title) return;

        const desc = window.prompt('Prompt description:');
        if (!desc) return;

        const prompt = window.prompt('Prompt content:');
        if (!prompt) return;

        const category = window.prompt('Category (writing/coding/business/learning):', 'writing');

        const newPrompt = {
            id: Date.now(),
            category: category || 'writing',
            title: title,
            desc: desc,
            prompt: prompt,
            custom: true
        };

        this.customPrompts.push(newPrompt);
        this.saveCustomPrompts();
        this.renderPrompts();
    },

    // 加载自定义提示词
    loadCustomPrompts() {
        const saved = localStorage.getItem('customPrompts');
        if (saved) {
            this.customPrompts = JSON.parse(saved);
        }
    },

    // 保存自定义提示词
    saveCustomPrompts() {
        localStorage.setItem('customPrompts', JSON.stringify(this.customPrompts));
    }
};

// 消息搜索功能
const MessageSearch = {
    isSearching: false,
    currentResults: [],
    currentIndex: -1,

    // 初始化
    init() {
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.toggleSearch();
            });
        }
    },

    // 切换搜索模式
    toggleSearch() {
        if (this.isSearching) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    },

    // 打开搜索
    openSearch() {
        this.isSearching = true;
        
        // 创建搜索栏
        const chatMessages = document.getElementById('chatMessages');
        
        let searchBar = document.getElementById('searchBar');
        if (!searchBar) {
            searchBar = document.createElement('div');
            searchBar.id = 'searchBar';
            searchBar.className = 'search-bar';
            searchBar.innerHTML = `
                <div class="search-input-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input type="text" id="searchInput" placeholder="Search messages..." />
                    <span class="search-results-count" id="searchResultsCount"></span>
                </div>
                <div class="search-actions">
                    <button class="search-nav-btn" id="searchPrev" title="Previous" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button class="search-nav-btn" id="searchNext" title="Next" disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <button class="search-close-btn" id="searchClose" title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
            
            chatMessages.parentElement.insertBefore(searchBar, chatMessages);
        }

        searchBar.style.display = 'flex';
        
        // 绑定事件
        const searchInput = document.getElementById('searchInput');
        const searchPrev = document.getElementById('searchPrev');
        const searchNext = document.getElementById('searchNext');
        const searchClose = document.getElementById('searchClose');

        searchInput.addEventListener('input', (e) => {
            this.search(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    this.previousResult();
                } else {
                    this.nextResult();
                }
            } else if (e.key === 'Escape') {
                this.closeSearch();
            }
        });

        searchPrev.addEventListener('click', () => this.previousResult());
        searchNext.addEventListener('click', () => this.nextResult());
        searchClose.addEventListener('click', () => this.closeSearch());

        // 聚焦输入框
        searchInput.focus();
    },

    // 关闭搜索
    closeSearch() {
        this.isSearching = false;
        
        const searchBar = document.getElementById('searchBar');
        if (searchBar) {
            searchBar.style.display = 'none';
        }

        // 清除高亮
        this.clearHighlights();
        this.currentResults = [];
        this.currentIndex = -1;
    },

    // 搜索消息
    search(query) {
        // 清除之前的高亮
        this.clearHighlights();
        this.currentResults = [];
        this.currentIndex = -1;

        if (!query.trim()) {
            this.updateResultsCount();
            return;
        }

        const chatMessages = document.getElementById('chatMessages');
        const messages = chatMessages.querySelectorAll('.message');

        messages.forEach((message, index) => {
            const text = message.textContent;
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();

            if (lowerText.includes(lowerQuery)) {
                // 高亮匹配的文本
                this.highlightText(message, query);
                this.currentResults.push({ element: message, index: index });
            }
        });

        if (this.currentResults.length > 0) {
            this.currentIndex = 0;
            this.scrollToResult(0);
        }

        this.updateResultsCount();
    },

    // 高亮文本
    highlightText(element, query) {
        const text = element.textContent;
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        
        // 保存原始内容
        if (!element.dataset.originalContent) {
            element.dataset.originalContent = element.innerHTML;
        }

        const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        element.innerHTML = highlighted;
    },

    // 清除高亮
    clearHighlights() {
        const chatMessages = document.getElementById('chatMessages');
        const messages = chatMessages.querySelectorAll('.message');

        messages.forEach(message => {
            if (message.dataset.originalContent) {
                message.innerHTML = message.dataset.originalContent;
                delete message.dataset.originalContent;
            }
            message.classList.remove('search-current');
        });
    },

    // 下一个结果
    nextResult() {
        if (this.currentResults.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.currentResults.length;
        this.scrollToResult(this.currentIndex);
        this.updateResultsCount();
    },

    // 上一个结果
    previousResult() {
        if (this.currentResults.length === 0) return;

        this.currentIndex = (this.currentIndex - 1 + this.currentResults.length) % this.currentResults.length;
        this.scrollToResult(this.currentIndex);
        this.updateResultsCount();
    },

    // 滚动到结果
    scrollToResult(index) {
        // 移除之前的当前标记
        document.querySelectorAll('.search-current').forEach(el => {
            el.classList.remove('search-current');
        });

        const result = this.currentResults[index];
        if (result) {
            result.element.classList.add('search-current');
            result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    // 更新结果计数
    updateResultsCount() {
        const searchResultsCount = document.getElementById('searchResultsCount');
        const searchPrev = document.getElementById('searchPrev');
        const searchNext = document.getElementById('searchNext');

        if (this.currentResults.length > 0) {
            searchResultsCount.textContent = `${this.currentIndex + 1} / ${this.currentResults.length}`;
            searchPrev.disabled = false;
            searchNext.disabled = false;
        } else {
            searchResultsCount.textContent = this.isSearching && document.getElementById('searchInput').value ? 'No results' : '';
            searchPrev.disabled = true;
            searchNext.disabled = true;
        }
    },

    // 转义正则表达式特殊字符
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};

// 文件上传和分析功能
const FileUpload = {
    currentFile: null,
    maxFileSize: 10 * 1024 * 1024, // 10MB

    // 初始化
    init() {
        const imageBtn = document.getElementById('imageBtn');
        const imageModal = document.getElementById('imageModal');
        const closeImageModal = document.getElementById('closeImageModal');
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        const removeImage = document.getElementById('removeImage');

        // 打开文件上传模态框
        if (imageBtn) {
            imageBtn.addEventListener('click', () => {
                imageModal.classList.add('active');
            });
        }

        // 关闭模态框
        if (closeImageModal) {
            closeImageModal.addEventListener('click', () => {
                imageModal.classList.remove('active');
            });
        }

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
            }
        });

        // 点击上传区域
        if (imageUploadArea) {
            imageUploadArea.addEventListener('click', () => {
                imageInput.click();
            });
        }

        // 拖拽上传
        if (imageUploadArea) {
            imageUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = '#3b82f6';
                imageUploadArea.style.background = '#eff6ff';
            });

            imageUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = '#e5e7eb';
                imageUploadArea.style.background = '';
            });

            imageUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUploadArea.style.borderColor = '#e5e7eb';
                imageUploadArea.style.background = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            });
        }

        // 文件选择
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            });
        }

        // 移除文件
        if (removeImage) {
            removeImage.addEventListener('click', () => {
                this.removeFile();
            });
        }
    },

    // 处理文件
    async handleFile(file) {
        // 检查文件大小
        if (file.size > this.maxFileSize) {
            alert('File size cannot exceed 10MB');
            return;
        }

        // 检查文件类型
        const allowedTypes = [
            'text/plain',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/markdown',
            'text/x-markdown'
        ];

        const fileExt = file.name.split('.').pop().toLowerCase();
        const allowedExts = ['txt', 'pdf', 'docx', 'doc', 'md'];

        if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
            alert('Unsupported file type. Supported: TXT, PDF, Word, Markdown');
            return;
        }

        this.currentFile = file;

        // 显示预览
        this.showPreview(file);

        // 上传文件
        await this.uploadFile(file);
    },

    // 显示预览
    showPreview(file) {
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imagePreview = document.getElementById('imagePreview');

        imageUploadArea.style.display = 'none';
        imagePreview.style.display = 'block';

        // 显示文件信息
        const fileIcon = this.getFileIcon(file.name);
        const fileSize = this.formatFileSize(file.size);

        imagePreview.innerHTML = `
            <div class="file-preview-content">
                <div class="file-icon">${fileIcon}</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                    <div class="file-status">
                        <div class="upload-progress">
                            <div class="progress-bar" id="uploadProgress"></div>
                        </div>
                        <span class="status-text" id="uploadStatus">Ready to upload...</span>
                    </div>
                </div>
            </div>
            <button class="btn-secondary" id="removeFileBtn">Remove file</button>
        `;

        // 重新绑定移除按钮
        document.getElementById('removeFileBtn').addEventListener('click', () => {
            this.removeFile();
        });
    },

    // 上传文件
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadStatus = document.getElementById('uploadStatus');
        const uploadProgress = document.getElementById('uploadProgress');

        try {
            uploadStatus.textContent = 'Uploading...';

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();

            if (result.success) {
                uploadProgress.style.width = '100%';
                uploadStatus.textContent = 'Upload successful!';
                uploadStatus.style.color = '#10b981';

                // 显示文件内容摘要
                if (result.content) {
                    this.showContentSummary(result.content, result.filename);
                }

                // 3秒后关闭模态框
                setTimeout(() => {
                    document.getElementById('imageModal').classList.remove('active');
                    this.removeFile();
                }, 3000);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            uploadStatus.textContent = 'Upload failed: ' + error.message;
            uploadStatus.style.color = '#ef4444';
        }
    },

    // 显示内容摘要
    showContentSummary(content, filename) {
        const preview = `📄 **File uploaded: ${filename}**\n\nContent preview:\n${content.substring(0, 500)}${content.length > 500 ? '...' : ''}`;
        
        // 添加到输入框
        const messageInput = document.getElementById('messageInput');
        const currentText = messageInput.value;
        messageInput.value = currentText + (currentText ? '\n\n' : '') + preview;
        messageInput.dispatchEvent(new Event('input'));
    },

    // 移除文件
    removeFile() {
        this.currentFile = null;
        
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const imageInput = document.getElementById('imageInput');

        imageUploadArea.style.display = 'flex';
        imagePreview.style.display = 'none';
        imageInput.value = '';
    },

    // 获取文件图标
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'txt': '📄',
            'pdf': '📕',
            'doc': '📘',
            'docx': '📘',
            'md': '📝'
        };
        return icons[ext] || '📄';
    },

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

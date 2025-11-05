// 语音朗读（TTS）功能
const TTS = {
    synthesis: window.speechSynthesis,
    currentUtterance: null,
    isPaused: false,
    voices: [],
    currentVoice: null,
    rate: 1.0,
    pitch: 1.0,

    // 初始化
    init() {
        if (!this.synthesis) {
            console.error('浏览器不支持语音合成');
            return false;
        }

        // 加载可用语音
        this.loadVoices();
        
        // 监听语音列表变化
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }

        return true;
    },

    // 加载可用语音
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // 优先选择中文语音
        const chineseVoice = this.voices.find(v => v.lang.startsWith('zh'));
        if (chineseVoice) {
            this.currentVoice = chineseVoice;
        } else if (this.voices.length > 0) {
            this.currentVoice = this.voices[0];
        }
    },

    // 朗读文本
    speak(text) {
        if (!this.synthesis) return;

        // 停止当前朗读
        this.stop();

        // 创建语音实例
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.voice = this.currentVoice;
        this.currentUtterance.rate = this.rate;
        this.currentUtterance.pitch = this.pitch;

        // 事件监听
        this.currentUtterance.onstart = () => {
            this.isPaused = false;
        };

        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
            this.isPaused = false;
        };

        this.currentUtterance.onerror = (event) => {
            console.error('TTS 错误:', event);
        };

        // 开始朗读
        this.synthesis.speak(this.currentUtterance);
    },

    // 暂停
    pause() {
        if (this.synthesis.speaking && !this.isPaused) {
            this.synthesis.pause();
            this.isPaused = true;
        }
    },

    // 继续
    resume() {
        if (this.synthesis.speaking && this.isPaused) {
            this.synthesis.resume();
            this.isPaused = false;
        }
    },

    // 停止
    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.currentUtterance = null;
            this.isPaused = false;
        }
    },

    // 是否正在朗读
    isSpeaking() {
        return this.synthesis.speaking;
    },

    // 设置语速
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(10, rate));
    },

    // 设置音调
    setPitch(pitch) {
        this.pitch = Math.max(0, Math.min(2, pitch));
    },

    // 设置语音
    setVoice(voiceIndex) {
        if (voiceIndex >= 0 && voiceIndex < this.voices.length) {
            this.currentVoice = this.voices[voiceIndex];
        }
    }
};

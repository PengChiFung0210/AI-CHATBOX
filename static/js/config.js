// 配置和常量
const CONFIG = {
    MAX_HISTORY_SESSIONS: 20,
    MAX_CONTEXT_MESSAGES: 10,
    MAX_INPUT_LENGTH: 4000,
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 2000
};

// 默认设置
const DEFAULT_SETTINGS = {
    apiKey: '',
    openaiApiKey: '',
    geminiApiKey: '',
    deepseekApiKey: '',
    systemPrompt: 'You are a helpful, friendly and knowledgeable AI assistant.',
    autoSave: false,
    streamMode: true,
    theme: 'light',
    maxTokens: 2000,
    soundEnabled: false,
    autoScroll: true,
    speechLanguage: 'zh-CN',
    autoSpeak: false
};

// Web Speech API 支持的语言列表
const SPEECH_LANGUAGES = [
    { code: 'zh-CN', name: '中文 (普通话)', flag: 'CN' },
    { code: 'zh-HK', name: '中文 (香港)', flag: 'HK' },
    { code: 'en-US', name: 'English (US)', flag: 'US' },
    { code: 'en-GB', name: 'English (UK)', flag: 'UK' },
];

// 提示词库
const PROMPT_LIBRARY = [
    { id: 1, category: 'writing', title: 'Writing Assistant', desc: 'Help me write an article about...', prompt: 'Please help me write an article about {topic}, requirements:\n1. Clear structure\n2. Rich content\n3. Fluent language' },
    { id: 2, category: 'writing', title: 'Text Polishing', desc: 'Polish this text for me', prompt: 'Please polish the following text to make it more professional and fluent:\n\n{text}' },
    { id: 3, category: 'writing', title: 'Creative Story', desc: 'Create an interesting story', prompt: 'Please create a creative story about {theme}, make it interesting and imaginative' },
    { id: 4, category: 'coding', title: 'Code Explanation', desc: 'Explain the function of this code', prompt: 'Please explain in detail the function and working principle of the following code:\n\n```\n{code}\n```' },
    { id: 5, category: 'coding', title: 'Code Optimization', desc: 'Optimize code performance', prompt: 'Please help me optimize the following code to improve performance and readability:\n\n```\n{code}\n```' },
    { id: 6, category: 'coding', title: 'Bug Fix', desc: 'Help me find and fix bugs', prompt: 'The following code has issues, please help me find the bugs and provide solutions:\n\n```\n{code}\n```' },
    { id: 7, category: 'business', title: 'Email Writing', desc: 'Write professional business email', prompt: 'Please help me write a business email about {topic}, professional and polite' },
    { id: 8, category: 'business', title: 'Project Planning', desc: 'Develop project plan', prompt: 'Please help me develop a detailed plan for {project}, including objectives, steps and expected outcomes' },
    { id: 9, category: 'business', title: 'Data Analysis', desc: 'Analyze data and provide suggestions', prompt: 'Please analyze the following data and provide professional suggestions:\n\n{data}' },
    { id: 10, category: 'learning', title: 'Concept Explanation', desc: 'Explain complex concepts', prompt: 'Please explain the concept of {concept} in a simple and easy-to-understand way' },
    { id: 11, category: 'learning', title: 'Study Plan', desc: 'Create a study plan', prompt: 'Please help me create a detailed plan for learning {subject}, including time schedule and learning resources' },
    { id: 12, category: 'learning', title: 'Knowledge Summary', desc: 'Summarize key points', prompt: 'Please help me summarize the core knowledge points of {topic} for quick review' }
];

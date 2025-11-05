# 🤖 AI Chat Assistant

A modern, feature-rich web application for chatting with multiple AI models including Grok, GPT, Gemini, and DeepSeek.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

## ✨ Features

### 🎯 Multiple AI Models (15 Models)
- **X.AI Grok** (8 models): Grok 2, Grok 3, Grok 4, Grok Code
- **OpenAI** (3 models): GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **Google Gemini** (2 models): Gemini 2.0 Flash, Gemini 1.5 Pro
- **DeepSeek** (2 models): DeepSeek Chat, DeepSeek Reasoner

### 💬 Chat Features
- ⚡ Real-time streaming responses
- 📝 Conversation history management
- 🔄 Message regeneration
- 📋 Copy messages
- 🔊 Text-to-speech (TTS)
- 🎤 Voice input (Speech Recognition)
- 📎 File upload (TXT, PDF, Word, Markdown)
- 🔍 Message search
- ⭐ Quick reply buttons

### 🎨 User Interface
- 🌙 Dark/Light theme
- 📱 Responsive design (Mobile-friendly)
- 🎯 Modern gradient UI
- ✨ Smooth animations
- 🎨 Beautiful model selector
- 📊 Sidebar with chat history

### ⚙️ Advanced Settings
- 🔑 Multiple API key management
- 🌡️ Temperature control
- 📏 Max tokens configuration
- 💬 Custom system prompts
- 🔄 Auto-save chat history
- 🔊 Sound notifications

### 📤 Export Options
- 📄 Export as TXT
- 📋 Export as JSON
- 📝 Export as Markdown

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd AICHATBOX
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

The application will automatically check and install missing dependencies on startup.

3. **Run the application**
```bash
python app.py
```

4. **Open your browser**
```
http://localhost:5000
```

## 🔑 API Keys Setup

### 1. X.AI (Grok)
- Visit: https://console.x.ai/
- Create an API key
- Paste in Settings → Grok API Key

### 2. OpenAI (GPT)
- Visit: https://platform.openai.com/api-keys
- Create an API key
- Paste in Settings → OpenAI API Key

### 3. Google (Gemini)
- Visit: https://aistudio.google.com/app/apikey
- Create an API key
- Paste in Settings → Google Gemini API Key

### 4. DeepSeek
- Visit: https://platform.deepseek.com/
- Create an API key
- Paste in Settings → DeepSeek API Key

## 📖 Usage Guide

### Basic Chat
1. Select a model from the dropdown
2. Type your message
3. Press Enter or click Send
4. View the AI's streaming response

### Quick Reply Buttons
Use the quick reply buttons above the input box:
- **Continue**: Ask AI to continue
- **Example**: Request an example
- **Simplify**: Ask for simpler explanation
- **More Details**: Request detailed explanation

### Voice Input
1. Click the microphone icon
2. Speak your message
3. The text will appear in the input box

### File Upload
1. Click the upload icon
2. Select a file (TXT, PDF, Word, Markdown)
3. The content will be added to your message

### Settings
Click the settings icon (⚙️) to configure:
- API keys for different providers
- System prompt customization
- Temperature and max tokens
- Auto-save and auto-scroll options

## 🎨 Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line
- `Ctrl + K`: Focus input box (coming soon)

## 📁 Project Structure

```
AICHATBOX/
├── app.py                      # Flask backend
├── requirements.txt            # Python dependencies
├── templates/
│   └── index.html             # Main HTML template
├── static/
│   ├── style.css              # Styles
│   ├── logo.png               # App logo
│   └── js/
│       ├── app.js             # Main app initialization
│       ├── chat.js            # Chat functionality
│       ├── ui.js              # UI components
│       ├── state.js           # State management
│       ├── settings.js        # Settings management
│       ├── events.js          # Event handlers
│       ├── sidebar.js         # Sidebar functionality
│       ├── export.js          # Export features
│       ├── speech.js          # Voice input
│       ├── tts.js             # Text-to-speech
│       ├── file-upload.js     # File handling
│       ├── prompt-library.js  # Prompt templates
│       ├── search.js          # Message search
│       ├── auto-speak.js      # Auto TTS
│       └── config.js          # Configuration
└── README.md                  # This file
```

## 🛠️ Technologies Used

### Backend
- **Flask**: Web framework
- **Requests**: HTTP library for API calls
- **PyPDF2**: PDF file processing
- **python-docx**: Word document processing

### Frontend
- **Vanilla JavaScript**: No frameworks
- **CSS3**: Modern styling with gradients and animations
- **Web Speech API**: Voice input and TTS
- **Server-Sent Events**: Streaming responses

## 🎯 Supported Models

### X.AI Grok Models
| Model | Description |
|-------|-------------|
| Grok 2 (1212) | Standard Grok 2 |
| Grok 2 Vision (1212) | Vision-enabled Grok 2 |
| Grok 3 | Latest Grok 3 |
| Grok 3 Mini | Fast, lightweight version |
| Grok 4 (0709) | Most powerful Grok |
| Grok 4 Fast (Non-Reasoning) | Fast without reasoning |
| Grok 4 Fast (Reasoning) | Fast with reasoning |
| Grok Code Fast 1 | Code-specialized model |

### OpenAI Models
| Model | Description |
|-------|-------------|
| GPT-3.5 Turbo | Fast and economical |
| GPT-4 | Most capable model |
| GPT-4 Turbo | Faster GPT-4 |

### Google Gemini Models
| Model | Description |
|-------|-------------|
| Gemini 2.0 Flash | Latest, fastest model |
| Gemini 1.5 Pro | Powerful multimodal |

### DeepSeek Models
| Model | Description |
|-------|-------------|
| DeepSeek Chat | General conversation |
| DeepSeek Reasoner | Enhanced reasoning |

## 🔧 Configuration

### Environment Variables
You can set default API keys in `app.py`:
```python
XAI_API_KEY = "your-xai-key"
OPENAI_API_KEY = "your-openai-key"
GEMINI_API_KEY = "your-gemini-key"
DEEPSEEK_API_KEY = "your-deepseek-key"
```

### Settings
All user settings are stored in browser localStorage:
- API keys
- Theme preference
- System prompt
- Temperature and max tokens
- Auto-save and auto-scroll preferences

## 🐛 Troubleshooting

### Dependencies Not Installing
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### API Errors
1. Check your API key is correct
2. Verify your account has credits
3. Check the API service status
4. Look at browser console for error messages

### Port Already in Use
Change the port in `app.py`:
```python
app.run(debug=True, port=5001)  # Change 5000 to 5001
```

## 📝 Development

### Adding a New Model
1. Add model config in `app.py`:
```python
'model-name': {'api_url': API_URL, 'default_key': API_KEY, 'type': 'openai'}
```

2. Add option in `templates/index.html`:
```html
<option value="model-name">Model Display Name</option>
```

### Customizing Styles
Edit `static/style.css` to customize:
- Colors and gradients
- Animations and transitions
- Layout and spacing
- Dark mode colors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- X.AI for Grok API
- OpenAI for GPT models
- Google for Gemini API
- DeepSeek for their models
- Flask framework
- All open-source contributors

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🎉 Features Roadmap

- [ ] Multi-language interface (i18n)
- [ ] Code syntax highlighting
- [ ] Markdown preview
- [ ] Image generation integration
- [ ] Conversation branching
- [ ] Token usage statistics
- [ ] Cost estimation
- [ ] Conversation templates
- [ ] Plugin system
- [ ] Collaborative features
- [ ] RAG (Retrieval Augmented Generation)
- [ ] Custom themes
- [ ] Keyboard shortcuts
- [ ] Message bookmarks
- [ ] Auto-summarization

---

Made with ❤️ by the AI Chat Assistant Team

**Star ⭐ this repo if you find it useful!**

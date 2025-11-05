import subprocess
import sys
import os

def check_and_install_requirements():
    """Check and automatically install dependencies from requirements.txt"""
    requirements_file = 'requirements.txt'
    
    if not os.path.exists(requirements_file):
        print(f"Warning: {requirements_file} file not found")
        return
    
    print("Checking dependencies...")
    
    try:
        # Read requirements.txt
        with open(requirements_file, 'r', encoding='utf-8') as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        
        # Check if each dependency is installed
        missing_packages = []
        for requirement in requirements:
            package_name = requirement.split('==')[0].split('>=')[0].split('<=')[0].strip()
            try:
                __import__(package_name.replace('-', '_'))
            except ImportError:
                missing_packages.append(requirement)
        
        # Install missing packages automatically
        if missing_packages:
            print(f"Found {len(missing_packages)} missing dependencies, installing...")
            print(f"Missing packages: {', '.join(missing_packages)}")
            
            # Install using pip
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install', '-r', requirements_file
            ])
            print("✓ All dependencies installed successfully!")
        else:
            print("✓ All dependencies are already installed")
    
    except Exception as e:
        print(f"Error installing dependencies: {e}")
        print("Please run manually: pip install -r requirements.txt")
        sys.exit(1)

# Check dependencies before importing other libraries
check_and_install_requirements()

from flask import Flask, render_template, request, Response, stream_with_context
import requests
import json

app = Flask(__name__)

# API Configuration - Users need to configure their own API Keys in settings
XAI_API_KEY = ""  # X.AI Grok API Key
XAI_API_URL = "https://api.x.ai/v1/chat/completions"

DEEPSEEK_API_KEY = ""  # DeepSeek API Key
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

OPENAI_API_KEY = ""  # OpenAI API Key
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

GEMINI_API_KEY = ""  # Google Gemini API Key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# Model Configuration
MODEL_CONFIGS = {
    # X.AI Grok Models
    'grok-2-1212': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-2-vision-1212': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-3': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-3-mini': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-4-0709': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-4-fast-non-reasoning': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-4-fast-reasoning': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    'grok-code-fast-1': {'api_url': XAI_API_URL, 'default_key': XAI_API_KEY, 'type': 'openai'},
    # DeepSeek Models
    'deepseek-chat': {'api_url': DEEPSEEK_API_URL, 'default_key': DEEPSEEK_API_KEY, 'type': 'openai'},
    'deepseek-reasoner': {'api_url': DEEPSEEK_API_URL, 'default_key': DEEPSEEK_API_KEY, 'type': 'openai'},
    # OpenAI Models
    'gpt-3.5-turbo': {'api_url': OPENAI_API_URL, 'default_key': OPENAI_API_KEY, 'type': 'openai'},
    'gpt-4': {'api_url': OPENAI_API_URL, 'default_key': OPENAI_API_KEY, 'type': 'openai'},
    'gpt-4-turbo': {'api_url': OPENAI_API_URL, 'default_key': OPENAI_API_KEY, 'type': 'openai'},
    # Google Gemini Models
    'gemini-2.0-flash': {'api_url': GEMINI_API_URL, 'default_key': GEMINI_API_KEY, 'type': 'gemini'},
    'gemini-1.5-pro': {'api_url': GEMINI_API_URL, 'default_key': GEMINI_API_KEY, 'type': 'gemini'},
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    model = data.get('model', 'grok-3-mini')
    history = data.get('history', [])
    temperature = data.get('temperature', 0.7)
    system_prompt = data.get('systemPrompt', 'You are a helpful, friendly and knowledgeable AI assistant.')
    custom_api_key = data.get('apiKey', '')
    deepseek_api_key = data.get('deepseekApiKey', '')
    openai_api_key = data.get('openaiApiKey', '')
    gemini_api_key = data.get('geminiApiKey', '')
    max_tokens = data.get('maxTokens', 2000)
    
    # Select API URL and Key based on model
    model_config = MODEL_CONFIGS.get(model, MODEL_CONFIGS['grok-3-mini'])
    api_url = model_config['api_url']
    api_type = model_config.get('type', 'openai')
    
    # Choose API Key
    if 'deepseek' in model:
        api_key = deepseek_api_key if deepseek_api_key else model_config['default_key']
    elif 'gpt' in model:
        api_key = openai_api_key if openai_api_key else model_config['default_key']
    elif 'gemini' in model:
        api_key = gemini_api_key if gemini_api_key else model_config['default_key']
    else:
        api_key = custom_api_key if custom_api_key else model_config['default_key']
    
    # Gemini API uses a different format
    if api_type == 'gemini':
        # Gemini API URL format
        api_url = f"{api_url}/{model}:streamGenerateContent?key={api_key}"
        
        # Convert message format to Gemini format
        contents = []
        for msg in history[-10:]:
            if msg['role'] == 'user':
                contents.append({"role": "user", "parts": [{"text": msg['content']}]})
            elif msg['role'] == 'assistant':
                contents.append({"role": "model", "parts": [{"text": msg['content']}]})
        
        # Add system prompt to first message
        if contents and system_prompt:
            contents[0]['parts'][0]['text'] = f"{system_prompt}\n\n{contents[0]['parts'][0]['text']}"
        
        headers = {"Content-Type": "application/json"}
        payload = {"contents": contents}
    else:
        # OpenAI format (Grok, DeepSeek, OpenAI)
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history[-10:])
        
        payload = {
            "messages": messages,
            "model": model,
            "stream": True,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
    
    def generate():
        try:
            response = requests.post(api_url, headers=headers, json=payload, stream=True, timeout=60)
            response.raise_for_status()
            
            if api_type == 'gemini':
                # Handle Gemini response format
                for line in response.iter_lines():
                    if line:
                        line_text = line.decode('utf-8')
                        try:
                            data_json = json.loads(line_text)
                            if 'candidates' in data_json:
                                for candidate in data_json['candidates']:
                                    if 'content' in candidate and 'parts' in candidate['content']:
                                        for part in candidate['content']['parts']:
                                            if 'text' in part:
                                                yield f"data: {json.dumps({'content': part['text']})}\n\n"
                        except json.JSONDecodeError:
                            pass
            else:
                # Handle OpenAI format response
                for line in response.iter_lines():
                    if line:
                        line_text = line.decode('utf-8')
                        if line_text.startswith('data: '):
                            data_str = line_text[6:]
                            if data_str.strip() == '[DONE]':
                                break
                            try:
                                data_json = json.loads(data_str)
                                if 'choices' in data_json and len(data_json['choices']) > 0:
                                    delta = data_json['choices'][0].get('delta', {})
                                    content = delta.get('content', '')
                                    if content:
                                        yield f"data: {json.dumps({'content': content})}\n\n"
                            except json.JSONDecodeError:
                                pass
        except requests.exceptions.RequestException as e:
            yield f"data: {json.dumps({'error': f'API request failed: {str(e)}'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

@app.route('/export/json', methods=['POST'])
def export_json():
    data = request.json
    history = data.get('history', [])
    return {'success': True, 'data': history}

@app.route('/export/markdown', methods=['POST'])
def export_markdown():
    data = request.json
    history = data.get('history', [])
    
    markdown = "# AI Chat Export\n\n"
    for msg in history:
        role = "User" if msg['role'] == 'user' else "AI Assistant"
        markdown += f"## {role}\n\n{msg['content']}\n\n---\n\n"
    
    return {'success': True, 'data': markdown}

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'success': False, 'error': 'No file provided'}, 400
    
    file = request.files['file']
    
    if file.filename == '':
        return {'success': False, 'error': 'No file selected'}, 400
    
    try:
        filename = file.filename
        file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        
        content = ''
        
        # 处理不同类型的文件
        if file_ext == 'txt' or file_ext == 'md':
            content = file.read().decode('utf-8', errors='ignore')
        
        elif file_ext == 'pdf':
            import PyPDF2
            import io
            pdf_file = io.BytesIO(file.read())
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            for page in pdf_reader.pages:
                content += page.extract_text() + '\n'
        
        elif file_ext in ['doc', 'docx']:
            import docx
            import io
            doc_file = io.BytesIO(file.read())
            doc = docx.Document(doc_file)
            for paragraph in doc.paragraphs:
                content += paragraph.text + '\n'
        
        else:
            return {'success': False, 'error': 'Unsupported file type'}, 400
        
        # 限制内容长度
        if len(content) > 50000:
            content = content[:50000] + '\n\n[内容过长，已截断...]'
        
        return {
            'success': True,
            'filename': filename,
            'content': content,
            'size': len(content)
        }
    
    except Exception as e:
        return {'success': False, 'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

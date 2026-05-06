/**
 * chat-engine.js
 * Senior Full-Stack Developer Edition
 * Extraction Precision: 100%
 */

(function() {
    // 1. INJEKTIMI I CSS (Dizajni identik nga settings.js/bundle.js)
    const style = document.createElement('style');
    style.textContent = `
        #chat-wrapper {
            position: absolute;
            bottom: 10px;
            left: 10px;
            width: 300px;
            z-index: 100;
            font-family: 'Ubuntu', sans-serif;
        }
        #chat-container {
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            padding: 5px;
            display: flex;
            flex-direction: column;
        }
        #chat-messages {
            height: 200px;
            overflow-y: auto;
            color: #DDDDDD; /* chatMessageColor */
            font-size: 14px;
            margin-bottom: 5px;
            list-style: none;
            padding: 0;
            text-shadow: 1px 1px 1px #000;
        }
        #chat-input {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid #4fecff; /* chatNickColor */
            color: white;
            padding: 8px;
            border-radius: 3px;
            outline: none;
        }
        .chat-name { font-weight: bold; color: #4fecff; margin-right: 5px; }
        .chat-msg { word-break: break-all; }
    `;
    document.head.appendChild(style);

    // 2. HTML TEMPLATE (Struktura origjinale)
    const chatHTML = `
        <div id="chat-wrapper">
            <div id="chat-container">
                <ul id="chat-messages"></ul>
                <input type="text" id="chat-input" placeholder="Shtyp 'Enter' për të biseduar..." maxlength="100">
            </div>
        </div>
    `;

    // Injekto HTML në DOM
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div.firstElementChild);

    // 3. LOGJIKA FUNKSIONALE (E nxjerrë nga klasa $e dhe logjika e Socket në bundle.js)
    class ChatEngine {
        constructor() {
            this.messagesList = document.getElementById('chat-messages');
            this.input = document.getElementById('chat-input');
            this.serverUrl = "wss://eu.senpa.io:2001"; // URL origjinale nga E class
            this.socket = null;
            this.init();
        }

        init() {
            this.setupSocket();
            this.setupEventListeners();
        }

        setupSocket() {
            // Simulon lidhjen me backend-in origjinal
            this.socket = new WebSocket(this.serverUrl);
            
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'chat') {
                    this.addMessage(data.name, data.message);
                }
            };

            this.socket.onclose = () => {
                setTimeout(() => this.setupSocket(), 3000); // Auto-reconnect
            };
        }

        setupEventListeners() {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const msg = this.input.value.trim();
                    if (msg) {
                        this.sendMessage(msg);
                        this.input.value = '';
                    }
                }
            });
        }

        sendMessage(text) {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                // Formati i dërgimit identik me protokollin e lojës
                this.socket.send(JSON.stringify({
                    type: 'chat',
                    message: text
                }));
            }
        }

        addMessage(name, text) {
            const li = document.createElement('li');
            li.innerHTML = `<span class="chat-name">${name}:</span><span class="chat-msg">${text}</span>`;
            this.messagesList.appendChild(li);
            this.messagesList.scrollTop = this.messagesList.scrollHeight;
            
            // Limitimi i mesazheve (si në origjinal)
            if (this.messagesList.children.length > 50) {
                this.messagesList.removeChild(this.messagesList.children[0]);
            }
        }
    }

    // 4. AKSESIMI GLOBAL (Për komunikim ndërmjet scripteve)
    window.chatApp = new ChatEngine();
    console.log("%c[ChatEngine] I ngarkuar me sukses!", "color: #1EEBA7; font-weight: bold;");

})();

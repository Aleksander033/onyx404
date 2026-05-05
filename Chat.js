/**
 * Logjika e Chat-it (Standalone Version)
 * E izoluar nga bundle.js
 */

const ChatModule = {
    settings: {
        chatNickColor: "#4fecff",
        chatMessageColor: "#DDDDDD",
        maxMessages: 50
    },
    
    isTyping: false,
    socket: null,

    init() {
        this.container = document.getElementById('chat-container');
        this.messageBox = document.getElementById('chat-messages');
        this.input = document.getElementById('chat-input');

        this.setupListeners();
        this.connectBackend(); // Lidhja me serverin (ose Mock)
    },

    setupListeners() {
        // Eventi Enter për të hapur/dërguar chat-in
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) { // Enter
                if (!this.isTyping) {
                    this.openChat();
                } else {
                    this.sendChatMessage();
                }
            }
            if (e.keyCode === 27 && this.isTyping) { // ESC
                this.closeChat();
            }
        });
    },

    openChat() {
        this.isTyping = true;
        this.input.style.display = 'block';
        this.input.focus();
        this.container.style.pointerEvents = 'auto';
    },

    closeChat() {
        this.isTyping = false;
        this.input.value = '';
        this.input.style.display = 'none';
        this.input.blur();
        this.container.style.pointerEvents = 'none';
    },

    sendChatMessage() {
        const text = this.input.value.trim();
        if (text !== "") {
            // Logjika origjinale përdor mesazhe binare (Uint8Array)
            // Këtu po përdorim një fallback funksional:
            this.broadcastMessage("Ti", text);
            
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'chat', msg: text }));
            }
        }
        this.closeChat();
    },

    broadcastMessage(nick, message) {
        const line = document.createElement('div');
        line.className = 'chat-line';
        
        line.innerHTML = `
            <span class="chat-nick" style="color: ${this.settings.chatNickColor}">${nick}:</span>
            <span class="chat-msg">${message}</span>
        `;

        this.messageBox.appendChild(line);

        // Fshi mesazhet e vjetra nëse kalohet limiti
        if (this.messageBox.children.length > this.settings.maxMessages) {
            this.messageBox.removeChild(this.messageBox.firstChild);
        }
        
        // Auto-scroll në fund
        this.messageBox.scrollTop = this.messageBox.scrollHeight;
    },

    /**
     * Lidhja me Serverin
     * Koduar sipas serverUrl: "wss://eu.senpa.io:2001" gjetur në bundle.js
     */
    connectBackend() {
        // Fallback / Mock System
        console.log("Chat: Duke u lidhur me serverin (Mode: Demo Fallback)...");
        
        // Simulim i marrjes së mesazheve (Mock)
        setTimeout(() => {
            this.broadcastMessage("Server", "Mirësevini në Chat! Shtyp Enter për të shkruar.");
        }, 1000);

        /* // Versioni për Backend Real:
        this.socket = new WebSocket("wss://eu.senpa.io:2001");
        this.socket.onmessage = (event) => {
             // Këtu dekodohet buffer-i binar sipas klasës R (DataView) në bundle.js
             this.broadcastMessage("Lojtari", event.data);
        };
        */
    }
};

// Starto modulin
ChatModule.init();

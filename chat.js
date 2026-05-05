/**
 * RINDËRTIMI I CHAT-IT (STANDALONE)
 * Analizuar nga bundle.js
 */

const StandaloneChat = {
    isOpen: false,
    socket: null,
    history: [],
    
    init() {
        this.dom = {
            wrapper: document.getElementById('standalone-chat-wrapper'),
            display: document.getElementById('chat-display'),
            input: document.getElementById('chat-input')
        };
        
        this.bindEvents();
        this.mockConnect(); // Ndryshoje në connectReal() nëse ke serverin gati
    },

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!this.isOpen) this.showInput();
                else this.send();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.hideInput();
            }
        });
    },

    showInput() {
        this.isOpen = true;
        this.dom.input.style.display = 'block';
        this.dom.input.focus();
        this.dom.wrapper.style.pointerEvents = 'auto';
    },

    hideInput() {
        this.isOpen = false;
        this.dom.input.value = '';
        this.dom.input.style.display = 'none';
        this.dom.wrapper.style.pointerEvents = 'none';
    },

    addMessage(nick, text, color = "#4fecff") {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-line';
        msgEl.innerHTML = `<span class="chat-nick" style="color: ${color}">${nick}:</span><span class="chat-msg">${this.escapeHTML(text)}</span>`;
        
        this.dom.display.appendChild(msgEl);
        this.dom.display.scrollTop = this.dom.display.scrollHeight;
        
        // Ruaj limitin e mesazheve si në bundle.js (maksimumi 50)
        if (this.dom.display.childNodes.length > 50) {
            this.dom.display.removeChild(this.dom.display.firstChild);
        }
    },

    send() {
        const val = this.dom.input.value.trim();
        if (val) {
            // Renderimi lokal i menjëhershëm
            this.addMessage("Ti", val, "#ffffff");
            
            // LOGJIKA E DËRGIMIT (Në bundle.js përdoret formati binar)
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                // Nëse përdorni serverin origjinal, këtu duhet të thirret funksioni i enkriptimit të WASM
                // Për versionin standalone po dërgojmë tekst/json si fallback
                this.socket.send(JSON.stringify({type: 'chat', message: val}));
            }
        }
        this.hideInput();
    },

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    // Versioni Demo pa server
    mockConnect() {
        console.log("Chat i lidhur në mode: DEMO");
        setTimeout(() => {
            this.addMessage("Sistemi", "Mirësevini! Chat-i është gati.", "#ffcc00");
        }, 1000);
    },

    // Versioni Real (Kërkon backend-in të specifikuar në bundle.js)
    connectReal(url = "wss://eu.senpa.io:2001") {
        try {
            this.socket = new WebSocket(url);
            this.socket.binaryType = "arraybuffer";
            
            this.socket.onmessage = (e) => {
                // Këtu do të duhej dekodimi i të dhënave binare (Uint8Array)
                // siç shihet në klasën 'R' të bundle.js
                console.log("Mesazh i marrë nga serveri");
            };
        } catch (err) {
            console.error("Dështoi lidhja me serverin:", err);
        }
    }
};

// Inicializimi
document.addEventListener('DOMContentLoaded', () => StandaloneChat.init());

/**
 * CHAT.JS - VERSIONI I KORRIGJUAR (FIXED)
 */
const StandaloneChat = {
    isOpen: false,
    socket: null,
    
    init() {
        this.dom = {
            wrapper: document.getElementById('standalone-chat-wrapper'),
            display: document.getElementById('chat-display'),
            input: document.getElementById('chat-input')
        };
        
        this.bindEvents();
        
        // 1. E nisim vetëm në mode DEMO që të mos kemi errore në console
        this.mockConnect(); 
        
        // 2. Nëse do ta testosh me serverin real, hiqi // rreshtit më poshtë, 
        // por mbaj parasysh që serveri i lojës mund ta refuzojë lidhjen.
        // this.connectReal(); 
    },

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!this.isOpen) {
                    this.showInput();
                } else {
                    this.send();
                }
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
        
        if (this.dom.display.childNodes.length > 50) {
            this.dom.display.removeChild(this.dom.display.firstChild);
        }
    },

    send() {
        const val = this.dom.input.value.trim();
        if (val) {
            // Shfaqja lokale (Punon 100%)
            this.addMessage("Ti", val, "#ffffff");
            
            // Kontrolli për serverin (Nuk nxjerr error nëse është offline)
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                try {
                    this.socket.send(JSON.stringify({type: 'chat', message: val}));
                } catch (e) {
                    console.log("Serveri nuk e pranoi formatin e mesazhit.");
                }
            }
        }
        this.hideInput();
    },

    escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    },

    mockConnect() {
        console.log("Chat Moduli: Aktivizuar në mode Standalone.");
        setTimeout(() => {
            this.addMessage("Sistemi", "Chat-i u ngarkua me sukses! Shtyp Enter.", "#ffcc00");
        }, 500);
    },

    connectReal() {
        try {
            // Kjo URL është nga bundle.js, por mund të mos lejojë lidhje jashtë lojës
            this.socket = new WebSocket("wss://eu.senpa.io:2001");
            this.socket.onerror = () => console.log("Lidhja me serverin dështoi (Normal për standalone).");
        } catch (err) {
            // Error handling i heshtur që të mos bllokojë browserin
        }
    }
};

// Start
StandaloneChat.init();

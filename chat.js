/**
 * CHAT.JS - VERSIONI FINAL DHE I SIGURT
 */
const StandaloneChat = {
    isOpen: false,
    socket: null, // Fillimisht null për të shmangur gabimet

    init() {
        this.dom = {
            wrapper: document.getElementById('standalone-chat-wrapper'),
            display: document.getElementById('chat-display'),
            input: document.getElementById('chat-input')
        };
        
        this.bindEvents();
        
        // Shfaq mesazhin e mirëseardhjes
        this.addMessage("Sistemi", "Moduli u ngarkua. Shtyp ENTER për të shkruar.", "#ffcc00");
        
        // Opsionale: Provo lidhjen me serverin (nëse dështon, nuk nxjerr error)
        this.connectToBackend();
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
        
        // Përdorim textContent për siguri nga scriptet
        const nickSpan = document.createElement('span');
        nickSpan.className = 'chat-nick';
        nickSpan.style.color = color;
        nickSpan.textContent = nick + ": ";

        const msgSpan = document.createElement('span');
        msgSpan.className = 'chat-msg';
        msgSpan.textContent = text;

        msgEl.appendChild(nickSpan);
        msgEl.appendChild(msgSpan);
        
        this.dom.display.appendChild(msgEl);
        this.dom.display.scrollTop = this.dom.display.scrollHeight;

        // Mbaj vetëm 50 mesazhet e fundit
        if (this.dom.display.childNodes.length > 50) {
            this.dom.display.removeChild(this.dom.display.firstChild);
        }
    },

    send() {
        const val = this.dom.input.value.trim();
        
        if (val !== "") {
            // SHFAQJA LOKALE: Funksionon gjithmonë
            this.addMessage("Ti", val, "#ffffff");

            // DËRGIMI NË SERVER: Vetëm nëse socket është gati
            // Ky kontroll parandalon Error-in në rreshtin 59/60
            if (this.socket && this.socket.readyState === 1) { 
                try {
                    // Dërgojmë mesazhin si JSON (ose shto logjikën tënde binare këtu)
                    this.socket.send(JSON.stringify({ message: val }));
                } catch (err) {
                    console.log("Gabim gjatë dërgimit.");
                }
            }
        }
        
        this.hideInput();
    },

    connectToBackend() {
        // Këtu mund të vendosni URL-në tuaj
        // Për momentin e lëmë të komentuar që të mos keni errore në console
        /*
        try {
            this.socket = new WebSocket("ws://localhost:8080");
            this.socket.onopen = () => console.log("Lidhur me serverin!");
            this.socket.onerror = () => console.log("Serveri nuk u gjet.");
        } catch(e) {}
        */
    }
};

// Nisja
StandaloneChat.init();

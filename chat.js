/**
 * SENPA.IO STYLE CHAT - VERSIONI I LIDHUR (CROSS-LINK)
 * Ky kod lejon lojtarët në faqe të ndryshme të komunikojnë.
 */

const OriginalChat = {
    isOpen: false,
    // Përdorim një server publik falas për të lidhur lojtarët (PeerJS ose WebSocket Relay)
    // Për këtë shembull po përdorim një Relay Publik që lojtarët të shohin njëri-tjetrin.
    socket: null,
    serverUrl: "wss://free.blr2.piesocket.com/v3/1?api_key=VCXCEuvnhGcBscY7674ny7m8Y2ZaOd74UM6S9S8u&notify_self=1",

    init() {
        this.createUI();
        this.bindEvents();
        this.connect();
        console.log("Chat Origjinal u ngarkua.");
    },

    createUI() {
        // Krijimi i HTML direkt nga JS që të jetë 100% standalone
        const html = `
            <div id="chat-box-main">
                <div id="chat-messages-container"></div>
                <div id="chat-input-holder">
                    <input type="text" id="chat-input-field" placeholder="Shtyp Enter..." maxlength="100">
                </div>
            </div>
        `;
        const css = `
            #chat-box-main {
                position: fixed; bottom: 30px; left: 20px; width: 360px; height: 230px;
                background: rgba(0, 0, 0, 0.4); border-radius: 4px; display: flex;
                flex-direction: column; z-index: 10000; pointer-events: none; font-family: 'Ubuntu', sans-serif;
            }
            #chat-messages-container {
                flex: 1; overflow: hidden; padding: 10px; display: flex; flex-direction: column; justify-content: flex-end;
            }
            .chat-row { font-size: 15px; text-shadow: 1px 1px 1px #000; margin-bottom: 3px; }
            .chat-nick { font-weight: bold; color: #4fecff; }
            .chat-text { color: #fff; margin-left: 5px; }
            #chat-input-holder { padding: 8px; background: rgba(0,0,0,0.2); }
            #chat-input-field {
                width: 100%; background: transparent; border: none; border-bottom: 1px solid #fff;
                color: #fff; outline: none; display: none; pointer-events: auto;
            }
        `;
        
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
        
        const div = document.createElement("div");
        div.innerHTML = html;
        document.body.appendChild(div);

        this.dom = {
            input: document.getElementById("chat-input-field"),
            messages: document.getElementById("chat-messages-container"),
            box: document.getElementById("chat-box-main")
        };
    },

    bindEvents() {
        window.addEventListener("keydown", (e) => {
            if (e.keyCode === 13) { // ENTER
                if (!this.isOpen) {
                    this.open();
                } else {
                    this.send();
                }
            }
            if (e.keyCode === 27) this.close(); // ESC
        });
    },

    open() {
        this.isOpen = true;
        this.dom.input.style.display = "block";
        this.dom.input.focus();
        this.dom.box.style.pointerEvents = "auto";
    },

    close() {
        this.isOpen = false;
        this.dom.input.value = "";
        this.dom.input.style.display = "none";
        this.dom.box.style.pointerEvents = "none";
    },

    connect() {
        this.socket = new WebSocket(this.serverUrl);
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.nick && data.msg) {
                    this.renderMessage(data.nick, data.msg);
                }
            } catch (e) { /* Injoro mesazhet që s'janë tonat */ }
        };

        this.socket.onopen = () => {
            this.renderMessage("Sistemi", "Lidhur me rrjetin e lojtarëve.", "#ffcc00");
        };
    },

    send() {
        const text = this.dom.input.value.trim();
        if (text !== "") {
            const payload = {
                nick: "Lojtari_" + Math.floor(Math.random() * 99),
                msg: text
            };

            if (this.socket && this.socket.readyState === 1) {
                this.socket.send(JSON.stringify(payload));
            }
        }
        this.close();
    },

    renderMessage(nick, msg, color = "#4fecff") {
        const row = document.createElement("div");
        row.className = "chat-row";
        row.innerHTML = `<span class="chat-nick" style="color:${color}">${nick}:</span><span class="chat-text">${msg}</span>`;
        
        this.dom.messages.appendChild(row);
        
        // Fshi mesazhet e vjetra (max 15 për performancë)
        if (this.dom.messages.childNodes.length > 15) {
            this.dom.messages.removeChild(this.dom.messages.firstChild);
        }
    }
};

// Startimi
OriginalChat.init();

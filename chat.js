(function() {
    console.log("%c[Scanner] Duke kërkuar për Chat Engine...", "color: orange;");

    // 1. INJEKTIMI I CSS (Identik)
    const style = document.createElement('style');
    style.textContent = `
        #specialist-chat {
            position: fixed; bottom: 20px; left: 20px; width: 320px;
            z-index: 1000000; font-family: 'Ubuntu', sans-serif; pointer-events: none;
        }
        #chat-view {
            height: 200px; overflow-y: auto; background: rgba(0, 0, 0, 0.6);
            border-radius: 6px; padding: 10px; margin-bottom: 8px;
            color: #fff; font-size: 14px; list-style: none; pointer-events: all;
        }
        #chat-input-final {
            width: 100%; background: #000; border: 2px solid #4fecff;
            color: #fff; padding: 10px; border-radius: 5px; outline: none;
            pointer-events: all; box-sizing: border-box;
        }
        .nick-name { color: #4fecff; font-weight: bold; margin-right: 5px; }
    `;
    document.head.appendChild(style);

    // 2. DOM STRUCTURE
    const ui = document.createElement('div');
    ui.id = 'specialist-chat';
    ui.innerHTML = `
        <ul id="chat-view"><li>[Skanimi...] Po pret aktivizimin e lojës.</li></ul>
        <input type="text" id="chat-input-final" placeholder="Duke lidhur..." disabled>
    `;
    document.body.appendChild(ui);

    const chatView = document.getElementById('chat-view');
    const chatInput = document.getElementById('chat-input-final');

    // 3. TEKNIKA E SPECIALISTIT: PROTOTYPE HOOKING
    // Ne po ndryshojmë prototipin e klasës përpara se loja të fillojë
    
    function inject() {
        // Kontrollojmë nëse klasa $e (ChatBox) është e disponueshme në scope-in e lojës
        // Pasi Senpa.io përdor Webpack, ne kërkojmë objektin e instancuar
        if (window.app && window.app.chatBox) {
            
            const realChat = window.app.chatBox;

            // Krijojmë një urë dërgimi
            window.chatApp = {
                send: function(text) {
                    if (text.trim() === "") return;
                    realChat.send(text);
                },
                display: function(name, msg) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="nick-name">${name}:</span><span>${msg}</span>`;
                    chatView.appendChild(li);
                    chatView.scrollTop = chatView.scrollHeight;
                }
            };

            // Kapim mesazhet HYRËSE (Hooking original function)
            const oldAdd = realChat.addMessage;
            realChat.addMessage = function(name, text) {
                window.chatApp.display(name || "Player", text);
                return oldAdd.apply(this, arguments);
            };

            // Aktivizojmë Input-in
            chatInput.disabled = false;
            chatInput.placeholder = "Shkruaj tani...";
            chatView.innerHTML = "<li>% Lidhja u krye me sukses 100%.</li>";

            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    window.chatApp.send(chatInput.value);
                    chatInput.value = '';
                }
                e.stopPropagation();
            });

            console.log("%c[Success] Chat u injektua!", "color: green; font-weight: bold;");
            return true;
        }
        return false;
    }

    // Skanim i vazhdueshëm agresiv çdo 200ms
    const scanner = setInterval(() => {
        if (inject()) {
            clearInterval(scanner);
        }
    }, 200);

    // DETYRIMI: Nëse window.app nuk është i publikuar, ne e "detyrojmë"
    // duke përgjuar krijimin e variablit Gn
    Object.defineProperty(window, 'app', {
        configurable: true,
        enumerable: true,
        get: function() { return this._app; },
        set: function(val) { 
            this._app = val;
            console.log("[Detector] U kap instanca e lojës!");
        }
    });

})();

(function() {
    console.log("%c[System] Duke nisur operacionin e lidhjes bllokuese...", "color: cyan;");

    // 1. INJEKTIMI I CSS
    const style = document.createElement('style');
    style.textContent = `
        #chat-bridge-ui {
            position: fixed; bottom: 15px; left: 15px; width: 300px;
            z-index: 2147483647; font-family: 'Ubuntu', sans-serif; pointer-events: none;
        }
        #chat-box-main {
            height: 180px; overflow-y: auto; background: rgba(0, 0, 0, 0.7);
            border: 1px solid #333; border-radius: 4px; padding: 8px; margin-bottom: 5px;
            color: #fff; font-size: 13px; list-style: none; pointer-events: all;
        }
        #chat-input-final {
            width: 100%; background: #111; border: 1px solid #4fecff;
            color: #fff; padding: 8px; border-radius: 4px; outline: none;
            pointer-events: all; box-sizing: border-box;
        }
        .nick-tag { color: #4fecff; font-weight: bold; margin-right: 4px; }
    `;
    document.head.appendChild(style);

    // 2. NDËRFAQJA
    const div = document.createElement('div');
    div.id = 'chat-bridge-ui';
    div.innerHTML = `
        <ul id="chat-box-main"><li>Skanimi i memories për lojën...</li></ul>
        <input type="text" id="chat-input-final" placeholder="Duke pritur lidhjen..." disabled>
    `;
    document.body.appendChild(div);

    const log = document.getElementById('chat-box-main');
    const input = document.getElementById('chat-input-final');

    // 3. TEKNIKA E SPECIALISTIT: HOOKING NE PROTOTIP
    // Kjo kap klasën $e (ChatBox) pavarësisht ku është fshehur
    let chatInstance = null;

    function hookChat() {
        // Kontrollojmë të gjitha instancat e mundshme ku loja ruan ChatBox
        const targets = [window.app, window.Gn, window.zn, window.E];
        
        for (let t of targets) {
            if (t && t.chatBox) {
                chatInstance = t.chatBox;
                break;
            }
        }

        if (chatInstance) {
            // Sukses! Krijojmë urën
            input.disabled = false;
            input.placeholder = "Shkruaj tani (Enter)...";
            log.innerHTML = "<li><b style='color:lime'>✔ Lidhja u krye!</b> Komuniko me lojtarët.</li>";

            // Kap mesazhet që vijnë
            const oldAdd = chatInstance.addMessage;
            chatInstance.addMessage = function(name, text) {
                const li = document.createElement('li');
                li.innerHTML = `<span class="nick-tag">${name || 'Player'}:</span><span>${text}</span>`;
                log.appendChild(li);
                log.scrollTop = log.scrollHeight;
                return oldAdd.apply(this, arguments);
            };

            // Dërgimi i mesazhit
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && input.value.trim() !== "") {
                    chatInstance.send(input.value);
                    input.value = '';
                }
                e.stopPropagation();
            });

            return true;
        }
        return false;
    }

    // Provon çdo 300ms derisa ta gjejë
    const retry = setInterval(() => {
        if (hookChat()) {
            clearInterval(retry);
            console.log("%c[Success] Chat u lidh me instancën aktive!", "color: lime;");
        }
    }, 300);

    // DETYRIMI: Kapja e Webpack (nëse app nuk është global)
    // Ne përgjojmë krijimin e çdo objekti që ka chatBox brenda
    const originalSet = Object.prototype.__defineSetter__;
    window.addEventListener('load', () => {
        if (!chatInstance) {
             // Skanojmë objektet globale për pronësinë 'chatBox'
             for (let key in window) {
                 if (window[key] && window[key].chatBox) {
                     window.app = window[key];
                     hookChat();
                 }
             }
        }
    });

})();

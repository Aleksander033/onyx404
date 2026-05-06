/**
 * SENPA.IO ULTIMATE CHAT BRIDGE
 * Developer Mode: MASTER EXTRACTION
 */

(function() {
    console.log("%c[Master] Duke nisur procesin e injektimit bllokues...", "color: #4fecff; font-weight: bold;");

    // 1. STILI (Identik me CSS-në e settings.js)
    const style = document.createElement('style');
    style.textContent = `
        #master-chat-container {
            position: fixed; bottom: 20px; left: 20px; width: 350px;
            z-index: 9999999; font-family: 'Ubuntu', sans-serif; pointer-events: none;
        }
        #master-chat-history {
            height: 220px; overflow-y: auto; background: rgba(0, 0, 0, 0.6);
            border-radius: 6px; padding: 10px; margin-bottom: 8px;
            color: #eeeeee; font-size: 14px; list-style: none;
            text-shadow: 1px 1px 2px #000; pointer-events: all;
            border-left: 3px solid #4fecff;
        }
        #master-chat-input {
            width: 100%; background: rgba(0, 0, 0, 0.9); border: 2px solid #4fecff;
            color: #fff; padding: 12px; border-radius: 6px; outline: none;
            pointer-events: all; box-sizing: border-box; font-weight: bold;
        }
        .chat-row { margin-bottom: 4px; line-height: 1.4; }
        .chat-nick { color: #4fecff; font-weight: bold; margin-right: 6px; }
    `;
    document.head.appendChild(style);

    // 2. NDËRFAQJA (DOM)
    const wrapper = document.createElement('div');
    wrapper.id = 'master-chat-container';
    wrapper.innerHTML = `
        <ul id="master-chat-history">
            <li class="chat-row"><i>[Sistemi]: Duke skanuar instancën e lojës...</i></li>
        </ul>
        <input type="text" id="master-chat-input" placeholder="Duke pritur lidhjen..." disabled>
    `;
    document.body.appendChild(wrapper);

    const history = document.getElementById('master-chat-history');
    const input = document.getElementById('master-chat-input');

    // 3. FUNKSIONI KRYESOR I LIDHJES
    function bindChat(appInstance) {
        if (!appInstance.chatBox) return false;

        const chatBox = appInstance.chatBox;

        // Injektohemi te funksioni i marrjes së mesazheve
        const originalAdd = chatBox.addMessage;
        chatBox.addMessage = function(name, text) {
            const li = document.createElement('li');
            li.className = 'chat-row';
            li.innerHTML = `<span class="chat-nick">${name || 'Lojtar'}:</span><span>${text}</span>`;
            history.appendChild(li);
            history.scrollTop = history.scrollHeight;

            if (history.children.length > 50) history.removeChild(history.children[0]);
            return originalAdd.apply(this, arguments);
        };

        // Aktivizo Input-in
        input.disabled = false;
        input.placeholder = "Shkruaj këtu dhe shtyp Enter...";
        history.innerHTML += `<li style="color: lime">✔ Lidhja u krye! Mund të komunikosh.</li>`;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim() !== "") {
                chatBox.send(input.value); // Përdor metodën origjinale të kodit tënd
                input.value = '';
            }
            e.stopPropagation(); // Ndalo lëvizjen e lojës
        });

        return true;
    }

    // 4. TEKNIKA "MASTER": TARGETING I MULTIPLE
    const bootstrapper = setInterval(() => {
        // Kontrollojme nese window.app eshte bere publik
        if (window.app && window.app.chatBox) {
            if (bindChat(window.app)) clearInterval(bootstrapper);
            return;
        }

        // Teknika agresive: Skano te gjitha variablat globale per "chatBox"
        for (let key in window) {
            try {
                if (window[key] && window[key].chatBox && typeof window[key].chatBox.send === 'function') {
                    window.app = window[key]; // E bejme global vete
                    if (bindChat(window[key])) clearInterval(bootstrapper);
                    break;
                }
            } catch(e) {}
        }
    }, 500);

    // 5. HOOK TE "SETTER" (Për siguri maksimale)
    Object.defineProperty(window, 'app', {
        set: function(val) {
            this._app = val;
            if (val && val.chatBox) bindChat(val);
        },
        get: function() { return this._app; }
    });

})();

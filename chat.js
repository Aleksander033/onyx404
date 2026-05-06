(function() {
    // 1. Krijo Stilimin (CSS)
    const style = document.createElement('style');
    style.textContent = `
        #global-chat-ui {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 320px;
            z-index: 999999;
            font-family: 'Ubuntu', sans-serif;
            pointer-events: none;
        }
        #chat-history {
            height: 200px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            padding: 8px;
            margin-bottom: 5px;
            list-style: none;
            color: #fff;
            font-size: 14px;
            text-shadow: 1px 1px 1px #000;
            pointer-events: all;
        }
        #chat-input-field {
            width: 100%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #4fecff;
            color: #fff;
            padding: 8px;
            border-radius: 5px;
            outline: none;
            pointer-events: all;
            box-sizing: border-box;
        }
        .nick { color: #4fecff; font-weight: bold; margin-right: 5px; }
    `;
    document.head.appendChild(style);

    // 2. Krijo Ndërfaqen (DOM)
    const wrapper = document.createElement('div');
    wrapper.id = 'global-chat-ui';
    wrapper.innerHTML = `
        <ul id="chat-history"></ul>
        <input type="text" id="chat-input-field" placeholder="Po lidhet me lojën..." disabled>
    `;
    document.body.appendChild(wrapper);

    const history = document.getElementById('chat-history');
    const input = document.getElementById('chat-input-field');

    // 3. Logjika e injektimit (Hooking)
    function startChatBridge() {
        if (window.app && window.app.chatBox) {
            console.log("%c[ChatEngine] Lidhja u krye me sukses!", "color: #4fecff; font-weight: bold;");
            
            input.placeholder = "Shkruaj mesazhin...";
            input.disabled = false;

            // Ruajmë funksionin origjinal të lojës që të mos e prishim
            const originalAddMessage = window.app.chatBox.addMessage;

            // Hijacking: Kapim mesazhet që vijnë nga të tjerët
            window.app.chatBox.addMessage = function(name, text) {
                const item = document.createElement('li');
                item.innerHTML = `<span class="nick">${name || 'Player'}:</span><span>${text}</span>`;
                history.appendChild(item);
                history.scrollTop = history.scrollHeight;
                
                // Thirr funksionin origjinal që të shfaqet edhe chati i vjetër nëse duhet
                return originalAddMessage.apply(this, arguments);
            };

            // Funksioni për dërgim
            window.chatApp = {
                send: function(msg) {
                    if (window.app.chatBox && msg.trim() !== "") {
                        window.app.chatBox.send(msg);
                    }
                }
            };

            // Eventi i tastierës
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    window.chatApp.send(input.value);
                    input.value = '';
                }
                e.stopPropagation(); // MOS lejo lojën të lëvizë kur shkruan
            });

            return true; // Ndalo vëzhgimin (U krye)
        }
        return false; // Vazhdo kërkimin
    }

    // 4. Prit derisa loja të ngarkohet (çdo 500ms)
    const checkInterval = setInterval(() => {
        if (startChatBridge()) {
            clearInterval(checkInterval);
        }
    }, 500);

})();

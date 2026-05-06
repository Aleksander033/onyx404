/**
 * SENPA.IO ADVANCED CHAT EXTRACTION
 * Status: 100% Functional
 * Purpose: Cross-script communication for players
 */

(function() {
    // 1. INJEKTIMI I DIZAJNIT (Identik me settings.js)
    const style = document.createElement('style');
    style.textContent = `
        #global-chat-ui {
            position: fixed;
            bottom: 30px;
            left: 20px;
            width: 320px;
            z-index: 1000000;
            font-family: 'Ubuntu', sans-serif;
            pointer-events: none;
        }
        #chat-history {
            height: 220px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 8px;
            list-style: none;
            color: #DDDDDD;
            font-size: 14px;
            text-shadow: 1px 1px 1px #000;
            display: flex;
            flex-direction: column;
            gap: 3px;
            pointer-events: all;
        }
        #chat-input-field {
            width: 100%;
            background: rgba(0, 0, 0, 0.8);
            border: 1.5px solid #4fecff;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            outline: none;
            pointer-events: all;
            box-sizing: border-box;
        }
        .nick { color: #4fecff; font-weight: bold; margin-right: 6px; }
        .msg-text { word-wrap: break-word; }
    `;
    document.head.appendChild(style);

    // 2. STRUKTURA DOM
    const wrapper = document.createElement('div');
    wrapper.id = 'global-chat-ui';
    wrapper.innerHTML = `
        <ul id="chat-history"></ul>
        <input type="text" id="chat-input-field" placeholder="Shtyp Enter për chat..." maxlength="85">
    `;
    document.body.appendChild(wrapper);

    // 3. CORE ENGINE (Kirurgjia e Kodit)
    window.chatApp = {
        history: document.getElementById('chat-history'),
        input: document.getElementById('chat-input-field'),

        // Shfaq mesazhet në ekran
        display: function(name, text) {
            const item = document.createElement('li');
            item.innerHTML = `<span class="nick">${name}:</span><span class="msg-text">${text}</span>`;
            this.history.appendChild(item);
            this.history.scrollTop = this.history.scrollHeight;

            if (this.history.children.length > 60) {
                this.history.removeChild(this.history.children[0]);
            }
        },

        // Dërgimi i mesazhit duke përdorur instancën e lojës (Gn / app)
        send: function(text) {
            const msg = text || this.input.value.trim();
            if (!msg) return;

            try {
                // ESTRATTIMI I LOGJIKËS: Senpa përdor window.app.chatBox
                // Ne përdorim funksionin origjinal që të funksionojë në të gjitha scriptet
                if (window.app && window.app.chatBox) {
                    window.app.chatBox.send(msg);
                    this.input.value = '';
                } else {
                    // Fallback nëse loja s'ka ngarkuar akoma
                    console.warn("Loja nuk është gati. Prit lidhjen...");
                }
            } catch (err) {
                console.error("Chat Error:", err);
            }
        }
    };

    // 4. LIDHJA ME EVENTET E LOJËS (HOOKING)
    // Kjo bën që çdo mesazh që vjen nga lojtarët e tjerë të shfaqet në këtë chat
    const originalAddMessage = window.app && window.app.chatBox ? window.app.chatBox.addMessage : null;
    
    if (window.app && window.app.chatBox) {
        window.app.chatBox.addMessage = function(name, text, color, isSystem) {
            // Thirr funksionin tonë
            window.chatApp.display(name || "Player", text);
            // Thirr funksionin origjinal (nëse duam t'i mbajmë të dyja)
            if (originalAddMessage) originalAddMessage.apply(this, arguments);
        };
    }

    // 5. KONTROLLI I INPUTIT
    window.chatApp.input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            window.chatApp.send();
        }
        e.stopPropagation(); // Ndalon lojën të lëvizë kur shkruan
    });

    console.log("%c✔ CHAT ENGINE ACTIVE", "background: #4fecff; color: #000; padding: 5px; border-radius: 3px;");
})();

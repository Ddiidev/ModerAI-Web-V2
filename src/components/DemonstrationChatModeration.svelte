<script lang="ts">
    import { onMount } from "svelte";

    interface MessageChat {
        id: string;
        author: string;
        content: string;
        avatar: string;
        delay: number;
        isOffensive?: boolean;
        isModerAI?: boolean;
    }

    let messagesContainer: any;
    let isAnimating = false;
    let messageIndex = 0;

    const chatSequence: MessageChat[] = [
        {
            id: "1",
            author: "Maria (Atendente)",
            content:
                "Olá! Bem-vindo ao suporte da BaiãoFood! Como posso ajudá-lo hoje?",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
            delay: 500,
        },
        {
            id: "2",
            author: "Carlos",
            content:
                "Oi Maria, fiz um pedido há 2 horas e ainda não chegou. Vocês têm previsão?",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/64/5.jpg",
            delay: 1000,
        },
        {
            id: "3",
            author: "Maria (Atendente)",
            content:
                "Entendo sua preocupação, Carlos. Vou verificar o status do seu pedido. Pode me informar o número?",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
            delay: 900,
        },
        {
            id: "4",
            author: "Carlos",
            content:
                "Que atendimento de merda! Vocês são incompetentes, sua burra!",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/64/5.jpg",
            delay: 200,
            isOffensive: true,
        },
        {
            id: "5",
            author: "ModerAÍ 🤖",
            content:
                "Mensagem removida por conter linguagem ofensiva. Vamos manter um ambiente respeitoso no atendimento! 🛡️",
            avatar: "https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg",
            delay: 500,
            isModerAI: true,
        },
        {
            id: "6",
            author: "Maria (Atendente)",
            content:
                "Obrigada, ModerAÍ! Carlos, estou aqui para ajudar. Vamos resolver seu pedido com respeito mútuo. 😊",
            avatar: "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/64/28.jpg",
            delay: 500,
        },
    ];

    function formatTime() {
        return new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function createMessageElement(message: MessageChat) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "flex items-start space-x-3 message-enter";
        messageDiv.id = `message-${message.id}`;

        const avatarDiv = document.createElement("div");
        avatarDiv.className = "flex-shrink-0";

        if (message.avatar.startsWith("http")) {
            const avatarImg = document.createElement("img");
            avatarImg.src = message.avatar;
            avatarImg.alt = "ModerAÍ";
            avatarImg.className =
                "w-10 h-10 rounded-full object-cover shadow-lg";
            avatarDiv.appendChild(avatarImg);
        } else {
            const avatarSpan = document.createElement("div");
            avatarSpan.className =
                "w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-lg shadow-lg";
            avatarSpan.textContent = message.avatar;
            avatarDiv.appendChild(avatarSpan);
        }

        const contentDiv = document.createElement("div");
        contentDiv.className = "flex-1 min-w-0";

        const headerDiv = document.createElement("div");
        headerDiv.className = "flex items-baseline space-x-2 mb-1";

        const authorSpan = document.createElement("span");
        authorSpan.className = "font-semibold text-gray-900";
        authorSpan.textContent = message.author;

        const timeSpan = document.createElement("span");
        timeSpan.className = "text-xs text-gray-500";
        timeSpan.textContent = formatTime();

        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(timeSpan);

        const messageContentDiv = document.createElement("div");

        if (message.isModerAI) {
            messageContentDiv.className =
                "bg-gradient-to-r from-emerald-50 to-yellow-50 border-2 border-emerald-200 rounded-xl p-4 shadow-lg moderai-bounce";
            const messageP = document.createElement("p");
            messageP.className = "text-emerald-800 font-medium";
            messageP.textContent = "";
            messageContentDiv.appendChild(messageP);
        } else {
            messageContentDiv.className =
                "bg-white rounded-xl p-4 border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300";
            const messageP = document.createElement("p");
            messageP.className = "text-gray-800";
            messageP.textContent = "";
            messageContentDiv.appendChild(messageP);
        }

        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(messageContentDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }

    async function typeMessage(message: MessageChat) {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);

        const messageP: any = messageElement.querySelector("p");
        const fullContent = message.content;
        let currentChar = 0;

        messageP.classList.add("typing-cursor");

        return new Promise((resolve) => {
            const typeInterval = setInterval(() => {
                if (currentChar < fullContent.length) {
                    messageP.textContent = fullContent.substring(
                        0,
                        currentChar + 1,
                    );
                    currentChar++;
                    // Scroll to bottom instantly while typing
                    messagesContainer.scrollTop =
                        messagesContainer.scrollHeight;
                } else {
                    messageP.classList.remove("typing-cursor");
                    clearInterval(typeInterval);

                    resolve(void 0);
                }
            }, 50);
        });
    }

    async function handleOffensiveMessage(
        offensiveMsg: MessageChat,
        moderationMsg: any,
    ) {
        // Type offensive message
        await typeMessage(offensiveMsg);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mark as deleted with animation
        const messageElement: any = document.getElementById(
            `message-${offensiveMsg.id}`,
        );
        const contentDiv = messageElement.querySelector(
            "div:last-child > div:last-child",
        );

        contentDiv.classList.add("deleted-shake");

        setTimeout(() => {
            contentDiv.className =
                "bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-lg";
            const messageP = contentDiv.querySelector("p");
            messageP.className = "text-red-600 italic font-medium";
            messageP.textContent =
                "Esta mensagem foi removida por violar as diretrizes da comunidade";
        }, 300);

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Show ModerAÍ message
        await typeMessage(moderationMsg);
    }

    async function startAnimation() {
        if (isAnimating) return;
        isAnimating = true;

        // Clear messages
        messagesContainer.innerHTML = "";
        messageIndex = 0;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Normal messages
        for (let i = 0; i < 3; i++) {
            await typeMessage(chatSequence[i]);
            await new Promise((resolve) =>
                setTimeout(resolve, chatSequence[i].delay),
            );
        }

        // Offensive message + moderation
        await handleOffensiveMessage(chatSequence[3], chatSequence[4]);
        await new Promise((resolve) =>
            setTimeout(resolve, chatSequence[4].delay),
        );

        // Final message
        await typeMessage(chatSequence[5]);

        isAnimating = false;

        // Restart after 5 seconds
        setTimeout(startAnimation, 5000);
    }

    onMount(() => {
        // Iniciar animação do chat após o carregamento da página
        setTimeout(startAnimation, 1500);
    });
</script>

<!-- Chat Container -->
<div class="container mx-auto px-6 py-8 max-w-2xl">
    <div
        class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden"
        data-animate="fade-up"
        data-duration="1000"
        data-delay="200"
    >
        <!-- Chat Header -->
        <div
            class="bg-gradient-to-r from-emerald-500 to-yellow-500 text-white p-6"
        >
            <div class="flex items-center space-x-3">
                <div
                    class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                    <span class="text-2xl">🍽️</span>
                </div>
                <div>
                    <h1 class="text-xl font-bold">BaiãoFood - Suporte</h1>
                    <p class="text-white/80 text-sm">
                        Comida Regional • Atendimento Online
                    </p>
                </div>
            </div>
        </div>

        <!-- Messages Area -->
        <div
            bind:this={messagesContainer}
            class="p-6 space-y-4 h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
            <!-- Messages will be dynamically added here -->
        </div>

        <!-- Footer -->
        <div
            class="bg-gradient-to-r from-emerald-50 to-yellow-50 p-6 border-t border-emerald-100"
        >
            <div class="text-center">
                <div
                    class="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-yellow-100 px-6 py-3 rounded-full border border-emerald-200"
                >
                    <img
                        src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
                        alt="ModerAÍ"
                        class="w-6 h-6 rounded-full object-cover"
                    />
                    <span class="text-sm font-medium text-emerald-700"
                        >🛡️ Protegido por ModerAÍ</span
                    >
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes typewriter {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }

    @keyframes blink {
        0%,
        50% {
            opacity: 1;
        }
        51%,
        100% {
            opacity: 0;
        }
    }

    :global(.typing-cursor::after) {
        content: "|";
        animation: blink 1s infinite;
        margin-left: 2px;
    }

    :global(.message-enter) {
        animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    :global(.moderai-bounce) {
        animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(20px);
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    :global(.deleted-shake) {
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        75% {
            transform: translateX(5px);
        }
    }

    /* Custom Scrollbar */
    :global(.custom-scrollbar) {
        scrollbar-width: thin;
        scrollbar-color: #10b981 #f0fdf4;
    }

    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 12px;
    }

    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: linear-gradient(
            180deg,
            #f0fdf4 0%,
            #fefce8 50%,
            #f0fdf4 100%
        );
        border-radius: 15px;
        margin: 4px;
    }

    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background: linear-gradient(
            180deg,
            #22c55e 0%,
            #84cc16 25%,
            #eab308 75%,
            #f59e0b 100%
        );
        border-radius: 15px;
        border: 2px solid transparent;
        background-clip: padding-box;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    }

    :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
        background: linear-gradient(
            180deg,
            #16a34a 0%,
            #65a30d 25%,
            #d97706 75%,
            #ea580c 100%
        );
        box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.15);
    }

    :global(.custom-scrollbar::-webkit-scrollbar-corner) {
        background: transparent;
    }
</style>

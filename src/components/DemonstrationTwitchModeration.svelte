<script lang="ts">
    import { onMount } from "svelte";
    import { Volume2, VolumeX } from "@lucide/svelte";

    const chatMessages = [
        {
            user: "GameMaster23",
            message: "🔥 Stream top demais!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Primeira vez aqui, curtindo muito!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message: "Qual jogo vai jogar hoje?",
            color: "#45b7d1",
        },
        { user: "NightGamer", message: "POGGERS", color: "#96ceb4" },
        { user: "ProPlayer99", message: "Seguindo já! 💜", color: "#ffeaa7" },
        {
            user: "ChatMod",
            message: "Bem-vindos ao chat pessoal!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Alguém mais vendo isso?",
            color: "#fd79a8",
        },
        { user: "StreamLover", message: "Melhor streamer!", color: "#00b894" },
        {
            user: "GameMaster23",
            message: "Essa jogada foi insana! 🤯",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Adorei a qualidade da stream! ✨",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message: "Quando será a próxima live? Mal posso esperar! 😂",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "GG! ModerAI é o melhor moderador!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message: "Conteúdo de primeira! ModerAI sempre on!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message:
                "Lembrem-se das regras do chat! E ModerAI está de olho! 👀",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Mandou bem demais! ModerAI é um gênio!",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message: "Sempre aprendendo com você! E com a ajuda do ModerAI!",
            color: "#00b894",
        },
        {
            user: "GameMaster23",
            message: "Que setup incrível! ModerAI, você é demais!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Recomendo a todos! ModerAI é a solução!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message:
                "Podia ter um sorteio, hein? Tipo, um ModerAI de estimação! 🤣",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "TOP! ModerAI é o futuro!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message: "Vou compartilhar com a galera! ModerAI é vida!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message:
                "Qualquer dúvida, só chamar! ModerAI está aqui para ajudar!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Essa live está épica! Graças ao ModerAI!",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message: "Melhor passatempo! ModerAI é o meu herói!",
            color: "#00b894",
        },
        {
            user: "GameMaster23",
            message: "Rumo aos 10k de viewers! Com ModerAI, é fácil!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Obrigado pela diversão! E pelo ModerAI!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message:
                "Ansioso pelo próximo! Será que o ModerAI vai contar uma piada?",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "Show! ModerAI é imbatível!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message:
                "Você é uma inspiração! E ModerAI é a inspiração dos moderadores!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message:
                "Agradecemos a presença de todos! E ao ModerAI pela moderação impecável!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Não paro de rir! ModerAI é hilário! 😂",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message: "Sempre inovando! ModerAI é a inovação em pessoa!",
            color: "#00b894",
        },
        {
            user: "GameMaster23",
            message: "Que energia boa! ModerAI é a alma da festa!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Valeu a pena cada minuto! ModerAI é o cara!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message: "Até a próxima! Espero que o ModerAI esteja lá!",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "Perfeito! ModerAI é a perfeição!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message: "Você é o melhor! E ModerAI é o melhor dos melhores!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message: "Fiquem ligados para mais novidades! E para o ModerAI!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Essa live é viciante! ModerAI é o meu vício!",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message:
                "Sempre superando as expectativas! ModerAI é o super-herói da moderação!",
            color: "#00b894",
        },
        {
            user: "GameMaster23",
            message: "Que gameplay! ModerAI, você é um monstro!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message: "Muito obrigado! ModerAI é o meu salvador!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message: "Quando vai ter collab? Com o ModerAI, claro!",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "Incrível! ModerAI é a lenda!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message: "Parabéns pelo trabalho! E pelo ModerAI!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message: "Não se esqueçam de seguir! E de agradecer ao ModerAI!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Essa live é pura diversão! ModerAI é a alegria do chat!",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message: "Sempre um prazer assistir! ModerAI é o meu prazer!",
            color: "#00b894",
        },
        {
            user: "GameMaster23",
            message: "Que aula! ModerAI é o professor!",
            color: "#ff6b6b",
        },
        {
            user: "PixelHunter",
            message:
                "Melhor streamer da Twitch! E ModerAI é o melhor moderador da Twitch!",
            color: "#4ecdc4",
        },
        {
            user: "StreamFan2024",
            message: "Já deixei o like! E um salve para o ModerAI!",
            color: "#45b7d1",
        },
        {
            user: "NightGamer",
            message: "Sensacional! ModerAI é um espetáculo!",
            color: "#96ceb4",
        },
        {
            user: "ProPlayer99",
            message: "Você é fera! ModerAI é o mestre!",
            color: "#ffeaa7",
        },
        {
            user: "ChatMod",
            message: "Até a próxima live! Com a benção do ModerAI!",
            color: "#a29bfe",
        },
        {
            user: "ViewerX",
            message: "Essa live é um espetáculo! ModerAI é a estrela!",
            color: "#fd79a8",
        },
        {
            user: "StreamLover",
            message: "Sempre aprendendo! ModerAI é a sabedoria!",
            color: "#00b894",
        },
    ];

    let showImage = true;
    let chatIndex = 0;

    function addChatMessage() {
        const container: any = document.getElementById("chatContainer");
        const message = chatMessages[chatIndex % chatMessages.length];

        const messageDiv = document.createElement("div");
        messageDiv.className = "chat-message text-sm";
        messageDiv.innerHTML = `
            <span style="color: ${message.color}; font-weight: bold;">${message.user}:</span>
            <span class="text-gray-300 ml-1">${message.message}</span>
        `;

        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        // Remove old messages to prevent overflow
        if (container.children.length > 15) {
            container.removeChild(container.firstChild);
        }

        chatIndex++;
    }

    function playDonationAudio() {
        if (mainAudio && !isMuted) {
            mainAudio.currentTime = 0;
            mainAudio.play().catch((e) => {
                console.warn("Falha ao reproduzir áudio:", e);
            });
        }
    }

    // Tipagem explícita para showDonationAlert
    async function showDonationAlert() {
        const donationContainer = document.getElementById("donationContainer");
        if (!donationContainer) {
            console.warn("donationContainer não encontrado!");
            return;
        }

        donationContainer.childNodes.forEach((elem) => {
            donationContainer.removeChild(elem);
        });

        const alertDiv = document.createElement("div");
        alertDiv.className =
            "donation-alert bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-lg shadow-2xl border-2 border-yellow-300";
        alertDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span class="text-2xl">💰</span>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="font-bold text-lg">UserTóxico doou R$ 50,00</div>
                    <div class="text-sm font-medium mt-1">
                        "Seu ******, ***** da ****"
                    </div>
                </div>
            </div>
        `;

        donationContainer.appendChild(alertDiv);

        showModerAIAlert();
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 2500);
    }

    function showModerAIAlert() {
        const moderaiContainer: any =
            document.getElementById("moderaiContainer");

        moderaiContainer.childNodes.forEach((elem: any) => {
            moderaiContainer.removeChild(elem);
        });

        const alertDiv = document.createElement("div");
        alertDiv.className =
            "moderai-alert bg-gradient-to-r from-emerald-500 to-yellow-500 text-white p-4 rounded-lg shadow-2xl border-2 border-emerald-400";
        alertDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <img 
                        src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg" 
                        alt="ModerAÍ" 
                        class="w-12 h-12 rounded-full border-2 border-white"
                    >
                </div>
                <div class="flex-1">
                    <div class="font-bold text-lg">ModerAÍ 🤖</div>
                    <div class="text-sm font-medium mt-1">
                        🛡️ Conteúdo ofensivo censurado automaticamente
                    </div>
                </div>
            </div>
        `;

        moderaiContainer.appendChild(alertDiv);
        playDonationAudio();

        // Remove alert after animation
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    function startDemo() {
        showImage = true;
        // Add initial chat messages
        for (let i = 0; i < 5; i++) {
            setTimeout(() => addChatMessage(), i * 800);
        }

        setTimeout(showDonationAlert, 2000);
        setTimeout(() => (showImage = false), 1000);
    }

    let mainAudio: HTMLAudioElement;
    let isMuted = true;
    let playCount = 0;

    function toggleMute() {
        isMuted = !isMuted;
    }

    // Start demo when page loads
    onMount(() => {
        startDemo();

        // Repeat demo every 15 seconds
        setInterval(startDemo, 9000);

        if (mainAudio) {
            mainAudio.onended = () => {
                playCount++;
                if (playCount > 4) {
                    isMuted = true;
                }
            };
        }
    });
</script>

<div class=" min-h-screen overflow-hidden flex items-center justify-center">
    <!-- Stream Layout -->
    <div
        class="flex flex-col md:flex-row h-auto md:h-[80vh] w-[98vw] max-w-2xl md:max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-800 bg-gray-900"
    >
        <!-- Main Stream Content -->
        <div class="flex-1 flex items-center justify-center bg-gray-800 p-2">
            <!-- Stream Video Area -->
            <div
                class="w-[30vw] h-full aspect-square bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative rounded-xl shadow-lg"
            >
                <!-- Donation Alert Container -->
                <div
                    id="donationContainer"
                    class="absolute top-4 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-50"
                >
                    <!-- Alerts will appear here -->
                </div>

                <!-- ModerAÍ Alert Container -->
                <div
                    id="moderaiContainer"
                    class="absolute top-24 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-50"
                >
                    <!-- ModerAÍ alerts will appear here -->
                </div>

                <audio
                    bind:this={mainAudio}
                    src="./DemonstrationTwitchModeration.mp3"
                    muted={isMuted}
                ></audio>

                <div class="absolute top-4 right-4 z-50">
                    <button
                        on:click={toggleMute}
                        class="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {#if isMuted}
                            <VolumeX size={24} />
                        {:else}
                            <Volume2 size={24} />
                        {/if}
                    </button>
                </div>

                {#if showImage}
                    <!-- Streamer Image -->
                    <div class="text-center">
                        <img
                            src="https://ddiidev.github.io/ModerAI-Web/images/logo-only-dog.jpg"
                            alt="Streamer"
                            class="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-2xl"
                        />
                        <h2 class="text-white text-lg md:text-2xl font-bold">
                            ModerAÍ Stream
                        </h2>
                        <p class="text-purple-300 text-sm md:text-base">
                            Demonstração de Moderação
                        </p>
                    </div>
                {:else}
                    <video
                        autoplay
                        muted
                        loop
                        playsinline
                        src="./DemonstrationTwitchModeration.mp4"
                    >
                        <track kind="captions" />
                    </video>
                {/if}
            </div>
        </div>

        <!-- Chat Sidebar -->
        <div
            class="w-full min-w-[220px] md:w-[340px] lg:w-[400px] bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col"
        >
            <!-- Chat Header -->
            <div
                class="bg-purple-600 text-white p-3 border-b border-purple-500"
            >
                <h3 class="font-bold">Chat do Stream</h3>
                <p class="text-sm text-purple-200">1,247 visualizadores</p>
            </div>

            <!-- Chat Messages -->
            <div
                id="chatContainer"
                class="flex-1 overflow-y-auto p-3 space-y-2 overflow-hidden"
            >
                <!-- Chat messages will be added here -->
            </div>

            <!-- Chat Input -->
            <div class="p-3 border-t border-gray-700">
                <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    class="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled
                />
            </div>
        </div>
    </div>

    <style>
        .donation-alert {
            animation:
                slideDown 0.5s ease-out,
                fadeOut 0.5s ease-in 4.5s;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-100px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        .chat-message {
            animation: fadeInChat 0.3s ease-out;
        }

        @keyframes fadeInChat {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .moderai-alert {
            animation: moderaiSlide 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes moderaiSlide {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    </style>
</div>

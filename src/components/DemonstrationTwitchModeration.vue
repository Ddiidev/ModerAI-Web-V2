<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Volume2, VolumeX } from 'lucide-vue-next'

// Refs
const chatContainer = ref(null)
const donationContainer = ref(null)
const moderaiContainer = ref(null)
const audioElement = ref(null)
const isMuted = ref(true)
const showImage = ref(true)
const isShowingPopup = ref(false)
let popupResetTimeout = null

// Chat messages data
const chatMessages = [
  { user: 'GamerPro123', message: 'Primeira!', color: '#FF6B6B', isOffensive: false, donation: null },
  { user: 'StreamFan', message: 'Oi pessoal!', color: '#4ECDC4', isOffensive: false, donation: null },
  { user: 'ToxicUser', message: 'Que stream ruim, você é péssimo!', color: '#FFE66D', isOffensive: true, donation: { amount: 'R$ 5,00', censoredMessage: 'Que stream ****, você é *******!' } },
  { user: 'NiceViewer', message: 'Adorando o conteúdo!', color: '#95E1D3', isOffensive: false, donation: null },
  { user: 'HaterBot', message: 'Você deveria parar de fazer stream', color: '#F38BA8', isOffensive: true, donation: { amount: 'R$ 2,50', censoredMessage: 'Você deveria ***** de fazer stream' } },
  { user: 'SupporterFan', message: 'Continue assim, muito bom!', color: '#A8DADC', isOffensive: false, donation: null },
  { user: 'RandomUser', message: 'Qual jogo você vai jogar depois?', color: '#457B9D', isOffensive: false, donation: null },
  { user: 'TrollAccount', message: 'Conteúdo lixo, ninguém assiste isso', color: '#E63946', isOffensive: true, donation: { amount: 'R$ 1,00', censoredMessage: 'Conteúdo ****, ninguém assiste isso' } }
]

let messageIndex = 0
let demoInterval = null

// Functions
const addChatMessage = (message) => {
  const messageElement = document.createElement('div')
  messageElement.className = 'text-sm py-1'
  messageElement.innerHTML = `
    <span class="font-bold" style="color: ${message.color}">${message.user}:</span>
    <span class="text-white"> ${message.message}</span>
  `
  chatContainer.value.appendChild(messageElement)
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

const showDonationAlert = (donation, user, color) => {
  // Se já está mostrando um popup, não mostrar outro
  if (isShowingPopup.value) {
    return
  }
  
  isShowingPopup.value = true
  
  if (donationContainer.value) {
    while (donationContainer.value.firstChild) {
      donationContainer.value.removeChild(donationContainer.value.firstChild);
    }
  }
  const alertElement = document.createElement('div')
  alertElement.className = 'donation-alert bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-lg shadow-2xl border-2 border-yellow-300'
  alertElement.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <span class="text-2xl">💰</span>
        </div>
      </div>
      <div class="flex-1">
        <div class="font-bold text-lg">${user} doou ${donation.amount}</div>
        <div class="text-sm font-medium mt-1">
          "${donation.censoredMessage}"
        </div>
      </div>
    </div>
  `
  donationContainer.value.appendChild(alertElement)

  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement)
    }
  }, 1500)
}

const showModerAIAlert = () => {
  if (moderaiContainer.value) {
    while (moderaiContainer.value.firstChild) {
      moderaiContainer.value.removeChild(moderaiContainer.value.firstChild);
    }
  }
  const alertElement = document.createElement('div')
  alertElement.className = 'moderai-alert bg-gradient-to-r from-emerald-500 to-yellow-500 text-white p-4 rounded-lg shadow-2xl border-2 border-emerald-400'
  alertElement.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <img 
          src="/src/assets/logo-only-dog.jpg" 
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
  `
  moderaiContainer.value.appendChild(alertElement)

  // Play audio
  if (audioElement.value && !isMuted.value) {
    audioElement.value.currentTime = 0
    audioElement.value.play().catch(console.error)
  }

  setTimeout(() => {
    if (alertElement.parentNode) {
      alertElement.parentNode.removeChild(alertElement)
    }
  }, 2000)
  
  // Reset popup state after 5 seconds
  if (popupResetTimeout) {
    clearTimeout(popupResetTimeout)
  }
  popupResetTimeout = setTimeout(() => {
    isShowingPopup.value = false
  }, 5000)
}

const processMessage = () => {
  // Only process messages and show popups if the image is not shown
  if (showImage.value) {
    return;
  }

  if (messageIndex >= chatMessages.length) {
    // Restart demo
    messageIndex = 0
    chatContainer.value.innerHTML = ''
    isShowingPopup.value = false
    if (popupResetTimeout) {
      clearTimeout(popupResetTimeout)
    }
    // Clear the current interval before restarting
    if (demoInterval) {
      clearInterval(demoInterval)
      demoInterval = null
    }
    setTimeout(startDemo, 2000)
    return
  }

  const message = chatMessages[messageIndex]
  messageIndex++

  if (message.isOffensive && message.donation && !isShowingPopup.value) {
    // Show donation alert first
    showDonationAlert(message.donation, message.user, message.color)

    // Show ModerAI alert after donation
    setTimeout(() => {
      showModerAIAlert()
    }, 1000)

    // Don't add the offensive message to chat
  } else if (!message.isOffensive) {
    // Add normal message to chat
    addChatMessage(message)
  }
}

const startDemo = () => {
  // Clear any existing interval first
  if (demoInterval) {
    clearInterval(demoInterval)
    demoInterval = null
  }
  
  // Start with image for 3 seconds
  showImage.value = true

  setTimeout(() => {
    // Switch to video
    showImage.value = false

    // Start adding messages
    demoInterval = setInterval(processMessage, 1500)
  }, 1000)
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

// Lifecycle
onMounted(() => {
  startDemo()
})

onUnmounted(() => {
  if (demoInterval) {
    clearInterval(demoInterval)
  }
})
</script>

<template>
  <div class="min-h-screen overflow-hidden flex items-center justify-center">
    <!-- Stream Layout -->
    <div
      class="flex flex-col md:flex-row h-auto md:h-[80vh] w-[98vw] max-w-2xl md:max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-gray-800 bg-gray-900">
      <!-- Main Stream Content -->
      <div class="flex-1 flex items-center justify-center bg-gray-800 p-2 h-[65vh] md:h-auto">
        <!-- Stream Video Area -->
        <div
          class="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative rounded-xl shadow-lg">
          <!-- Donation Alert Container -->
          <div ref="donationContainer" class="absolute top-4 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-40">
            <!-- Alerts will appear here -->
          </div>

          <!-- ModerAÍ Alert Container -->
          <div ref="moderaiContainer" class="absolute top-24 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-40">
            <!-- ModerAÍ alerts will appear here -->
          </div>

          <!-- Audio Element -->
          <audio ref="audioElement" :muted="isMuted" src="/DemonstrationTwitchModeration.mp3"></audio>

          <!-- Mute Button -->
          <div class="absolute top-4 right-4 z-40">
            <button @click="toggleMute"
              class="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <VolumeX v-if="isMuted" :size="24" />
              <Volume2 v-else :size="24" />
            </button>
          </div>

          <!-- Streamer Image or Video -->
          <div v-if="showImage" class="text-center">
            <img src="/src/assets/logo-only-dog.jpg" alt="Streamer"
              class="w-32 h-32 md:w-64 md:h-64 rounded-full mx-auto mb-4 border-4 border-purple-500 shadow-2xl" />
            <h2 class="text-white text-lg md:text-2xl font-bold">ModerAÍ Stream</h2>
            <p class="text-purple-300 text-sm md:text-base">Demonstração de Moderação</p>
          </div>
          <video v-else autoplay muted loop playsinline src="/DemonstrationTwitchModeration.mp4"
            class="w-full h-full object-cover rounded-xl">
            <track kind="captions" />
          </video>
        </div>
      </div>

      <!-- Chat Sidebar -->
      <div
        class="w-full min-w-[220px] md:w-[340px] lg:w-[400px] bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col h-[30vh] md:h-auto">
        <!-- Chat Header -->
        <div class="bg-purple-600 text-white p-3 border-b border-purple-500">
          <h3 class="font-bold">Chat do Stream</h3>
          <p class="text-sm text-purple-200">1,247 visualizadores</p>
        </div>

        <!-- Chat Messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 space-y-2 overflow-hidden">
          <!-- Chat messages will be added here dynamically -->
        </div>

        <!-- Chat Input -->
        <div class="p-3 border-t border-gray-700">
          <input type="text" placeholder="Digite sua mensagem..."
            class="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donation-alert {
  animation: slideDown 0.5s ease-out, fadeOut 0.5s ease-in 4.5s;
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
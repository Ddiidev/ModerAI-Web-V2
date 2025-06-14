<template>
  <DashboardLayout>
    <div class="space-y-8">
      <!-- Promotion Banner -->
      <div v-if="credits.promotionActive" class="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-6 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold mb-2">🎉 Promoção de Lançamento!</h3>
            <p class="text-yellow-100">
              R$ 10,00 = {{ credits.promotionRate }} palavras até {{ formatDate(credits.promotionEndDate) }}
            </p>
          </div>
          <Gift class="w-12 h-12 text-yellow-200" />
        </div>
      </div>

      <!-- Credits Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Saldo Atual</h3>
            <Wallet class="w-8 h-8 text-emerald-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-emerald-700">R$ {{ credits.balance.toFixed(2) }}</p>
            <p class="text-sm text-gray-600">{{ credits.wordsRemaining }} palavras restantes</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Palavras Processadas</h3>
            <FileText class="w-8 h-8 text-blue-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-blue-700">{{ metrics.totalWordsProcessed.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Total processado</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Taxa de Precisão</h3>
            <Target class="w-8 h-8 text-purple-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-purple-700">{{ accuracyRate.toFixed(1) }}%</p>
            <p class="text-sm text-gray-600">Precisão média</p>
          </div>
        </div>
      </div>

      <!-- Processing Chart -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Evolução do Processamento</h3>
          <TrendingUp class="w-6 h-6 text-emerald-600" />
        </div>
        <div class="h-80">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Detailed Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-red-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Palavras Ofensivas</h3>
            <AlertTriangle class="w-8 h-8 text-red-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-red-700">{{ metrics.offensiveWordsDetected.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Detectadas e bloqueadas</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-green-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Palavras Aprovadas</h3>
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-green-700">{{ metrics.nonOffensiveWords.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Liberadas com segurança</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-orange-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Falsos Positivos</h3>
            <AlertCircle class="w-8 h-8 text-orange-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-orange-700">{{ metrics.falsePositives.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Identificados e corrigidos</p>
          </div>
        </div>
      </div>

      <!-- Details Button -->
      <div class="flex justify-center">
        <button
          class="relative px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          style="filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));"
          disabled
        >
          <span class="mr-2">Detalhes</span>
          <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            WIP
          </span>
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import DashboardLayout from '@/components/DashboardLayout.vue';
import { dashboardService } from '@/lib/services/dashboard';
import { useAuthStore } from '@/stores/auth';
import type { CreditData, ProcessingMetrics } from '@/types/dashboard';
import {
  Gift,
  Wallet,
  FileText,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const authStore = useAuthStore();

// Data
const credits = ref<CreditData>({
  balance: 0,
  wordsRemaining: 0,
  promotionActive: false,
  promotionEndDate: '',
  promotionRate: 0
});

const metrics = ref<ProcessingMetrics>({
  totalWordsProcessed: 0,
  offensiveWordsDetected: 0,
  nonOffensiveWords: 0,
  falsePositives: 0,
  processingHistory: []
});

// Computed
const accuracyRate = computed(() => {
  if (metrics.value.totalWordsProcessed === 0) return 0;
  const correctDetections = metrics.value.totalWordsProcessed - metrics.value.falsePositives;
  return (correctDetections / metrics.value.totalWordsProcessed) * 100;
});

// Chart data
const chartData = computed(() => ({
  labels: metrics.value.processingHistory.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }),
  datasets: [
    {
      label: 'Palavras Processadas',
      data: metrics.value.processingHistory.map(item => item.wordsProcessed),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Data'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Palavras'
      },
      beginAtZero: true
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
};

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const loadDashboardData = async () => {
  try {
    if (authStore.token) {
      dashboardService.setToken(authStore.token);
    }
    
    const [creditsData, metricsData] = await Promise.all([
      dashboardService.getCreditData(),
      dashboardService.getProcessingMetrics()
    ]);
    
    credits.value = creditsData;
    metrics.value = metricsData;
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  }
};

// Initialize
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: none;
}
</style>
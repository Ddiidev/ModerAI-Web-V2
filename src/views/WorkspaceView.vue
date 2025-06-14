<template>
  <DashboardLayout>
    <div class="relative">
      <!-- Conteúdo original com blur -->
      <div class="space-y-8 filter blur-sm pointer-events-none">
      <!-- Header -->
      <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Workspace</h2>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">Projetos:</span>
              <span class="text-emerald-600 font-bold">{{ projects.length }}</span>
            </div>
            <button
              @click="showCreateProjectModal = true"
              class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus class="w-4 h-4" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>
        <p class="text-gray-600">
          Organize seus projetos de moderação, gerencie configurações específicas e monitore o desempenho de cada aplicação.
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Projetos Ativos</h3>
            <FolderOpen class="w-8 h-8 text-emerald-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-emerald-700">{{ activeProjects }}</p>
            <p class="text-sm text-gray-600">Em produção</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Total de Requisições</h3>
            <Activity class="w-8 h-8 text-blue-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-blue-700">{{ totalRequests.toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Últimos 30 dias</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Taxa de Bloqueio</h3>
            <Shield class="w-8 h-8 text-red-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-red-700">{{ blockRate.toFixed(1) }}%</p>
            <p class="text-sm text-gray-600">Conteúdo bloqueado</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Uptime</h3>
            <Zap class="w-8 h-8 text-green-600" />
          </div>
          <div class="space-y-2">
            <p class="text-3xl font-bold text-green-700">99.9%</p>
            <p class="text-sm text-gray-600">Disponibilidade</p>
          </div>
        </div>
      </div>

      <!-- Projects Grid -->
      <div v-if="projects.length === 0" class="bg-white rounded-xl p-12 shadow-lg border border-emerald-200/50 text-center">
        <FolderPlus class="w-20 h-20 mx-auto mb-6 text-gray-300" />
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum projeto criado</h3>
        <p class="text-gray-500 mb-6">Crie seu primeiro projeto para começar a organizar suas configurações de moderação</p>
        <button
          @click="showCreateProjectModal = true"
          class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors inline-flex items-center space-x-2"
        >
          <Plus class="w-5 h-5" />
          <span>Criar Primeiro Projeto</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white rounded-xl p-6 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          @click="selectProject(project)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold',
                  project.color || 'bg-emerald-500'
                ]"
              >
                {{ project.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  {{ project.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ project.description }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                :class="[
                  'px-2 py-1 text-xs rounded-full',
                  project.status === 'active' ? 'bg-green-100 text-green-700' :
                  project.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                ]"
              >
                {{ getStatusLabel(project.status) }}
              </span>
              <button
                @click.stop="toggleProjectMenu(project.id)"
                class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Requisições hoje:</span>
              <span class="font-medium text-gray-800">{{ project.stats.requestsToday.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Taxa de bloqueio:</span>
              <span class="font-medium text-red-600">{{ project.stats.blockRate.toFixed(1) }}%</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Última atividade:</span>
              <span class="font-medium text-gray-800">{{ formatRelativeTime(project.lastActivity) }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar class="w-4 h-4" />
                <span>Criado em {{ formatDate(project.createdAt) }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <div
                  v-for="category in project.moderationCategories.slice(0, 3)"
                  :key="category"
                  class="w-2 h-2 bg-emerald-400 rounded-full"
                ></div>
                <span v-if="project.moderationCategories.length > 3" class="text-xs text-gray-400">
                  +{{ project.moderationCategories.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Project Menu -->
          <div
            v-if="showProjectMenu[project.id]"
            class="absolute right-6 top-16 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10"
            @click.stop
          >
            <button
              @click="editProject(project)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit class="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              @click="duplicateProject(project)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Copy class="w-4 h-4" />
              <span>Duplicar</span>
            </button>
            <button
              @click="toggleProjectStatus(project)"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Power class="w-4 h-4" />
              <span>{{ project.status === 'active' ? 'Pausar' : 'Ativar' }}</span>
            </button>
            <hr class="my-1" />
            <button
              @click="deleteProject(project)"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 class="w-4 h-4" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Project Modal -->
    <div
      v-if="showCreateProjectModal || editingProject"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeProjectModal"
    >
      <div
        class="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">
            {{ editingProject ? 'Editar Projeto' : 'Novo Projeto' }}
          </h3>
          <button
            @click="closeProjectModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveProject" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome do Projeto *
              </label>
              <input
                v-model="projectForm.name"
                type="text"
                placeholder="Ex: Blog Comments, Chat App"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cor do Projeto
              </label>
              <select
                v-model="projectForm.color"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="bg-emerald-500">Verde</option>
                <option value="bg-blue-500">Azul</option>
                <option value="bg-purple-500">Roxo</option>
                <option value="bg-red-500">Vermelho</option>
                <option value="bg-yellow-500">Amarelo</option>
                <option value="bg-indigo-500">Índigo</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              v-model="projectForm.description"
              placeholder="Descreva o propósito deste projeto..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows="3"
            ></textarea>
          </div>
          
          <!-- Moderation Categories -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Categorias de Moderação
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                v-for="category in availableCategories"
                :key="category.id"
                class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-300 cursor-pointer"
              >
                <input
                  v-model="projectForm.moderationCategories"
                  type="checkbox"
                  :value="category.id"
                  class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div class="flex-1">
                  <div class="font-medium text-gray-800">{{ category.name }}</div>
                  <div class="text-sm text-gray-500">{{ category.description }}</div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Settings -->
          <div class="space-y-4">
            <h4 class="text-lg font-medium text-gray-800">Configurações</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sensibilidade ({{ projectForm.sensitivity }}%)
                </label>
                <input
                  v-model.number="projectForm.sensitivity"
                  type="range"
                  min="0"
                  max="100"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Permissivo</span>
                  <span>Rigoroso</span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Idiomas Suportados
                </label>
                <select
                  v-model="projectForm.supportedLanguages"
                  multiple
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  size="3"
                >
                  <option value="pt">Português</option>
                  <option value="en">Inglês</option>
                  <option value="es">Espanhol</option>
                  <option value="fr">Francês</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-3">
              <label class="flex items-center space-x-3">
                <input
                  v-model="projectForm.autoModeration"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div>
                  <div class="font-medium text-gray-800">Moderação Automática</div>
                  <div class="text-sm text-gray-500">Bloquear automaticamente conteúdo ofensivo</div>
                </div>
              </label>
              
              <label class="flex items-center space-x-3">
                <input
                  v-model="projectForm.emailNotifications"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div>
                  <div class="font-medium text-gray-800">Notificações por Email</div>
                  <div class="text-sm text-gray-500">Receber alertas sobre atividade suspeita</div>
                </div>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeProjectModal"
              class="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              {{ isSaving ? 'Salvando...' : editingProject ? 'Salvar Alterações' : 'Criar Projeto' }}
            </button>
          </div>
        </form>
      </div>
      </div>
      
      <!-- Overlay "Em Construção" -->
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-emerald-200/50 text-center max-w-md mx-4">
          <div class="mb-4">
            <div class="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Em Construção</h2>
          <p class="text-gray-600 mb-4">Esta funcionalidade está sendo desenvolvida e estará disponível em breve.</p>
          <div class="flex items-center justify-center space-x-2 text-emerald-600">
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import { dashboardService } from '@/lib/services/dashboard';
import { useAuthStore } from '@/stores/auth';
import {
  Plus,
  FolderOpen,
  Activity,
  Shield,
  Zap,
  FolderPlus,
  MoreVertical,
  Calendar,
  Edit,
  Copy,
  Power,
  Trash2,
  X
} from 'lucide-vue-next';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'active' | 'paused' | 'inactive';
  moderationCategories: string[];
  sensitivity: number;
  autoModeration: boolean;
  emailNotifications: boolean;
  supportedLanguages: string[];
  createdAt: string;
  lastActivity: string;
  stats: {
    requestsToday: number;
    blockRate: number;
  };
}

interface ProjectForm {
  name: string;
  description: string;
  color: string;
  moderationCategories: string[];
  sensitivity: number;
  autoModeration: boolean;
  emailNotifications: boolean;
  supportedLanguages: string[];
}

const authStore = useAuthStore();

// Data
const projects = ref<Project[]>([]);
const showCreateProjectModal = ref(false);
const editingProject = ref<Project | null>(null);
const showProjectMenu = ref<Record<string, boolean>>({});
const isSaving = ref(false);

const projectForm = ref<ProjectForm>({
  name: '',
  description: '',
  color: 'bg-emerald-500',
  moderationCategories: [],
  sensitivity: 75,
  autoModeration: true,
  emailNotifications: false,
  supportedLanguages: ['pt']
});

const availableCategories = [
  {
    id: 'hate-speech',
    name: 'Discurso de Ódio',
    description: 'Detecta linguagem ofensiva e discriminatória'
  },
  {
    id: 'spam',
    name: 'Spam',
    description: 'Identifica conteúdo promocional não solicitado'
  },
  {
    id: 'violence',
    name: 'Violência',
    description: 'Detecta conteúdo violento ou ameaçador'
  },
  {
    id: 'adult-content',
    name: 'Conteúdo Adulto',
    description: 'Identifica conteúdo sexual ou inadequado'
  },
  {
    id: 'harassment',
    name: 'Assédio',
    description: 'Detecta comportamento de assédio ou bullying'
  },
  {
    id: 'misinformation',
    name: 'Desinformação',
    description: 'Identifica informações falsas ou enganosas'
  }
];

// Computed
const activeProjects = computed(() => {
  return projects.value.filter(p => p.status === 'active').length;
});

const totalRequests = computed(() => {
  return projects.value.reduce((total, project) => total + project.stats.requestsToday, 0);
});

const blockRate = computed(() => {
  const totalReqs = totalRequests.value;
  if (totalReqs === 0) return 0;
  
  const totalBlocked = projects.value.reduce((total, project) => {
    return total + (project.stats.requestsToday * project.stats.blockRate / 100);
  }, 0);
  
  return (totalBlocked / totalReqs) * 100;
});

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Agora há pouco';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return formatDate(dateString);
};

const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Ativo',
    paused: 'Pausado',
    inactive: 'Inativo'
  };
  return labels[status as keyof typeof labels] || status;
};

const toggleProjectMenu = (projectId: string) => {
  // Close all other menus
  Object.keys(showProjectMenu.value).forEach(id => {
    if (id !== projectId) {
      showProjectMenu.value[id] = false;
    }
  });
  
  showProjectMenu.value[projectId] = !showProjectMenu.value[projectId];
};

const selectProject = (project: Project) => {
  // TODO: Navigate to project details or open project workspace
  console.log('Selected project:', project);
};

const editProject = (project: Project) => {
  editingProject.value = project;
  projectForm.value = {
    name: project.name,
    description: project.description,
    color: project.color,
    moderationCategories: [...project.moderationCategories],
    sensitivity: project.sensitivity,
    autoModeration: project.autoModeration,
    emailNotifications: project.emailNotifications,
    supportedLanguages: [...project.supportedLanguages]
  };
  showProjectMenu.value[project.id] = false;
};

const duplicateProject = async (project: Project) => {
  try {
    const newProject: Partial<Project> = {
      name: `${project.name} (Cópia)`,
      description: project.description,
      color: project.color,
      moderationCategories: [...project.moderationCategories],
      sensitivity: project.sensitivity,
      autoModeration: project.autoModeration,
      emailNotifications: project.emailNotifications,
      supportedLanguages: [...project.supportedLanguages]
    };
    
    // TODO: Call API to create project
    console.log('Duplicating project:', newProject);
    showProjectMenu.value[project.id] = false;
  } catch (error) {
    console.error('Erro ao duplicar projeto:', error);
  }
};

const toggleProjectStatus = async (project: Project) => {
  try {
    const newStatus = project.status === 'active' ? 'paused' : 'active';
    project.status = newStatus;
    
    // TODO: Call API to update project status
    console.log('Toggling project status:', project.id, newStatus);
    showProjectMenu.value[project.id] = false;
  } catch (error) {
    console.error('Erro ao alterar status do projeto:', error);
  }
};

const deleteProject = async (project: Project) => {
  if (!confirm(`Tem certeza que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
    return;
  }
  
  try {
    projects.value = projects.value.filter(p => p.id !== project.id);
    
    // TODO: Call API to delete project
    console.log('Deleting project:', project.id);
    showProjectMenu.value[project.id] = false;
  } catch (error) {
    console.error('Erro ao excluir projeto:', error);
  }
};

const closeProjectModal = () => {
  showCreateProjectModal.value = false;
  editingProject.value = null;
  projectForm.value = {
    name: '',
    description: '',
    color: 'bg-emerald-500',
    moderationCategories: [],
    sensitivity: 75,
    autoModeration: true,
    emailNotifications: false,
    supportedLanguages: ['pt']
  };
};

const saveProject = async () => {
  if (isSaving.value) return;
  
  isSaving.value = true;
  
  try {
    if (editingProject.value) {
      // Update existing project
      const projectIndex = projects.value.findIndex(p => p.id === editingProject.value!.id);
      if (projectIndex !== -1) {
        projects.value[projectIndex] = {
          ...projects.value[projectIndex],
          ...projectForm.value
        };
      }
    } else {
      // Create new project
      const newProject: Project = {
        id: Date.now().toString(),
        ...projectForm.value,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        stats: {
          requestsToday: 0,
          blockRate: 0
        }
      };
      
      projects.value.push(newProject);
    }
    
    // TODO: Call API to save project
    console.log('Saving project:', projectForm.value);
    
    closeProjectModal();
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
  } finally {
    isSaving.value = false;
  }
};

const loadProjects = async () => {
  try {
    // TODO: Load projects from API
    // For now, using mock data
    projects.value = [
      {
        id: '1',
        name: 'Blog Comments',
        description: 'Sistema de moderação para comentários do blog',
        color: 'bg-emerald-500',
        status: 'active',
        moderationCategories: ['hate-speech', 'spam'],
        sensitivity: 80,
        autoModeration: true,
        emailNotifications: true,
        supportedLanguages: ['pt', 'en'],
        createdAt: '2024-01-15T10:00:00Z',
        lastActivity: '2024-01-20T14:30:00Z',
        stats: {
          requestsToday: 1234,
          blockRate: 12.5
        }
      },
      {
        id: '2',
        name: 'Chat App',
        description: 'Moderação em tempo real para aplicativo de chat',
        color: 'bg-blue-500',
        status: 'active',
        moderationCategories: ['hate-speech', 'harassment', 'violence'],
        sensitivity: 90,
        autoModeration: true,
        emailNotifications: false,
        supportedLanguages: ['pt'],
        createdAt: '2024-01-10T08:00:00Z',
        lastActivity: '2024-01-20T16:45:00Z',
        stats: {
          requestsToday: 5678,
          blockRate: 8.3
        }
      }
    ];
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
  }
};

// Initialize
onMounted(() => {
  loadProjects();
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
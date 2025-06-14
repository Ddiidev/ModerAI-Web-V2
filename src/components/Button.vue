<script setup lang="ts">
import { computed } from 'vue';

// Props do componente
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  href?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  customClass?: string;
  external?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  rounded: 'md',
  disabled: false,
  fullWidth: false,
  type: 'button',
  customClass: '',
  external: false
});

// Emits para eventos
const emit = defineEmits(['click']);

// Estilos base para todos os botões
const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';

// Estilos específicos para cada variante
const variantStyles = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500';
    case 'secondary':
      return 'bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 focus:ring-emerald-500';
    case 'tertiary':
      return 'bg-transparent text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500';
    case 'danger':
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500';
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500';
    case 'warning':
      return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 focus:ring-yellow-500';
    case 'info':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500';
    default:
      return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 focus:ring-emerald-500';
  }
});

// Estilos para diferentes tamanhos
const sizeStyles = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs px-3 py-1.5';
    case 'sm':
      return 'text-sm px-4 py-2';
    case 'md':
      return 'text-base px-6 py-3';
    case 'lg':
      return 'text-lg px-8 py-4';
    case 'xl':
      return 'text-xl px-10 py-5';
    default:
      return 'text-base px-6 py-3';
  }
});

// Estilos para diferentes arredondamentos
const roundedStyles = computed(() => {
  switch (props.rounded) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-xl';
    case 'lg':
      return 'rounded-2xl';
    case 'xl':
      return 'rounded-3xl';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-xl';
  }
});

// Estilos para largura total
const widthStyles = computed(() => {
  return props.fullWidth ? 'w-full' : '';
});

// Estilos para estado desabilitado
const disabledStyles = computed(() => {
  return props.disabled ? 'opacity-50 cursor-not-allowed transform-none hover:shadow-lg' : '';
});

// Classe final combinada
const buttonClass = computed(() => {
  return [
    baseStyles,
    variantStyles.value,
    sizeStyles.value,
    roundedStyles.value,
    widthStyles.value,
    disabledStyles.value,
    props.customClass
  ].join(' ');
});

// Função para lidar com cliques
const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <!-- Link externo -->
  <a 
    v-if="href && external" 
    :href="href" 
    target="_blank" 
    rel="noopener noreferrer"
    :class="buttonClass"
  >
    <slot />
  </a>
  
  <!-- Link interno -->
  <router-link 
    v-else-if="href" 
    :to="href" 
    :class="buttonClass"
  >
    <slot />
  </router-link>
  
  <!-- Botão normal -->
  <button 
    v-else
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
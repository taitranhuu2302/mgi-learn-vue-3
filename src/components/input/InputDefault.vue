<script setup lang="ts">
import { ref, watch } from 'vue'

const { value } = defineProps<{
  value: String
  placeholder?: string
}>()
const isFocus = ref<boolean>(false)
defineEmits(['update:value'])
</script>

<template>
  <div class="input-control" :class="{ focus: isFocus }">
    <slot name="startIcon" />
    <input
      class="input-default"
      type="text"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('update:value', $event.target.value)"
    />
    <slot name="endIcon" />
  </div>
</template>

<style scoped>
.input-control {
  @apply flex gap-2.5 border-2 px-3 py-2 rounded;
}

.input-control.focus {
  @apply border-primary;
}

.input-default {
  @apply outline-none w-full;
}
</style>

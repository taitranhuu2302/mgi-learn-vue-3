<script setup lang="ts">
import { ref } from 'vue'

const { task } = defineProps<{
  task: TaskItemType
}>()
const emit = defineEmits(['changeStatusTask', 'onDeleteTask', 'getEditTask'])
const isOpenDropdown = ref<boolean>(false)

const onChangeStatusTask = () => {
  const status = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
  emit('changeStatusTask', task.id, status)
}
</script>

<template>
  <li class="task-item">
    <div class="flex items-center gap-2.5 flex-grow" @click="onChangeStatusTask">
      <i v-if="task.status === 'COMPLETED'" class="far fa-check-square"></i>
      <i v-if="task.status === 'PENDING'" class="far fa-square"></i>
      <span
        class="text-lg"
        :class="{ 'line-through text-gray-500': task.status === 'COMPLETED' }"
        >{{ task.name }}</span
      >
    </div>
    <div class="relative" v-click-outside="() => (isOpenDropdown = false)">
      <button @click="isOpenDropdown = !isOpenDropdown">
        <i class="far fa-ellipsis-h"></i>
      </button>
      <ul v-show="isOpenDropdown" class="dropdown">
        <li @click="emit('getEditTask', task)">Edit</li>
        <li @click="emit('onDeleteTask', task.id)">Delete</li>
      </ul>
    </div>
  </li>
</template>

<style scoped>
.task-item {
  @apply p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-200 rounded;
}

.dropdown {
  @apply w-fit bg-white px-2 py-2.5 right-0 absolute top-full rounded shadow-md z-10;
}

.dropdown li {
  @apply p-2 hover:bg-gray-200;
}
</style>

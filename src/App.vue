<script setup lang="ts">
import TaskItem from '@/components/TaskItem.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import InputDefault from '@/components/input/InputDefault.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { v4 as uuidV4 } from 'uuid'

const TASK_KEY = 'tasks'
type ActiveTabType = 'All' | 'Pending' | 'Completed'

const activeTabs = ref<ActiveTabType>('All')
const taskObj = reactive<TaskItemType>({
  createdAt: new Date(),
  id: '',
  name: '',
  status: 'PENDING'
})
const taskList = ref<TaskItemType[]>([])
const isTaskTyping = computed(() => !!taskObj.name)
const keyword = ref<string>('')
const sortType = ref<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT')

onMounted(() => {
  taskList.value = localStorage.getItem(TASK_KEY) ? JSON.parse(localStorage.getItem(TASK_KEY)) : []
})

const taskListFilter = computed(() => {
  const search = keyword.value.toLowerCase()
  let result: TaskItemType[] = []

  if (activeTabs.value === 'Pending') {
    result = taskList.value.filter(
      (item) => item.status === 'PENDING' && item.name.toLowerCase().includes(search)
    )
  } else if (activeTabs.value === 'Completed') {
    result = taskList.value.filter(
      (item) => item.status === 'COMPLETED' && item.name.toLowerCase().includes(search)
    )
  } else {
    result = taskList.value.filter((item) => item.name.toLowerCase().includes(search))
  }

  if (sortType.value === 'ASC') {
    result.sort((a, b) => b.name.localeCompare(a.name))
  } else {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

const onDeleteTask = (id: string) => {
  taskList.value = taskList.value.filter((item) => item.id !== id)
  updateLocalstorage()
}

const changeStatusTask = (id: string, status: TaskItemStatusType) => {
  const task = taskList.value.find((item) => item.id === id)
  if (!task) return

  task.status = status
}

const updateLocalstorage = () => {
  localStorage.setItem(TASK_KEY, JSON.stringify(taskList.value))
}

const createOrUpdateTask = () => {
  if (!taskObj.name) return

  if (!taskObj.id) {
    // ADD
    const newTask: TaskItemType = {
      ...taskObj,
      id: uuidV4(),
      createdAt: new Date()
    }
    taskList.value = [newTask, ...taskList.value]
  } else {
    const index = taskList.value.findIndex((item) => item.id === taskObj.id)
    if (index !== -1) {
      taskList.value[index] = {
        ...taskObj
      }
    }
  }
  resetTask()
  updateLocalstorage()
}

const getEditTask = (editTask: TaskItemType) => {
  taskObj.id = editTask.id
  taskObj.name = editTask.name
  taskObj.status = editTask.status
  taskObj.createdAt = editTask.createdAt
}

const resetTask = () => {
  taskObj.name = ''
  taskObj.status = 'PENDING'
  taskObj.id = ''
}

const onClearTasks = () => {
  taskList.value = []
  updateLocalstorage()
}
</script>

<template>
  <main-layout>
    <div id="task">
      <h2 class="text-2xl font-semibold text-center mb-3">Todo List</h2>
      <div class="flex gap-2.5">
        <input-default class="flex-grow" v-model:value="keyword" placeholder="Search...">
          <template #startIcon><i class="fal fa-search text-xl"></i></template>
        </input-default>
        <button @click="sortType = 'ASC'">
          <i class="fas fa-sort-alpha-up text-xl"></i>
        </button>
        <button @click="sortType = 'DESC'">
          <i class="fas fa-sort-alpha-down text-xl"></i>
        </button>
      </div>
      <div class="flex items-center justify-between gap-2.5 flex-wrap mt-3">
        <ul class="tabs">
          <li @click="activeTabs = 'All'" :class="{ active: activeTabs === 'All' }">All</li>
          <li @click="activeTabs = 'Pending'" :class="{ active: activeTabs === 'Pending' }">
            Pending
          </li>
          <li @click="activeTabs = 'Completed'" :class="{ active: activeTabs === 'Completed' }">
            Completed
          </li>
        </ul>
        <button
          @click="onClearTasks"
          class="p-2 bg-gradient-to-tr from-primary-500 to-primary text-white rounded"
        >
          Clear All
        </button>
      </div>
      <div class="border border-gray-300 my-4"></div>
      <ul class="task-list">
        <li v-if="taskListFilter.length <= 0" class="text-lg">You don't have any task here</li>
        <template v-for="task in taskListFilter" :key="task.id">
          <task-item
            @onDeleteTask="onDeleteTask"
            :task="task"
            @changeStatusTask="changeStatusTask"
            @getEditTask="getEditTask"
          ></task-item>
        </template>
      </ul>
      <input-default
        placeholder="Add some thing..."
        v-model:value="taskObj.name"
        @keyup.enter="createOrUpdateTask"
      >
        <template #startIcon><i class="fas fa-plus-circle text-gray-500 text-2xl"></i></template>
        <template #endIcon>
          <button
            @click="createOrUpdateTask"
            v-show="isTaskTyping"
            class="bg-primary-500 hover:bg-opacity-95 px-2.5 rounded text-white"
          >
            <template v-if="!taskObj.id">Add</template>
            <template v-if="taskObj.id">Edit</template>
          </button>
          <button
            v-if="taskObj.id"
            @click="resetTask"
            class="bg-red-500 hover:bg-opacity-95 px-2.5 rounded text-white"
          >
            Reset
          </button>
        </template>
      </input-default>
    </div>
  </main-layout>
</template>

<style scoped>
#task {
  @apply max-w-[500px] w-full rounded p-5 bg-white;
}

.tabs {
  @apply flex items-center gap-3;
}

.tabs li {
  @apply text-lg cursor-pointer;
}

.tabs li.active {
  @apply text-primary-500;
}

.task-list {
  @apply flex flex-col h-[340px] overflow-y-auto;
}
</style>
import type { Directive } from 'vue'

const clickOutSide: Directive = {
  beforeMount: (el, binding) => {
    el.clickOutside = (event: MouseEvent) => {
      if (event.target !== el && !el.contains(event.target) && binding.value instanceof Function) {
        binding.value()
      }
    }

    document.addEventListener('click', el.clickOutside)
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickOutside)
  }
}

export default clickOutSide

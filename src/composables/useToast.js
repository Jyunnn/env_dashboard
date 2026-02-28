import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = ({ type = 'success', message = '', duration = 3000 }) => {
    const id = ++toastId
    toasts.value.push({ id, type, message })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showSuccess = (message) => {
    return showToast({ type: 'success', message })
  }

  const showError = (message) => {
    return showToast({ type: 'error', message })
  }

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError
  }
}

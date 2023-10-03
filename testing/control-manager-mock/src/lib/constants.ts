if (import.meta.env.VITE_BACKEND_PORT === undefined) {
  throw new Error('VITE_BACKEND_PORT is undefined')
}

export const backendUrl = `http://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}/api`
export const backendUrlWs = `ws://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`

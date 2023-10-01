/// <reference types="vite/client" />

declare module '*.vue' {
  import { defineComponent } from 'vue'
  constcomponent: ReturnType<typeof defineComponent>
  export default component
}

interface ImportMeta {
  env: {
    VITE_BACKEND_URL: string;
    VITE_WS_BACKEND_URL: string;
    PORT?: string;
    PWD: string;
  };
}

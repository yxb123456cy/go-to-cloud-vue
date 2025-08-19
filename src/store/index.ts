import { createPinia } from "pinia";
import piniaPersistedstatePlugin from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPersistedstatePlugin)

export default pinia;
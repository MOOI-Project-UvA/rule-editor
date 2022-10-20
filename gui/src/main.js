import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/mdi-v6'
import { store } from "./store";

// Import icon libraries
import '@quasar/extras/mdi-v6/mdi-v6.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const myApp = createApp(App)
myApp.use(store)

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet: quasarIconSet,
})

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'
import Toasted from 'vue-toasted'
import VueI18n from 'vue-i18n'

import routes from './routes'

import en from './assets/translation/en.json'
import vi from './assets/translation/vi.json'
import tr from './assets/translation/tr.json'
import ja from './assets/translation/ja.json'
import cn from './assets/translation/cn.json'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Toasted, {
    position: 'bottom-right',
    theme: 'bubble',
    duration: 4000,
    action : {
        text : 'Dismiss',
        onClick : (e, toastObject) => {
            toastObject.goAway(0)
        }
    },
    singleton: true
})

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en,
        vi,
        tr,
        ja,
        cn
    }
})

const store = new Vuex.Store({
    state: {
    }
})

const EventBus = new Vue()

Vue.prototype.$bus = EventBus

const router = new VueRouter({
    mode: 'history',
    routes
})

new Vue({ // eslint-disable-line no-new
    el: '#app',
    i18n,
    store,
    router: router,
    components: { App },
    data: {
        language: 'en'
    },
    template: '<App/>'
})

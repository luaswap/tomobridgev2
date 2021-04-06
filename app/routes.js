// import Home from './components/Home.vue'
import Product from './components/Product.vue'
import Wrap from './components/wrap/Wrap.vue'
import Unwrap from './components/unwrap/Unwrap.vue'
import Select from './Select.vue'

const routes = [
    { path: '/', component: Product },
    { path: '/select', component: Select },
    { path: '/wrap', component: Wrap },
    { path: '/unwrap', component: Unwrap }
]

export default routes

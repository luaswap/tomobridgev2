// import Home from './components/Home.vue'
import Product from './components/Product.vue'
import Wrap from './components/wrap/Wrap.vue'
import Unwrap from './components/unwrap/Unwrap.vue'
import Select from './Select.vue'
import WrapExection from './components/wrap/WrapExecution.vue'
import UnwrapExection from './components/unwrap/UnwrapExecution.vue'

const routes = [
    { path: '/', component: Product },
    { path: '/select', component: Select },
    { path: '/wrap', component: Wrap },
    { path: '/unwrap', component: Unwrap },
    { path: '/wrapToken', component: WrapExection },
    { path: '/unwrapToken', component: UnwrapExection }
]

export default routes

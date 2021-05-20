import Product from './components/Product.vue'
import Wrap from './components/wrap/Wrap.vue'
import Unwrap from './components/unwrap/Unwrap.vue'
import Select from './Select.vue'
import WrapExecution from './components/wrap/WrapExecution.vue'
import UnwrapExecution from './components/unwrap/UnwrapExecution.vue'

const routes = [
    { path: '/', component: Product },
    { path: '/select', component: Select },
    { path: '/wrap', component: Wrap },
    { path: '/unwrap', component: Unwrap },
    { path: '/wrapToken', component: WrapExecution, name: 'WrapExecution' },
    { path: '/unwrapToken', component: UnwrapExecution, name: 'UnwrapExecution' }
]

export default routes

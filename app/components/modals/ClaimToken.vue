<template>
    <b-modal
        id="claimModal"
        ref="claimModal"
        centered
        scrollable
        size="sm"
        hide-footer>
        <template #modal-title>
            <div class="">Connect to a wallet</div>
        </template>
        <b-container>
            <div
                class="login__buttons mt-3">
                <b-button
                    class="d-flex">
                    <span>
                        Metamask
                    </span>
                    <img
                        src="/app/assets/images/metamask.png"
                        alt="Metamask">
                </b-button>
            </div>
        </b-container>
    </b-modal>
</template>

<script>
export default {
    name: 'App',
    components: { },
    mixins: [],
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
        }
    },
    validations: { },
    async updated () { },
    destroyed () { },
    created: async function () {
    },
    methods: {
        show () {
            this.$refs.claimModal.show()
        }
    }
}
</script>

<template>
    <b-modal
        id="claimModal"
        ref="claimModal"
        centered
        scrollable
        size="sm"
        hide-footer>
        <template #modal-title>
            <div class="">Claim token</div>
        </template>
        <b-container>
            {{ unClaimTx }}
            <div>
                Burning TX: {{ unClaimTx }}
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
    computed: {
        unClaimTx: {
            get () {
                return this.$store.getters.unClaimTx || {}
            },
            set () {}
        }
    },
    validations: { },
    async updated () {
    },
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

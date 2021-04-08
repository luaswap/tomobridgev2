<template>
    <div id="app">
        <b-navbar
            v-if="$route.path !== '/'"
            toggleable="lg"
            type="light"
            class="tomo-header"
            variant="dark">
            <section class="container container-tomochain">
                <b-navbar-brand to="/">
                    <b-img
                        src="/app/assets/images/logo3.svg"
                        alt="TomoBridge"/>
                </b-navbar-brand>
                <!-- button menu SP -->
                <b-navbar-toggle
                    target="nav-collapse"
                    class="btn-menu-sp"/>
                <!-- /button menu SP -->
                <b-collapse
                    id="nav-collapse"
                    is-nav>
                    <div class="ml-auto navbar-buttons">
                        <b-button
                            class="btn-token"
                            variant="success">Connect Wallets</b-button>
                        <span class="btn-token network ml-2">Ethereum</span>
                        <b-dropdown
                            :text="selectedLanguage"
                            class="nav-item btn-language ml-3">
                            <b-dropdown-item
                                class="current-lang"
                                @click="changeLang('english')">English</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('turkish')">Türk</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('japanese')">日本語</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('chinese')">简体中文</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-collapse>
            </section>
        </b-navbar>
        <div class="page-layout common-main-content">
            <router-view/>
        </div>
        <footer
            class="tomo-footer footer">
            <div
                class="container ">
                <div class="tomo-meta-links text-center">
                    <div class="row">
                        <ul class="">
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://forms.gle/cU1XU3b8EUMxB6yA6">
                                    Submit a request</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/faq">
                                    FAQ</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/fee-structure">
                                    Fee Structure</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/trc21-wrapped-token-information">
                                    TRC21 Wrapped Tokens</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>

export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            selectedLanguage: this.$store.state.language || 'English',
            address: '',
            provider: ''
        }
    },
    computed: {
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
    },
    methods: {
    }
}
</script>

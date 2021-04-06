<template>
    <b-container>
        <h4 class="">Select Asset to convert</h4>
        <b-row class="wrapbox__row mb-lg-4 mt-4">
            <b-col cols="7">
                <multiselect
                    id="fromwrap-select"
                    v-model="fromWrapSelected"
                    :options="fromData"
                    :custom-label="customLabel"
                    :show-labels="false"
                    :allow-empty="false"
                    :close-on-select="true"
                    track-by="name">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <img
                            v-if="props.option.image"
                            :src="props.option.image"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.name }}</span>
                        <i
                            v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                || props.option.name === 'BTC' || props.option.name === 'ETH'"
                            class="tb-check-circle-o multiselect_greentick"/>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            v-if="props.option.image"
                            :src="props.option.image"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.name }}</span>
                        <i
                            v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                || props.option.name === 'BTC' || props.option.name === 'ETH'"
                            class="tb-check-circle-o multiselect_greentick"/>
                    </template>
                </multiselect>
            </b-col>
        </b-row>

        <div class="text-center">
            <p>You are converting TomoChain wrapped XXX to ERC-20 XXX</p>
        </div>
        <b-row>
            <b-col cols="6">
                <ul>
                    <li>View Wrapped Token address on
                        <a href="#">Etherscan</a>
                    </li>
                    <li>
                        <span class="font-weight-bold">Estimated conversion transaction fee</span>
                        <div class="d-flex flex-column mt-4">
                            <div v-if="!isApproved">Approve: 1 XXX</div>
                            <div>Swap: 1 XXX</div>
                            <div class="text-danger font-weight-bold">Total: 1 XXX</div>
                        </div>
                    </li>
                </ul>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    class="mb-4"
                    label="Amount"
                    label-for="depAmount">
                    <b-form-input
                        v-model="depAmount"
                        type="text"
                        placeholder="Deposit amount"/>
                    <b-button
                        class="add-address"
                        variant="success">
                        Max
                    </b-button>
                </b-form-group>
                <b-form-group
                    class="mb-4"
                    label="Recipient Address"
                    label-for="recAddress">
                    <b-form-input
                        v-model="recAddress"
                        type="text"
                        placeholder="Please use only TomoChain network address"/>
                </b-form-group>
            </b-col>
        </b-row>
        <div class="mt-3 style-label">
            <span class="font-weight-bold">Please confirm the following:</span>
            <b-form-checkbox
                v-model="agreeEx"
                class="mr-1 m1 light-h">
                My recipient address has NOT been created on a centralized exchange (e.g binance.com)
            </b-form-checkbox>
            <b-form-checkbox
                v-model="agreePk"
                class="mr-1 m1 light-h">
                I have a Private Key/Mnemonic Phrase of the TOMO receiving address I entered above
            </b-form-checkbox>
            <b-form-checkbox
                v-model="agreeAll"
                class="mr-1 m1 light-h">
                I have double checked that my recipient address is correct
            </b-form-checkbox>
            <div
                v-if="allChecked"
                class="text-error">
                <b-icon
                    class="mr-1 m1 light-h"
                    icon="exclamation-circle"
                    font-scale="1"/>
                Required fields
            </div>
        </div>
        <div class="step-one__buttons text-center mt-5">
            <b-button
                class="btn--big">Back</b-button>
            <b-button
                class="btn--big"
                variant="primary">Next</b-button>
        </div>
    </b-container>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
    name: 'App',
    components: {
        Multiselect
    },
    data () {
        return {
            verifiedList: [],
            depAmount: '',
            isApproved: false,
            agreeEx: false,
            agreePk: false,
            agreeAll: false,
            allChecked: false,
            fromWrapSelected: {},
            recAddress: '',
            fromData: [
                { name: 'Ethereum', symbol: 'ETH', image: '' }
            ]
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
        customLabel ({ name }) {
            return `${name}`
        }
    }
}
</script>

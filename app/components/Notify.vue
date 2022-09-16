<template>
  <div class="row infor-wallet mb-4 txt-red">
    <div class="col-12">
      <div>
        For a better user experience, we have moved the following tokens to Multichain Bridge: ETH, USDT, LUA, SRM, FTT
      </div>
      <div>
        Proceed to <a :href="multichainUrl" target="_blank" class="text-blue">
          Multichain
        </a> to continue wrapping/unwrapping tokens above. For any further assistance, <a :href="multichainSupportUrl"
          target="_blank" class="text-blue">please contact Multichain for
          support.</a>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      multichainUrl: 'https://app.multichain.org/#/router',
      multichainSupportUrl: 'https://multichain.zendesk.com/hc/en-us'
    }
  }
}
</script>

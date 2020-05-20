<template>
  <div class="dummy"></div>
</template>

<script>
export default {
  computed: {
    apiParam() {
      console.log('[AppAPICommon] NETOVIZ_API: ', process.env.NETOVIZ_API)
      return {
        use: process.env.NETOVIZ_API || 'rest', // default: REST
        grpcURIBase: this.grpcURIBase,
        restURIBase: this.restURIBase
      }
    },
    grpcURIBase() {
      const host = window.location.hostname
      const port = process.env.NETOVIZ_GRPC_WEB_PORT
      return `http://${host}:${port}`
    },
    restURIBase() {
      const host = window.location.hostname
      // If NETOVIZ_REST_PORT is defined,
      // use it instead of browser location port.
      // Run all-in-one application, unset NETOVIZ_REST_PORT.
      const port = process.env.NETOVIZ_WEB_PORT || window.location.port
      return `http://${host}:${port}`
    }
  }
}
</script>

<style></style>

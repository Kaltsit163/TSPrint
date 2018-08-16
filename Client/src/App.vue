<template>
  <div id="app">
    <router-view/>
    <!-- 底部 -->
    <Footer :modules="footerConf.modules"
            :showCartDot="footerConf.activeDot"
            :activeModuleId="footerConf.activeModuleId"></Footer>
  </div>
</template>
<script>
import Footer from '@/components/Footer.vue' // @ is an alias to /src
import Request from 'axios'
export default {
  name: 'Print',
  components: {
    Footer
  },
  data () {
    return {
      footerConf: {
        modules: [],
        activeDot: false,
        activeModuleId: 'home'
      }
    }
  },
  methods: {
    getShopCartState () {
      Request.get('/cart/has/products', {}).then(response => {
        let res = response.data
        if (res.succ) {
          this.footerConf.activeDot = res.data.hasValidProducts
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getFooterConfig () {
      Request.get('/home/resources', {}).then(response => {
        let res = response.data
        if (res.succ) {
          this.footerConf.modules = res.data.tabs
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  computed: {
  },
  mounted () {
    this.$toasted.show('hello billo')
  }
}
</script>
<style lang="scss"></style>

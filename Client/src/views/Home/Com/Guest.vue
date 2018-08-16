<template>
  <div class="guest-line">
    <div class="guest">尊敬的：访客{{guestId}}</div>
    <div class="login" @click="goLogin">您好，请登录</div>
  </div>
</template>
<script>
export default {
  props: {
    guestId: {
      type: String
    }
  },
  methods: {
    goLogin () {
    }
  }
}
</script>
<style lang="scss" scoped>
.guest-line{
  height: 60px;
  line-height: 60px;
  background-color: #FCF7F7;
  font-size: 24px;
}
.guest{
  float: left;
  padding-left: 35px;
  color: #B0B0B0;
}
.login{
  float: right;
  padding-right: 35px;
  color: #FF5E51;
}
</style>

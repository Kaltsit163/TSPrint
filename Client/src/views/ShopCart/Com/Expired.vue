<template>
  <section class="page-components">
    <section class="main-content">
      <section class="icon">
        <span class="expired">失效</span>
      </section>
      <section class="pic" :style="{'backgroundImage': 'url(' + info.thumbImage +')'}"></section>
      <section class="main-info">
        <!-- 产品名称 -->
        <p class="i-main-title" v-if="info.productName">{{info.productName | maxCount(18)}}</p>
        <!-- 副标题 -->
        <p class="i-vice-title" v-if="info.skuName">{{info.skuName | maxCount(16)}}</p>
        <!-- 小标题 -->
        <span class="i-spec-title" v-if="info.spec">{{info.spec | maxCount(10)}}</span>
        <!-- 底部信息 -->
        <section class="i-bottom">
          <section class="i-expired-info">
            <span>{{info.invalidTips | maxCount(10)}}</span>
          </section>
          <section class="i-num-picker">
            <section class="i-action-edit js-redirect">
              <span @click="expiredRedirect(info.actionUrl)">去首页看看</span>
            </section>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
export default {
  name: 'Commodity',
  data () {
    return {
    }
  },
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  filters: {
    maxCount: function (val, max) {
      return val.length < max ? val : val.slice(0, max) + '···'
    }
  },
  methods: {
    expiredRedirect (actionUrl) {
      this.$emit('expiredred', {
        url: actionUrl
      })
    }
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
  .page-components {
    background: #fff;
  }
  .main-content {
    display: flex;
    align-items: center;
    min-height: 212px;
    background: #fff;
    color: #333333;
    font-size: 28px;
    border-top: 1px solid #eee; /* no */
  }
  .icon {
    flex: 2;
    text-align: center;
    color: #FF4338;
    .expired {
      background: #D8D8D8;
      border-radius: 56px;
      font-size: 22px;
      color: #FFFFFF;
      padding: 5px 10px;
    }
  }
  .pic {
    width: 154px;
    height: 154px;
    background-color: #D8D8D8;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }
  .main-info {
    flex: 12;
    display: flex;
    position: relative;
    text-indent: 20px;
    height: 154px;
    overflow: hidden;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    .i-vice-title {
      color: #B0B0B0;
      font-size: 22px;
    }
    .i-spec-title {
      color: #999999;
      font-size: 16px;
    }
  }
  .i-num-picker {
    text-indent: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    right: 20px;
  }
  .i-bottom {
    display: flex;
    align-items: flex-end;
    .i-expired-info {
      color: #B0B0B0;
    }
  }
  .vice-content {
    background: #fff;
    padding-bottom: 20px;
    .i-text {
      color: #FF4338;
      font-size: 20px;
      margin-left: 84px;
      margin-bottom: 14px;
      border-radius: 4px;
      padding: 4px;
      border: 1px solid #FF4338; /* no */
    }
  }
  .i-num-edit {
    background: #F8F8F8;
    overflow: hidden;
    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      // line-height: 40px;
      text-align: center;
      color: #999999;
    }
  }
  .i-action-edit {
    position: absolute;
    display: inline-block;
    background: #F8F8F8;
    margin-left: 20px;
    bottom: 0;
    right: 20px;
    width: 130px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    overflow: hidden;
    border: 1px solid #FF4338; /* no */
    border-radius: 100px;
    font-size: 20px;
    color: #FF4338;
  }
</style>

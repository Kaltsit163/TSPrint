<template>
  <section class="page-components">
    <section class="main-content">
      <section class="icon" @click="toggleCheck">
        <span v-if="info.checked" class="i-font icon-wancheng-tianchong"></span>
        <span v-else class="circle"></span>
      </section>
      <section class="pic" @click="preview(info.detailUrl)" :style="{'backgroundImage': 'url(' + info.thumbImage +')'}">
        <!-- 推荐小Logo -->
        <span v-if="layerMode ? false : (info.checked || info.recommend)"
              class="logo-tag"
              :class="info.checked ? 'tag-type-choose' : 'tag-type-recommend'">
              {{info.checked ? '自选' : (info.recommend ? '推荐' : '')}}</span>
      </section>
      <section class="main-info">
        <!-- 产品名称 -->
        <p class="i-main-title" v-if="info.productName">{{info.productName | maxCount(16)}}</p>
        <!-- 副标题 -->
        <p class="i-vice-title" v-if="info.skuName">{{info.skuName | maxCount(16)}}</p>
        <!-- 小标题 -->
        <span class="i-spec-title" v-if="info.spec">{{info.spec | maxCount(28)}}</span>
        <!-- 底部信息 -->
        <section class="i-bottom">
          <section class="i-price-info">
            <span>{{`￥${(info.unitPrice / 100).toFixed(2)}`}}</span>
          </section>
          <section class="i-num-picker">
            <section class="i-num-edit">
              <!-- 减少按钮 -->
              <span class="i-font icon-minus" @click="minus"></span>
              <!-- 输入区域 -->
              <input v-model.lazy.number.trim="info.count" @blur="countBlur" class="input" type="number"/>       
              <!-- 增加按钮 -->       
              <span class="i-font icon-plus" @click="add"></span>
            </section>
          </section>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
export default {
  name: 'Recommend',
  data () {
    return {
      storeMax: 0
    }
  },
  props: {
    layerMode: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default () {
        return {
          info: 0
        }
      }
    }
  },
  computed: {
    realMax () {
      return parseInt(this.info.maxQuantity ? this.info.maxQuantity : 1)
    }
  },
  filters: {
    maxCount: function (val, max) {
      return val.length < max ? val : val.slice(0, max) + '···'
    }
  },
  methods: {
    toggleCheck () {
      this.$emit('check', {
        checked: this.info.checked,
        beenChecked: this.info.beenChecked
      })
    },
    add () {
      if (this.info.count + 1 <= this.realMax) {
        this.$emit('add', {
          count: this.info.count,
          checked: this.info.checked,
          beenChecked: this.info.beenChecked
        })
      } else {
        this.$toast('您已到达本次购买上限')
      }
    },
    minus () {
      if (this.info.count - 1 >= 1) {
        this.$emit('minus', {
          count: this.info.count,
          checked: this.info.checked,
          beenChecked: this.info.beenChecked
        })
      } else {
        this.$toast('超出数量范围~')
      }
    },
    preview (detailUrl) {
      this.$emit('preview', {
        url: detailUrl,
        checked: this.info.checked,
        beenChecked: this.info.beenChecked
      })
    },
    countBlur () {
      if (this.info.count + 1 > this.realMax) {
        this.$toast('您已到达本次购买上限')
        this.$emit('formate', {
          count: this.realMax,
          resetCount: this.info.resetCount,
          checked: this.info.checked,
          beenChecked: this.info.beenChecked
        })
        return
      }
      if (this.info.count - 1 < 0) {
        this.$toast('超出数量范围~')
        this.$emit('formate', {
          count: 1,
          resetCount: this.info.resetCount,
          checked: this.info.checked,
          beenChecked: this.info.beenChecked
        })
        return
      }
      this.$emit('formate', {
        count: this.info.count,
        resetCount: this.info.resetCount,
        checked: this.info.checked,
        beenChecked: this.info.beenChecked
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
  @keyframes pulse {
    from {
      opacity: 0;
      transform: scale3d(1, 1, 1);
    }

    50% {
      opacity: 0.5;
      transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }
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
    .circle {
      width: 36px;
      height: 36px;
      display: inline-block;
      border-radius: 50%;
      border: 1px solid #888888;; /* no */
    }
    .icon-wancheng-tianchong {
      background-color: #FFFFFF;
      font-size: 36px;
      animation: pulse 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-fill-mode: both;
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
    .logo-tag {
      display: inline-block;
      position: absolute;
      padding: 5px 10px;
      font-size: 12px;
      color: #FFFFFF;
      top: 16px;
      left: 0;
      border-radius: 0 30px 30px 0;
    }
    .tag-type-recommend {
      background: #FF4338;
    }
    .tag-type-choose {
      background: #50E3C2;
    }
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
    .i-main-title {
      
    }
    .i-vice-title {
      color: #B0B0B0;
      font-size: 22px;
    }
    .i-spec-title {
      color: #999999;
      font-size: 18px;
    }
    .js-edit-btn {
      text-indent: 0;
      position: absolute;
      right: 20px;
      top: 0;
      height: 32px;
      width: 88px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #36D4B0; /* no */
      border-radius: 100px;
      font-size: 20px;
      color: #36D4B0;
      background: rgba(54,212,176,0.20);
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
    .i-unit {
      display: inline-block;
      background-color: #4A90E2;
      color: #fff;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      font-size: 20px;
      color: #FFFFFF;
      text-align: center;
      margin-right: 10px;
    }
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
    .icon-minus {
      border-right: 1px solid #ffffff; /* no */
    }
    .icon-plus {
      border-left: 1px solid #ffffff; /* no */
    }
    span {
      display: inline-block;
      width: 40px;
      height: 40px;
      // line-height: 40px;
      text-align: center;
      color: #999999;
    }
    input {
      background: #F8F8F8;
      display: inline-block;
      width: 100px;
      border: none;
      outline: none;
      height: 40px;
      box-sizing: border-box;
      // line-height: 40px;
      text-align: center;
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

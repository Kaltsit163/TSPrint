<template>
  <div class="products list" >
    <div class="list-item"
         v-for="(item, index) in products"
         :key="index"
         :data-cid="item.collectionId"
         @click="jump(item)">
      <div class="main-info">
        <div class="bg"
        v-lazy:background-image="item.image + '?imageMogr2/auto-orient/thumbnail/320x>/quality/80!'"
        v-if="index > 5">
        </div>
        <div class="bg" v-if="index <= 5"
        v-bind:style="{ 'backgroundImage': 'url(' + item.image + '?imageMogr2/auto-orient/thumbnail/320x>/quality/80!)'}">
        </div>
        <div class="info">
          <span class="title">
            {{item.title}}
          </span>
          <span class="sub-title" v-if="item.subtitle">
            {{item.subtitle}}
          </span>
          <span class="charge" v-show="item.price">
              &yen;{{item.price}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    showFakeToolBar: {
      type: Boolean
    },
    collectionSeq: {
      type: Number
    },
    products: {
      type: Array
    }
  },
  methods: {
    onTouch (e) {
      e.stopPropagation()
    },
    jump (item) {
    }
  }
}
</script>
<style lang="scss">
@import '../../../scss/mixin.scss';
.product-nav{
  padding-top: 32px;
}
.products{
  background-color: #fff;
  padding: 0 20px;
}
.list{
  .list-item{
    width: 355px;
    display: inline-block;
    margin-top: 20px;
    vertical-align: top;
    .main-info {
      height: 544px;
      width: 325px;
      border-radius: 8px;
      background-color: #fff;
      margin: 0 auto;
      overflow: hidden;
      .bg{
        width: 100%;
        height: 326px;
        background-size: cover;
        background-position: center;
        border-radius: 10px;
      }
      .info {
        padding: 20px 20px 30px 10px;
      }
      .title{
        color: #333;
        font-size: 28px;
        display: block;
        line-height: 40px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical; 
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
      .sub-title{
        display: block;
        font-size: 24px;
        line-height: 330px;
        color: #B0B0B0;
        line-height: 34px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        padding-top: 4px;
      }
      .charge{
        display: block;
        font-size: 32px;
        color: #FF5E51;
        padding-top: 12px;
        line-height: 44px;
      }
    }
  }
}

</style>

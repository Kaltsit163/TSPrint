<template>
  <section class="page-shopCart" :class="getAllCommodity > 0 ? '' : 'hasNo-commidty'">
    <!-- 假头 -->
    <Header :head-info="headInfo" ref="header"></Header>
    <!-- 走马灯 -->
    <!-- <marquee v-if="marquee.show"
            :content="marquee.content"
            :delay="marquee.delay"
            :speed="marquee.speed"
            :top="typeJudge ? '56px' : 0"
            :isFixed="marquee.isFixed"
            :fontColor="marquee.fontColor"
            :iconColor="marquee.fontColor"
            :needCloseIcon="marquee.needCloseIcon"
            :bgColor="marquee.bgColor"
            :num="marquee.num"
            @close="marqueeClose"
            @start="marqueeStart"
            @delaying="marqueeDelay"></marquee> -->
    <!-- 仓库 -->
    <section class="hasFakeHead">
      <section v-for="(warehouses, location) in warehousesList"
               v-if="warehouses.items && warehouses.items.length > 0"
              :key="warehouses.id"
              class="module-warehouses">
        <section class="warehouses-title">
          <span @click="toggleWarehouses(location)">
            <span v-if="warehouses.checked" class="i-font icon-wancheng-tianchong"></span>
            <span v-else class="circle"></span>
          </span>
          <span class="warehouses-name">{{warehouses.name | maxCount(8)}}</span>
          <span class="warehouses-tip" @click="goBuy">{{warehouses.tip | maxCount(15)}}<i class="i-font icon-qianjin"></i></span>
        </section>
        <!-- 商品 -->
        <section v-for="(commodity, index) in warehouses.items"
                :key="commodity.itemId"
                class="commodity-List">
          <section class="module-commodity">
            <Commodity :info="commodity"
                      @preview="previewDetail"
                      @formate="formateHandler(arguments[0], 'commodity', location, index)"
                      @del="delHandler(arguments[0], location, index)"
                      @check="checkHandler(arguments[0], 'commodity', location, index)"
                      @add="addHandler(arguments[0], 'commodity', location, index)"
                      @minus="minusHandler(arguments[0], 'commodity', location, index)"
                      @edit="editHandler"></Commodity>
            <!-- 优惠搭配 -->
            <section v-if="commodity.recommends"
                    class="module-recommend">
              <section class="recommend-title">
                <span class="title">优惠搭配</span>
                <span v-if="commodity.recommends.count > 2"
                      class="more"
                      @click="previewMore(location, index, commodity.itemId)">查看更多<i class="i-font icon-qianjin"></i></span>
              </section>
              <section v-for="(data, num) in commodity.recommends.skus"
                      :key="data.skuId"
                      class="recommend">
                  <Recommend v-if="data.recommend || data.checked || data.beenChecked"
                            :info="data"
                            :layerMode="false"
                            @preview="previewDetail"
                            @formate="formateHandler(arguments[0], 'recommend', location, index, num)"
                            @check="checkHandler(arguments[0], 'recommend', location, index, num)"
                            @add="addHandler(arguments[0], 'recommend', location, index, num)"
                            @minus="minusHandler(arguments[0], 'recommend', location, index, num)"></Recommend>
              </section> 
            </section>    
          </section>
        </section>
      </section>
    </section>
    <!-- 空置显示 -->
    <section v-if="isEmpty" class="module-empty">
      <section class="i-font icon-shopCart"></section>
      <p>购物车空空如也</p>
      <span @click="goBuy">去购买</span>
    </section>
    <!-- 失效商品 -->
    <section v-if="expiredList.length > 0"
             class="module-expired">
        <section class="expired-title">
          <span class="expired-name">失效商品</span>
          <span class="expired-tip" @click="clearExpired">清空失效商品</span>
        </section>
        <!-- 过期商品 -->
        <section v-for="(expired, index) in expiredList"
                :key="expired.itemId"
                class="expired-List">
          <Expired :info="expired" @expiredred="editHandler"></Expired>  
        </section>
      </section>
    <!-- 总价计算 -->
    <section v-show="getAllCommodity > 0" class="module-total">      
      <section class="total-icon" @click="toggleAllCheck">
        <span v-if="allChecked"  class="i-font icon-wancheng-tianchong"></span>
        <span v-else class="circle"></span>
      </section>
      <span class="total-tip">全选</span>
      <section class="total-fee">
        <p>总计: </p>
        <section>
          <section class="total-price">￥ {{totalFeePrice}}</section>
          <section class="total-price-tip" v-show="choosedCommodity <= 0">不含运费</section>
        </section>
      </section>
      <section @click="goConfirmOrder" class="pay-btn js-pay">去结算({{choosedCommodity}})</section>
    </section>
    <!-- 更多商品弹起层 -->
    <bottom-up-shell ref="recommandShell">
      <section class="i-recommend-title">优惠推荐
        <i class="i-font icon-close js-down-shell" @click="downShell"></i>
      </section>
      <section class="i-recommend-list">
        <section v-for="(recommendItem, index) in currentRecommend"
                 :key="recommendItem.skuId"
                 class="i-recommend">
          <Recommend :info="recommendItem"
                     :layerMode="true"
                     @preview="previewDetail"
                     @formate="formateHandler(arguments[0], 'recommend', currentWarehouses, currentCommodity, index)"
                     @check="checkHandler(arguments[0], 'recommend', currentWarehouses, currentCommodity, index)"
                     @add="addHandler(arguments[0], 'recommend', currentWarehouses, currentCommodity, index)"
                     @minus="minusHandler(arguments[0], 'recommend', currentWarehouses, currentCommodity, index)"></Recommend>
        </section>
      </section>
      <section class="i-recommend-bottom">
        <section class="recommend-redirect" @click="goBuy">
          <p>不满意，去首页逛逛</p>
          <i class="i-font icon-qianjin"></i>
        </section>
        <section class="recommend-price">
          <p>小计: ￥ {{currentRecommendPrice}}</p>
          <span class="js-confirm-recommend" @click="recommendConfirm">确认</span>
        </section>
      </section>
    </bottom-up-shell>
  </section>
</template>

<script>
import Request from 'axios'
import BottomUpShell from '@/components/BottomUpShell'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Commodity from './Com/Commodity'
import Recommend from './Com/Recomend'
import Expired from './Com/Expired'
export default {
  name: 'ShopCart',
  components: {
    BottomUpShell,
    Commodity,
    Recommend,
    Expired,
    Header
  },
  filters: {
    maxCount: function (val, max) {
      return val.length < max ? val : val.slice(0, max) + '···'
    }
  },
  data () {
    return {
      totalFee: 0,
      warehousesList: [],
      expiredList: [],
      footerConf: {
        modules: [],
        activeModuleId: 'cart'
      },
      homepageURI: `${location.origin}/new/newHomepage.html`,
      currentRecommend: [],
      currentWarehouses: 0,
      currentCommodity: 0,
      currentDelWareHouse: 0,
      currentDelCommodity: 0,
      currentDelCommodityId: 0,
      currentRecommendPrice: 0,
      allChecked: false,
      isEmpty: false,
      showDialog: false,
      loading: false,
      dialogTextConfig: {
        dialogTitle: '提示',
        dialogText: '是否确认删除',
        sureText: '确认',
        cancleText: '取消'
      },
      headInfo: {
        leftBtn: {
          click () {
            if (history.length > 1) {
              history.back()
            }
          }
        },
        title: `购物车(0)`,
        height: 56
      },
      marquee: {
        speed: 'simple',
        needCloseIcon: true,
        num: 3,
        show: false,
        delay: 3,
        content: '',
        isFixed: false,
        fontColor: '#FF4338',
        bgColor: '#FFE6DE'
      }
    }
  },
  methods: {
    requestShopCart () {
      Request.get('/cart/item', {
        params: {}
      }).then(response => {
        let res = response.data
        if (res.succ) {
          if (Object.prototype.toString.call(res.data) === '[object Array]') {
            this.isEmpty = true
            return
          }
          if (res.data.warehouses) {
            res.data.warehouses.forEach((warehouses) => {
              warehouses.checked = false
              warehouses['items'].forEach((item) => {
                item.checked = false
                item.resetCount = parseInt(item.count)
                item['recommends'] && item['recommends']['skus'] && item['recommends']['skus'].forEach((item) => {
                  item.checked = false
                  item.resetCount = parseInt(item.count)
                })
              })
            })
            this.warehousesList = res.data.warehouses
            this.isEmpty = res.data.warehouses.length === 0
          }
          if (res.data.invalidItems) {
            this.expiredList = res.data.invalidItems
          }
        } else {
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.$toast('网络崩溃了')
        console.error(error)
      })
    },
    getFootTab () {
      Request.get('/home/resources', {}).then(response => {
        let res = response.data
        if (res.succ) {
          this.footerConf.modules = res.data.tabs
          const homeObj = res.data.tabs.filter(item => item.id === 'home')
          this.homepageURI = homeObj[0].url
        }
      }).catch(error => {
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    formateHandler (payLoad, type, warehousesIndex, commodityIndex, recommendIndex) {
      let warehouse = this.warehousesList[warehousesIndex]
      let commodity = warehouse['items']
      let checkState = payLoad.checked
      switch (type) {
        case 'commodity':
          let commodityId = commodity[commodityIndex]['itemId']
          this.requestItem(commodityId, payLoad.count, () => {
            commodity[commodityIndex]['count'] = +payLoad.count
            commodity[commodityIndex]['resetCount'] = +payLoad.count
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          }, () => {
            commodity[commodityIndex]['count'] = +payLoad.resetCount
          })
          break
        case 'recommend':
          let recommends = commodity[commodityIndex]['recommends']['skus']
          let itemId = commodity[commodityIndex]['itemId']
          let skuId = recommends[recommendIndex]['skuId']
          let resCheckState = recommends[recommendIndex]['checked']
          this.requestRecommend(itemId, skuId, payLoad.count, resCheckState, () => {
            recommends[recommendIndex].count = +payLoad.count
            recommends[recommendIndex].resetCount = +payLoad.count
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          }, () => {
            recommends[recommendIndex].count = +payLoad.resetCount
          })
          break
        default:
          break
      }
    },
    addHandler (payLoad, type, warehousesIndex, commodityIndex, recommendIndex) {
      let warehouse = this.warehousesList[warehousesIndex]
      let commodity = warehouse['items']
      let checkState = payLoad.checked
      switch (type) {
        case 'commodity':
          let commodityId = commodity[commodityIndex]['itemId']
          this.requestItem(commodityId, payLoad.count + 1, () => {
            commodity[commodityIndex]['count'] = +payLoad.count + 1
            commodity[commodityIndex]['resetCount'] = +payLoad.count + 1
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          })
          break
        case 'recommend':
          let recommends = commodity[commodityIndex]['recommends']['skus']
          let itemId = commodity[commodityIndex]['itemId']
          let skuId = recommends[recommendIndex]['skuId']
          let recCheckedState = recommends[recommendIndex]['checked']
          this.requestRecommend(itemId, skuId, payLoad.count + 1, recCheckedState, () => {
            recommends[recommendIndex].count = +payLoad.count + 1
            recommends[recommendIndex].resetCount = +payLoad.count + 1
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          })
          break
        default:
          break
      }
    },
    minusHandler (payLoad, type, warehousesIndex, commodityIndex, recommendIndex) {
      let warehouse = this.warehousesList[warehousesIndex]
      let commodity = warehouse['items']
      let checkState = payLoad.checked
      switch (type) {
        case 'commodity':
          let commodityId = commodity[commodityIndex]['itemId']
          this.requestItem(commodityId, payLoad.count - 1, () => {
            commodity[commodityIndex]['count'] = +payLoad.count - 1
            commodity[commodityIndex]['resetCount'] = +payLoad.count - 1
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          })
          break
        case 'recommend':
          let recommends = commodity[commodityIndex]['recommends']['skus']
          let itemId = commodity[commodityIndex]['itemId']
          let skuId = recommends[recommendIndex]['skuId']
          let recCheckState = recommends[recommendIndex]['checked']
          this.requestRecommend(itemId, skuId, payLoad.count - 1, recCheckState, () => {
            recommends[recommendIndex].count = +payLoad.count - 1
            recommends[recommendIndex].resetCount = +payLoad.count - 1
            // checkState 与 业务流程决定，必须走接口记录数量，故没有选中就不计算价格
            if (checkState) {
              this.reCalcCurrentRecPrice()
              this.$nextTick(() => {
                this.getCheckOutFee(this.getAllCheckedItems())
              })
            }
          })
          break
        default:
          break
      }
    },
    editHandler (payLoad) {
      if (payLoad.url && payLoad.url.length) {
        location.href = payLoad.url
      } else {
        this.$toast('跳转链接错误')
      }
    },
    previewDetail (payLoad) {
      const URL = payLoad.url
      console.info(URL)
      if (URL && URL.length > 0) {
        window.location.href = URL
      }
    },
    checkHandler (payLoad, type, warehousesIndex, commodityIndex, recommendIndex) {
      let warehouse = this.warehousesList[warehousesIndex]
      let commodity = warehouse['items']
      switch (type) {
        case 'commodity':
          let id = commodity[commodityIndex].itemId
          let { itemIds, direct } = this.getAllCheckedItems()
          if (!commodity[commodityIndex].checked) {
            itemIds.push(id)
          } else {
            itemIds.splice(itemIds.indexOf(id), 1)
          }
          this.getCheckOutFee({
            itemIds,
            direct
          }, () => {
            commodity[commodityIndex].checked = !payLoad.checked
            if (payLoad.checked && commodity[commodityIndex]['recommends'] && commodity[commodityIndex]['recommends']['skus']) {
              commodity[commodityIndex]['recommends']['skus'].forEach(ele => {
                ele.checked = !payLoad.checked
              })
            }
            warehouse.checked = commodity.filter(ele => ele.checked).length === commodity.length
            this.allChecked = this.warehousesList.filter(ele => ele.checked).length === this.warehousesList.length
          })
          break
        case 'recommend':
          let recommends = commodity[commodityIndex]['recommends']['skus']
          let reccount = recommends[recommendIndex]['count']
          let itemId = commodity[commodityIndex]['itemId']
          let skuId = recommends[recommendIndex]['skuId']
          let checkedState = recommends[recommendIndex]['checked']
          this.requestRecommend(itemId, skuId, reccount, checkedState, () => {
            recommends[recommendIndex].checked = !payLoad.checked
            if (this.currentRecommend && this.currentRecommend.length > 0) {
              this.currentRecommend[recommendIndex]['checked'] = !payLoad.checked
            }
            if (recommends.filter(ele => ele.checked).length > 0) {
              commodity[commodityIndex].checked = true
            }
            warehouse.checked = commodity.filter(ele => ele.checked).length === commodity.length
            this.allChecked = this.warehousesList.filter(ele => ele.checked).length === this.warehousesList.length
            this.reCalcCurrentRecPrice()
            this.$nextTick(() => {
              this.getCheckOutFee(this.getAllCheckedItems())
            })
          })
          break
        default:
          break
      }
    },
    delHandler (payLoad, wareHouseIndex, commodityIndex) {
      this.currentDelWareHouse = wareHouseIndex
      this.currentCommodity = commodityIndex
      this.currentDelCommodityId = payLoad.id
      this.showDialog = true
    },
    requestItem (id, count, succCB, failCB) {
      if (this.loading) {
        return
      }
      this.loading = true
      Request.post('/cart/item/sync', {
        itemId: id,
        count: count
      }).then(response => {
        let res = response.data
        this.loading = false
        if (res.succ) {
          succCB && succCB()
        } else {
          this.$toast(res.msg)
          failCB && failCB()
        }
      }).catch(error => {
        this.loading = false
        failCB && failCB()
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    requestRecommend (itemId, skuId, count, checkedState, succCb, failCb) {
      if (this.loading) {
        return
      }
      this.loading = true
      Request.post('/cart/recommend/sync', {
        itemId: itemId,
        skuId: skuId,
        count: count,
        checked: checkedState ? 0 : 1 // 这里秘密要变化之后的状态，所以反过来
      }).then(response => {
        let res = response.data
        this.loading = false
        if (res.succ) {
          succCb && succCb()
        } else {
          failCb && failCb()
          this.$toast(res.msg)
        }
      }).catch(error => {
        failCb && failCb()
        this.loading = false
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    getAllCheckedItems () {
      let tplObj = {
        itemIds: [],
        direct: []
      }
      this.warehousesList.forEach(Warehouse => {
        let checkedCommodity = Warehouse['items'].filter(ele => ele.checked)
        checkedCommodity.forEach(Commodity => {
          tplObj['itemIds'].push(Commodity.itemId)
          if (Commodity.recommends && Commodity.recommends.skus) {
            let checkedRecommend = Commodity.recommends.skus.filter(ele => ele.checked)
            checkedRecommend.forEach(Recommend => {
              tplObj['direct'].push({
                skuId: Recommend.skuId,
                count: Recommend.count,
                shelvesId: Recommend.shelvesId
              })
            })
          }
        })
      })
      return tplObj
    },
    getCheckOutFee (data, succCB, failCB) {
      Request.post('/cart/checkout', data).then(response => {
        let res = response.data
        this.loading = false
        if (res.succ) {
          this.totalFee = res.data.fee
          succCB && succCB(res.data)
        } else {
          failCB && failCB(res)
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.loading = false
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    reCalcCurrentRecPrice () {
      let price = 0
      this.currentRecommend.filter(ele => ele.checked).forEach(ele => {
        price += +ele.count * +ele.unitPrice
      })
      this.currentRecommendPrice = (price / 100).toFixed(2)
    },
    toggleWarehouses (warehousesInedx) {
      let nowWarehouse = this.warehousesList[warehousesInedx]
      let nowWarehouseState = nowWarehouse.checked
      let tplObj = {
        itemIds: [],
        direct: []
      }
      let filterWarehouses = this.warehousesList.filter((ele, index, arr) => {
        return index !== warehousesInedx
      })
      filterWarehouses.forEach(Warehouse => {
        let checkedCommodity = Warehouse['items'].filter(ele => ele.checked)
        checkedCommodity.forEach(Commodity => {
          tplObj['itemIds'].push(Commodity.itemId)
          if (Commodity.recommends && Commodity.recommends.skus) {
            let checkedRecommend = Commodity.recommends.skus.filter(ele => ele.checked)
            checkedRecommend.forEach(Recommend => {
              tplObj['direct'].push({
                skuId: Recommend.skuId,
                count: Recommend.count,
                shelvesId: Recommend.shelvesId
              })
            })
          }
        })
      })
      if (!nowWarehouseState) {
        nowWarehouse['items'].forEach(ele => {
          tplObj['itemIds'].push(ele.itemId)
        })
      }
      this.getCheckOutFee(tplObj, () => {
        this.warehousesList[warehousesInedx].checked = !nowWarehouseState
        for (let i = 0; i < this.warehousesList[warehousesInedx]['items'].length; i++) {
          this.warehousesList[warehousesInedx]['items'][i].checked = !nowWarehouseState
          if (nowWarehouseState && this.warehousesList[warehousesInedx]['items'][i]['recommends']) {
            this.warehousesList[warehousesInedx]['items'][i]['recommends']['skus'].forEach(ele => {
              ele.checked = !nowWarehouseState
            })
          }
        }
        this.allChecked = this.warehousesList.filter(obj => !obj.checked).length === 0
      })
    },
    getMarquee () {
      Request.get(`/marquee/detail`, {})
        .then((res) => {
          res = res.data
          if (res.succ) {
            this.marquee.content = res.data.message
            this.marquee.delay = parseInt(res.data.frequency)
            this.marquee.show = true
          }
        })
        .catch((error) => {
          this.$toast('网络崩溃了')
          console.log(error)
        })
    },
    marqueeStart (data) {
    },
    marqueeDelay (data) {
      if (data >= this.marquee.num) {
        this.marquee.show = false
        this.marquee.start = false
      }
    },
    marqueeClose (data) {
      this.marquee.show = false
    },
    goBuy (payLoad) {
      console.info(this.homepageURI)
      location.href = this.homepageURI
    },
    toggleAllCheck () {
      if (this.loading) {
        return
      }
      this.loading = true
      let tplObj = {
        itemIds: [],
        direct: []
      }
      if (!this.allChecked) {
        let { itemIds, direct } = this.getAllCheckedItems()
        this.warehousesList.filter(ele => !ele.checked).forEach(ele => {
          ele['items'].forEach(item => {
            itemIds.push(item.itemId)
          })
        })
        tplObj.itemIds = itemIds
        tplObj.direct = direct
      }
      this.getCheckOutFee(tplObj, (data) => {
        let state = !this.allChecked
        this.warehousesList.forEach((item, index) => {
          item.checked = state
          item['items'].forEach((data, num) => {
            data.checked = state
            if (this.allChecked && data['recommends'] && data['recommends']['skus']) {
              data['recommends']['skus'].forEach(ele => {
                ele.checked = state
              })
            }
          })
        })
        this.allChecked = !this.allChecked
      })
    },
    dialogCancle () {
      this.showDialog = false
    },
    dialogSure () {
      if (this.loading) {
        return
      }
      this.loading = true
      Request.get('/cart/item/remove', {
        params: {
          itemId: this.currentDelCommodityId
        }
      }).then(response => {
        let res = response.data
        this.loading = false
        if (res.succ) {
          this.warehousesList[this.currentDelWareHouse]['items'].splice(this.currentDelCommodity, 1)
          this.showDialog = false
          this.$toast('删除成功')
          // 再计算
          this.isEmpty = !(this.getAllCommodity > 0)
          this.$nextTick(() => {
            this.getCheckOutFee(this.getAllCheckedItems())
          })
        } else {
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.loading = false
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    previewMore (warehousesIndex, commodityIndex, itemId) {
      const recommendsCount = this.warehousesList[warehousesIndex]['items'][commodityIndex].recommends
      this.currentWarehouses = warehousesIndex
      this.currentCommodity = commodityIndex
      if (+recommendsCount.count > recommendsCount.skus.length) {
        this.requestMore(warehousesIndex, commodityIndex, itemId)
      } else {
        this.currentRecommend = recommendsCount.skus
        this.reCalcCurrentRecPrice()
        this.$refs.recommandShell.slideUpShell()
      }
    },
    requestMore (warehousesIndex, commodityIndex, itemId) {
      if (this.loading) {
        return
      }
      this.loading = true
      Request.get('/cart/recommends', {
        params: {
          itemId
        }
      }).then(response => {
        this.loading = false
        let res = response.data
        if (res.succ) {
          let noRec = res.data.recommends.skus.filter(ele => !ele.recommend)
          noRec.forEach((ele) => {
            ele.checked = false
          })
          let initRec = this.warehousesList[warehousesIndex]['items'][commodityIndex].recommends.skus
          let newRecommends = [...noRec, ...initRec]
          this.currentRecommend = newRecommends
          this.warehousesList[warehousesIndex]['items'][commodityIndex].recommends.skus = Object.assign([], newRecommends)
          this.reCalcCurrentRecPrice()
          this.$nextTick(() => {
            this.$refs.recommandShell.slideUpShell()
          })
        } else {
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.loading = false
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    downShell () {
      this.$refs.recommandShell.slideDownShell()
    },
    clearExpired () {
      if (this.loading) {
        return
      }
      this.loading = true
      Request.get('/cart/clean', {
        params: {}
      }).then(response => {
        this.loading = false
        let res = response.data
        if (res.succ) {
          this.expiredList = []
          this.$toast('删除成功')
        } else {
          this.$toast(res.msg)
        }
      }).catch(error => {
        this.loading = false
        this.$toast('网络崩溃了')
        console.log(error)
      })
    },
    recommendConfirm () {
      this.$refs.recommandShell.slideDownShell()
    },
    goConfirmOrder () {
      if (this.loading) {
        return
      }
      const checkItem = this.getAllCheckedItems()
      if ([...checkItem['itemIds'], ...checkItem['direct']].length === 0) {
        this.$toast('您没有选择任何商品哦~')
        return
      }
      this.getCheckOutFee(checkItem, (data) => {
        location.href = data.confirmUrl
      }, (data) => {
        setTimeout(() => {
          location.reload()
        }, 1000)
      })
    }
  },
  mounted () {
    this.requestShopCart()
  },
  computed: {
    totalFeePrice () {
      return (+this.totalFee / 100).toFixed(2)
    },
    choosedCommodity () {
      let count = 0
      let headCount = 0
      this.warehousesList.forEach(Warehouse => {
        let checkedCommodity = Warehouse['items'].filter(ele => ele.checked)
        count += checkedCommodity.length
        headCount += checkedCommodity.length
        checkedCommodity.forEach(Commodity => {
          if (Commodity.recommends && Commodity.recommends.skus) {
            count += Commodity.recommends.skus.filter(ele => ele.checked).length
          }
        })
      })
      // this.headInfo.title = `购物车(${headCount})`
      return count
    },
    getAllCommodity () {
      let count = 0
      this.warehousesList.forEach(Warehouse => {
        count += Warehouse['items'].length
      })
      return count
    }
  }
}
</script>

<style scoped lang="scss">
  .page-shopCart {
    -webkit-overflow-scrolling: touch;
    min-height: 1134px;
    position: relative;
    background: #fff;
    padding-bottom: 200px;
    &.hasNo-commidty {
      padding-bottom: 100px;
    }
  }
  .recommend {
    background: #fff;
    padding-left: 10%;
    width: 90%;
  }
  .hasFakeHead {
    margin-top: 66px; /* no */
  }
  .module-warehouses {
    margin-top: 20px;
    font-size: 28px;
    border-top: 1px solid #eee; /* no */
    background: #FAFAFA;
    .warehouses-title {
      display: flex;
      color: #333333;
      padding-left: 3%;
      height: 88px;
      justify-content: flex-start;
      align-items: center;
      .circle {
        width: 36px;
        height: 36px;
        display: inline-block;
        border-radius: 50%;
        border: 1px solid #888888; /* no */
        margin-right: 20px;
      }
      .icon-wancheng-tianchong {
        background-color: transparent;
        font-size: 36px;
        color: #FF4338;
        margin-right: 20px;
      }
    }
    .icon {
      flex: 2;
      text-align: center;
      color: #FF4338;
    }
    .warehouses-name {
      color: #333333;
    }
    .warehouses-tip {
      font-size: 24px;
      color: #FF4338;
      position: absolute;
      display: flex;
      align-items: center;
      right: 2%;
    }
  }
  .module-commodity {}
  .module-recommend {
    font-size: 22px;
    .recommend-title {
      padding-left: 11%;
      padding-right: 2%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    .title {
      color: #888888;
    }
    .more {
      display: flex;
      align-items: center;
      color: #FF4338;
    }
  }
  .module-expired {
    background: #FAFAFA;
    font-size: 28px;
    color: #333333;
    margin-top: 20px;
    padding-bottom: 20px;
    .expired-title {
      display: flex;
      height: 88px;
      justify-content: space-between;
      align-items: center;
      padding-left: 10%;
      padding-right: 5%;
    }
    .expired-name {
      color: #333333;
      font-size: 28px;
    }
    .expired-tip {
      font-size: 24px;
      color: #FF4338;
    }
  }
  .module-total {
    display: flex;
    position: fixed;
    bottom: 100px;
    left: 0;
    color: #666666;
    background: #ffffff;
    font-size: 22px;
    padding-left: 3%;
    height: 100px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #eee; /* 1px */
    z-index: 99;
    .total-icon {
      flex: 2;
    }
    .total-tip {
      flex: 4;
    }
    .total-fee {
      flex: 12;
      display: flex;
      text-align: center;
      height: 100px;
      justify-content: space-around;
      align-items: center;
      > section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
      }
    }
    .total-price {
      color: #FF4338;
      line-height: 1.2;
      font-size: 36px;
      margin-bottom: 5px;
    }
    .total-price-tip {
    }
    .pay-btn {
      flex: 8;
      text-align: center;
      background: #FF4338;
      color: #fff;
      font-size: 36px;
      line-height: 100px;
      border-radius: 10px 0 0 10px;
    }
    .circle {
      width: 36px;
      height: 36px;
      display: inline-block;
      border-radius: 50%;
      box-sizing: border-box;
      border: 1px solid #888888; /* no */
    }
    .icon-wancheng-tianchong {
      background-color: transparent;
      font-size: 36px;
      color: #FF4338;
    }
  }
  .module-empty {
    text-align: center;
    background: #fff;
    padding-bottom: 56px;
    section {
      display: inline-block;
      background: #DDDDDD;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      margin-top: 100px;
    }
    p {
      color: #888888;
      font-size: 22px;
      margin: 60px auto 40px;
    }
    span {
      display: inline-block;
      width: 173px;
      height: 66.6px;
      font-size: 30px;
      line-height: 66.6px;
      border-radius: 10px;
      background: #FFE6DE;
      border: 1px solid #FF4338;
      border-radius: 100px;
      color: #FF4338;
    }
    .icon-shopCart {
      font-size: 32px;
    }
  }
  .i-recommend-list {
    max-height: 636px;
    overflow: scroll;
  }
  .i-recommend-title {
    height: 104px;
    line-height: 104px;
    color: #333333;
    font-size: 28px;
    background: #FAFAFA;
    border: 1px solid #E0E0E0;
    text-align: center;
    position: relative;
  }
  .i-recommend-bottom {
    > section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      font-size: 28px;
    }
    .recommend-redirect {
      font-size: 28px;
      background: #FFE6DE;
      color: #FF4338;
      height: 70px;
    }
    .icon-qianjin {
      color: #FF4338;
    }
    .recommend-price {
      padding-right: 0;
      .js-confirm-recommend {
        display: inline-block;
        width: 218px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        color: #fff;
        font-size: 36px;
        background: #FF4338;
      }
    }
  }
  .js-down-shell {
    position: absolute;
    font-size: 32px;
    color: #B0B0B0;
    transform: translateY(-50%);
    right: 3%;
    top: 50%;
  }
  .i-font {
    font-size: 14px;
  }
</style>

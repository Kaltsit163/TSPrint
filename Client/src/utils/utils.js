import Request from './http.js'
let coordtransform = require('coordtransform')
let defaultFontInfo = {
  fontFile: 'fangzhengqingkebenyuesongjianti',
  fontColor: '0,0,0',
  textType: 'cn',
  fontSize: 160,
  direction: 'hor',
  wrapLine: 0,
  xAlgin: 'left',
  yAlgin: 'top',
  word: '',
  v: 1,
  cacheV: 1
}

const Util = {
  get isWeChat () {
    return /micromessenger/gi.test(this.ua)
  },
  get isWeiBo () {
    return /weibo/gi.test(this.ua)
  },
  get isAndroid () {
    return /android|adr/gi.test(this.ua)
  },
  get isIos () {
    return /iphone|ipod|ipad/gi.test(this.ua)
  },
  get isQQ () {
    return /MQQBrowserQQ/.test(this.ua) || /MQQBrowser QQ/.test(this.ua)
  },
  get isInApp () {
    // 2.9.97版本后加上了ua
    if (/infashion/gi.test(this.ua)) {
      return true
    }
  },
  get isWutaApp () {
    return /wuta_browser/gi.test(this.ua)
  },
  get wutaAppId () {
    return 'ad2d2b69f9951da8e696d3472836f173'
  },
  get ua () {
    if (!this._ua) {
      this._ua = window.navigator.userAgent.toLowerCase()
    }
    return this._ua
  },

  getQueryString (name, url) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    url = (url && url.indexOf && url.indexOf('?') >= 0) ? url.split('?')[1]
      : (window.location.search ? window.location.search.substr(1)
        : (window.location.hash && window.location.hash.indexOf('?') > 0 ? window.location.hash.split('?')[1] : ''))
    let r = url.match(reg)
    if (r != null) return unescape(r[2])
    return null
  },
  getCookie (name) {
    var reg = new RegExp('(^|\\s)' + name + '=([^;]*)(;|$)')
    var r = document.cookie.match(reg)
    return r && unescape(r[2])
  },
  getPlatform () {
    var ua = navigator.userAgent
    var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1
    var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    return {
      isAndroid: isAndroid,
      isiOS: isiOS
    }
  },
  // 一级域名在in66.com的cookie全部设置在一级域名下
  // 为了让 www.in66.com 和 print.in66.com 共享cookie
  setCookie (name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    var domain = location.host.indexOf('in66.com') === -1 ? '' : 'in66.com'
    document.cookie =
      `${name}=${escape(value)};path=/;domain=${domain}` +
      (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
  },
  getToken () {
    return this.getQueryString('_token') || this.getCookie('tg_auth')
  },
  getVersion (url) {
    return this.getQueryString('_v', url) || this.getCookie('_v')
  },
  isLessThanVersion (targetVersion, url) {
    var currentVersion = this.getVersion(url)
    targetVersion = targetVersion.toString()

    if (!currentVersion || !targetVersion) {
      return false
      // throw new Error("Can't get version.");
    }

    var currentVersionSplit = currentVersion.split('.')
    var targetVersionSplit = targetVersion.split('.')
    var loopLength = Math.min(
      currentVersionSplit.length,
      targetVersionSplit.length
    )

    for (var i = 0; i < loopLength; i++) {
      if (currentVersionSplit[i] !== targetVersionSplit[i]) {
        return Number(currentVersionSplit[i]) < Number(targetVersionSplit[i])
      }
    }

    return currentVersion.length < targetVersion.length
  },
  setTempStorage (key, value, callback) {
    window.sessionStorage.setItem(key, value)
    callback && callback()
  },
  getTempStorage (key, callback) {
    callback && callback(window.sessionStorage.getItem(key))
    return window.sessionStorage.getItem(key)
  },
  removeTempStorage (key) {
    window.sessionStorage.removeItem(key)
  },
  clearTempStorage () {
    window.sessionStorage.clear()
  },
  setStorage (key, value, callback) {
    window.localStorage.setItem(key, value)
    callback && callback()
  },
  getStorage (key, callback) {
    callback && callback(window.localStorage.getItem(key))
    return window.localStorage.getItem(key)
  },
  removeStorage (key) {
    window.localStorage.removeItem(key)
  },
  clearStorage () {
    window.localStorage.clear()
  },
  regOnePagePath (str) {
    const reg = /\/?.*\/(.*)\.\w.*\?(.*)/
    const reg1 = /\/?.*\/(.*)\.\w.*/
    let result = reg.exec(str)
    if (result && result.length >= 2) {
      return {
        'path': result[1],
        'query': result[2]
      }
    }
    result = reg1.exec(str)
    if (result && result.length >= 2) {
      return {
        'path': result[1]
      }
    }
    return {
      'path': '',
      'query': ''
    }
  },
  judgeIfFirstOpen (symbol, callback) {
    Request.get('/common/c', {
      params: {
        symbol: symbol,
        random: Math.random()
      }
    })
      .then(res => {
        res = res.data
        if (res.succ) {
          callback && callback(res.data.count)
        }
      })
      .catch(() => {})
  },
  formatTextLink (options, callback, failCallback) {
    let newOption = Object.assign({}, defaultFontInfo, options)
    if (!newOption.word) {
      newOption.word = '双击修改'
    }
    newOption.originalword = newOption.word
    if (newOption.originalword.indexOf('\n') < 0) {
      if (newOption.originalword.length > 10) {
        newOption.word = '\n' + newOption.word + '\n'
      }
      if (
        newOption.originalword.length > 0 &&
        newOption.originalword.length < 3
      ) {
        newOption.word = ' ' + newOption.word + ' '
      }
    }
    Request.get('/custom/text', {
      params: newOption
    })
      .then(res => {
        res = res.data
        if (res.succ) {
          callback &&
            callback({
              imgUrl: res.data.url,
              fontFile: newOption.fontFile,
              word: newOption.originalword === '双击修改' ? '' : newOption.originalword
            })
        } else {
          failCallback && failCallback(res.msg)
        }
      })
      .catch(() => {})
  },
  filterEmoji (val) {
    let emojireg = val
    const regRule2 = new RegExp('[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]', 'g')
    if (emojireg.match(regRule2)) {
      emojireg = emojireg.replace(regRule2, '')
    }
    return emojireg
  },
  // 分享微信小程序
  shareWXXCX (options) {
    let shareSet = document.getElementById('shareSet')
    if (shareSet == null) {
      shareSet = document.createElement('div')
      shareSet.setAttribute('id', 'shareSet')
      document.body.appendChild(shareSet)
    }
    let shareConfig
    if (options.wmpShareTitle) {
      shareConfig = {
        wmpShareTitle: options.wmpShareTitle || '',
        wmpShareDesc: options.wmpShareDesc || '',
        wmpSharePath: options.wmpSharePath || '',
        wmpShareLink: options.wmpShareLink || '',
        wmpShareEnable: options.wmpShareEnable || '',
        wmpShareImgSrc: this.fixImgPoctol(options.wmpShareImgSrc || ''),
        shareImgSrc: this.fixImgPoctol(options.shareImgSrc || ''),
        shareImageUrl: this.fixImgPoctol(options.shareImageUrl || '')
      }
    } else {
      shareConfig = {
        wmpShareTitle: options.title,
        wmpShareDesc: options.desc,
        wmpSharePath: options.path,
        wmpShareLink: options.link,
        wmpShareEnable: options.enabled,
        wmpShareImgSrc: options.image,
        shareImgSrc: options.image,
        shareImageUrl: options.thumb
      }
    }
    let htmlString = []
    Object.keys(shareConfig).forEach(item => {
      htmlString.push(
        `<input type="hidden" id="${item}" value="${shareConfig[item]}">`
      )
    })
    shareSet.innerHTML = htmlString.join('')
  },
  rmImgProtocal (url) {
    if (url && typeof url === 'string' && url.length > 0) {
      let src = url
      const [httpHead, httpsHead] = [/^(http:\/\/)/, /^(https:\/\/)/]
      if (httpsHead.test(url)) {
        src = url.replace('https:', '')
      } else if (httpHead.test(url)) {
        src = url.replace('http:', '')
      }
      return src
    } else {
      return ''
    }
  },
  fixImgPoctol (url) {
    if (url && typeof url === 'string' && url.length > 0) {
      let src = url
      const [httpHead, httpsHead, noPoctolHead] = [
        /^(http:\/\/)/,
        /^(https:\/\/)/,
        /^\/\//
      ]
      if (httpsHead.test(url)) {
        src = url
      } else if (httpHead.test(url)) {
        src = url.replace('http', 'http')
      } else if (noPoctolHead.test(url)) {
        src = `${window.location.protocol}${url}`
      }
      return src
    } else {
      return ''
    }
  },
  formateRequestParams (obj) {
    if (obj && typeof obj === 'object') {
      let tplUrl = ''
      for (let key in obj) {
        tplUrl += `/${key}_${obj[key]}`
      }
      return tplUrl
    }
  },
  changeParam (url, name, value) {
    var newUrl = ''
    var reg = new RegExp('(^|)' + name + '=([^&]*)(|$)')
    var tmp = name + '=' + value
    if (url.match(reg) != null) {
      newUrl = url.replace(reg, tmp)
    } else {
      /* eslint-disable */
      if (url.match(/[\?]/)) {
        newUrl = url + '&' + tmp
      } else {
        newUrl = url + '?' + tmp
      }
    }
    return newUrl
  },
  isPassive() {
    var supportsPassiveOption = false
    try {
      addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function () {
            supportsPassiveOption = true
          }
        })
      )
    } catch (e) {}
    return supportsPassiveOption
  },
  // 微信支付
  weixinPay(jsApiParameters, returnUrl) {
    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', jsApiCall, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', jsApiCall)
        document.attachEvent('onWeixinJSBridgeReady', jsApiCall)
      }
    } else {
      jsApiCall()
    }

    function jsApiCall() {
      WeixinJSBridge.invoke('getBrandWCPayRequest', jsApiParameters, function (res) {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          var conStr = returnUrl.indexOf('?') === -1 ? '?' : '&'
          returnUrl = returnUrl + conStr + 'succ=1'
          location.href = returnUrl
        } else {
          location.href = returnUrl
        }
      })
    }
  },
  getWxSdk(XToken, cb) {
    const getJSConfig = `/wechat/js/config?redirectUrl=${encodeURIComponent(
      location.href.split('#')[0]
    )}`
    const requestHead = !Util.isInApp && XToken ? {
      headers: {
        'X-Token': XToken
      }
    } : {}
    Request.get(getJSConfig, requestHead)
      .then(res => {
        res = res.data
        if (res.succ) {
          let data = res.data.config
          wx.config({
            //eslint-disable-line
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
              'onMenuShareAppMessage',
              'onMenuShareTimeline',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage'
            ]
          })
          cb && cb()
        } else {
          wx.error(function (res) {
            alert(JSON.stringify(res))
          })
        }
      })
      .catch(error => {
        wx.error(function (error) {
          alert(JSON.stringify(error))
        })
        console.log(error)
      })
  },
  /**
   *  in外登录
   **/
  loginHandler(url) {
    let redirectUrl = url && url.length > 0 ? url : location.href
    let WT_DEVICE_ID = Util.getStorage('wutaDeviceId')
    if (Util.isWutaApp) {
      if (WT_DEVICE_ID) {
        let jumpUrl = encodeURIComponent(`${location.origin}/wuta/redirect?redirect_url=` + encodeURIComponent(redirectUrl) + `&device_id=${WT_DEVICE_ID}`)
        window.location.href = 'https://uc.wuta-cam.com/api/authtp/auth?app_id=ad2d2b69f9951da8e696d3472836f173&redirect_uri=' + jumpUrl
      } else {
        Util.initWT({
          appId: Util.wutaAppId,
          list: ['get_device_id'],
          succ: () => {
            if (WT && WT.hasPermission('get_device_id') && WT.support('get_device_id')) {
              WT.getDeviceID((deviceID) => {
                Util.setStorage('wutaDeviceId', deviceID)
                let jumpUrl = encodeURIComponent(`${location.origin}/wuta/redirect?redirect_url=` + encodeURIComponent(redirectUrl) + `&device_id=${deviceID}`)
                window.location.href = 'https://uc.wuta-cam.com/api/authtp/auth?app_id=ad2d2b69f9951da8e696d3472836f173&redirect_uri=' + jumpUrl
              })
            } else {
              let jumpUrl = encodeURIComponent(`${location.origin}/wuta/redirect?redirect_url=` + encodeURIComponent(redirectUrl))
              window.location.href = 'https://uc.wuta-cam.com/api/authtp/auth?app_id=ad2d2b69f9951da8e696d3472836f173&redirect_uri=' + jumpUrl
            }
          },
          fail: () => {
            let jumpUrl = encodeURIComponent(`${location.origin}/wuta/redirect?redirect_url=` + encodeURIComponent(redirectUrl))
            window.location.href = 'https://uc.wuta-cam.com/api/authtp/auth?app_id=ad2d2b69f9951da8e696d3472836f173&redirect_uri=' + jumpUrl
          }
        })
      }
      return
    }
    Request.get('/auth/key', {})
      .then(res => {
        res = res.data
        if (res.succ) {
          const tplPath = `/auth/in?key=${
          res.data.key
        }&redirect_url=${encodeURIComponent(redirectUrl)}`
          location.href = tplPath
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  computePrice(price) {
    if (price === '') {
      return price
    }
    let r = parseFloat(price, 10)
    if (!isNaN(r)) {
      return (r / 100).toFixed(2)
    } else {
      return ''
    }
  },
  addSourceTracker(url, source) {
    source = source ? source : Util.getQueryString('_psource')
    if (typeof url === 'string' && url.length > 0) {
      let trackerUrl = ''
      if (source && source.length > 0) {
        source = Util.isWutaApp && Util.getQueryString('wt_native_refer') ? `${source}_wt_native_refer_${Util.getQueryString('wt_native_refer')}` : source
        if (url.indexOf('?') < 0) {
          trackerUrl = `${url}?_psource=${source}`
        } else {
          trackerUrl = `${url}&_psource=${source}`
        }
      } else {
        trackerUrl = url
      }
      return trackerUrl
    } else {
      throw new Error('url is not valid')
    }
  },
  getExif(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            resolve('')
          }
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          resolve('')
        }
      }
      xhr.open('GET', url, true)
      xhr.send(null)
    })
  },
  async getImageTimeAndLocation(url) {
    // if (Util.isWutaApp) {
    //   url = url.indexOf('?') < 0 ? url + '?x-oss-process=image/info' : url + '&x-oss-process=image/info'
    // } else {
    url = url.indexOf('?') < 0 ? url + '?exif' : url + '|exif'
    // }
    let res = await this.getExif(url)
    if (res) {
      let reData = {}
      if (res.DateTimeOriginal) {
        let date = res.DateTimeOriginal.val
        let dateTime = date.split(/\:|\s/)
        date = dateTime.join('.')
        reData['time'] = date.slice(0, 10)
      }
      // wuta 走阿里云，覆盖赋值
      // if (Util.isWutaApp && res.DateTime) {
      //   let date = res.DateTimeOriginal.value
      //   let dateTime = date.split(/\:|\s/)
      //   date = dateTime.join('.')
      //   reData['time'] = date.slice(0, 10)
      // }
      if (res.GPSLatitude && res.GPSLongitude) {
        let olat = res.GPSLatitude.val.split(', ')
        let olng = res.GPSLongitude.val.split(', ')
        let lat = 0
        let lng = 0
        let coord
        for (var i = 0; i < olat.length; i++) {
          lat += olat[i] / Math.pow(60, i)
          lng += olng[i] / Math.pow(60, i)
        }
        if (res.GPSLatitudeRef) {
          lat = res.GPSLatitudeRef.val == 'S' ? -lat : lat
        }
        if (res.GPSLongitudeRef) {
          lng = res.GPSLongitudeRef.val == 'W' ? -lng : lng
        }
        coord = coordtransform.wgs84togcj02(lat, lng)
        let location = await Request.get('/common/getAddress', {
          params: {
            lat: coord[1],
            lng: coord[0]
          }
        })
        if (
          location.status === 200 &&
          location.data &&
          location.data.succ &&
          location.data.data.addressComponent
        ) {
          let addressComponent = location.data.data.addressComponent
          reData['location'] = {
            province: addressComponent.province,
            city: addressComponent.city,
            district: addressComponent.district
          }
        }
      }
      return reData
    } else {
      return ''
    }
  },
  filterOriginFromThumb: url => url && url.split('?')[0],
  requestObjectToString(obj) {
    let tplString = ''
    for (let k in obj) {
      tplString += `${k}=${obj[k]}&`
    }
    return tplString.slice(0, -1)
  },
  getWTAppId(callback) {
    Request.get('/common/wuta', {})
      .then(res => {
        res = res.data
        if (res.succ) {
          window.localStorage.setItem('wuta-appid', res.data.appId)
          callback && callback(res.data.appId)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  initWT({
    appId,
    list,
    succ,
    fail
  }) {
    if (typeof appId === 'string' && appId.length > 0) {
      WT.init(appId, list, (res) => {
        if (res) {
          succ && succ()
        } else {
          fail && fail()
        }
      })
    } else {
      alert('appid is illegal')
      throw Error('appid is illegal')
    }
  }
}

export default Util
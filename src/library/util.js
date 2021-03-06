import { api } from './constants'
import $ from 'jquery'

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

var HtmlToIOS = HtmlToIOS || {}
HtmlToIOS.pageJump = function(type, tuid) {
  if (tuid === undefined) {
    tuid = 0
  }
  setupWebViewJavascriptBridge(function(bridge) {
    bridge.callHandler('pageJump', { type: type, tuid: tuid }, function(response) {
      // todo
    })
  })
}

HtmlToIOS.invite_share = function(v2) {
  if (v2 === undefined) {
    v2 = 0
  }
  if (v2 == 1) {
    IOSinviteShare()
  } else {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('invite_share', {}, function(response) {
        // todo
      })
    })
  }
}

function environment() {
  return env
}

function is_production() {
  return environment() === 'production'
}

function is_local() {
  return environment() === 'local'
}

function is_development() {
  return environment() === 'development'
}

function is_test() {
  return environment() === 'test'
}

function is_pre() {
  return environment() === 'pre'
}

function getApi() {
  return api
}

function getPlatform() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return 'ios'
  } else if (/(Android)/i.test(navigator.userAgent)) {
    return 'android'
  } else if (/(MicroMessenger)/i.test(navigator.userAgent)) {
    return 'wechat'
  }
  return 'web'
}

function isIos() {
  return getPlatform() === 'ios'
}

function isAndroid() {
  return getPlatform() === 'android'
}

function isWechat() {
  return getPlatform() === 'wechat'
}

function jump2native(a, b) {
  if (isIos()) {
    HtmlToIOS.pageJump(a, b)
  } else if (isAndroid()) {
    window.clientToHtml.pageJump(a, b)
  }
}

function getQueryString(a) {
  var b = new RegExp('(^|&)' + a + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(b)
  if (r != null) return unescape(r[2])
  return null
}

function setTitle(c) {
  if (isIos()) {
    setupWebViewJavascriptBridge(function(b) {
      b.callHandler('pageTitle', {
        title: c
      }, function(a) {
      })
    })
  } else if (isAndroid()) {
    window.clientToHtml.pageTitle(c)
  }
}

function uid() {
  return getQueryString('uid')
}

function token() {
  return getQueryString('token')
}

// json????????????????????????????????????
function num2str(data) {
  for (var x in data) {
    if (typeof data[x] === 'number') { // ??????????????? ????????????????????? ?????????
      data[x] += ''
    }
  }
  return data
}

var a = 1

function getType() {
  if (isIos()) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('getData', { json: JSON.stringify(ajaxData) }, function(response) {
        a = 0
      })
    })
  }
}

function ajaxHandle(url, type, ajaxData, dataType, callback) {
  $.ajax({
    headers: { // ?????????
      'X-CLIENT': 'h5'
    },
    url: url,
    type: type,
    data: ajaxData,
    dataType: dataType,
    async: true,
    success: function(data) {
      callback(data)
    }
  })
}

function postHandle(ajaxData, callback) {
  // json????????????????????????????????????
  ajaxData = num2str(ajaxData)
  // if(getApi().indexOf("development1") != -1){
  // 	ajaxHandle(getApi() + ajaxData.url,'get',ajaxData,'json')
  // }else{
  if (isIos()) {
    // ???a???????????????????????????getData
    console.log('iphone')
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler('getData', { json: JSON.stringify(ajaxData) }, function(response) {
        a = 0
        var nowData = {}
        nowData = JSON.parse(response)// json?????????????????????
        ajaxHandle(getApi() + nowData.url, 'POST', nowData, 'json', function(data) {
          callback(data)
        })
      })
    })
    if (a == 1) { // ??????????????????????????????????????????
      ajaxHandle(getApi() + ajaxData.url, 'GET', ajaxData, 'json', function(data) {
        callback(data)
      })
    }
  } else if (isAndroid()) {
    console.log('isAndroid')
    if (typeof window.clientToHtml != 'undefined' && typeof window.clientToHtml.getData != 'undefined' && window.clientToHtml.getData instanceof Function) { // ?????????????????????getData?????????
      var result = {}
      var nowData = {}
      result = window.clientToHtml.getData(JSON.stringify(ajaxData))
      var type = ''
      if (JSON.stringify(result) !== '{}') { // getData?????????
        type = 'POST'
        nowData = JSON.parse(result)// json?????????????????????
      } else { // getData??????
        type = 'GET'
        nowData = ajaxData
      }
      ajaxHandle(getApi() + nowData.url, type, nowData, 'json', function(data) {
        callback(data)
      })
    } else { // ???????????????getData??????get??????
      ajaxHandle(getApi() + ajaxData.url, 'get', ajaxData, 'json', function(data) {
        callback(data)
      })
    }
  }

  // }
}
export {
  postHandle,
  getQueryString,
  jump2native
}

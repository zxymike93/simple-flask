/*
    现在每一个事件都要拼一个 request，都要调用一次 $.ajax()
    重构的思路是：
      造一个空对象 -- api ，用来和服务器通信
      它包含我想要做的功能，如: weiboAdd, commentDelete
      只需调用这些 api.func() 传入“数据，回调函数”
*/
var api = {}
/*
  这个函数可以发一个打包了 request 的 ajax 请求
  向哪里发送(url), 用什么http方法(method)，发送什么数据(form)
  callback 回调函数，在收到服务器响应后回调
  但拼 request 和发送 ajax 请求的代码已经封装起来了
*/
// success 和 error 统一用 callback
api.ajax = function(url, method, form, callback){

  var data = JSON.stringify(form)
  // 生成一个请求
  request = {
    'url': url,
    'type': method,
    // 貌似 key 不能用引号这个 contentType 才生效
    contentType: 'application/json',
    'data': data,
    'success': function(response) {
      // 解析 ajax 传来的参数 response
      var r = JSON.parse(response)
      // 传给 callback
      callback(r)
    },
    'error': function(err) {
      // 当服务器返回非 200-300 的状态吗或网络错误就会调用该函数
      var r = {
        'success': false,
        'message': '网络错误',
      }
      callback(r)
    },
  }
  $.ajax(request)
}
// get 方法
api.get = function(url, response){
  var form = {}
  api.ajax(url, 'get', form, response)
}
// post 方法
api.post = function(url, form, response){
  api.ajax(url, 'post', form, response)
}

// ===============
// 以上是 api 内部函数
// ---------------
// 下面是功能函数
// 程序需要的功能，以功能名来定义函数
// ===============

// 添加微博
api.weiboAdd = function(form, response){
  var url = '/api/weibo/add'
  api.post(url, form, response)
}
// 删除微博
api.weiboDelete = function(weiboId, response){
  var url = '/api/weibo/delete/' + weiboId
  api.get(url, response)
}
// 添加评论
api.commentAdd = function(form, response) {
  var url = '/api/comment/add'
  api.post(url, form, response)
}
// 删除评论
api.commentDelete = function(commentId, response) {
  var url = '/api/comment/delete/' + commentId
  api.get(url, response)
}

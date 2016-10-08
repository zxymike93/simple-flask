/*
  现在每一个事件都要拼一个 request，都要调用一次 $.ajax()
  重构的思路是：
    造一个 api 它包含我想要做的功能，如: weiboAdd, commentDelete
    只需调用这些 api.func() 传入“数据，回调函数”
*/
var api = {}
/*
  这个函数可以发一个打包了 request 的 ajax 请求
  向哪里发送(url), 用什么http方法(method)，发送什么数据(form)
  成功，失败的响应(success, error) 由传入的参数决定
  但拼 request 和发送 ajax 请求的代码已经封装起来了
*/
api.ajax = function(url, method, form, success, error){
  request = {
    'url': url,
    'type': method,
    'data': form,
    'success': function(response) {
      var r = JSON.parse(response)
      success(r)
    },
    'error': function(err) {
      var r = {
        'success': false,
        'message': '网络错误',
      }
      error(r)
    },
  }
  $.ajax(request)
}
// get 方法
api.get = function(url, success, error){
  var form = {}
  api.ajax(url, 'get', form, success, error)
}
// post 方法
api.post = function(url, form, response){
  api.ajax(url, 'post', form, response, response)
}
// 添加微博
api.weiboAdd = function(form, response){
  var url = '/api/weibo/add'
  api.post(url, form, response)
}
// 删除微博
api.weiboDelete = function(weiboId, success, error){
  var url = '/api/weibo/delete/' + weiboId
  api.get(url, success, error)
}
// 添加评论
api.commentAdd = function(form, response) {
  var url = '/api/comment/add'
  api.post(url, form, response)
}
// 删除评论
api.commentDelete = function(commentId, success, error) {
  var url = '/api/comment/delete/' + commentId
  api.get(url, success, error)
}

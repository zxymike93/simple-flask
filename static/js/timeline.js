// 自定义一个 log 函数
var log = function(){
  console.log(arguments)
}


var weiboTemplate = function(w){
  var template = `
    <div class="weibo-content">
      <p>
        ${ w.content } @ ${ w.created_time }
        <button class="weibo-delete" data-id="{{ w.id }}">删除</button>
      </p>
      <a href="#" class="weibo-show-comment">评论</a>
    </div>
  `
  return template
}


var commentTemplate = function(c) {
  var template = `
    <div class="weibo-comment-item">
        <p>${ c.content } <button class="comment-delete" data-id="{{ c.id }}">删除</button></p>
    </div>
  `
  return template
}


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
    'success': success,
    'error': error
  }
  $.ajax(request)
}
// get 方法
api.get = function(url, success, error){
  var form = {}
  api.ajax(url, 'get', form, success, error)
}
// post 方法
api.post = function(url, form, success, error){
  api.ajax(url, 'post', form, success, error)
}
// 添加微博
api.weiboAdd = function(form, success, error){
  var url = '/api/weibo/add'
  api.post(url, form, success, error)
}
// 删除微博
api.weiboDelete = function(weiboId, success, error){
  var url = '/api/weibo/delete/' + weiboId
  api.get(url, success, error)
}
// 添加评论
api.commentAdd = function(form, success, error) {
  var url = '/api/comment/add'
  api.post(url, form, success, error)
}
// 删除评论
api.commentDelete = function(commentId, success, error) {
  var url = '/api/comment/delete/' + commentId
  api.get(url, success, error)
}


// load 完 DOM 后再执行里面的代码
$(document).ready(function(){
  // 给发微博的按钮绑定事件
  $('#id-button-weibo-add').on('click', function(){
    // 因为 weibo-content 有 id，可以直接选中
    var content = $('#id-input-weibo-content').val()
    var form = {
      'content': content,
    }
    var success = function(response){
      var r = JSON.parse(response)
      if (r.success) {
        var w = r.data
        $('.weibo-container').prepend(weiboTemplate(w))
        alert('发送微博成功')
      } else {
        alert(r.message)
      }
    }
    var error = function(){
      alert()
    }
    api.weiboAdd(form, success, error)
  })

  // 用‘事件委托’绑定删除 weibo 按钮事件
  $('.weibo-container').on('click', '.weibo-delete', function(){
    // 选中按钮本身用 this
    var weiboId = $(this).data('id')
    // 找到离按钮最近的 .weibo-content
    var weiboContent = $(this).closest('.weibo-content')
    var success = function(){
      $(weiboContent).slideUp()
      alert('删除微博成功')
    }
    var error = function(){
      alert('删除微博失败')
    }
    api.weiboDelete(weiboId, success, error)
  })

  // 评论开关
  $('.weibo-container').on('click', 'a.weibo-show-comment', function(){
    var button = $(this)
    var commentShow = button.parent().next()
    // log('commentShow', commentShow)
    commentShow.slideToggle()
    return false
  })

  // 添加评论
  $('.weibo-container').on('click', '.weibo-comment-add', function() {
    var parent = $(this).parent()
    var weiboId = parent.find('.weibo-comment-weibo_id').val()
    var commentContent = parent.find('.weibo-comment-content').val()
    var form = {
      'weibo_id': weiboId,
      'content': commentContent,
    }
    var success = function(response) {
      var c = JSON.parse(response)
      var commentList = parent.parent().find('.weibo-comment-list')
      commentList.append(commentTemplate(c))
      alert('添加评论成功')
    }
    var error = function() {
      alert('添加评论失败')
    }
    api.commentAdd(form, success, error)
  })

  // 删除评论
  $('.weibo-comment').on('click', '.comment-delete', function() {
    var button = $(this)
    var commentId = button.data('id')
    log('commentId', commentId)
    var commentItem = button.closest('.weibo-comment-item')
    log('commentItem', commentItem.val())
    var success = function() {
      $(commentItem).slideUp()
      alert('删除评论成功')
    }
    var error = function() {
      alert('删除评论失败')
    }
    api.commentDelete(commentId, success, error)
  })

    // // 绑定按钮
    // $('.weibo-content').on('click', '.weibo-comment-add', function(){
    //     // console.log('click weibo-comment-add')
    //     var button = $(this)
    //     // button 的父节点 .weibo-comment-form
    //     var parent = button.parent()
    //
    //     // 得到 comment 的两个值
    //     var weibo_id = parent.find('.weibo-comment-weibo_id').val()
    //     var content = parent.find('.weibo-comment-content').val()
    //     // console.log('weibo_id and content', weibo_id, content)
    //
    //     // parent.parent 是 .weibo-content
    //     var commentList = parent.parent().find('.weibo-comment-list')
    //     // console.log('commentAll', commentAll)
    //
    //     // 拼好 comment 的两个值，以及 request 的格式
    //     // 发送 ajax 请求
    //     var comment = {
    //         'weibo_id': weibo_id,
    //         'content': content
    //     }
    //     var request = {
    //         'url': '/api/comment/add',
    //         'type': 'post',
    //         'data': comment,
    //         'success': function(){
    //             // console.log('成功', arguments)
    //             // 0: "{"created_time": "2016/10/03 17:19:23", "id": 21, "weibo_id": 1, "user_id": 1, "content": ""}"
    //             // 1: "success"
    //             // 2: Object
    //             var response = arguments[0]
    //             // str 转为 json 对象(字典)
    //             var comment = JSON.parse(response)
    //             var content = comment.content
    //             var item = `
    //                 <div class="weibo-comment-item">
    //                     <p>${content}</p>
    //                 </div>
    //             `
    //             log('item', item)
    //             commentList.append(item)
    //             log('结束')
    //         },
    //         'error': function(){
    //             console.log('失败', arguments)
    //         }
    //     }
    //     $.ajax(request)
    // })
})

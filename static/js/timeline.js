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


var bindEventWeiboAdd = function() {
  $('#id-button-weibo-add').on('click', function() {
    // 因为 weibo-content 有 id，可以直接选中
    var content = $('#id-input-weibo-content').val()
    var form = {
      'content': content,
    }
    var response = function(r) {
      /*
        response 回调函数，在 ajax 调用完成后被调用
        参数 r 是后端传过来的，格式为：
          r = {
            'success': Boolean
            'data': 数据
            'message': 错误提示
          }
      */
      if (r.success) {
        var w = r.data
        $('.weibo-container').prepend(weiboTemplate(w))
        alert('发送微博成功')
      } else {
        alert(r.message)
      }
    }
    api.weiboAdd(form, response)
  })
}


var bindEventWeiboDelete = function() {
  $('.weibo-container').on('click', '.weibo-delete', function() {
    // 选中按钮本身用 this
    var weiboId = $(this).data('id')
    // 找到离按钮最近的 .weibo-content
    var weiboContent = $(this).closest('.weibo-content')
    var response = function(r) {
      if (r.success) {
          $(weiboContent).slideUp()
          alert('删除微博成功')
      } else {
        alert('删除微博失败')
      }
    }
    api.weiboDelete(weiboId, response)
  })
}


//var bindEventWeiboEdit = function() {
//  $('.weibo-container').on('click', '.', function() {
//    log('click')
//    var text = $(this)
//    var div = text.closest('.weibo-content')
//    var form = `
//      <div class="weibo-update-form">
//        <input type="text" value="edit">
//        <button class="weibo-update">更新</button>
//      </div>
//    `
//    div.append(form)
//  })
//}


var bindEvents = function() {
  // 不同的事件用不同的函数绑定
  // 在 bindEvents 函数里一起执行

  // bindEventCommentToggle()
  bindEventWeiboAdd()
  bindEventWeiboDelete()
}


$(document).ready(function() {
  // 页面加载完成后调用这个函数
  // 函数内部只调用一个 bindEvents 函数
  bindEvents()
})


// load 完 DOM 后再执行里面的代码
$(document).ready(function(){
  // // 给发微博的按钮绑定事件
  // $('#id-button-weibo-add').on('click', function(){
  //   // 因为 weibo-content 有 id，可以直接选中
  //   var content = $('#id-input-weibo-content').val()
  //   var form = {
  //     'content': content,
  //   }
  //   var response = function(r){
  //     if (r.success) {
  //       var w = r.data
  //       $('.weibo-container').prepend(weiboTemplate(w))
  //       alert('发送微博成功')
  //     } else {
  //       alert(r.message)
  //     }
  //   }
  //   api.weiboAdd(form, response)
  // })

  // 用‘事件委托’绑定删除 weibo 按钮事件
  // $('.weibo-container').on('click', '.weibo-delete', function(){
  //   // 选中按钮本身用 this
  //   var weiboId = $(this).data('id')
  //   // 找到离按钮最近的 .weibo-content
  //   var weiboContent = $(this).closest('.weibo-content')
  //   var success = function(){
  //     $(weiboContent).slideUp()
  //     alert('删除微博成功')
  //   }
  //   var error = function(){
  //     alert('删除微博失败')
  //   }
  //   api.weiboDelete(weiboId, success, error)
  // })

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
    var response = function(r) {
      if (r.success) {
        var commentList = parent.parent().find('.weibo-comment-list')
        var c = r.data
        commentList.append(commentTemplate(c))
        alert('添加评论成功')
      } else {
        alert(r.message)
      }
    }
    // var success = function(response) {
    //   var c = JSON.parse(response)
    //   var commentList = parent.parent().find('.weibo-comment-list')
    //   commentList.append(commentTemplate(c))
    //   alert('添加评论成功')
    // }
    // var error = function() {
    //   alert('添加评论失败')
    // }
    api.commentAdd(form, response)
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
})

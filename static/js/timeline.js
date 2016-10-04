// 自定义一个 log 函数
var log = function(){
  console.log(arguments)
}


var weiboTemplate = function(w){
  var template = `
    <div class="weibo-content">
      <p>${ w.content } @ ${ w.created_time }</p>
      <button class="weibo-delete" data-id="{{ w.id }}">删除</button>
    </div>
  `
  return template
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
    request = {
      'url': '/api/weibo/add',
      'type': 'post',
      'data': form,
      'success': function(response){
        var w = JSON.parse(response)
        $('.weibo-container').prepend(weiboTemplate(w))

      },
      'error': function(){
        log('失败', arguments)
      }
    }
    $.ajax(request)
  })

  // 用‘事件委托’绑定删除 weibo 按钮事件
  $('.weibo-container').on('click', '.weibo-delete', function(){
    // 选中按钮本身用 this
    var weiboId = $(this).data('id')
    // 找到离按钮最近的 .weibo-content
    var weiboContent = $(this).closest('.weibo-content')

    var request = {
      'url': '/api/weibo/delete/' + weiboId,
      'type': 'post',
      'success': function(){
        log('成功', arguments)
        $(weiboContent).slideUp()
      },
      'error': function(){
        log('失败', arguments)
      }
    }
    $.ajax(request)
  })

    // 绑定按钮
    $('.weibo-comment-add').on('click', function(){
        // console.log('click weibo-comment-add')
        var button = $(this)
        // button 的父节点 .weibo-comment-form
        var parent = button.parent()

        // 得到 comment 的两个值
        var weibo_id = parent.find('.weibo-comment-weibo_id').val()
        var content = parent.find('.weibo-comment-content').val()
        // console.log('weibo_id and content', weibo_id, content)

        // parent.parent 是 .weibo-content
        var commentAll = parent.parent().find('.weibo-comment-all')
        // console.log('commentAll', commentAll)

        // 拼好 comment 的两个值，以及 request 的格式
        // 发送 ajax 请求
        var comment = {
            'weibo_id': weibo_id,
            'content': content
        }
        var request = {
            'url': '/api/comment/add',
            'type': 'post',
            'data': comment,
            'success': function(){
                // console.log('成功', arguments)
                // 0: "{"created_time": "2016/10/03 17:19:23", "id": 21, "weibo_id": 1, "user_id": 1, "content": ""}"
                // 1: "success"
                // 2: Object
                var response = arguments[0]
                // str 转为 json 对象(字典)
                var comment = JSON.parse(response)
                var content = comment.content
                var item = `
                    <div class="weibo-comment-item">
                        <p>${content}</p>
                    </div>
                `
                commentAll.append(item)
            },
            'error': function(){
                console.log('失败', arguments)
            }
        }
        $.ajax(request)
    })
})

// load 完 DOM 后再执行里面的代码
$(document).ready(function(){
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
from flask import Blueprint, session, request, abort

from models import User, Weibo, Comment


main = Blueprint('api', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


@main.route('/weibo/add', methods=['POST'])
def weibo_add():
    form = request.form
    u = current_user()
    w = Weibo(form)
    w.user_id = u.id
    if w.validate_weibo():
        w.save()
    return w.json()


@main.route('/weibo/delete/<int:weibo_id>', methods=['GET'])
def weibo_delete(weibo_id):
    w = Weibo.query.get(weibo_id)
    print('delete w', w)
    w.delete()
    return w.json()


@main.route('/comment/add', methods=['POST'])
def comment_add():
    u = current_user()
    if u is not None:
        form = request.form
        c = Comment(form)
        c.user_id = u.id
        c.weibo_id = int(form.get('weibo_id', -1))
        c.save()
        # 只返回数据而不是整个页面
        return c.json()
    else:
        abort(404)

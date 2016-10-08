from flask import Blueprint, session, request, abort

from models import User, Weibo, Comment
import json


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
    r = {
        'data': [],
    }
    if w.validate_weibo():
        w.save()
        r['success'] = True
        r['data'] = w.json()
    else:
        r['success'] = False
        message = w.error_message()
        r['message'] = message
    return json.dumps(r, ensure_ascii=False)


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
        r = {
            'data': [],
        }
        if c.validate_comment():
            c.save()
            r['success'] = True
            r['data'] = c.json()
        else:
            r['success'] = False
            message = c.error_message()
            r['message'] = message
        print('r', r)
        return json.dumps(r, ensure_ascii=False)


@main.route('/comment/delete/<int:comment_id>', methods=['GET'])
def comment_delete(comment_id):
    c = Comment.query.get(comment_id)
    c.delete()
    return c.json()

from flask import Blueprint, session, request, abort

from models import User, Weibo, Comment
import json


main = Blueprint('api', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


def api_response(success, data=None, message=''):
    r = {
        'success': success,
        'data': data,
        'message': message,
    }
    return json.dumps(r, ensure_ascii=False)


@main.route('/weibo/add', methods=['POST'])
def weibo_add():
    form = request.form
    u = current_user()
    w = Weibo(form)
    w.user_id = u.id
    if w.validate_weibo():
        w.save()
        return api_response(True, data=w.json())
    else:
        return api_response(False, message=w.error_message())


@main.route('/weibo/delete/<int:weibo_id>', methods=['GET'])
def weibo_delete(weibo_id):
    w = Weibo.query.get(weibo_id)
    w.delete()
    return api_response(True, data=w.json())


@main.route('/comment/add', methods=['POST'])
def comment_add():
    u = current_user()
    if u is not None:
        form = request.form
        c = Comment(form)
        c.user_id = u.id
        c.weibo_id = int(form.get('weibo_id', -1))
        if c.validate_comment():
            c.save()
            return api_response(True, data=c.json())
        else:
            return api_response(False, message=c.error_message())


@main.route('/comment/delete/<int:comment_id>', methods=['GET'])
def comment_delete(comment_id):
    c = Comment.query.get(comment_id)
    c.delete()
    return api_response(True, data=c.json())

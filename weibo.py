from flask import Blueprint, session, abort, render_template,\
    request, redirect, url_for

from models import User, Weibo


main = Blueprint('weibo', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


@main.route('/<username>/timeline')
def timeline(username):
    print('打开微博')
    u = User.query.filter_by(username=username).first()
    if u is None:
        print('timeline abort')
        abort(404)
    else:
        # 把这个写进 ModelHelper 的方法里面
        # 就可以简化成 ws = u.Weibos()
        ws = Weibo.query.filter_by(user_id=u.id).all()
        return render_template('timeline.html', weibos=ws)


@main.route('/weibo/add', methods=['POST'])
def add():
    u = current_user()
    if u is not None:
        form = request.form
        w = Weibo(form)
        # Weibo 的 user_id 字段要手动传入
        w.user_id = u.id
        w.save()
        return redirect(url_for('.timeline', username=u.username))
    else:
        abort(404)

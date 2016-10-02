# encoding='utf-8'

from flask import render_template
from flask import Blueprint
from flask import request
from flask import redirect
from flask import url_for
from flask import session

from models import User

from utils import log


main = Blueprint('user', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/user/login', methods=['POST'])
def login():
    form = request.form
    u = User(form)
    # log('login u', u)
    user = User.query.filter_by(username=u.username).first()
    if user is not None and user.validate_login(u):
        session['user_id'] = user.id
        # redirect 到动态路由，要传参数
        return redirect(url_for('weibo.timeline', username=user.username))
    else:
        return redirect(url_for('user.index'))


@main.route('/user/register')
def register():
    return render_template('register.html')


@main.route('/user/new', methods=['POST'])
def new():
    form = request.form
    u = User(form)
    if u.validate_register():
        log('user new', u.username, u.password)
        u.save()
    else:
        abort(404)
    return redirect(url_for('user.index'))
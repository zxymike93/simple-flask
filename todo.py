# encoding='utf-8'

from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import Blueprint
from flask import abort

from models import Todo
from models import User
from user import current_user

from utils import log

main = Blueprint('todo', __name__)


@main.route('/<username>')
def index(username):
    u = User.query.filter_by(username=username).first()
    todo_list = Todo.query.filter_by(user_id=u.id).all()
    return render_template('todo_index.html',
                             username=username,
                             todos=todo_list)


@main.route('/add', methods=['POST'])
def add():
    u = current_user()
    if u is not None:
        form = request.form
        t = Todo(form)
        t.user_id = u.id
        log('todo add', t)
        if t.validate_todo():
            t.save()
    else:
        abort(404)
    return redirect(url_for('todo.index', username=u.username))


@main.route('/delete/<int:todo_id>')
def delete(todo_id):
    t = Todo.query.get(todo_id)
    t.delete()
    return redirect(url_for('todo.index'))
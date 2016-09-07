# encoding='utf-8'

from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import Blueprint
from flask import abort

from models import Todo

from utils import log

main = Blueprint('todo', __name__)


@main.route('/')
def index():
    log('todo index', Todo.query)
    todo_list = Todo.query.all()
    log('todo_index', todo_list)
    return render_template('todo_index.html', todos=todo_list)


@main.route('/add', methods=['POST'])
def add():
    form = request.form
    t = Todo(form)
    log('todo add', t)
    if t.validate_todo():
        t.save()
    else:
        abort(400)
    return redirect(url_for('todo.index'))


# @main.route('/delete/<int:todo_id>')
# def delete(todo_id):
#     t = Todo.query.get(todo_id)
#     t.delete()
#     return redirect(url_for('todo.index'))
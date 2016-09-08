# encoding='utf-8'

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from utils import date


app = Flask(__name__)

app.secret_key = 'secret*key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    password = db.Column(db.String())

    def __repr__(self):
        """
        格式化 log 日志的输出
        """
        return u'<User {}>'.format(self.username)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def __init__(self, form):
        self.username = form.get('username', '')
        self.password = form.get('password', '')

    def validate_register(self):
        return len(self.username) > 3 and len(self.password) > 3

    def validate_login(self, u):
        # u 是登录操作填的数据
        # self 是根据 username filter 到的实例
        return u.password == self.password


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String())
    created_time = db.Column(db.Integer, default=0)

    def __repr__(self):
        return u'<ToDo {} {}>'.format(self.id, self.task)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __init__(self, form):
        self.task = form.get('task', '')
        self.created_time = date()

    def validate_todo(self):
        return len(self.task) > 0


if __name__ == '__main__':
    """
    首次使用要先把 models.py 以程序运行
    create_all() 一个数据库
    每次运行 main 都会 rebuild 一次数据库
    如果没有这段代码来操作 database
    会出现 bug:
    sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: todos
    """
    db.drop_all()
    db.create_all()
    print('rebuild database')
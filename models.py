from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from utils import date

import datetime
import json


app = Flask(__name__)

app.secret_key = 'secret*key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'

db = SQLAlchemy(app)


class ModelHelper(object):
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        """
        格式化 log 的输出
        """
        class_name = self.__class__.__name__
        properties = ['{}: ({})'.format(k, v) for k, v in self.__dict__.items()]
        s = '\n'.join(properties)
        return '<{}\n{}>\n'.format(class_name, s)


class User(db.Model, ModelHelper):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True)
    password = db.Column(db.String())

    def __init__(self, form):
        self.username = form.get('username', '')
        self.password = form.get('password', '')

    def validate_register(self):
        return len(self.username) >= 6 and len(self.password) >= 6

    def validate_login(self, u):
        return u.password == self.password


class Weibo(db.Model, ModelHelper):
    __tablename__ = 'weibos'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(), nullable=False)
    created_time = db.Column(db.String())
    user_id = db.Column(db.Integer)

    def __init__(self, form):
        self.content = form.get('content', '')
        self.created_time = date()
        self.comments = []

    def validate_weibo(self):
        return len(self.content) >= 2 and len(self.content) <= 20

    def error_message(self):
        if len(self.content) < 2:
            return '微博长度必须大于等于 2 个字符'
        elif len(self.content) > 20:
            return '微博长度必须小于等于 20 个字符'

    def json(self):
        d = dict(
            id=self.id,
            content=self.content,
            created_time=self.created_time,
            user_id=self.user_id
        )
        # return json.dumps(d, ensure_ascii=False)
        return d

    def show_comments(self):
        self.comments = Comment.query.filter_by(weibo_id=self.id).all()


class Comment(db.Model, ModelHelper):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String())
    created_time = db.Column(db.String())
    user_id = db.Column(db.Integer)
    weibo_id = db.Column(db.Integer)

    def __init__(self, form):
        self.content = form.get('content', '')
        self.created_time = date()

    def json(self):
        d = {
            'id': self.id,
            'content': self.content,
            'created_time': self.created_time,
            'weibo_id': self.weibo_id,
            'user_id': self.user_id,
        }
        # return json.dumps(d, ensure_ascii=False)
        return d

    def validate_comment(self):
        return len(self.content) >= 2 and len(self.content) <= 20

    def error_message(self):
        if len(self.content) < 2:
            return '评论不能少于 2 个字符'
        elif len(self.content) > 20:
            return '评论不能多过 20 个字符'


class Todo(db.Model, ModelHelper):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String())
    created_time = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer)

    def __init__(self, form):
        self.task = form.get('task', '')
        self.created_time = datetime.date.today()

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
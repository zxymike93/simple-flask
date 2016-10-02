# encoding: utf-8

"""
Flask:
render_template:
request:
redirect:
url_for:
"""
from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for

import time


app = Flask(__name__)


message_list = []


def log(*args, **kwargs):
	format = '%Y/%m/%d %H:%M:%S'
	value = time.localtime(int(time.time()))
	dt = time.strftime(format, value)
	# 把 log 的输出写成日志
	with open('log.txt', 'a', encoding='utf-8') as f:
		print(dt, *args, file=f, **kwargs)


@app.route('/', methods=['GET'])
def hello_world():
	return 'Hello World!'


@app.route('/message')
def message_view():
	log('message_view 请求方法: ', request.method)
	log('message view query参数: ', request.args)
	# 左: messages, 模板里面的占位符
	# 右: message_list, 要传进去的参数
	return render_template('message_index.html', messages=message_list)


@app.route('/message/add', methods=['POST'])
def message_add():
	log('message_add 请求方法: ', request.method)
	log('post 的 form 数据: ', request.form)
	msg = {
		'content': request.form.get('message', ''),
	}
	message_list.append(msg)
	# 不用 url_for 就得写路径: redirect('/message')
	# 但 url_for 可以生成动态路由，更先进
	return redirect(url_for('message_view'))


if __name__ == '__main__':
	config = dict(
		debug=True,
		host='0.0.0.0',
		port=2000,
	)
	app.run(**config)

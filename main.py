# encoding='utf-8'

from flask import Flask
from flask import render_template

from todo import main as todo_routes
from user import main as user_routes
from weibo import main as weibo_routes
from api import main as api_routes

# from utils import log


app = Flask(__name__)

app.secret_key = 'secret*key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

app.register_blueprint(todo_routes, url_prefix='/todo')
app.register_blueprint(user_routes)
app.register_blueprint(weibo_routes)
app.register_blueprint(api_routes, url_prefix='/api')


@app.errorhandler(404)
def error404(e):
    return render_template('404.html')


if __name__ == '__main__':
    app.run(debug=True)

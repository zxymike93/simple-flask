# encoding='utf-8'

from flask import Flask
# from flask import render_template

from todo import main as todo_routes
# from user import main as user_routes

# from utils import log


app = Flask(__name__)

app.secret_key = 'secret*key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

app.register_blueprint(todo_routes, url_prefix='/todo')
# app.register_blueprint(user_routes)

if __name__ == '__main__':
    app.run(debug=True)
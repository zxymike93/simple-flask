# encoding='utf-8'

from flask import render_template
from flask import Blueprint


main = Blueprint('user', __name__)


@main.route('/')
def index():
    return render_template('index.html')
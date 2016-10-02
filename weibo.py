from flask import abort, render_template


main = Blueprint('weibo', __name__)


@main.route('/<username>/timeline')
def timeline(username):
    u = User.query.filter_by(username=username).first()
    if u is None:
        abort(404)
    else:
        # 把这个写进 ModelHelper 的方法里面
        # 就可以简化成 ws = u.Weibos()
        ws = Weibo.query.filter_by(user_id=u.id).all()
        return render_template('timeline.html', weibos=ws)



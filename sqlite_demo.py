"""
    这个 demo 是用来展示 sqlite 在 python 中的基本操作
"""

import sqlite3


def create(conn):
    sql_create = """
        CREATE TABLE
            `users`(
                `id`    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                `username`    TEXT NOT NULL UNIQUE,
                `password`    TEXT NOT NULL,
                `email`    TEXT
                )
        """
    conn.execute(sql_create)
    print('创建')


def insert(conn, username, password, email):
    sql_insert = """
        INSERT INTO
            `users`(`username`,`password`,`email`)
        VALUES
            (?,?,?)
        """
    conn.execute(sql_insert, (username, password, email))
    print('插入')


def select(conn):
    sql_select = """
        SELECT
            *
        FROM
            users
        """
    cursor = conn.execute(sql_select)
    for row in cursor:
        print(row)


def update(conn, user_id, email):
    sql_update = """
        UPDATE
            `users`
        SET
            `email`=?
        WHERE
            `id`=?
        """
    conn.execute(sql_update, (email, user_id))


def delete(conn, user_id):
    sql_delete = """
        DELETE FROM
            users
        WHERE
            id=?
        """
    conn.execute(sql_delete, (user_id,))


def main():
    # 指定路径，创建和 sqlite 的连接
    db_path = 'demo.sqlite'
    conn = sqlite3.connect(db_path)

    # 创建一个数据库文件
    # 并创建一个表
    create(conn)

    # 插入数据
    # insert(conn, 'sql1', '123', 'a@b.c')

    # 查看数据
    # select(conn)

    # # 更新数据
    # update(conn, 1, 'mike@163.com')

    # 删除数据
    # delete(conn, 1)

    # 以上操作都需要 commit 函数来提交
    # 否则不会写入数据库中
    conn.commit()

    # 操作完要 close 数据库
    conn.close()


if __name__ == '__main__':
    main()

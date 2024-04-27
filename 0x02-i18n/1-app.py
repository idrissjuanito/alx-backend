#!/usr/bin/env python3
""" Flask App module """
from flask import Flask, render_template
from flask_babel import Babel
app = Flask(__name__)
app.config.from_object('Config')
babel = Babel(app)


@app.route('/')
def index():
    """ Root endpoint handler """
    return render_template('1-index.html')


class Config():
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")

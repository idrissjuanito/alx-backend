#!/usr/bin/env python3
""" Flask App module """
from flask import Flask, render_template, request
from flask_babel import Babel
app = Flask(__name__)
app.config.from_object('__main__.Config')
babel = Babel(app)


@app.route('/')
def index():
    """ Root endpoint handler """
    return render_template('2-index.html')


class Config():
    """ class for app configuration """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


@babel.localeselector
def get_locale():
    """ gets local from request """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")

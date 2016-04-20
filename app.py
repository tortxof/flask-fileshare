import os
import base64
import datetime

from flask import Flask, render_template, redirect, flash
from werkzeug.utils import secure_filename
from peewee import SqliteDatabase, Model, CharField, DateTimeField
import boto3

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

db = SqliteDatabase('/data/data.db')

class BaseModel(Model):
    class Meta():
        database = db

class Upload(BaseModel):
    original_name = CharField()
    s3_name = CharField()
    time = DateTimeField()

db.connect()
db.create_tables([Upload], safe=True)
db.close()

@app.before_request
def before_request():
    g.db = db
    g.db.connect()

@app.after_request
def after_request(request):
    g.db.close()
    return request

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file_upload = request.files['file']
        original_name = secure_filename(file_upload.filename)
        s3_name = base64.urlsafe_b64encode(os.urandom(24)).decode()
        time = datetime.datetime.now()
        Upload.create(original_name=original_name,
                      s3_name=s3_name,
                      time=time)
        return render_template('complete.html')
    else:
        return render_template('upload.html')

import os
import base64
import datetime

from flask import Flask, render_template, redirect, request, flash
import boto3

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

app.config['APP_URL'] = os.environ.get('APP_URL')

app.config['AWS_ACCESS_KEY_ID'] = os.environ.get('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.environ.get('AWS_SECRET_ACCESS_KEY')

@app.route('/')
def upload():
    key = base64.urlsafe_b64encode(os.urandom(12)).decode()
    s3 = boto3.client(
        's3',
        aws_access_key_id = app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key = app.config['AWS_SECRET_ACCESS_KEY']
        )
    post = s3.generate_presigned_post(
        Bucket = 'djones-flask-fileshare',
        Key = key + '/${filename}',
        Fields = {
            'acl': 'public-read',
            'success_action_redirect': '{0}/view'.format(app.config['APP_URL'])
            },
        Conditions = [
            {'acl': 'public-read'},
            ['starts-with', '$success_action_redirect', app.config['APP_URL']]
            ],
        ExpiresIn = 600
        )
    return render_template('upload.html', post=post)

@app.route('/view')
def view_file():
    args = request.args.to_dict()
    return render_template('view.html', args=args)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
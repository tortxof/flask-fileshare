import os
import base64
import operator

from flask import Flask, render_template, request, jsonify
from flask_s3 import FlaskS3, create_all
import boto3

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

app.config['APP_URL'] = os.environ.get('APP_URL')

app.config['S3_BUCKET'] = os.environ.get('S3_BUCKET')

app.config['FLASKS3_BUCKET_NAME'] = os.environ.get('FLASKS3_BUCKET_NAME')
app.config['FLASKS3_DEBUG'] = os.environ.get('FLASKS3_DEBUG', 'false').lower() == 'true'
app.config['FLASKS3_GZIP'] = True

s3 = FlaskS3(app)

def upload_static(zappa_settings):
    app.config['FLASKS3_BUCKET_NAME'] = zappa_settings.aws_environment_variables['FLASKS3_BUCKET_NAME']
    create_all(app)

def get_s3_client():
    return boto3.client('s3')

def gen_signed_post(s3_client, redirect_path=None):
    if redirect_path:
        success_action_field = {
            'success_action_redirect': '{0}{1}'.format(
                app.config['APP_URL'],
                redirect_path,
            )
        }
        success_action_condition = [
            'starts-with',
            '$success_action_redirect',
            app.config['APP_URL']
        ]
    else:
        success_action_field = {
            'success_action_status': '204'
        }
        success_action_condition = [
            'starts-with',
            '$success_action_status',
            '204'
        ]
    return s3_client.generate_presigned_post(
        Bucket = app.config['S3_BUCKET'],
        Key = base64.urlsafe_b64encode(os.urandom(3)).decode() + '/${filename}',
        Fields = {
            'acl': 'public-read',
            **success_action_field
        },
        Conditions = [
            {'acl': 'public-read'},
            success_action_condition,
            ['starts-with', '$Content-Type', ''],
        ],
        ExpiresIn = 600
    )

@app.route('/')
@app.route('/upload')
@app.route('/list')
def index():
    return render_template('layout.html')

@app.route('/legacy')
def legacy_upload():
    s3 = get_s3_client()
    post = gen_signed_post(s3, redirect_path='/legacy')
    objects = s3.list_objects_v2(
        Bucket = app.config['S3_BUCKET'],
    ).get('Contents')
    objects.sort(key=operator.itemgetter('LastModified'), reverse=True)
    objects = [
        {
            'bucket': app.config['S3_BUCKET'],
            's3key': obj['Key'],
        }
        for obj in objects
    ]
    return render_template(
        'legacy.html',
        post = post,
        s3Objects = objects,
    )

@app.route('/signed-post')
def upload():
    s3 = get_s3_client()
    post = gen_signed_post(s3)
    return jsonify(post=post)

@app.route('/list.json')
def list_objects():
    s3 = get_s3_client()
    objects = s3.list_objects_v2(
        Bucket = app.config['S3_BUCKET'],
    ).get('Contents')
    if not objects:
        return jsonify(s3Objects=[])
    objects.sort(key=operator.itemgetter('LastModified'), reverse=True)
    objects = [
        {
            'bucket': app.config['S3_BUCKET'],
            's3key': obj['Key'],
            'size': obj['Size'],
            'content_type': s3.head_object(
                Bucket = app.config['S3_BUCKET'],
                Key = obj['Key'],
            ).get('ContentType'),
        }
        for obj in objects
    ]
    return jsonify(s3Objects=objects)

if __name__ == '__main__':
    app.run(host='0.0.0.0')

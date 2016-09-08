import os
import base64
import operator

from flask import Flask, render_template, request, jsonify
import boto3

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'

app.config['APP_URL'] = os.environ.get('APP_URL')

app.config['S3_BUCKET'] = os.environ.get('S3_BUCKET')

app.config['AWS_ACCESS_KEY_ID'] = os.environ.get('AWS_ACCESS_KEY_ID')
app.config['AWS_SECRET_ACCESS_KEY'] = os.environ.get('AWS_SECRET_ACCESS_KEY')

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id = app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key = app.config['AWS_SECRET_ACCESS_KEY']
    )

def gen_signed_post(s3_client):
    return s3_client.generate_presigned_post(
        Bucket = app.config['S3_BUCKET'],
        Key = base64.urlsafe_b64encode(os.urandom(6)).decode() + '/${filename}',
        Fields = {
            'acl': 'public-read',
            'success_action_redirect': '{0}/'.format(app.config['APP_URL'])
        },
        Conditions = [
            {'acl': 'public-read'},
            ['starts-with', '$success_action_redirect', app.config['APP_URL']],
            ['starts-with', '$Content-Type', ''],
        ],
        ExpiresIn = 600
    )

@app.route('/')
def index():
    args = request.args.to_dict()
    s3 = get_s3_client()
    post = gen_signed_post(s3)
    return (
        render_template('upload.html', post=post, args=args),
        200,
        {'Access-Control-Allow-Origin': '*'}
    )

@app.route('/signed-post')
def upload():
    s3 = get_s3_client()
    post = gen_signed_post(s3)
    return jsonify(post=post)

@app.route('/list')
def list_objects():
    s3 = get_s3_client()
    objects = s3.list_objects_v2(
        Bucket = app.config['S3_BUCKET'],
    ).get('Contents')
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

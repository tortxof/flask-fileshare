# flask-fileshare

A minimal flask app for an AWS S3 based temporary file sharing service.

This app allows anonymous uploads to an S3 bucket, and provides a public link to
uploaded files. Your S3 bucket should be configured to remove objects after 14
days.

## Deploy to AWS Lambda using Zappa

You will need a `zappa_settings.json` file to configure Zappa. Here's an
example.

```json
{
  "production": {
    "project_name": "flask-fileshare",
    "domain": "file.example.com",
    "certificate_arn": "arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-4000-0000-000000000000",
    "app_function": "app.app",
    "aws_region": "us-east-1",
    "profile_name": "default",
    "s3_bucket": "lambda-zip-upload-bucket",
    "callbacks": {
      "settings": "app.upload_static"
    },
    "aws_environment_variables": {
      "S3_BUCKET": "file-upload-bucket",
      "SECRET_KEY": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      "APP_URL": "https://file.example.com",
      "FLASKS3_BUCKET_NAME": "static-assets-bucket",
    }
  }
}
```

You'll neet to create the file upload bucket yourself. See below for setting the
CORS configuration on the bucket.

Create a certificate in the AWS Certificate Manager. After the certificate is
approved, put the certificate ARN in your `zappa_settings.json` file.

Deploy the app with `zappa deploy <stage>`. Update with `zappa update <stage>`.
Once the app is deployed, running `zappa certify <stage>` will create the DNS
records and the Cloud Front deployments.

## Build the Docker image.

docker build --pull -t tortxof/flask-fileshare https://github.com/tortxof/flask-fileshare.git

## Run a container.

    docker run -d --restart always --name file.example.com \
      -e SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
      -e APP_URL=https://file.example.com \
      -e S3_BUCKET=example-bucket-name \
      -e AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX \
      -e AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
      -p 5000:5000 \
      tortxof/flask-fileshare

## AWS S3 CORS Configuration

Set this CORS configuration on the S3 bucket used with the app.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

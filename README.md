# flask-fileshare

A minimal flask app for an AWS S3 based temporary file sharing service.

This app allows anonymous uploads to an S3 bucket, and provides a public link to
uploaded files. Your S3 bucket should be configured to remove objects after 14
days.

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

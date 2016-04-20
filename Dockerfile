FROM python:3.4
MAINTAINER Daniel Jones <tortxof@gmail.com>

RUN groupadd -r docker && useradd -r -g docker docker

COPY requirements.txt /app/
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app/

USER docker

EXPOSE 5000

CMD ["python3", "app.py"]

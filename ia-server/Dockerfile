FROM python:3.7.6-buster

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python3.7", "-u", "./service/app.py" ]
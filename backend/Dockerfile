FROM python:3.9.0-buster

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python3.9", "-u", "./run.py" ]
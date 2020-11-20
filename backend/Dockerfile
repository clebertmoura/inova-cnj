FROM python:3.9.0-buster

# descomentar a linha abaixo quanto estiver por tráz de proxy http
# ENV http_proxy=http://192.168.251.227:8080 \
#     https_proxy=http://192.168.251.227:8080 \
#     no_proxy=localhost \
#     HTTP_PROXY=http://192.168.251.227:8080 \
#     HTTPS_PROXY=http://192.168.251.227:8080 \
#     NO_PROXY=localhost

RUN apt-get update && \
    apt-get -y install graphviz && \
    apt-get clean

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000 8080

CMD [ "python3.9", "-u", "./run.py" ]
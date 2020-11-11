FROM python:3.7.6-buster

# ENV http_proxy=http://192.168.251.227:8080 \
#     https_proxy=http://192.168.251.227:8080 \
#     no_proxy=*.tjpe.gov.br,*.tjpe.jus.br,localhost \
#     HTTP_PROXY=http://192.168.251.227:8080 \
#     HTTPS_PROXY=http://192.168.251.227:8080 \
#     NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python3.7", "-u", "./service/app.py" ]
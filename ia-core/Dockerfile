FROM jupyter/pyspark-notebook:4a112c0f11eb

# ENV http_proxy=http://192.168.251.227:8080 \
#     https_proxy=http://192.168.251.227:8080 \
#     no_proxy=*.tjpe.gov.br,*.tjpe.jus.br,localhost \
#     HTTP_PROXY=http://192.168.251.227:8080 \
#     HTTPS_PROXY=http://192.168.251.227:8080 \
#     NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

# Copia as configurações do jupyter
COPY /config/* /home/$NB_USER/

USER root

RUN apt-get update && \
    apt-get -y install graphviz && \
    apt-get clean

USER $NB_UID

RUN pip install pm4py flask psycopg2-binary flask-restplus

EXPOSE 8888 8080
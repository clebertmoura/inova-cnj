FROM jupyter/pyspark-notebook:4a112c0f11eb

#ENV http_proxy=http://192.168.251.227:8080
#ENV https_proxy=http://192.168.251.227:8080
#ENV no_proxy=*.tjpe.gov.br,*.tjpe.jus.br,localhost
#ENV HTTP_PROXY=http://192.168.251.227:8080
#ENV HTTPS_PROXY=http://192.168.251.227:8080
#ENV NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

USER root

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install graphviz

USER $NB_UID

RUN pip install pm4py flask

EXPOSE 8888 8080
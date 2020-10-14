FROM jupyter/pyspark-notebook:4a112c0f11eb

ENV http_proxy=http://192.168.251.227:8080
ENV https_proxy=http://192.168.251.227:8080
ENV no_proxy=*.tjpe.gov.br,*.tjpe.jus.br,localhost
ENV HTTP_PROXY=http://192.168.251.227:8080
ENV HTTPS_PROXY=http://192.168.251.227:8080
ENV NO_PROXY=*.tjpe.gov.br,*.tjpe.jus.br,localhost

RUN pip install pm4py

EXPOSE 8888
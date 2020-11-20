FROM jupyter/pyspark-notebook:4a112c0f11eb

# descomentar a linha abaixo quanto estiver por tráz de proxy http
# ENV http_proxy=http://192.168.251.227:8080 \
#     https_proxy=http://192.168.251.227:8080 \
#     no_proxy=localhost \
#     HTTP_PROXY=http://192.168.251.227:8080 \
#     HTTPS_PROXY=http://192.168.251.227:8080 \
#     NO_PROXY=localhost

# Copia as configurações do jupyter
COPY /config/* /home/$NB_USER/.jupyter/

USER root

# RUN mkdir /home/$NB_USER/.ipython/profile_default/startup/ -p
# COPY /startup/* /home/$NB_USER/.ipython/profile_default/startup/
# RUN fix-permissions /home/$NB_USER/.ipython

RUN apt-get update && \
    apt-get -y install graphviz && \
    apt-get clean

USER $NB_UID

RUN pip install pm4py svgutils flask psycopg2-binary flask-restplus timer3 jsonpickle

EXPOSE 8888 8080
FROM jboss/wildfly:19.0.0.Final

ENV CONNECTION_TIMEOUT 60000
ENV RECEIVE_TIMEOUT 300000
ENV HTTP_PROXY_ENABLED true
ENV HTTP_PROXY_HOST 192.168.251.227
ENV HTTP_PROXY_PORT 8080

ENV http_proxy http://192.168.251.227:8080
ENV https_proxy http://192.168.251.227:8080
ENV no_proxy *.tjpe.gov.br,*.tjpe.jus.br,localhost
ENV HTTP_PROXY http://192.168.251.227:8080
ENV HTTPS_PROXY http://192.168.251.227:8080
ENV NO_PROXY *.tjpe.gov.br,*.tjpe.jus.br,localhost

ENV ARTEMIS_HOST shaplactivemq01.tjpe.gov.br
ENV ARTEMIS_PORT 61616
ENV ARTEMIS_USERNAME admin
ENV ARTEMIS_PASSWORD admin
ENV ARTEMIS_URL tcp://shaplactivemq01.tjpe.gov.br:61616

ADD ./wfcfg/tjpe-gov-br.pem /usr/lib/jvm/java/lib/security
ADD ./wfcfg/app-tjpe-gov-br.pem /usr/lib/jvm/java/lib/security

USER root

RUN /usr/lib/jvm/java/bin/keytool -importcert -file /usr/lib/jvm/java/lib/security/tjpe-gov-br.pem -alias tjpe-gov-br -noprompt -cacerts -storepass changeit 
RUN /usr/lib/jvm/java/bin/keytool -importcert -file /usr/lib/jvm/java/lib/security/app-tjpe-gov-br.pem -alias app-tjpe-gov-br -noprompt -cacerts -storepass changeit 

USER jboss

ADD ./wfcfg/configuration/ /opt/jboss/wildfly/standalone/configuration/
ADD ./wfcfg/bin/ /opt/jboss/wildfly/bin/
RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent
EXPOSE 8080 8443 9990 9999 8787
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0", "--debug"]
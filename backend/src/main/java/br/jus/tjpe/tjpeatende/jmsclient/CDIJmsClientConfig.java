package br.jus.tjpe.tjpeatende.jmsclient;

import javax.enterprise.context.ApplicationScoped;

import org.apache.artemis.client.cdi.configuration.ArtemisClientConfiguration;

import br.jus.tjpe.tjpeatende.util.Constantes;

/**
 * CDIClientConfig
 */
@ApplicationScoped
public class CDIJmsClientConfig implements ArtemisClientConfiguration {

    @Override
    public String getUsername() {
        return System.getenv(Constantes.ENV_ARTEMIS_USERNAME);
    }

    @Override
    public String getPassword() {
        return System.getenv(Constantes.ENV_ARTEMIS_PASSWORD);
    }

    @Override
    public String getUrl() {
        return System.getenv(Constantes.ENV_ARTEMIS_URL);
    }

    @Override
    public String getHost() {
        return System.getenv(Constantes.ENV_ARTEMIS_HOST);
    }

    @Override
    public Integer getPort() {
        return Integer.parseInt(System.getenv(Constantes.ENV_ARTEMIS_PORT));
    }

    @Override
    public boolean startEmbeddedBroker() {
        return false;
    }

    @Override
    public boolean hasAuthentication() {
        return true;
    }

    @Override
    public boolean isHa() {
        return false;
    }

    @Override
    public String getConnectorFactory() {
        return "org.apache.activemq.artemis.core.remoting.impl.netty.NettyConnectorFactory";
    }
}
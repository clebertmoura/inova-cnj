package br.jus.tjpe.tjpeatende.manager;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Destroyed;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.jms.Destination;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSRuntimeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.jus.tjpe.tjpeatende.consumer.SolicitacaoConsumer;

/**
 * ConsumerManager
 */
@ApplicationScoped
public class ConsumerStartupManager {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Inject
    private JMSContext context;

    private JMSConsumer consumer;

    public void onInitialized(@Observes @Initialized(ApplicationScoped.class) Object o) {
        logger.info("ConsumerStartupManager onInitialized");
        Destination queue = context.createTopic("topic/tjpeatende/solicitacao");
        consumer = context.createConsumer(queue);
        consumer.setMessageListener(new SolicitacaoConsumer());
        logger.info("SolicitacaoConsumer criado");
    }

    public void onDestroyed(@Observes @Destroyed(ApplicationScoped.class) Object o) {
        logger.info("ConsumerStartupManager onDestroyed");
        try {
            consumer.close();
        } catch(JMSRuntimeException e) {
            logger.error("Falha ao fechar consumidor.", e);
        }
    }
    
}
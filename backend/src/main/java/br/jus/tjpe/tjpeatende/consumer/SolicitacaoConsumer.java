package br.jus.tjpe.tjpeatende.consumer;

import javax.jms.Message;
import javax.jms.MessageListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SolicitacaoConsumer implements MessageListener {

    private Logger logger = LoggerFactory.getLogger(getClass());

    @Override
    public void onMessage(Message message) {
        logger.info("onMessage: " + message.toString());
    }
    
}
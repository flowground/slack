package de.telekom.idu.toa;

import com.github.seratch.jslack.Slack;
import com.github.seratch.jslack.api.webhook.Payload;
import com.github.seratch.jslack.api.webhook.WebhookResponse;
import io.elastic.api.ExecutionParameters;
import io.elastic.api.Message;
import io.elastic.api.Module;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 *
 */
public class SendMessage implements Module {

    /**
     *
     */
    private static final Logger logger = LoggerFactory.getLogger(SendMessage.class);


    /**
     *
     * @param args
     * @throws IOException
     *
    public static void main(String[] args) throws IOException {

        System.setProperty("http.proxyHost", "HE103024.emea1.cds.t-internal.com");
        System.setProperty("http.proxyPort", "8080");
        System.setProperty("https.proxyHost", "HE103024.emea1.cds.t-internal.com");
        System.setProperty("https.proxyPort", "8080");

        new SendMessage().execute(null);

    }
    */

    /**
     *
     * @param parameters
     */
    @Override
    public void execute(ExecutionParameters parameters) {

        logger.info("About to send a message to Slack");

        String url = parameters.getConfiguration().getString("channel");
        //" https://hooks.slack.com/services/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"; //System.getenv("SLACK_WEBHOOK_URL");

        Payload payload = Payload.builder()
                .channel("#allgemein")
                .username("jSlack Bot")
                .iconEmoji(":smile_cat:")
                .text("Hello World!")
                .build();

        Slack slack = Slack.getInstance();
        WebhookResponse response = null;
        try {
            response = slack.send(url, payload);
        } catch (IOException e) {
            e.printStackTrace();
            parameters.getEventEmitter().emitException(e);
        }

        logger.info("Response Code: " + response.getCode());

        Message message = parameters.getMessage();

        parameters.getEventEmitter().emitData(message);
    }
}
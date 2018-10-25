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
     * @param parameters
     */
    @Override
    public void execute(ExecutionParameters parameters) {

        logger.info("About to send a message to Slack");

        //" https://hooks.slack.com/services/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";
        // System.getenv("SLACK_WEBHOOK_URL");
        String url = parameters.getConfiguration().getString("slack_webhook_url");
        String channel = parameters.getConfiguration().getString("slack_channel");
        String username = parameters.getConfiguration().getString("slack_username");
        String text = parameters.getConfiguration().getString("slack_text");

        String iconEmoji =parameters.getConfiguration().getString("slack_icon_emoji");

        Payload payload = Payload.builder()
                .channel(channel)
                .username(username)
                .text(text)
                .iconEmoji(iconEmoji)
                .build();

        Slack slack = Slack.getInstance();
        WebhookResponse response = null;
        try {
            response = slack.send(url, payload);
        } catch (IOException e) {
            parameters.getEventEmitter().emitException(e);
        }

        logger.info("Response Code: " + response.getCode());

        Message message = parameters.getMessage();

        parameters.getEventEmitter().emitData(message);
    }
}
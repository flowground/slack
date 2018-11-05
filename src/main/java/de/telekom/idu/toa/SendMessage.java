package de.telekom.idu.toa;

import com.github.seratch.jslack.Slack;
import com.github.seratch.jslack.api.webhook.Payload;
import com.github.seratch.jslack.api.webhook.WebhookResponse;
import io.elastic.api.ExecutionParameters;
import io.elastic.api.Message;
import io.elastic.api.Module;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.json.JsonObject;
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
     * @param parameters
     */
    @Override
    public void execute(final ExecutionParameters parameters) {

        logger.info("About to send a message to Slack");

        //" https://hooks.slack.com/services/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";

        JsonObject slackParameters = parameters.getMessage().getBody();

        logger.info(slackParameters.toString());

        String url = slackParameters.getString("slack_webhook_url");
        String channel = slackParameters.getString("slack_channel");
        String text = slackParameters.getString("slack_text");

        Payload.PayloadBuilder payloadBuilder = Payload.builder()
                .channel(channel)
                .text(text);

        if (slackParameters.containsKey("slack_username")) {
            String username = slackParameters.getString("slack_username");
            logger.info("Setting username to: " + username);
            payloadBuilder.username(username);
        }

        if (slackParameters.containsKey("slack_icon_emoji")) {
            String iconEmoji = parameters.getConfiguration().getString("slack_icon_emoji");
            logger.info("Setting iconEmoji to: " + iconEmoji);
            payloadBuilder.iconEmoji(iconEmoji);
        }

        Payload payload = payloadBuilder.build();

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
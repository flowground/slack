package de.telekom.idu.toa;

import com.github.seratch.jslack.*;
import com.github.seratch.jslack.api.webhook.*;
import java.io.IOException;

public class SendMessage implements io.elastic.api.Module {

    public static void main(String[] args) throws IOException {

        System.setProperty("http.proxyHost", "HE103024.emea1.cds.t-internal.com");
        System.setProperty("http.proxyPort", "8080");
        System.setProperty("https.proxyHost", "HE103024.emea1.cds.t-internal.com");
        System.setProperty("https.proxyPort", "8080");

        String url = " https://hooks.slack.com/services/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"; //System.getenv("SLACK_WEBHOOK_URL");

        Payload payload = Payload.builder()
                .channel("#allgemein")
                .username("jSlack Bot")
                .iconEmoji(":smile_cat:")
                .text("Hello World!")
                .build();

        Slack slack = Slack.getInstance();
        WebhookResponse response = slack.send(url, payload);

    }
}

'use strict';

const request = require('request');
const elasticio = require('elasticio-node');
const messages = elasticio.messages;
var async = require("async");

/**
 * Validates input data
 **/
function validate(msg, cfg) {
    // Credentials
    if ( !(cfg.slack_webhook_url)) {
	    throw new Error('Missing Slack Webhook URL');
    }
}

/**
 *
 **/
function sendRequest(cfg) {
    
    // Debug output
    if (process.env.debug || cfg.debug) {
        console.log(`Calling Slack with Args: ${JSON.stringify(args)}`);
    }
        
    request.post(
        cfg.slack_webhook_url,
        {json: {
            'channel': cfg.slack_channel,
            'text': cfg.slack_text
        }},
        function(error, response, body) {
            if(!error && response.statusCode == 200) {
                console.log(body);
            }
        } 
    )
}
    

/**
 * Process Action (main method)
 * 
 * @param {*} msg 
 * @param {*} cfg 
 */
function processAction(msg, cfg) {
    const self = this;

    if (process.env.debug || cfg.debug) {
        console.log(`CFG: ${JSON.stringify(cfg)}`);
        console.log(`MSG: ${JSON.stringify(msg)}`);
        console.log(`ENV: ${JSON.stringify(process.env)}`);
    }

    // Perform validation of input data
    try {
        validate(msg, cfg);

        sendRequest(cfg)
            .then(emitData)
            .then(emitEnd)
            .catch(emitError);;

    } catch (e) {
        emitError(e);
    }

    // Emit functions
    function emitData(data) {
        self.emit('data', messages.newMessageWithBody(data));
    }

    function emitError(err) {
        self.emit('error', err);
    }

    function emitEnd() {
        self.emit('end');
    }
}

exports.process = processAction;

/**
 *
 *
public class SendMessage implements Module {

    /**
     *
     *
    private static final Logger logger = LoggerFactory.getLogger(SendMessage.class);

    /**
     * @param parameters
     *
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
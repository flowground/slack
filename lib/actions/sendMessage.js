'use strict';

const request = require('request');
const elasticio = require('elasticio-node');
const messages = elasticio.messages;
var async = require("async");

//"https://hooks.slack.com/services/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";

/**
 * Validates input data
 **/
function validate(msg, cfg) {
    // Credentials
    if ( !(cfg.slack_webhook_url)) {
	    throw new Error('Missing Slack Webhook URL');
    } else {
        console.log("validated")
    }
}

/**
 *
 **/
function sendRequest(cfg) {

    console.log("Entered sendRequest");
    
    // Debug output
    if (process.env.debug || cfg.debug) {
        console.log(`Calling Slack with Args: ${JSON.stringify(args)}`);
    }
        
    request.post(
        cfg.slack_webhook_url,
        {
            json: {
                'channel': cfg.slack_channel,
                'text': cfg.slack_text
            }
        },
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

    console.log("Entered processAction");

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
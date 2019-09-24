'use strict';

const Q = require('q');
const {
    messages
} = require('elasticio-node');
const rp = require('request-promise');

//"https://hooks.slack.com/services/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";


/**
 * Process Action (main method)
 * 
 * @param {*} msg 
 * @param {*} cfg 
 */
function processAction(msg, cfg) {

    console.log("Entered processAction");

    const self = this;

    /**
     * Validates input data
     **/
    function checkInput(msg, cfg) {

        return new Promise((resolve) => {

            // Check input data
            if (!msg.body.slack_webhook_url) throw (new Error('missing parameter: webhook url'));

            resolve(true);
        });
    };

    /**
     * API call
     */
    function getData() {

        return new Promise((resolve, reject) => {

            var myBody = {
                'channel': msg.body.slack_channel,
                'text': msg.body.slack_text,
                'icon_emoji': msg.body.slack_icon_emoji
            }

            const uri = msg.body.slack_webhook_url;

            const options = {
                uri: uri,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'client': cfg.client,
                    'user': cfg.user
                },
                json: true,
                body: myBody
            };

            // Send request
            rp(options)
                .then(resolve)
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });

        });
    };

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

    // Process
    Q()
        .then(checkInput)
        .then(getData)
        .then(emitData)
        .fail(emitError)
        .done(emitEnd);

};

exports.process = processAction;
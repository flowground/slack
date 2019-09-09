# eio.slack-connector - Slack-Connector

Integration component for sending messages to a Slack channel via Incoming WebHook: https://api.slack.com/incoming-webhooks

## Configuration

The connector requires neither ENV variables nor Credentials to be configured.


## Actions/Triggers

The component contains only one action for sending mails:
```shell
sendMessage.js
```

### sendMessage.js

Actions that sends a message to Slack using various parameters to be set during flow configuration. The action allows to set the WebHook URL, Slack Channel, Username, Emoji and Text to be set.

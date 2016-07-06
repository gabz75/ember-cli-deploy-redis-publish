# Ember-cli-deploy-redis-publish

Upon activation this ember-cli-deploy plugin publishes an event on redis based on your configuration.

## Requirements

You need to provide your redis configuration in `config/deploy.js` (same than [ember-cli-deploy-redis](https://github.com/ember-cli-deploy/ember-cli-deploy-redis))

```
ENV.redis = {
  host: '<your-redis-host>',
  port: <your-redis-port>,
  password: '<your-redis-password>'
}

```

## Quick Start

Run the following command in your terminal

```
ember install ember-cli-deploy-redis-publish
```

In your `config/deploy.js`, add one or more configuration object.

```
ENV.redisPublish = [
  {
    channel: '<your-channel-name>',
    message: '<your-message>'
  },
  {
    channel: '<your-channel-name>',
    message: { '<some-key>': '<some-value>' } // will be serialized through JSON.stringify
  }
]
```


## TODO

* Add tests

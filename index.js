/* jshint node: true */
'use strict';

const DeployPluginBase = require('ember-cli-deploy-plugin');
const Promise = require('ember-cli/lib/ext/promise');
const redis = require('redis');

module.exports = {
  name: 'ember-cli-deploy-redis-publish',

  createDeployPlugin: function(options) {
    const DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        host: function(context) {
          if (context.config.redis &&  context.config.redis.host) {
            return context.config.redis.host;
          }

          throw new Error('Missing configuration for redis.host');
        },

        port: function(context) {
          if (context.config.redis &&  context.config.redis.port) {
            return context.config.redis.port;
          }

          throw new Error('Missing configuration for redis.port');
        },

        password: function(context) {
          if (context.config.redis &&  context.config.redis.password) {
            return context.config.redis.password;
          }

          throw new Error('Missing configuration for redis.password');
        },

        events: function(context) {
          if (context.config.redisPublish) {
            return context.config.redisPublish;
          }

          throw new Error('Missing configuration for redisPublish');
        },
      },

      requiredConfig: ['host', 'port', 'password', 'events'],

      didActivate: function() {
        const redisConfig = {
          host: this.readConfig('host'),
          port: this.readConfig('port'),
          password: this.readConfig('password'),
        };

        const client = redis.createClient(redisConfig);
        const promises = this.readConfig('events').map((event) => {
          return new Promise((resolve, reject) => {
            let message;

            if (typeof message === Object) {
              message = JSON.stringify(event.message);
            } else {
              message = event.message;
            }


            if (!message || !event.channel) {
              return reject(new Error('invalid configuration for redisPublish'));
            }

            client.publish(event.channel, message, (err, response) => {
              if (err) {
                return reject(err);
              }

              this.log(`Redis publish on channel: ${event.channel}, message: ${message}`);

              return resolve(response);
            });
          });
        });

        return Promise.all(promises);
      },
    });
    return new DeployPlugin();
  },
};

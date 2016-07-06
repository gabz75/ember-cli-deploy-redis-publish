/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var Promise = require('ember-cli/lib/ext/promise');
var redis = require('redis');

module.exports = {
  name: 'ember-cli-deploy-redis-publish',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        host: function(context) {
          return context.config.redis.host;
        },

        port: function(context) {
          return context.config.redis.port;
        },

        password: function(context) {
          return context.config.redis.password;
        },

        events: function(context) {
          return context.config.redisPublish;
        },
      },

      requiredConfig: ['host', 'port', 'password', 'events'],

      didActivate: function() {
        var redisConfig = {
          host: this.readConfig('host'),
          port: this.readConfig('port'),
          password: this.readConfig('password'),
        };

        var client = redis.createClient(redisConfig);
        var events = this.readConfig('events');
        var promises = events.map(function(event) {
          return new Promise(function(resolve, reject) {
            var message = JSON.stringify(event.message);
            client.publish(event.channel, message, function (err, response) {
              if (err) {
                return reject(err);
              }

              this.log(`Redis publish on channel: ${event.channel}, message: ${message}`);

              return resolve(response);
            }.bind(this));
          }.bind(this));
        }.bind(this));

        return Promise.all(promises);
      },
    });
    return new DeployPlugin();
  },
};

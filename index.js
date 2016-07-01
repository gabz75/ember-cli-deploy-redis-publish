/* jshint node: true */
'use strict';

var DeployPluginBase = require('ember-cli-deploy-plugin');
var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  name: 'ember-cli-deploy-redis-publish',

  createDeployPlugin: function(options) {
    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,

      // note: most plugins can simply implement these next two properties and use
      // the base class' implementation of the `configure` hook
      defaultConfig: {
        someKey: 'defaultValue',
        anotherKey: function(context) {
          return context.anotherKey; // to use data added to the context by another plugin
        }
      },
      requiredConfig: ['redis'], // throw an error if this is not configured

      // implement any hooks appropriate for your plugin
      willUpload: function(context) {
        // Use the `readConfig` method for uniform access to this plugin's config,
        // whether via a dynamic function or a configured value
        var redis = this.readConfig('redis');

        // Use the `log` method to generate output consistent with the tree style
        // of ember-cli-deploy's verbose output
        this.log(redis);

        // Need to do something async? You can return a promise.
        // Need to fail out? Throw an error or return a promise which becomes rejected
        return Promise.resolve();
      },
    });
    return new DeployPlugin();
  }
};

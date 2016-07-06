/* jshint node: true */
/* jshint jasmine: true */
'use strict';

var assert = require('../helpers/assert');
var chai = require('chai');

var stubProject = {
  name: function(){
    return 'my-project';
  }
};

describe('ember-cli-deploy-redis-publish plugin', function() {
  var subject, mockUi;

  beforeEach(function() {
    subject = require('../../index');
    mockUi = {
      verbose: true,
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
  });

  it('implements the didActivate', function() {
    var plugin = subject.createDeployPlugin({
      name: 'mock-plugin'
    });
    assert.ok(plugin.didActivate);
  });

  describe('configure hook', function() {
    it('throw an error if redis is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish'
      });

      var context = {
        ui: mockUi,
        project: stubProject,
        config: {}
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.host');
    });

    it('throw an error if redis.host is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish'
      });

      var context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {}
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.host');
    });

    it('throw an error if redis.port is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish'
      });

      var context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {
            host: '127.0.0.1',
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.port');
    });

    it('throw an error if redis.password is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish'
      });

      var context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {
            host: '127.0.0.1',
            port: 6379,
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.password');
    });

    it('throw an error if redisPublish is missing', function() {
      var plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish'
      });

      var context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {
            host: '127.0.0.1',
            port: 6379,
            password: 'foobar'
          }
        }
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redisPublish');
    });

    // it('throw an error if one redisPublish object does not have a channel', function() {
    //   var plugin = subject.createDeployPlugin({
    //     name: 'ember-cli-deploy-redis-publish'
    //   });

    //   var context = {
    //     ui: mockUi,
    //     project: stubProject,
    //     config: {
    //       redis: {
    //         host: '127.0.0.1',
    //         port: 6379,
    //         password: 'foobar'
    //       },
    //       redisPublish: [
    //         {
    //           message: 'bar',
    //         }
    //       ]
    //     },
    //     _redisLib: new FakeRedisLib(),
    //   };

    //   plugin.beforeHook(context);
    //   plugin.configure(context);
    //   chai.expect(() => {
    //     plugin.didActivate(context);
    //   }).to.throw('invalid configuration for redisPublish');
    // });
  });

  // describe('didActivate hook', function() {
  //   it('prints messages about published events', function() {
  //     // var messageOutput = '';

  //     // var plugin = subject.createDeployPlugin({
  //     //   name: 'redis'
  //     // });
  //     // plugin.upload = function(){};
  //     // plugin.activate = function(){};

  //     // var context = {
  //     //   deployTarget: 'qa',
  //     //   ui: {
  //     //     write: function(message){
  //     //       messageOutput = messageOutput + message;
  //     //     },
  //     //     writeLine: function(message){
  //     //       messageOutput = messageOutput + message + '\n';
  //     //     }
  //     //   },
  //     //   project: stubProject,
  //     //   config: {
  //     //     redis: { }
  //     //   },
  //     //   revisionData: {
  //     //     revisionKey: '123abc',
  //     //   }
  //     // };
  //     // plugin.beforeHook(context);
  //     // plugin.configure(context);
  //     // plugin.beforeHook(context);
  //     // plugin.didDeploy(context);
  //     // assert.match(messageOutput, /Deployed but did not activate revision 123abc./);
  //     // assert.match(messageOutput, /To activate, run/);
  //     // assert.match(messageOutput, /ember deploy:activate qa --revision=123abc/);

  //     assert.ok(true);
  //   });
  // });
});

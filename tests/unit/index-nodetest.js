/* jshint node: true */
/* jshint jasmine: true */
'use strict';

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const assert = chai.assert;

const stubProject = {
  name() {
    return 'my-project';
  },
};

describe('ember-cli-deploy-redis-publish plugin', () => {
  let subject;
  let mockUi;

  beforeEach(() => {
    subject = require('../../index');
    mockUi = {
      verbose: true,
      messages: [],
      write() { },

      writeLine(message) {
        this.messages.push(message);
      },
    };
  });

  it('implements the didActivate', () => {
    let plugin = subject.createDeployPlugin({
      name: 'mock-plugin',
    });
    assert.ok(plugin.didActivate);
  });

  describe('configure hook', () => {
    it('throw an error if redis is missing', () => {
      let plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish',
      });

      let context = {
        ui: mockUi,
        project: stubProject,
        config: {},
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.host');
    });

    it('throw an error if redis.host is missing', () => {
      let plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish',
      });

      let context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {},
        },
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.host');
    });

    it('throw an error if redis.port is missing', () => {
      let plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish',
      });

      let context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {
            host: '127.0.0.1',
          },
        },
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.port');
    });

    it('throw an error if redis.password is missing', () => {
      let plugin = subject.createDeployPlugin({
        name: 'ember-cli-deploy-redis-publish',
      });

      let context = {
        ui: mockUi,
        project: stubProject,
        config: {
          redis: {
            host: '127.0.0.1',
            port: 6379,
          },
        },
      };

      plugin.beforeHook(context);
      plugin.configure(context);
      chai.expect(() => {
        plugin.didActivate(context);
      }).to.throw('Missing configuration for redis.password');
    });
  });
});

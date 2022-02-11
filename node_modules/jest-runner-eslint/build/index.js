'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const throat = require('throat');
const pify = require('pify');
const workerFarm = require('worker-farm');
const path = require('path');

const TEST_WORKER_PATH = path.join(__dirname, 'runESLint.js');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

module.exports = class ESLintTestRunner {
  constructor(globalConfig) {
    this._globalConfig = globalConfig;
  }

  // eslint-disable-next-line
  runTests(tests, watcher, onStart, onResult, onFailure) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const farm = workerFarm({
        autoStart: true,
        maxConcurrentCallsPerWorker: 1,
        maxConcurrentWorkers: _this._globalConfig.maxWorkers,
        maxRetries: 2 // Allow for a couple of transient errors.
      }, TEST_WORKER_PATH);

      const mutex = throat(_this._globalConfig.maxWorkers);
      const worker = pify(farm);

      const runTestInWorker = function runTestInWorker(test) {
        return mutex(_asyncToGenerator(function* () {
          if (watcher.isInterrupted()) {
            throw new CancelRun();
          }
          yield onStart(test);
          return worker({
            config: test.context.config,
            globalConfig: _this._globalConfig,
            testPath: test.path,
            rawModuleMap: watcher.isWatchMode() ? test.context.moduleMap.getRawModuleMap() : null
          });
        }));
      };

      const onError = (() => {
        var _ref2 = _asyncToGenerator(function* (err, test) {
          yield onFailure(test, err);
          if (err.type === 'ProcessTerminatedError') {
            // eslint-disable-next-line no-console
            console.error('A worker process has quit unexpectedly! ' + 'Most likely this is an initialization error.');
            process.exit(1);
          }
        });

        return function onError(_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      })();

      const onInterrupt = new Promise(function (_, reject) {
        watcher.on('change', function (state) {
          if (state.interrupted) {
            reject(new CancelRun());
          }
        });
      });

      const runAllTests = Promise.all(tests.map(function (test) {
        return runTestInWorker(test).then(function (testResult) {
          return onResult(test, testResult);
        }).catch(function (error) {
          return onError(error, test);
        });
      }));

      const cleanup = function cleanup() {
        return workerFarm.end(farm);
      };

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    })();
  }
};
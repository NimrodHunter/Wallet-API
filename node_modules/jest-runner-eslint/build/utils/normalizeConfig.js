'use strict';

const identity = v => v;
const negate = v => !v;
const asArray = v => typeof v === 'string' ? [v] : v;

const BASE_CONFIG = {
  cacheLocation: {
    default: '.eslintcache'
  },
  config: {
    name: 'configFile',
    default: null
  },
  env: {
    name: 'envs',
    default: [],
    transform: asArray
  },
  ext: {
    name: 'extensions',
    default: ['.js'],
    transform: asArray
  },
  fix: {
    default: false
  },
  global: {
    name: 'globals',
    default: [],
    transform: asArray
  },
  ignorePath: {
    default: null
  },
  noEslintrc: {
    name: 'useEslintrc',
    default: false,
    transform: negate
  },
  noIgnore: {
    name: 'ignore',
    default: false,
    transform: negate
  },
  noInlineConfig: {
    name: 'allowInlineConfig',
    default: false,
    transform: negate
  },
  parser: {
    default: 'espree'
  },
  parserOptions: {
    default: {}
  },
  plugin: {
    name: 'plugins',
    default: [],
    transform: asArray
  },
  rule: {
    name: 'rules',
    default: null,
    transform: asArray
  },
  rulesdir: {
    name: 'rulePaths',
    default: [],
    transform: asArray
  }
};

/* eslint-disable no-param-reassign */
const normalizeCliOptions = rawConfig => Object.keys(BASE_CONFIG).reduce((config, key) => {
  var _BASE_CONFIG$key = BASE_CONFIG[key],
      _BASE_CONFIG$key$name = _BASE_CONFIG$key.name;
  const name = _BASE_CONFIG$key$name === undefined ? key : _BASE_CONFIG$key$name;
  var _BASE_CONFIG$key$tran = _BASE_CONFIG$key.transform;
  const transform = _BASE_CONFIG$key$tran === undefined ? identity : _BASE_CONFIG$key$tran,
        defaultValue = _BASE_CONFIG$key.default;


  const value = rawConfig[key] !== undefined ? rawConfig[key] : defaultValue;

  return Object.assign({}, config, {
    [name]: transform(value)
  });
}, {});
/* eslint-enable no-param-reassign */

const normalizeConfig = config => {
  return Object.assign({}, config, {
    cliOptions: normalizeCliOptions(config.cliOptions || {})
  });
};

module.exports = normalizeConfig;
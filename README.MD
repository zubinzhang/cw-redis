# redis 组件

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/cw-redis.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cw-redis
[travis-image]: https://img.shields.io/travis/zubincheung/cw-redis.svg?style=flat-square
[travis-url]: https://travis-ci.org/zubincheung/cw-redis
[codecov-image]: https://img.shields.io/codecov/c/github/zubincheung/cw-redis.svg?style=flat-square
[codecov-url]: https://codecov.io/github/zubincheung/cw-redis?branch=master
[david-image]: https://img.shields.io/david/zubincheung/cw-redis.svg?style=flat-square
[david-url]: https://david-dm.org/zubincheung/cw-redis
[snyk-image]: https://snyk.io/test/npm/cw-redis/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/cw-redis
[download-image]: https://img.shields.io/npm/dm/cw-redis.svg?style=flat-square
[download-url]: https://npmjs.org/package/cw-redis

cw-redis 是基于[ioredis](https://github.com/luin/ioredis)封装的 [Redis](http://redis.io)组件,推荐[Node](https://nodejs.org)版本 8LTS 以上

## 安装

```shell
npm install --save cw-redis
```

## 使用方法

```javascript
var Redis = require('cw-redis');
var redis = Redis.init({});

redis.set('key', 'value');
redis.get('key', function(err, result) {
  console.log(result);
});

redis.get('key').then(function(result) {
  console.log(result);
});

redis.set('key', 100, 'EX', 10);

await redis.setData('test', 'hello', 60);
const data = await redis.get('test');

redis.sadd('set', 1, 3, 5, 7);
redis.sadd('set', [1, 3, 5, 7]);
```

详情请参考[ioredis](https://github.com/luin/ioredis) ,[redis 官网](https://redis.io)

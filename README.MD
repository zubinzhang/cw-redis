# redis组件
cw-redis是基于[ioredis](https://github.com/luin/ioredis)封装的 [Redis](http://redis.io)组件,推荐[Node](https://nodejs.org)版本8LTS以上

## 安装
``` shell
npm install --save cw-redis
```
## 使用方法
```javascript
var Redis = require('cw-redis');
var redis = Redis.init({});

redis.set('key', 'value');
redis.get('key', function (err, result) {
  console.log(result);
});

redis.get('key').then(function (result) {
  console.log(result);
});

redis.set('key', 100, 'EX', 10);

await redis.setData('test', 'hello', 60);
const data = await redis.get('test');


redis.sadd('set', 1, 3, 5, 7);
redis.sadd('set', [1, 3, 5, 7]);
```

详情请参考[ioredis](https://github.com/luin/ioredis) ,[redis官网](https://redis.io)

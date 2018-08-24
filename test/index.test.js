const Redis = require('../index');

describe('redis test', () => {
  it('set:', async () => {
    const redis = Redis.init({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });
    await redis.setData('test', 'hello', 60);
    await redis.setData('test1', 'hello', 60);
    await redis.setData('test2', 'hello', 60);
    await redis.setData('test3', 'hello', 60);

    expect(redis.get('test')).resolves.toBe('hello');
  });

  it('getJson:', async () => {
    const redis = Redis.init({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });
    await redis.setData('b', JSON.stringify({ a: 1 }), 60);

    expect(redis.getJsonData('b')).resolves.toEqual({ a: 1 });

    await redis.setData('c', '{a:12}', 60);
    expect(redis.getJsonData('c')).resolves.toEqual(null);
  });

  it('delete:', async () => {
    const redis = Redis.init({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });

    const result = await redis.deleteKey('test');
    expect(result.rows).toBe(1);
  });

  it('deleteMany:', async () => {
    const redis = Redis.init({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });

    const result = await redis.deleteKey('test*');
    expect(result.rows).toBe(3);
  });

  it('deleteMany2:', async () => {
    const redis = new Redis({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: 'prefix',
    });

    const tasks = [];
    for (let i = 0; i < 1000; i++) {
      tasks.push(redis.setData(`test:${i}`, 'hello', 60));
    }

    await Promise.all(tasks);

    const result = await redis.deleteKey('*test*');
    expect(result.rows).toBe(1000);
  });

  it('should deleteKey not found key', async () => {
    const redis = Redis.init({
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });
    const r = await redis.deleteKey('*head*');
    expect(r).toEqual({ keys: [], rows: 0 });
  });
});

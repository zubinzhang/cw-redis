const Redis = require('../index');

const redis = Redis.init({
  host: '127.0.0.1',
  port: 6379,
  password: '',
  db: 0,
  connectTimeout: 1000,
  lazyConnect: false,
  keyPrefix: '',
});

describe('redis test', () => {
  afterAll(() => {
    return redis.end();
  });
  it('set:', async () => {
    await redis.setData('test', 'hello', 60);
    await redis.setData('test1', 'hello', 60);
    await redis.setData('test2', 'hello', 60);
    await redis.setData('test3', 'hello', 60);

    expect(redis.get('test')).resolves.toBe('hello');
  });

  it('getJson:', async () => {
    await redis.setData('b', JSON.stringify({ a: 1 }), 60);

    expect(redis.getJsonData('b')).resolves.toEqual({ a: 1 });

    await redis.setData('c', '{a:12}', 60);
    expect(redis.getJsonData('c')).resolves.toEqual(null);
  });

  it('delete:', async () => {
    const result = await redis.deleteKey('test');
    expect(result.rows).toBe(1);
  });

  it('deleteMany:', async () => {
    const result = await redis.deleteKey('test*');
    expect(result.rows).toBe(3);
  });

  it('deleteMany2:', async () => {
    const r = new Redis({
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
      tasks.push(r.setData(`test:${i}`, 'hello', 60));
    }

    await Promise.all(tasks);

    const result = await r.deleteKey('*test*');
    expect(result.rows).toBe(1000);

    await r.end();
  });

  it('should deleteKey not found key', async () => {
    const r = await redis.deleteKey('*head*');
    expect(r).toEqual({ keys: [], rows: 0 });
  });
});

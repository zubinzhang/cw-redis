import Redis from '../src';
import { expect } from 'chai';

describe('redis test', () => {
  it('set:', async () => {
    const redis = Redis.init({
      host: '192.168.2.163',
      port: 6379,
      password: 'ciwongrds',
      db: 5,
      connectTimeout: 1000,
      lazyConnect: false,
      keyPrefix: '',
    });
    await redis.set('test', 'hello', 'EX', 60);
    const data = await redis.get('test');
    expect(data).to.eq('hello');
  });
});

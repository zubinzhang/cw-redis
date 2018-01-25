/*
 * Created by Zubin on 2017-11-03 12:00:10
 */

const Redis = require('ioredis');

/**
 * redis操作类
 */
class RedisHelper extends Redis {

  /**
   * 初始化redis
   */
  static init(config) {
    if (!RedisHelper[`db${config.db || ''}`]) {
      let server;
      config.retryStrategy = (times) => {
        if (times <= 5) {
          console.info(`重连次数${times}`);
          return times;
        }
        if (!server) return 0;
        server.disconnect();
        console.info('redis将在10分钟之后重新尝试建立连接');
        setTimeout(() => {
          console.info('redis正在尝试重新建立连接');
          server = new RedisHelper(config);
        }, 1000 * 60 * 10);

        return 240;
      };

      server = new RedisHelper(config);
      server.on('connect', () => {
        console.info('redis正在连接中...');
      });

      server.on('error', (err) => {
        console.error(`redis连接错误[error]:${err.toString()}`);
      });

      server.on('ready', () => {
        console.info('redis连接已就绪...');
      });

      server.on('close', () => {
        console.info('redis连接已关闭...');
      });

      server.on('reconnecting', () => {
        console.info('redis正在尝试重连...');
      });

      server.on('end', () => {
        console.info('redis连接已经释放');
      });

      RedisHelper[`db${config.db || ''}`] = server;
    }
    return RedisHelper[`db${config.db || ''}`];
  }


  constructor(options) {
    super(options);
    this.config = options;
  }

  /**
   * 获取json数据
   *
   * @param {string} key
   * @returns
   * @memberof RedisHelper
   */
  async getJsonData(key) {
    let data = null;
    try {
      data = await this.get(key);
      data = JSON.parse(data);
    } catch (error) {
      console.error(`获取缓存错误：${error}`);
      // 非必要信息，获取异常忽略就好
      data = null;
    }
    return data;
  }

  /**
   * 设置指定 key 的值
   *
   * @param {string} key
   * @param {string} value
   * @param {number} expire 过期时间[s]
   * @returns
   * @memberof RedisHelper
   */
  setData(key, value, expire) {
    return super.set(key, value, 'EX', expire);
  }

  /**
   * 删除符合条件的key
   * eg：deleteKey('a')  deleteKey('*a*')
   *
   * @param {any} keyStr
   * @memberof RedisHelper
   */
  async deleteKey(keyStr) {

    // 查询符合所有条件的所有key
    let [cursor, matchKeys] = await super.scan(0, 'COUNT', '200', 'MATCH', keyStr);
    let rows = 0;

    while (cursor.toString() !== '0') {
      const r = await super.scan(cursor, 'COUNT', '200', 'MATCH', keyStr);
      cursor = r[0];
      matchKeys = [...matchKeys, ...r[1]];
    }

    // 如果有前缀，删除前缀
    if (this.config.keyPrefix) matchKeys = matchKeys.map(item => item.replace(this.config.keyPrefix, ''));
    if (matchKeys.length > 0) {
      rows = await super.del(...matchKeys);
    }

    return { rows, keys: matchKeys };
  }
}

exports = module.exports = RedisHelper;

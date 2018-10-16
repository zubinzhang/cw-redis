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
    const instance = `${config.host}#db${config.db}`;
    if (!RedisHelper[instance]) {
      const server = new RedisHelper(config);

      RedisHelper[instance] = server;
    }
    return RedisHelper[instance];
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
    let [cursor, matchKeys] = await super.scan(0, 'MATCH', keyStr);
    let rows = 0;

    while (cursor.toString() !== '0') {
      // eslint-disable-next-line no-await-in-loop
      const r = await super.scan(cursor, 'MATCH', keyStr);

      // eslint-disable-next-line prefer-destructuring
      cursor = r[0];
      matchKeys = [...matchKeys, ...r[1]];
    }

    // 如果有前缀，删除前缀
    if (this.config.keyPrefix) {
      matchKeys = matchKeys.map(item => item.replace(this.config.keyPrefix, ''));
    }

    if (matchKeys.length > 0) {
      rows = await super.del(...matchKeys);
    }

    return { rows, keys: matchKeys };
  }
}

module.exports = RedisHelper;

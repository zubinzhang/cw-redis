/// <reference types="ioredis" />
import * as Redis from 'ioredis';

import { RedisOptions } from 'ioredis';

interface IDeleteResult {
  [x: string]: any;
  rows: number;
  keys: string[];
}

/**
 * redis操作类
 */
declare class RedisHelper extends Redis {
  static db: RedisHelper;
  /**
   * 初始化redis
   */
  static init(config: RedisOptions): RedisHelper;
  private constructor();
  /**
   * 获取json数据
   *
   * @param {string} key
   * @returns
   * @memberof RedisHelper
   */
  getJsonData(key: string): Promise<any>;
  /**
   * 设置指定 key 的值
   *
   * @param {string} key
   * @param {string} value
   * @param {number} expire 过期时间[s]
   * @returns
   * @memberof RedisHelper
   */
  setData(key: string, value: string, expire: number): any;

  /**
 * 删除符合条件的key
 * eg：deleteKey('a')  deleteKey('*a*')
 *
 * @param {string} keyStr
 * @memberof RedisHelper
 */
  async deleteKey(keyStr: string): IDeleteResult;
}
export = RedisHelper;

declare module RedisHelper { }

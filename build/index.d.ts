/// <reference types="ioredis" />
import * as Redis from 'ioredis';
import { RedisOptions } from 'ioredis';
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
}
export default RedisHelper;

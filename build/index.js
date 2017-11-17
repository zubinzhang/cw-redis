"use strict";
/*
 * Created by Zubin on 2017-11-03 12:00:10
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Redis = require("ioredis");
/**
 * redis操作类
 */
class RedisHelper extends Redis {
    /**
     * 初始化redis
     */
    static init(config) {
        if (!RedisHelper.db) {
            let server;
            config.retryStrategy = (times) => {
                if (times <= 5) {
                    console.info(`重连次数${times}`);
                    return times;
                }
                if (!server)
                    return 0;
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
            RedisHelper.db = server;
        }
        return RedisHelper.db;
    }
    constructor(options) {
        super(options);
    }
    /**
     * 获取json数据
     *
     * @param {string} key
     * @returns
     * @memberof RedisHelper
     */
    getJsonData(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = null;
            try {
                data = yield this.get(key);
                data = JSON.parse(data);
            }
            catch (error) {
                console.error(`获取缓存错误：${error}`);
                // 非必要信息，获取异常忽略就好
                data = null;
            }
            return data;
        });
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
}
exports.default = RedisHelper;
//# sourceMappingURL=index.js.map
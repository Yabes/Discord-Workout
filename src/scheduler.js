// External import
import CronParser from 'cron-parser';

// Internal import
import ServerConfig from './server-config';
import * as Utils from './utils';

/**
 * @class Scheduler
 */

export default class Scheduler {
  /**
   * @method getNextTiming
   * @desc check against server config to deliver the next, authorised, session in ms
   * @param {String} serverID server id
   * @return {number} timing in ms
   */
  static getNextTiming (serverID) {
    const serverConfig = ServerConfig.getConfig(serverID);

    const offset = Utils.random(-serverConfig.DELAY_OFFSET, serverConfig.DELAY_OFFSET);
    let timing = serverConfig.DELAY + offset;

    // Check if next timing is corresponding to the cron expression
    const now = Date.now();
    const nextTiming = now + timing;
    const parserOptions = {
      currentDate: new Date(nextTiming - 60 * 1000),
      endDate: new Date(nextTiming + 60 * 1000),
      iterator: true
    };

    const cronExpression = serverConfig.CRON_EXPRESSION;
    let interval = CronParser.parseExpression(cronExpression, parserOptions);

    if (!interval.hasNext()) {
      delete parserOptions.endDate;
      interval = CronParser.parseExpression(cronExpression, parserOptions);
      let obj = interval.next();

      timing = obj.value.getTime() - now;
    }

    return timing;
  }
}

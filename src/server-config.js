// Config import
import CONFIG from '../config';

/**
 * @typedef ServerConfig
 * @type Object
 * @prop {String}  CRON_EXPRESSION - The cron expression regulating the exercices
 * @prop {Boolean} EXERCISE_AT_STARTUP - Does it need to launch an exercice at startup?
 * @prop {Number}  DELAY - Delay in ms between two exercices
 * @prop {Number}  DELAY_OFFSET - Variable part of the delay
 * @prop {Number}  LEVEL - server's specific level
 */

/**
 * @type ServerConfig
 */
const serverConfigDefaults = {
  CRON_EXPRESSION: "* * * * *",
  EXERCISE_AT_STARTUP: true,
  DELAY: 30 * 60 * 1000,
  DELAY_OFFSET: 5 * 50 * 1000,
  LEVEL: 1.0
};

/**
 * @class ServerConfig
 */
export default class ServerConfig {
  /**
   * @static getConfig
   * @desc return the server's config
   * @param {String} serverID
   * @return {ServerConfig}
   */
  static getConfig (serverID) {
    const serverConfig = {};

    for (let key in serverConfigDefaults) {
      let serverSpecificConfig = CONFIG.SERVERS[serverID][key];
      serverConfig[key] =  serverSpecificConfig !== undefined ? serverSpecificConfig : serverConfigDefaults[key];
    }

    return serverConfig;
  }
}

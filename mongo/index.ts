import mongoClass from "./src/mongo";
import { logger } from "../src/utils";

const initialize = async (config) => {
    try {
        const mongoDriver = new mongoClass();
        await mongoDriver.initializeDriver(config);
        return mongoDriver.getMongoInstance();
    } catch (error) {
        logger.error(`MONGO_CONNECTOR :: Error connecting to Mongo ${JSON.stringify(error.message)}`);
    }
};
export default {
    initialize
};

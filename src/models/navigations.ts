import { config, Connections, constants } from "../utils";
import * as mongoose from "mongoose";

export interface Navigation {
    name: string;
    responseStart: number;
    responseEnd: number;
    fetchStart: number;
    navigationStart: number;
    initiatorType: string;
    type: string;
    connectStart: number;
    connectEnd: number;
    domComplete: number;
    domContentLoadedEventEnd: number;
    domContentLoadedEventStart: number;
    loadEventEnd: number;
    loadEventStart: number;
    duration: number;
    requestStart: number;
    requestEnd: number;
    unloadEventEnd: number;
    unloadEventStart: number;
    ttfb: number;
    domInteractive: number;
    pageLoadTime: number;
}

export default class Navigations {
    public static Navigations;
    private navigationModel;
    readonly collectionName;

    constructor() {
        this.collectionName = config.databases.mongo.navigation_collection;
        this.setDbModel();
    }

    public static getInstance(): Navigations {
        if (!this.Navigations) {
            this.Navigations = new Navigations();
            return this.Navigations;
        }
        return this.Navigations;
    }

    private setDbModel() {
        const mongoConnection = Connections.get(constants.CONNECTIONS.MONGO);
        const Schema = mongoose.Schema;
        const bodDetailsSchema = new Schema<Navigation>(
            {
                name: {type: String},
                responseStart: {type: Number},
                responseEnd: {type: Number},
                fetchStart: {type: Number},
                navigationStart: {type: Number},
                initiatorType: {type: String},
                type: {type: String},
                connectStart: {type: Number},
                connectEnd: {type: Number},
                domComplete: {type: Number},
                domContentLoadedEventEnd: {type: Number},
                domContentLoadedEventStart: {type: Number},
                domInteractive: {type: Number},
                loadEventEnd: {type: Number},
                loadEventStart: {type: Number},
                duration: {type: Number},
                requestStart: {type: Number},
                requestEnd: {type: Number},
                unloadEventEnd: {type: Number},
                unloadEventStart: {type: Number},
                ttfb: {type: Number},
                pageLoadTime: {type: Number},
            },
            {timestamps: true}
        );
        this.navigationModel = mongoConnection.model(
            this.collectionName,
            bodDetailsSchema
        );
    }

    public async getAllNavigations(startDate?: Date, endDate?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0}, createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async getDOMNavigations(startDate?: Date, endDate?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0},
            initiatorType: {
                $in: ["DomContentLoaded", "DomContentLoad", "readystatechange interactive", "readystatechange complete"]
            },
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async getWindowNavigations(startDate?: Date, endDate?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0},
            initiatorType: {
                $in: ["window_load"]
            },
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async getAllNavigationsTTFBs(startDate ?: Date, endDate ?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0},
            initiatorType: {
                $nin: ["window_load", "DomContentLoad", "readystatechange"]
            },
            createdAt: {
                $gt: startDate,
                $lt: endDate
            }
        };
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async addNavigation(navigation: Navigation, callback: Function) {
        const _nav = new this.navigationModel(navigation);
        _nav.save(function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return true;
    }

    public async addNavigations(navigations: Navigation[], callback: Function) {
        this.navigationModel.insertMany(navigations, function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return true;
    }
}

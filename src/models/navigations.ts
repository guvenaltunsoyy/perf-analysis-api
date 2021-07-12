import { config, Connections, constants } from "../utils";
import * as mongoose from "mongoose";

export interface Navigation {
    name: { type: String; required: true };
    responseStart: { type: Number; required: true };
    responseEnd: { type: Number; required: true };
    fetchStart: { type: Number; required: true };
    navigationStart: { type: Number; required: false };
    initiatorType: { type: String };
    type: { type: String };
    connectStart: { type: Number; required: false };
    connectEnd: { type: Number; required: false };
    domComplete: { type: Number; required: false };
    domContentLoadedEventEnd: { type: Number; required: false };
    domContentLoadedEventStart: { type: Number; required: false };
    loadEventEnd: { type: Number; required: false };
    loadEventStart: { type: Number; required: false };
    duration: { type: Number; required: false };
    requestStart: { type: Number; required: false };
    requestEnd: { type: Number; required: false };
    unloadEventEnd: { type: Number; required: false };
    unloadEventStart: { type: Number; required: false };
    ttfb: { type: Number; required: false };
    domInteractive: { type: Number; required: false };
    pageLoadTime: { type: Number };
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
                name: {type: String, required: true},
                responseStart: {type: Number, required: true},
                responseEnd: {type: Number, required: true},
                fetchStart: {type: Number, required: true},
                navigationStart: {type: Number, required: false},
                initiatorType: {type: String},
                type: {type: String},
                connectStart: {type: Number, required: false},
                connectEnd: {type: Number, required: false},
                domComplete: {type: Number, required: false},
                domContentLoadedEventEnd: {type: Number, required: false},
                domContentLoadedEventStart: {type: Number, required: false},
                domInteractive: {type: Number, required: false},
                loadEventEnd: {type: Number, required: false},
                loadEventStart: {type: Number, required: false},
                duration: {type: Number, required: false},
                requestStart: {type: Number, required: false},
                requestEnd: {type: Number, required: false},
                unloadEventEnd: {type: Number, required: false},
                unloadEventStart: {type: Number, required: false},
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
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: -1});
    }

    public async getDOMNavigations(startDate?: Date, endDate?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0},
            initiatorType: {
                $in: ["DomContentLoad", "readystatechange"]
            },
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: -1});
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
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: -1});
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
        return await this.navigationModel.find(queryFilter, {}, {lean: true}).sort({createdAt: -1});
    }

    public async addNavigation(navigation: Navigation, callback: Function) {
        const _nav = new this.navigationModel(navigation);
        _nav.save(function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return _nav;
    }
}

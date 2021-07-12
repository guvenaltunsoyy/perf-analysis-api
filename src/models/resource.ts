import { config, Connections, constants } from "../utils";
import * as mongoose from "mongoose";

export interface Resource {
    name: { type: String; required: true };
    responseStart: { type: Number; required: true };
    responseEnd: { type: Number; required: true };
    fetchStart: { type: Number; required: true };
    initiatorType: { type: String };
    entryType: { type: String };
    connectStart: { type: Number; required: false };
    connectEnd: { type: Number; required: false };
    duration: { type: Number; required: false };
    requestStart: { type: Number; required: false };
    requestEnd: { type: Number; required: false };
    startTime: { type: Number; required: false };
    ttfb: { type: Number };

}

export default class Resources {
    public static Resources;
    private resourceModel;
    readonly collectionName;

    constructor() {
        this.collectionName = config.databases.mongo.resource_collection;
        this.setDbModel();
    }

    public static getInstance(): Resources {
        if (!this.Resources) {
            this.Resources = new Resources();
            return this.Resources;
        }
        return this.Resources;
    }

    private setDbModel() {
        const mongoConnection = Connections.get(constants.CONNECTIONS.MONGO);
        const Schema = mongoose.Schema;
        const bodDetailsSchema = new Schema<Resource>(
            {
                name: {type: String, required: true},
                responseStart: {type: Number, required: true},
                responseEnd: {type: Number, required: true},
                fetchStart: {type: Number, required: true},
                initiatorType: {type: String},
                entryType: {type: String},
                connectStart: {type: Number, required: false},
                connectEnd: {type: Number, required: false},
                duration: {type: Number, required: false},
                requestStart: {type: Number, required: false},
                requestEnd: {type: Number, required: false},
                startTime: {type: Number, required: false},
                ttfb: {type: Number},

            },
            {timestamps: true}
        );
        this.resourceModel = mongoConnection.model(
            this.collectionName,
            bodDetailsSchema
        );
    }

    public async getAllResources(startDate ?: Date, endDate ?: Date) {
        const queryFilter = {
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.resourceModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async getAllResourcesTTFBs(startDate ?: Date, endDate ?: Date) {
        const queryFilter = {
            ttfb: {$gt: 0},
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        };
        return await this.resourceModel.find(queryFilter, {}, {lean: true}).sort({createdAt: 1});
    }

    public async addResource(resource: Resource, callback: Function) {
        const _nav = new this.resourceModel(resource);
        _nav.save(function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return _nav;
    }
}

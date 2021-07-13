import { config, Connections, constants } from "../utils";
import * as mongoose from "mongoose";

export interface Resource {
    name: string;
    responseStart: number;
    responseEnd: number;
    fetchStart: number;
    initiatorType: string;
    entryType: string;
    connectStart: number;
    connectEnd: number;
    duration: number;
    requestStart: number;
    requestEnd: number;
    startTime: number;
    ttfb: number;

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
        return true;
    }

    public async addResources(resources: Resource[], callback: Function) {
        this.resourceModel.insertMany(resources, function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return true;
    }
}

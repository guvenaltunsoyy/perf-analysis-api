import { config, Connections, constants } from "../utils";
import * as mongoose from "mongoose";

export interface Paint {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
}

export default class Paints {
    public static Paints;
    private paintModel;
    readonly collectionName;

    constructor() {
        this.collectionName = config.databases.mongo.paint_collection;
        this.setDbModel();
    }

    public static getInstance(): Paints {
        if (!this.Paints) {
            this.Paints = new Paints();
            return this.Paints;
        }
        return this.Paints;
    }

    private setDbModel() {
        const mongoConnection = Connections.get(constants.CONNECTIONS.MONGO);
        const Schema = mongoose.Schema;
        const bodDetailsSchema = new Schema<Paint>(
            {
                name: { type: String },
                entryType: { type: String },
                startTime: { type: Number },
                duration: { type: Number },
            },
            { timestamps: true }
        );
        this.paintModel = mongoConnection.model(
            this.collectionName,
            bodDetailsSchema
        );
    }

    public async getAllPaints(startDate?: Date, endDate?: Date) {
        const queryFilter = {
            name: { $eq: "first-contentful-paint" },
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        };
        return await this.paintModel.find(queryFilter, {}, { lean: true });
    }

    public async addPaint(paint: Paint, callback: Function) {
        const _nav = new this.paintModel(paint);
        _nav.save(function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return true;
    }

    public async addPaints(paints: Paint[], callback: Function) {
        this.paintModel.insertMany(paints, function (err, data) {
            if (err) throw err;
            return callback(data);
        });
        return true;
    }
}

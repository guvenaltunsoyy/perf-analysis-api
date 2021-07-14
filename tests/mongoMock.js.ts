import { Connections, constants, mongo } from "../src/utils";

export default async function createConnection() {
    if (Connections.get(constants.CONNECTIONS.MONGO)) {
        return;
    }
    const mongoClient = await mongo.initialize({
        hosts: "boss:6516102Gg@cluster0.tdrcz.mongodb.net",
        port: "27017",
        user: "boss",
        password: "6516102Gg",
        database: "perf_analysis"
    });
    Connections.set(constants.CONNECTIONS.MONGO, mongoClient);
    return mongoClient;
}

export function closeConnection() {
    if (Connections.get(constants.CONNECTIONS.MONGO)) {
        const connection = Connections.get(constants.CONNECTIONS.MONGO);
        connection.close();
    }
}

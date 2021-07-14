import Resources from "../src/models/resource";
import { diffMinutes, halfHourAgo, now, oneHourAgo, tenMinutesAgo } from "./utils";
import createConnection from "./mongoMock.js";

let connection;
describe("resource case", () => {
    const _now = now();
    beforeAll(async () => {
        connection = await createConnection();
    });
    afterAll((done) => {
        connection.close();
        done();
    });
    test("should return empty array", async () => {
        const res = await Resources.getInstance().getAllResourcesTTFBs();
        expect(res).toEqual([]);

    });
    test("should return last one hour events", async () => {
        // @ts-ignore
        const res = await Resources.getInstance().getAllResourcesTTFBs(oneHourAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(60);
        });
    });
    test("should return last 30 minutes events", async () => {
        // @ts-ignore
        const res = await Resources.getInstance().getAllResourcesTTFBs(halfHourAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(30);
        });
    });
    test("should return last 10 minutes events", async () => {
        // @ts-ignore
        const res = await Resources.getInstance().getAllResourcesTTFBs(tenMinutesAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(10);
        });
    });
    test("should return between specifics dates events", async () => {
        // @ts-ignore
        const sDate = new Date() - 5000, eDate = new Date() - 4000;
        // @ts-ignore
        const res = await Resources.getInstance().getAllResourcesTTFBs(new Date(sDate), new Date(eDate));
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, new Date(eDate));
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(4000);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(5000);
        });
    });
    test("add new resource", async () => {
        const resource = {
            name: "test",
            responseStart: 0,
            responseEnd: 0,
            fetchStart: 0,
        };
        jest.useFakeTimers();
        // @ts-ignore
        const res = await Resources.getInstance().addResource(resource, console.log);
        jest.useFakeTimers();
        expect(res).toEqual(true);
    });
});

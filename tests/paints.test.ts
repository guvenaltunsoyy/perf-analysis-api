import createConnection from "./mongoMock.js";
import Paints from "../src/models/paints";
import { diffMinutes, halfHourAgo, now, oneHourAgo, tenMinutesAgo } from "./utils";

describe("paints case", () => {
    const _now = now();
    beforeEach(async () => {
        await createConnection();
    });
    it("should return empty array", async () => {
        const res = await Paints.getInstance().getAllPaints();
        expect(res).toEqual([]);

    });
    it("should return last one hour events", async () => {
        // @ts-ignore
        const res = await Paints.getInstance().getAllPaints(oneHourAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(60);
        });
    });
    it("should return last 30 minutes events", async () => {
        // @ts-ignore
        const res = await Paints.getInstance().getAllPaints(halfHourAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(30);
        });
    });
    it("should return last 10 minutes events", async () => {
        // @ts-ignore
        const res = await Paints.getInstance().getAllPaints(tenMinutesAgo(), _now);
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, _now);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(0);
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(10);
        });
    });
    it("should return between specifics dates events", async () => {
        // @ts-ignore
        const sDate = new Date() - 5000, eDate = new Date() - 4000;

        // @ts-ignore
        const res = await Paints.getInstance().getAllPaints(new Date(sDate), new Date(eDate));
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, new Date(eDate));
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(4000);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(5000);
        });
    });
});

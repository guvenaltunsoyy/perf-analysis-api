import Navigations from "../src/models/navigations";
import createConnection from "./mongoMock.js";
import { diffMinutes, halfHourAgo, now, oneHourAgo, tenMinutesAgo } from "./utils";

describe("navigations case", () => {
    const _now = now();
    beforeEach(async () => {
        await createConnection();
    });
    it("should return empty array", async () => {
        const res = await Navigations.getInstance().getAllNavigationsTTFBs();
        expect(res).toEqual([]);

    });
    it("should return last one hour events", async () => {
        // @ts-ignore
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(oneHourAgo(), _now);
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
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(halfHourAgo(), _now);
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
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(tenMinutesAgo(), _now);
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
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(new Date(sDate), new Date(eDate));
        res.forEach(e => {
            const diff = diffMinutes(e.createdAt, new Date(eDate));
            // @ts-ignore
            expect(diff).toBeLessThanOrEqual(4000);
            // @ts-ignore
            expect(diff).toBeGreaterThanOrEqual(5000);
        });
    });
    it("should return just domLoad events", async () => {
        // @ts-ignore
        const res = await Navigations.getInstance().getDOMNavigations(new Date(0), _now);
        res.forEach(e => {
            expect(["DomContentLoad", "readystatechange"]).toContain(e.initiatorType);
        });
    });
    it("should return just windowLoad events", async () => {
        // @ts-ignore
        const res = await Navigations.getInstance().getWindowNavigations(new Date(0), _now);
        res.forEach(e => {
            expect(["window_load"]).toContain(e.initiatorType);
        });
    });
});

import Navigations from "../src/models/navigations";
import createConnection from "./mongoMock.js";

describe("navigations case", () => {
    beforeEach(async () => {
        await createConnection();
    });
    it("should return empty array", async () => {
        const res = await Navigations.getInstance().getAllNavigationsTTFBs();
        expect(res).toEqual([]);

    });
    it("should return last one hour events", async () => {
        const now = new Date();
        // @ts-ignore
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(new Date(now - 3600000), now);
        res.forEach(e => {
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeGreaterThanOrEqual(360000);
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeLessThanOrEqual(now.getTime());
        });
    });
    it("should return last 30 minutes events", async () => {
        const now = new Date();
        // @ts-ignore
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(new Date(now - 1800000), now);
        res.forEach(e => {
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeGreaterThanOrEqual(180000);
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeLessThanOrEqual(now.getTime());
        });
    });
    it("should return last 10 minutes events", async () => {
        const now = new Date();
        // @ts-ignore
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(new Date(now - 900000), now);
        res.forEach(e => {
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeGreaterThanOrEqual(90000);
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeLessThanOrEqual(now.getTime());
        });
    });
    it("should return between specifics dates events", async () => {
        const now = new Date();
        // @ts-ignore
        const sDate = new Date() - 5000, eDate = new Date() - 4000;

        // @ts-ignore
        const res = await Navigations.getInstance().getAllNavigationsTTFBs(new Date(sDate), new Date(eDate));
        res.forEach(e => {
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeLessThanOrEqual(4000);
            // @ts-ignore
            expect(now - e.createdAt?.getTime()).toBeGreaterThanOrEqual(5000);
        });
    });
    it("should return just domLoad events", async () => {
        const now = new Date();
        // @ts-ignore
        const res = await Navigations.getInstance().getDOMNavigations(new Date(0), now);
        res.forEach(e => {
            expect(["DomContentLoad", "readystatechange"]).toContain(e.initiatorType);
        });
    });
    it("should return just windowLoad events", async () => {
        const now = new Date();
        // @ts-ignore
        const res = await Navigations.getInstance().getWindowNavigations(new Date(0), now);
        res.forEach(e => {
            expect(["window_load"]).toContain(e.initiatorType);
        });
    });
});

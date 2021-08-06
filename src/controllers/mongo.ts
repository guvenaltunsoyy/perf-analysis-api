import { Response, statusCode } from "../utils";

import Navigations, { Navigation } from "../models/navigations";
import Resources, { Resource } from "../models/resource";
import Paints, { Paint } from "../models/paints";

export const navigationController = async (req, res) => {
    const allNavigations = await Navigations.getInstance().getAllNavigations();

    res.status(statusCode.OK_200).send(Response.success(allNavigations));
};

export const addNavigationController = async (req, res) => {
    try {
        const {
            responseStart,
            navigationStart,
            fetchStart,
            loadEventStart = 0,
            requestStart,
        } = JSON.parse(req.body);
        const _nav: Navigation = {
            ...JSON.parse(req.body),
            ttfb:
                responseStart - (requestStart || navigationStart || fetchStart),
            pageLoadTime: loadEventStart - (navigationStart ?? fetchStart),
        };
        const success = await Navigations.getInstance().addNavigation(
            _nav,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};
export const addNavigationsController = async (req, res) => {
    try {
        const navigations: Navigation[] = JSON.parse(req.body);
        navigations.forEach((res) => {
            const {
                responseStart,
                navigationStart,
                fetchStart,
                loadEventStart = 0,
                requestStart,
            } = res;
            res.ttfb =
                responseStart - (requestStart || navigationStart || fetchStart);
            res.pageLoadTime = loadEventStart - (navigationStart ?? fetchStart);
        });
        const success = await Navigations.getInstance().addNavigations(
            navigations,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};
export const resourceController = async (req, res) => {
    const { startDate, endDate } = req?.query;
    const allNavigations = await Resources.getInstance().getAllResources(
        startDate,
        endDate
    );

    res.status(statusCode.OK_200).send(Response.success(allNavigations));
};

export const addResourceController = async (req, res) => {
    try {
        const {
            responseStart,
            navigationStart,
            startTime,
            fetchStart,
            requestStart,
        } = JSON.parse(req.body);
        const _nav: Resource = {
            ...JSON.parse(req.body),
            ttfb:
                responseStart -
                (requestStart || navigationStart || fetchStart || startTime),
        };
        const success = await Resources.getInstance().addResource(
            _nav,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};
export const addResourcesController = async (req, res) => {
    try {
        const resources: Resource[] = JSON.parse(req.body);
        resources.forEach((res) => {
            const { responseStart, startTime, fetchStart, requestStart } = res;
            res.ttfb =
                responseStart - (requestStart || fetchStart || startTime);
        });
        const success = await Resources.getInstance().addResources(
            resources,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};
export const paintController = async (req, res) => {
    const { startDate, endDate } = req?.query;
    const allNavigations = await Paints.getInstance().getAllPaints(
        startDate,
        endDate
    );
    res.status(statusCode.OK_200).send(Response.success(allNavigations));
};

export const addPaintController = async (req, res) => {
    try {
        const _nav: Paint = { ...JSON.parse(req.body) };
        const success = await Paints.getInstance().addPaint(
            _nav,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};
export const addPaintsController = async (req, res) => {
    try {
        const _nav: Paint[] = JSON.parse(req.body);
        const success = await Paints.getInstance().addPaints(
            _nav,
            (data) => data
        );
        res.status(statusCode.OK_200).send(Response.success({ success }));
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR_500).send(
            Response.error(
                statusCode.INTERNAL_SERVER_ERROR_500,
                "ERROR",
                JSON.stringify(err)
            )
        );
    }
};

export const ttfbController = async (req, res) => {
    const { startDate, endDate } = req?.query;
    const allResources = await Resources.getInstance().getAllResourcesTTFBs();
    const allNavigations =
        await Navigations.getInstance().getAllNavigationsTTFBs(
            startDate,
            endDate
        );
    res.status(statusCode.OK_200).send(
        Response.success([...allNavigations, ...allResources])
    );
};

export const domController = async (req, res) => {
    const { startDate, endDate } = req?.query;
    const allNavigations = await Navigations.getInstance().getDOMNavigations(
        startDate,
        endDate
    );
    res.status(statusCode.OK_200).send(Response.success(allNavigations));
};
export const windowLoadController = async (req, res) => {
    const { startDate, endDate } = req?.query;
    const allNavigations = await Navigations.getInstance().getWindowNavigations(
        startDate,
        endDate
    );
    res.status(statusCode.OK_200).send(Response.success(allNavigations));
};

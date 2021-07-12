import { Response, statusCode } from "../utils";

import Users from "../models/users";
import Navigations, { Navigation } from "../models/navigations";
import Resources, { Resource } from "../models/resource";
import Paints, { Paint } from "../models/paints";

export const userController = async (req, res) => {
    const allUsers = await Users.getInstance().getAllUsers();

    res.status(statusCode.OK_200).send(
        Response.success(allUsers, {
            link: "http://localhost:8080/v1/users",
        })
    );
};

export const navigationController = async (req, res) => {
    const allNavigations = await Navigations.getInstance().getAllNavigations();

    res.status(statusCode.OK_200).send(
        Response.success(allNavigations, {
            link: "http://localhost:8080/v1/navigations",
        })
    );
};

export const addNavigationController = async (req, res) => {
    try {
        const {
            responseStart,
            navigationStart,
            fetchStart,
            loadEventStart = 0,
            requestStart
        } = req.body;
        const _nav: Navigation = {
            ...req.body,
            ttfb: responseStart - (requestStart || navigationStart || fetchStart),
            pageLoadTime: loadEventStart - (navigationStart ?? fetchStart),
        };
        const addNav = await Navigations.getInstance().addNavigation(
            _nav,
            (data) => data
        );
        console.log(`${addNav?.initiatorType} ${addNav._id}: added`);
        res.status(statusCode.OK_200).send(
            Response.success(addNav, {
                link: "http://localhost:8080/v1/navigations/add",
            })
        );
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
    const {startDate, endDate} = req?.query;
    const allNavigations = await Resources.getInstance().getAllResources(startDate, endDate);

    res.status(statusCode.OK_200).send(
        Response.success(allNavigations, {
            link: "http://localhost:8080/v1/resources",
        })
    );
};

export const addResourceController = async (req, res) => {
    try {
        const {
            responseStart,
            navigationStart,
            startTime,
            fetchStart,
            requestStart
        } = req.body;
        const _nav: Resource = {
            ...req.body,
            ttfb: responseStart - (requestStart || navigationStart || fetchStart || startTime),
        };
        const addNav = await Resources.getInstance().addResource(
            _nav,
            (data) => data
        );
        console.log(`${addNav?.initiatorType} ${addNav._id}: added`);
        res.status(statusCode.OK_200).send(
            Response.success(addNav, {
                link: "http://localhost:8080/v1/resources/add",
            })
        );
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
    const {startDate, endDate} = req?.query;
    const allNavigations = await Paints.getInstance().getAllPaints(startDate, endDate);

    res.status(statusCode.OK_200).send(
        Response.success(allNavigations, {
            link: "http://localhost:8080/v1/paints",
        })
    );
};

export const addPaintController = async (req, res) => {
    try {
        const _nav: Paint = {...req.body};
        const addNav = await Paints.getInstance().addPaint(
            _nav,
            (data) => data
        );
        console.log(`${addNav?.name} ${addNav._id}: added`);
        res.status(statusCode.OK_200).send(
            Response.success(addNav, {
                link: "http://localhost:8080/v1/paints/add",
            })
        );
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
    const {startDate, endDate} = req?.query;
    const allResources = await Resources.getInstance().getAllResourcesTTFBs();
    const allNavigations = await Navigations.getInstance().getAllNavigationsTTFBs(startDate, endDate);
    res.status(statusCode.OK_200).send(
        Response.success([...allNavigations, ...allResources], {
            link: "http://localhost:8080/v1/ttfb",
        })
    );
};

export const domController = async (req, res) => {
    const {startDate, endDate} = req?.query;
    const allNavigations = await Navigations.getInstance().getDOMNavigations(startDate, endDate);
    res.status(statusCode.OK_200).send(
        Response.success(allNavigations, {
            link: "http://localhost:8080/v1/dom-events",
        })
    );
};
export const windowLoadController = async (req, res) => {
    const {startDate, endDate} = req?.query;
    const allNavigations = await Navigations.getInstance().getWindowNavigations(startDate, endDate);
    res.status(statusCode.OK_200).send(
        Response.success(allNavigations, {
            link: "http://localhost:8080/v1/window-events",
        })
    );
};

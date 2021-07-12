import defaultController from "./default";
import pingController from "./ping";
import pugController from "./pug";
import {
    addNavigationController,
    addPaintController,
    addResourceController,
    domController,
    navigationController,
    paintController,
    resourceController,
    ttfbController,
    userController,
    windowLoadController
} from "./mongo";

export default {
    defaultController,
    pingController,
    pugController,
    userController,
    navigationController,
    addNavigationController,
    resourceController,
    addResourceController,
    paintController,
    addPaintController,
    ttfbController,
    domController,
    windowLoadController
};

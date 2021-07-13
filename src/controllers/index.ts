import defaultController from "./default";
import pingController from "./ping";
import pugController from "./pug";
import {
    addNavigationController,
    addNavigationsController,
    addPaintController,
    addPaintsController,
    addResourceController,
    addResourcesController,
    domController,
    navigationController,
    paintController,
    resourceController,
    ttfbController,
    windowLoadController
} from "./mongo";

export default {
    defaultController,
    pingController,
    pugController,
    navigationController,
    addNavigationController,
    addNavigationsController,
    resourceController,
    addResourceController,
    addResourcesController,
    paintController,
    addPaintController,
    addPaintsController,
    ttfbController,
    domController,
    windowLoadController
};

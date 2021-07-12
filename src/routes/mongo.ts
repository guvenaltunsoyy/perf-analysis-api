import * as express from "express";
import controller from "../controllers";

const router = express.Router();

router.get("/v1/users", controller.userController);
router.get("/v1/navigations", controller.navigationController);
router.post("/v1/navigations/add", controller.addNavigationController);
router.get("/v1/resources", controller.resourceController);
router.post("/v1/resources/add", controller.addResourceController);
router.get("/v1/paints", controller.paintController);
router.post("/v1/paints/add", controller.addPaintController);
router.get("/v1/ttfb", controller.ttfbController);
router.get("/v1/dom-events", controller.domController);
router.get("/v1/window-events", controller.windowLoadController);

export default router;

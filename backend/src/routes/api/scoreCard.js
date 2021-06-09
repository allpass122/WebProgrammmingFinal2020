import { Router } from "express";
import ScoreCard from "../../models/ScoreCard";

const router = Router();

router.post("/create-card", async function (req, res) {

});

// TODO: delete the collection of the DB
// router.delete(...)
router.delete("/clear", async function (req, res) {
});
// TODO: implement the DB query
// route.xx(xxxx)
router.post("/query-card", async function (req, res) {
});
export default router;

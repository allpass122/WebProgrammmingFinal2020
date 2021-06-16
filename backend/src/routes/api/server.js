import { Router } from "express";
import userSchema from "../../models/userSchema";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.post("/login", async function (req, res) {
  const { name, pwd } = req.body;
  console.log(`receive ${name} ${pwd}`);
  var queryParam = { name: name, pwd: pwd };
  const existing = await userSchema
    .find(queryParam)
    .exec(function (error, result) {
      console.log(`res:${result} and ${typeof result}`);
      if (!result.length) {
        console.log(`Not found ${name}\n`);
        res.send({ success: false });
      } else {
        console.log(`Find`);
        console.log(result);
        // const results = result.map(
        //     (m) => { name: m["name"], uuid: m["uuid"] }
        // );
        res.send({
          success: true,
          uuid: result[0]["uuid"],
        });
      }
    });
});

router.post("/signup", async function (req, res) {
  const { name_, pwd_ } = req.body;
  console.log(`receive ${name_} ${pwd_}`);
  const existing = await userSchema.findOne({ name: name_, pwd: pwd_ });
  const newUser = new userSchema({ name: name_, pwd: pwd_, uuid: uuidv4() });
  if (existing) {
    console.log(`User ${name_} exist!\n`);
    res.send({ success: false, msg: `User ${name_} exist!\n` });
  } else {
    await newUser.save();
    console.log(`Created user ${name_}`);
    res.send({ success: true, msg: `Success!` });
  }
});

router.post("/clear", async function (req, res) {
  try {
    await userSchema.deleteMany({});
    console.log("Database cleared");
    res.send({ success: true });
  } catch (e) {
    console.log(`Delete Fail: ${e}`);
    res.send({ success: false });
  }
});
export default router;

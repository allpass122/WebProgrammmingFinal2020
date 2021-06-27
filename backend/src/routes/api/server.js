import { Router } from "express";
import userSchema from "../../models/userSchema";
import mapSchema from "../../models/mapSchema";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

const router = Router();
// function Hasmap(arr, id) {
//   for (var ele in arr) {
//     console.log(`Element:`);
//     console.log(arr[ele]);
//     if (arr[ele].id === id) {
//       return true;
//     }
//   }
//   return false;
// }

/* For Login */
router.post("/login", async function (req, res) {
  const { name, pwd } = req.body;
  console.log(`receive ${name} ${pwd}`);
  var queryParam = { name: name, pwd: pwd };
  const existing = await userSchema
    .find(queryParam)
    .exec(function (error, result) {
      // console.log(`res:${result} and ${typeof result}`);
      if (!result.length) {
        res.send({ success: false });
      } else {
        res.send({
          success: true,
          uuid: result[0]["uuid"],
          mapIDs: result[0]["mapIDs"],
        });
      }
    });
});
router.post("/signup", async function (req, res) {
  const { name_, pwd_ } = req.body;
  console.log(`receive ${name_} ${pwd_}`);
  const existing = await userSchema.findOne({ name: name_ });
  if (existing) {
    console.log(`User ${name_} exist!\n`);
    res.send({ success: false, msg: `User ${name_} exist!\n` });
  } else {
    const newUser = new userSchema({ name: name_, pwd: pwd_, uuid: uuidv4() });
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
/* For map */
router.post("/upload", async function (req, res) {
  const { uuid, settingPack, title, description, name, publish, id0 } =
    req.body;
  console.log(`UPLOAD`);
  // console.log(settingPack);

  // use setting and public to decide a unique hash id
  // let id = hash({ setting: settingPack, publish: publish });
  let id = hash({ time: Date.now() });
  const existing = await userSchema
    .find({ uuid: uuid })
    .exec(function (error, result) {
      console.log(result);
      // console.log(`res:${result} and ${typeof result}`);
      if (!result.length) {
        console.log(`Upload find NO user ${uuid}`);
        res.send({ success: false, errorCode: 100, idNew: 0 });
        return;
      } else {
        // console.log(`id:${id0}`);
        let user = result[0];
        // if (Hasmap(user.mapIDs, id)) {
        if (id0 !== 0 && !publish) {
          // not a new map
          mapSchema
            .updateOne(
              { id: id0 },
              {
                $set: {
                  publish: publish,
                  description: description,
                  title: title,
                  content: settingPack,
                },
              }
            )
            .catch((err) => {
              console.log("Error: " + err);
            });

          res.send({ success: false, errorCode: 1, idNew: id0 });
          console.log(`user has this map`);
          return;
        } else if (user.mapIDs.length >= 16) {
          // too many maps
          res.send({ success: false, errorCode: 2, idNew: 0 });
          return;
        } else {
          console.log(`user.mapIDs.push`);
          user.mapIDs.push(id);
          userSchema
            .updateOne({ uuid: uuid }, { $set: { mapIDs: user.mapIDs } })
            .catch((err) => {
              console.log("Error: " + err);
            });
          res.send({ success: true, errorCode: 0, idNew: id });
        }
      }
    });

  const newMap = new mapSchema({
    id: id,
    content: settingPack,
    title: title,
    description: description,
    publish: publish,
    author: name,
    statistic: {
      fastestPass: 999.9,
      fastestMan: "None",
      passTime: 0,
      playTime: 0,
    },
    rateRec: [],
    passPeople: [],
  });
  const exist = await mapSchema.findOne({ id: id });
  if (publish || (!exist && id0 === 0)) {
    await newMap.save();
    console.log(`Created map ${newMap}`);
    // res.send({ success: true, errorCode: 0 });
  } else {
    console.log(`map exist`);
  }

  return;
});
router.post("/getUserData", async function (req, res) {
  const { uuid } = req.body;
  const existing = await userSchema
    .find({ uuid: uuid })
    .exec(function (error, result) {
      // console.log(`res:${result} and ${typeof result}`);
      if (!result.length) {
        res.send({ success: false });
      } else {
        res.send({
          success: true,
          mapIDs: result[0].mapIDs,
        });
      }
    });
});
router.post("/getAllMaps", async function (req, res) {
  console.log(`getAllMaps`);
  const { mapIDs } = req.body;
  console.log(mapIDs);
  const existing = await mapSchema
    .find({ id: { $in: mapIDs } })
    .exec(function (error, result) {
      console.log(result);

      if (!result.length) {
        res.send({ success: false, errorCode: 1 });
      } else {
        res.send({ success: true, errorCode: 0, maps: result });
      }
    });
});
router.post("/getMap", async function (req, res) {
  console.log(`getMap`);
  const { id } = req.body;
  console.log(id);
  const existing = await mapSchema
    .find({ id: id })
    .exec(function (error, result) {
      console.log(result);

      if (!result.length) {
        res.send({ success: false, errorCode: 1 });
      } else {
        res.send({ success: true, errorCode: 0, map: result[0] });
      }
    });
});
router.post("/deleteMap", async function (req, res) {
  try {
    await mapSchema.deleteMany({});
    console.log("Map Database cleared");
    res.send({ success: true });
  } catch (e) {
    console.log(`Delete Fail: ${e}`);
    res.send({ success: false });
  }
});
router.post("/deleteSingleMap", async function (req, res) {
  const { id, uuid } = req.body;
  try {
    await mapSchema.deleteOne({ id: id });
    console.log(`Delete Single Map ${id}`);
    const existing = await userSchema
      .find({ uuid: uuid })
      .exec(function (error, result) {
        let user = result[0];
        let newMapIDs = user.mapIDs.filter((ele) => {
          return ele !== id;
        });
        userSchema
          .updateOne({ uuid: uuid }, { $set: { mapIDs: newMapIDs } })
          .catch((err) => {
            console.log("Error: " + err);
          });
      });
    res.send({ success: true });
  } catch (e) {
    console.log(`Delete Fail: ${e}`);
    res.send({ success: false });
  }
});
/* Popular Page */
router.post("/getAllMapsByOrder", async function (req, res) {
  const existing = await mapSchema
    .find({ publish: true })
    .sort({ _id: -1 })
    .exec(function (error, result) {
      // console.log("~~~~~~~~~~~~~~");
      // console.log(result);
      if (!result.length) {
        res.send({ success: false, errorCode: 1 });
      } else {
        res.send({
          success: true,
          errorCode: 0,
          maps: result,
        });
      }
    });
});
/* Challenge */
router.post("/challengeSuccess", async function (req, res) {
  const { mapLocal } = req.body;
  console.log(`challengeSuccess`);
  mapSchema
    .updateOne(
      { id: mapLocal.id },
      {
        $set: {
          statistic: mapLocal.statistic,
          passPeople: mapLocal.passPeople,
        },
      }
    )
    .catch((err) => {
      console.log("Error: " + err);
    });
  res.send({ success: true, errorCode: 0 });

  return;
});
/* Rate Map */
router.post("/rateMap", async function (req, res) {
  const { rateID, val, name } = req.body;
  console.log(`rateMap`);
  const existing = await mapSchema
    .find({ id: rateID })
    .exec(function (error, result) {
      if (!result.length) {
        console.log(`NO map ${rateID}`);
        res.send({ success: false, errorCode: 100 });
        return;
      } else {
        let map = result[0];
        if (!map.passPeople.includes(name)) {
          // not pass
          res.send({ success: false, errorCode: 1 });
        } else if (
          map.rateRec.filter((ele) => {
            return ele.name === name;
          }).length === 0
        ) {
          // never rate
          map.rateRec.push({ name: name, rate: val });
          res.send({ success: true, errorCode: 0 });
        } else if (
          map.rateRec.filter((ele) => {
            return ele.name === name;
          }).length === 1
        ) {
          // has rated
          map.rateRec
            .filter((ele) => {
              return ele.name === name;
            })
            .forEach((ele) => {
              ele.rate = val;
            });
          console.log(map.rateRec);
          res.send({ success: false, errorCode: 2 });
        }
        mapSchema
          .updateOne({ id: rateID }, { $set: { rateRec: map.rateRec } })
          .catch((err) => {
            console.log("Error: " + err);
          });
      }
    });
});
export default router;

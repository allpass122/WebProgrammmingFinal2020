import mongoose from "mongoose";
const Schema = mongoose.Schema;
const mapSchema = new Schema({
  id: String,
  content: Schema.Types.Mixed,
  title: String,
  description: String,
  publish: Boolean,
  author: String,
  statistic: {
    fastestPass: Number,
    fastestMan: String,
    passTime: Number,
    playTime: Number,
  },
  rateRec: Array,
  passPeople: Array,
});
// rateRec: [{name:"Amy", rate:0}, {name:"Ben", rate:1}, ... ]
const MapSchema = mongoose.model("FinalProjectMaps", mapSchema);
export default MapSchema;

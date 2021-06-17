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
    passTime: Number,
    playTime: Number,
  },
});
const MapSchema = mongoose.model("FinalProjectMaps", mapSchema);
export default MapSchema;

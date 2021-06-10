// TODO: Define ScoreCardSchema
//   name   : String
//   subject: String
//   score  : Number
// export default model('ScoreCard', scoreCardSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  pwd: String,
  uuid: String,
});
const UserSchema = mongoose.model("FinalProjectUsers", userSchema);
export default UserSchema;

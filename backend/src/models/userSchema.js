import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  pwd: String,
  uuid: String,
  mapIDs: [],
});
// mapIDs: [{ id: id, title: title, description: description }]
const UserSchema = mongoose.model("FinalProjectUsers", userSchema);
export default UserSchema;

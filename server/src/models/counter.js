import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;

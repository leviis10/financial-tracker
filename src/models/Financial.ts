import mongoose from "mongoose";

const { Schema } = mongoose;

const financialSchema = new Schema({
  type: {
    type: String,
    enum: ["income", "outcome"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Financial = mongoose.model("Financial", financialSchema);

export default Financial;

import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 10 },
    capacity: { type: Number, required: true, min: 1, default: 30 },
    price: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);

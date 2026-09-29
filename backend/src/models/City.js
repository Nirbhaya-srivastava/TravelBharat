import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
    },
    stateSlug: {
      type: String,
      required: true,
      trim: true,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

citySchema.index({ slug: 1, stateSlug: 1 }, { unique: true });
citySchema.index({ name: 'text', description: 'text' });

const City = mongoose.models.City || mongoose.model('City', citySchema);
export default City;

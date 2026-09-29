import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'State name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['State', 'Union Territory'],
      default: 'State',
    },
    capital: {
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
    culture: {
      type: String,
      default: '',
    },
    cuisine: {
      type: String,
      default: '',
    },
    festivals: {
      type: [String],
      default: [],
    },
    geography: {
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

stateSchema.index({ name: 'text', description: 'text', capital: 'text' });

const State = mongoose.models.State || mongoose.model('State', stateSchema);
export default State;

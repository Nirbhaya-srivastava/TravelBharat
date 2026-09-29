import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    state: {
      type: String, // Slug of the state
      required: true,
      trim: true,
    },
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String, // Slug of the city
      required: true,
      trim: true,
    },
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // Slug of category
      required: true,
      trim: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    historicalSignificance: {
      type: String,
      default: '',
    },
    culturalSignificance: {
      type: String,
      default: '',
    },
    bestTimeToVisit: {
      type: String,
      default: 'October - March',
    },
    recommendedDuration: {
      type: String,
      default: '2-3 hours',
    },
    openingHours: {
      type: String,
      default: 'Sunrise to Sunset',
    },
    entryFee: {
      type: String,
      default: 'Free entry',
    },
    location: {
      type: String,
      required: true,
    },
    mapUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    nearbyAttractions: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
    howToReach: {
      air: { type: String, default: '' },
      train: { type: String, default: '' },
      road: { type: String, default: '' },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'verified'],
      default: 'published',
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

destinationSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
  stateName: 'text',
  cityName: 'text',
  categoryName: 'text',
});

destinationSchema.index({ state: 1, city: 1, category: 1 });

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
export default Destination;

import mongoose from 'mongoose';
import State from './State.js';
import City from './City.js';
import Category from './Category.js';
import Destination from './Destination.js';
import Admin from './Admin.js';
import { initialStates, initialCities, initialCategories, initialDestinations, initialAdmin, hashPassword } from '../seed/seedData.js';
import { isDbConnected } from '../config/index.js';

// In-memory collections for resilient zero-config fallback
class MemoryCollection {
  constructor(name, initialItems = []) {
    this.name = name;
    this.items = [];
    this.counter = 1;
    initialItems.forEach((item) => this.insertSync(item));
  }

  insertSync(doc) {
    const _id = doc._id ? doc._id.toString() : `${this.name}_${this.counter++}_${Date.now()}`;
    const now = new Date();
    const newDoc = {
      _id,
      id: _id,
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || now,
      ...doc,
    };
    this.items.push(newDoc);
    return newDoc;
  }

  async find(filter = {}) {
    return this.items.filter((item) => this.matchFilter(item, filter)).map((i) => ({ ...i }));
  }

  async findOne(filter = {}) {
    const item = this.items.find((i) => this.matchFilter(i, filter));
    return item ? { ...item } : null;
  }

  async findById(id) {
    const item = this.items.find((i) => i._id === id || i.id === id);
    return item ? { ...item } : null;
  }

  async create(data) {
    const doc = this.insertSync(data);
    return { ...doc };
  }

  async findByIdAndUpdate(id, updates, options = {}) {
    const index = this.items.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return null;
    const existing = this.items[index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.items[index] = updated;
    return { ...updated };
  }

  async findByIdAndDelete(id) {
    const index = this.items.findIndex((i) => i._id === id || i.id === id);
    if (index === -1) return null;
    const [deleted] = this.items.splice(index, 1);
    return deleted;
  }

  async countDocuments(filter = {}) {
    return (await this.find(filter)).length;
  }

  matchFilter(item, filter) {
    for (const [key, val] of Object.entries(filter)) {
      if (val === undefined) continue;
      if (typeof val === 'object' && val !== null) {
        if ('$regex' in val) {
          const reg = new RegExp(val.$regex, val.$options || 'i');
          if (!reg.test(String(item[key] || ''))) return false;
        } else if ('$in' in val) {
          if (!val.$in.includes(item[key])) return false;
        } else if ('$ne' in val) {
          if (item[key] === val.$ne) return false;
        }
      } else {
        if (item[key] !== val) return false;
      }
    }
    return true;
  }
}

// In-memory stores
const memStates = new MemoryCollection('state', initialStates);
const memCities = new MemoryCollection('city', initialCities);
const memCategories = new MemoryCollection('category', initialCategories);
const memDestinations = new MemoryCollection('destination', initialDestinations);
const memAdmins = new MemoryCollection('admin');

// Initialize admin account in memory
(async () => {
  const passwordHash = await hashPassword(initialAdmin.password);
  memAdmins.insertSync({
    name: initialAdmin.name,
    email: initialAdmin.email.toLowerCase(),
    passwordHash,
    role: initialAdmin.role,
    isActive: true,
  });
})();

// Data Store Abstraction
export const db = {
  // Check if real MongoDB is connected
  get isMongo() {
    return isDbConnected() && mongoose.connection.readyState === 1;
  },

  // State operations
  state: {
    async find(filter = {}) {
      if (db.isMongo) return State.find(filter).lean();
      return memStates.find(filter);
    },
    async findOne(filter = {}) {
      if (db.isMongo) return State.findOne(filter).lean();
      return memStates.findOne(filter);
    },
    async findById(id) {
      if (db.isMongo) return State.findById(id).lean();
      return memStates.findById(id);
    },
    async create(data) {
      if (db.isMongo) return (await State.create(data)).toObject();
      return memStates.create(data);
    },
    async findByIdAndUpdate(id, data) {
      if (db.isMongo) return State.findByIdAndUpdate(id, data, { new: true }).lean();
      return memStates.findByIdAndUpdate(id, data);
    },
    async findByIdAndDelete(id) {
      if (db.isMongo) return State.findByIdAndDelete(id).lean();
      return memStates.findByIdAndDelete(id);
    },
    async countDocuments(filter = {}) {
      if (db.isMongo) return State.countDocuments(filter);
      return memStates.countDocuments(filter);
    },
  },

  // City operations
  city: {
    async find(filter = {}) {
      if (db.isMongo) return City.find(filter).lean();
      return memCities.find(filter);
    },
    async findOne(filter = {}) {
      if (db.isMongo) return City.findOne(filter).lean();
      return memCities.findOne(filter);
    },
    async findById(id) {
      if (db.isMongo) return City.findById(id).lean();
      return memCities.findById(id);
    },
    async create(data) {
      if (db.isMongo) return (await City.create(data)).toObject();
      return memCities.create(data);
    },
    async findByIdAndUpdate(id, data) {
      if (db.isMongo) return City.findByIdAndUpdate(id, data, { new: true }).lean();
      return memCities.findByIdAndUpdate(id, data);
    },
    async findByIdAndDelete(id) {
      if (db.isMongo) return City.findByIdAndDelete(id).lean();
      return memCities.findByIdAndDelete(id);
    },
    async countDocuments(filter = {}) {
      if (db.isMongo) return City.countDocuments(filter);
      return memCities.countDocuments(filter);
    },
  },

  // Category operations
  category: {
    async find(filter = {}) {
      if (db.isMongo) return Category.find(filter).lean();
      return memCategories.find(filter);
    },
    async findOne(filter = {}) {
      if (db.isMongo) return Category.findOne(filter).lean();
      return memCategories.findOne(filter);
    },
    async findById(id) {
      if (db.isMongo) return Category.findById(id).lean();
      return memCategories.findById(id);
    },
    async create(data) {
      if (db.isMongo) return (await Category.create(data)).toObject();
      return memCategories.create(data);
    },
    async findByIdAndUpdate(id, data) {
      if (db.isMongo) return Category.findByIdAndUpdate(id, data, { new: true }).lean();
      return memCategories.findByIdAndUpdate(id, data);
    },
    async findByIdAndDelete(id) {
      if (db.isMongo) return Category.findByIdAndDelete(id).lean();
      return memCategories.findByIdAndDelete(id);
    },
    async countDocuments(filter = {}) {
      if (db.isMongo) return Category.countDocuments(filter);
      return memCategories.countDocuments(filter);
    },
  },

  // Destination operations
  destination: {
    async find(filter = {}) {
      if (db.isMongo) return Destination.find(filter).lean();
      return memDestinations.find(filter);
    },
    async findOne(filter = {}) {
      if (db.isMongo) return Destination.findOne(filter).lean();
      return memDestinations.findOne(filter);
    },
    async findById(id) {
      if (db.isMongo) return Destination.findById(id).lean();
      return memDestinations.findById(id);
    },
    async create(data) {
      if (db.isMongo) return (await Destination.create(data)).toObject();
      return memDestinations.create(data);
    },
    async findByIdAndUpdate(id, data) {
      if (db.isMongo) return Destination.findByIdAndUpdate(id, data, { new: true }).lean();
      return memDestinations.findByIdAndUpdate(id, data);
    },
    async findByIdAndDelete(id) {
      if (db.isMongo) return Destination.findByIdAndDelete(id).lean();
      return memDestinations.findByIdAndDelete(id);
    },
    async countDocuments(filter = {}) {
      if (db.isMongo) return Destination.countDocuments(filter);
      return memDestinations.countDocuments(filter);
    },
  },

  // Admin operations
  admin: {
    async find(filter = {}) {
      if (db.isMongo) return Admin.find(filter).lean();
      return memAdmins.find(filter);
    },
    async findOne(filter = {}) {
      if (db.isMongo) return Admin.findOne(filter).lean();
      return memAdmins.findOne(filter);
    },
    async findById(id) {
      if (db.isMongo) return Admin.findById(id).lean();
      return memAdmins.findById(id);
    },
    async create(data) {
      if (db.isMongo) return (await Admin.create(data)).toObject();
      return memAdmins.create(data);
    },
    async findByIdAndUpdate(id, data) {
      if (db.isMongo) return Admin.findByIdAndUpdate(id, data, { new: true }).lean();
      return memAdmins.findByIdAndUpdate(id, data);
    },
  },
};

// Seeder logic for live MongoDB if connected
export const seedLiveDatabaseIfEmpty = async () => {
  if (!db.isMongo) return;
  try {
    const stateCount = await State.countDocuments();
    if (stateCount === 0) {
      console.log('🌱 [Seeder] Populating empty MongoDB database with initial sample data...');
      await State.insertMany(initialStates);
      await City.insertMany(initialCities);
      await Category.insertMany(initialCategories);
      await Destination.insertMany(initialDestinations);

      const passwordHash = await hashPassword(initialAdmin.password);
      await Admin.create({
        name: initialAdmin.name,
        email: initialAdmin.email.toLowerCase(),
        passwordHash,
        role: initialAdmin.role,
        isActive: true,
      });
      console.log('✅ [Seeder] MongoDB successfully seeded!');
    }
  } catch (err) {
    console.error('⚠️ [Seeder] MongoDB seeding error:', err.message);
  }
};

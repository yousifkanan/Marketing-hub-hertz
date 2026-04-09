import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
}, { timestamps: true });

const AdSchema = new mongoose.Schema({
  adId: String,
  budget: Number,
  reach: Number,
  impressions: Number,
  likes: Number,
  comments: Number,
  views: Number,
  messages: Number,
}, { timestamps: true });

const InventorySchema = new mongoose.Schema({
  name: String,
  category: String,
  quantity: Number,
  status: String,
  lastUpdated: String,
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  senderId: String,
  senderName: String,
  text: String,
  timestamp: Number,
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
  user: String,
  action: String,
  color: String,
  timestamp: Number,
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'POSTPONED', 'COMPLETED'], default: 'TODO' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  deadline: String,
  assignee: String,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Ad = mongoose.models.Ad || mongoose.model('Ad', AdSchema);
export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

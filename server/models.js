import mongoose from 'mongoose';

const resumeItemSchema = new mongoose.Schema({
  activityName: { type: String, required: true, trim: true, maxlength: 100 },
  energy: { type: Number, required: true, min: 1, max: 3, validate: Number.isInteger },
  activityType: { type: String, required: true, trim: true, maxlength: 100 },
  desc: { type: String, maxlength: 1000 }
}, { collection: 'resume_items', autoIndex: false });

export const ResumeItem = mongoose.models.ResumeItem || mongoose.model('ResumeItem', resumeItemSchema);

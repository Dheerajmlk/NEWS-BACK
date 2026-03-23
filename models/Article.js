const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  gnewsId: {
    type: String,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
    maxlength: 5000
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  image: {
    type: String,
  },
  publishedAt: {
    type: Date,
    index: true,
  },
  source: {
    name: String,
    url: String,
    country: String
  },
  category: {
    type: String,
    index: true,
    required: true,
  },
  language: {
    type: String,
    index: true
  },
  isManual: {
  type: Boolean,
  default: false
}
}, { timestamps: true });

// Auto-delete articles older than 7 days based on createdAt field
articleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days in seconds

// Add compound index: { category: 1, publishedAt: -1 }
articleSchema.index({ category: 1, publishedAt: -1 });

// Add text index: { title: "text", description: "text" }
articleSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model('Article', articleSchema);

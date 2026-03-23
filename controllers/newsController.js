const Article = require('../models/Article');
const { fetchCategoryNews } = require('../utils/gnews');
const { validationResult } = require('express-validator');

exports.fetchNewsManual = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const category = req.query.category || 'general';
    const query = req.query.q || category;

    const inserted = await fetchCategoryNews(category, query);

    res.status(200).json({
      success: true,
      message: `Fetched news for category: ${category}`,
      inserted
    });
  } catch (error) {
    next(error);
  }
};

exports.createNews = async (req, res) => {
  try {
    const { title, description, image, url, category } = req.body;

    const news = await Article.create({
      title,
      description,
      image,
      url,
      category,

      source: {
        name: "Admin",
        url: "",
        country: "in"
      },

      isManual: true, 

      language: "en", 
      publishedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: news
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const queryInfo = {};
    if (req.query.q) {
      queryInfo.$or = [
        { title: { $regex: req.query.q, $options: 'i' } },
        { description: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    if (req.query.category) {
      queryInfo.category = req.query.category;
    }

    if (req.query.lang) {
      queryInfo.language = req.query.lang;
    }

    if (req.query.country) {
      queryInfo['source.country'] = {
        $regex: req.query.country,
        $options: 'i'
      };
    }

    let sortObj = { publishedAt: -1 };
    if (req.query.sort === 'oldest') {
      sortObj = { publishedAt: 1 };
    }

    const selectFields =
      'gnewsId title description url image publishedAt source category language createdAt';

    const articles = await Article.find(queryInfo)
      .select(selectFields)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(queryInfo);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: articles
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteNews = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Not found" });
  }

  await article.deleteOne();

  res.json({ success: true });
};
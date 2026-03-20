const axios = require('axios');
const Article = require('../models/Article');

const fetchCategoryNews = async (category, query = '') => {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    const pages = [1, 2, 3]; // 👉 30 news total
    let allArticles = [];

    // 🔥 MULTIPLE API CALLS
    for (let page of pages) {
      const url = `https://gnews.io/api/v4/search?q=${query || category}&lang=en&country=in&max=10&page=${page}&apikey=${apiKey}`;

      const response = await axios.get(url);

      const articles = response.data.articles || [];

      allArticles = [...allArticles, ...articles];
    }

    if (allArticles.length === 0) return 0;

    // 🔥 REMOVE DUPLICATES FROM DB
    const urls = allArticles.map(a => a.url);

    const existingArticles = await Article.find({
      url: { $in: urls }
    }).select('url gnewsId');

    const existingUrls = existingArticles.map(a => a.url);
    const existingIds = existingArticles.map(a => a.gnewsId).filter(Boolean);

    // 🔥 FILTER NEW ARTICLES
    const newArticles = allArticles.filter(a => {
      const isUrlDuplicate = existingUrls.includes(a.url);
      const isIdDuplicate = a.id && existingIds.includes(a.id);

      return !isUrlDuplicate && !isIdDuplicate;
    });

    // 🔥 INSERT CLEAN DATA
    if (newArticles.length > 0) {
      await Article.insertMany(
        newArticles.map(item => {
          let contentStr = item.content || '';
          if (contentStr.length > 5000) {
            contentStr = contentStr.substring(0, 4997) + '...';
          }

          return {
            gnewsId: item.id || null,
            title: item.title,
            description: item.description,
            content: contentStr,
            url: item.url,
            image: item.image,
            publishedAt: new Date(item.publishedAt),
            source: {
              name: item.source?.name,
              url: item.source?.url,
              country: item.source?.country || 'in'
            },
            category: category,
            language: item.lang || 'en'
          };
        })
      );
    }

    return newArticles.length;

  } catch (error) {
    console.error(`❌ Error fetching ${category}:`, error.message);
    return 0;
  }
};

module.exports = { fetchCategoryNews };
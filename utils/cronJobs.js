const cron = require('node-cron');
const { fetchCategoryNews } = require('./gnews');

const initCronJobs = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running cron job: Fetching news for multiple categories...');
    const categories = [ 'general',
  'technology',
  'sports',
  'business',
  'entertainment',
  'health',];
    
    for (const category of categories) {
      try {
        const added = await fetchCategoryNews(category);
        console.log(`Cron: Fetched ${category} - Added ${added} new articles.`);
      } catch (error) {
        console.error(`Cron error for ${category}:`, error.message);
      }
    }
  });
};

module.exports = initCronJobs;

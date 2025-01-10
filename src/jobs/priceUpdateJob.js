import cron from 'node-cron';
import cryptoService from '../services/cryptoService.js';

const SUPPORTED_COINS = ['bitcoin', 'matic-network', 'ethereum'];

class PriceUpdateJob {
  start() {
    // Run every 2 hours
    cron.schedule('0 */2 * * *', async () => {
      console.log('Running price update job...');
      
      for (const coinId of SUPPORTED_COINS) {
        try {
          const priceData = await cryptoService.fetchCoinData(coinId);
          await cryptoService.savePrice(coinId, priceData);
          console.log(`Updated price data for ${coinId}`);
        } catch (error) {
          console.error(`Failed to update price for ${coinId}:`, error.message);
        }
      }
    });
  }
}

export default new PriceUpdateJob();
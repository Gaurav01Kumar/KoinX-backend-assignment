import axios from 'axios';
import Crypto from '../models/Crypto.js';

class CryptoService {
  constructor() {
    this.baseUrl = 'https://api.coingecko.com/api/v3';
  }

  async fetchCoinData(coinId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/simple/price`,
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_change: true
          }
        }
      );

      const data = response.data[coinId];
      return {
        priceUSD: data.usd,
        marketCapUSD: data.usd_market_cap,
        dayChange: data.usd_24h_change
      };
    } catch (error) {
      console.error(`Error fetching data for ${coinId}:`, error.message);
      throw error;
    }
  }

  async savePrice(coinId, priceData) {
    try {
      const crypto = new Crypto({
        coinId,
        priceUSD: priceData.priceUSD,
        marketCapUSD: priceData.marketCapUSD,
        dayChange: priceData.dayChange
      });
      await crypto.save();
      return crypto;
    } catch (error) {
      console.error(`Error saving price for ${coinId}:`, error.message);
      throw error;
    }
  }

  async getLatestStats(coinId) {
    try {
      const stats = await Crypto.findOne({ coinId })
        .sort({ timestamp: -1 })
        .select('-_id priceUSD marketCapUSD dayChange');
      
      if (!stats) {
        // If no data exists, fetch current data from API and save it
        const currentData = await this.fetchCoinData(coinId);
        const savedData = await this.savePrice(coinId, currentData);
        
        return {
          price: savedData.priceUSD,
          marketCap: savedData.marketCapUSD,
          "24hChange": savedData.dayChange
        };
      }
      
      return {
        price: stats.priceUSD,
        marketCap: stats.marketCapUSD,
        "24hChange": stats.dayChange
      };
    } catch (error) {
      console.error(`Error fetching stats for ${coinId}:`, error.message);
      throw error;
    }
  }

  async getLast100Prices(coinId) {
    try {
      const prices = await Crypto.find({ coinId })
        .sort({ timestamp: -1 })
        .limit(100)
        .select('priceUSD');

      if (prices.length === 0) {
        // If no historical data exists, fetch current price and save it
        const currentData = await this.fetchCoinData(coinId);
        const savedData = await this.savePrice(coinId, currentData);
        return [{ priceUSD: savedData.priceUSD }];
      }

      return prices;
    } catch (error) {
      console.error(`Error fetching last 100 prices for ${coinId}:`, error.message);
      throw error;
    }
  }
}

export default new CryptoService();

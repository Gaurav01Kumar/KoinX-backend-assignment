import cryptoService from '../services/cryptoService.js';
import Calculator from '../utils/calculator.js';

class CryptoController {
  async getStats(req, res) {
    try {
      const { coin } = req.query;
      
      if (!coin) {
        return res.status(400).json({ error: 'Coin parameter is required' });
      }

      
      const validCoins = ['bitcoin', 'matic-network', 'ethereum'];
      if (!validCoins.includes(coin)) {
        return res.status(400).json({ 
          error: 'Invalid coin. Must be one of: bitcoin, matic-network, ethereum'
        });
      }

      const stats = await cryptoService.getLatestStats(coin);
      res.json(stats);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }

  async getDeviation(req, res) {
    try {
      const { coin } = req.query;
      
      if (!coin) {
        return res.status(400).json({ error: 'Coin parameter is required' });
      }

      // Validate coin parameter
      const validCoins = ['bitcoin', 'matic-network', 'ethereum'];
      if (!validCoins.includes(coin)) {
        return res.status(400).json({ 
          error: 'Invalid coin. Must be one of: bitcoin, matic-network, ethereum'
        });
      }

      const prices = await cryptoService.getLast100Prices(coin);
      const deviation = Calculator.calculateStandardDeviation(prices);
      
      res.json({ deviation: Number(deviation.toFixed(2)) });
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
}

export default new CryptoController();
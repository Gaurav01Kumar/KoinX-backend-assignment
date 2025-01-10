class Calculator {
    static calculateStandardDeviation(prices) {
      const values = prices.map(p => p.priceUSD);
      const n = values.length;
      
      if (n === 0) return 0;
      
      const mean = values.reduce((acc, val) => acc + val, 0) / n;
      const squareDiffs = values.map(value => {
        const diff = value - mean;
        return diff * diff;
      });
      
      const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / n;
      return Math.sqrt(avgSquareDiff);
    }
  }
  
  export default Calculator;
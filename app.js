const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Sample seed data
const database = [
  {
    id: 1,
    dateOfSale: '2022-01-01',
    price: 150,
    category: 'X',
    isSold: true
  },
  {
    id: 2,
    dateOfSale: '2022-02-01',
    price: 250,
    category: 'Y',
    isSold: true
  },
  {
    id: 3,
    dateOfSale: '2022-01-02',
    price: 300,
    category: 'X',
    isSold: false
  }
];

// Middleware to parse request bodies
app.use(bodyParser.json());

// API to initialize the database
app.post('/initialize', (req, res) => {
  const seedData = req.body;
  database.push(...seedData);
  res.json({ message: 'Database initialized successfully.' });
});

// API for statistics
app.get('/statistics', (req, res) => {
  const month = req.query.month;

  const totalSaleAmount = database
    .filter(item => item.dateOfSale.includes(month))
    .reduce((total, item) => total + (item.isSold ? item.price : 0), 0);

  const totalSoldItems = database.filter(item => item.dateOfSale.includes(month) && item.isSold).length;

  const totalNotSoldItems = database.filter(item => item.dateOfSale.includes(month) && !item.isSold).length;

  res.json({
    totalSaleAmount,
    totalSoldItems,
    totalNotSoldItems
  });
});

// API for bar chart
app.get('/bar-chart', (req, res) => {
  const month = req.query.month;

  const priceRanges = [
    { range: '0 - 100', count: 0 },
    { range: '101 - 200', count: 0 },
    { range: '201 - 300', count: 0 },
    { range: '301 - 400', count: 0 },
    { range: '401 - 500', count: 0 },
    { range: '501 - 600', count: 0 },
    { range: '601 - 700', count: 0 },
    { range: '701 - 800', count: 0 },
    { range: '801 - 900', count: 0 },
    { range: '901-above', count: 0 }
  ];

  database
    .filter(item => item.dateOfSale.includes(month))
    .forEach(item => {
      const priceRange = Math.floor(item.price / 100);
      if (priceRange < 10) {
        priceRanges[priceRange].count++;
      } else {
        priceRanges[9].count++;
      }
    });

  res.json(priceRanges);
});

// API for pie chart
app.get('/pie-chart', (req, res) => {
  const month = req.query.month;

  const categories = {};

  database
    .filter(item => item.dateOfSale.includes(month))
    .forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 1;
      } else {
        categories[item.category]++;
      }
    });

  res.json(categories);
});

// Combined API
app.get('/combined', (req, res) => {
  const month = req.query.month;

  const statisticsResponse = {
    endpoint: 'statistics',
    data: {}
  };

  const barChartResponse = {
    endpoint: 'bar-chart',
    data: {}
  };

  const pieChartResponse = {
    endpoint: 'pie-chart',
    data: {}
  };

  // Get statistics data
  const totalSaleAmount = database
    .filter(item => item.dateOfSale.includes(month))
    .reduce((total, item) => total + (item.isSold ? item.price : 0), 0);

  const totalSoldItems = database.filter(item => item.dateOfSale.includes(month) && item.isSold).length;

  const totalNotSoldItems = database.filter(item => item.dateOfSale.includes(month) && !item.isSold).length;

  statisticsResponse.data = {
    totalSaleAmount,
    totalSoldItems,
    totalNotSoldItems
  };

  // Get bar chart data
  const priceRanges = [
    { range: '0 - 100', count: 0 },
    { range: '101 - 200', count: 0 },
    { range: '201 - 300', count: 0 },
    { range: '301 - 400', count: 0 },
    { range: '401 - 500', count: 0 },
    { range: '501 - 600', count: 0 },
    { range: '601 - 700', count: 0 },
    { range: '701 - 800', count: 0 },
    { range: '801 - 900', count: 0 },
    { range: '901-above', count: 0 }
  ];

  database
    .filter(item => item.dateOfSale.includes(month))
    .forEach(item => {
      const priceRange = Math.floor(item.price / 100);
      if (priceRange < 10) {
        priceRanges[priceRange].count++;
      } else {
        priceRanges[9].count++;
      }
    });

  barChartResponse.data = priceRanges;

  // Get pie chart data
  const categories = {};

  database
    .filter(item => item.dateOfSale.includes(month))
    .forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 1;
      } else {
        categories[item.category]++;
      }
    });

  pieChartResponse.data = categories;

  res.json([statisticsResponse, barChartResponse, pieChartResponse]);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

import express from 'express';
import { calculateTotal } from './utilities/utilities.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to handle the purchase
app.post('/purchase', (req, res) => {
  const { cart, promoCode } = req.body;
  const { total, promoMessage } = calculateTotal(cart, promoCode); // Destructure the returned object
  res.json({ total, promoMessage }); // Return both total and promo message in the response
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

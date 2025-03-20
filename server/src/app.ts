import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import partnerRoutes from './routes/partnerRoutes';
import orderRoutes from './routes/orderRoutes';
import assignmentRoutes from './routes/assignmentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.set('debug', true);

// Middleware
app.use(bodyParser.json());
app.use('/api/partners', partnerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/assignments', assignmentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-delivery', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
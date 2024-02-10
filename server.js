const express = require('express')
const cors = require("cors");
const app = express()
const multer = require('multer');
const Ts = require('./models/tsModel');
const dotenv = require('dotenv');
dotenv.config();
//cors otions
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

const errorMiddleware = require('./middleware/error-middleware');

//connect database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL).then(() => {
  console.log("Successfully connect to MongoDB.");
})
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
// parse requests of content-type - application/json
app.use(express.json({ limit: '100mb' }));

//admin routes
app.use('/api/admin', require('./routes/admin/admin.routes'))
//user routes
app.use('/api/user', require('./routes/user/user.routes'))
//seller routes
app.use('/api/seller', require('./routes/seller/seller.routes'))
//localseller routes
app.use('/api/localseller', require('./routes/localseller/localseller.routes'))

// Create a Ts with image file
app.post('/api/product/add', upload.single('productImage'), (req, res) => {
  const { name } = req.body;
  const image = req.file.filename; // Get the filename of the uploaded image
  const ts = new Ts({ image, name });
  ts.save()
    .then(() => {
      res.json({ message: 'Ts created successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.get('/', async(req, res) => {
  res.send('localbazaars Backend Run Successfully!')
})
app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`server is running on ${PORT}`);
})



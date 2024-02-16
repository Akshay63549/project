const express = require('express')
const cors = require("cors");
const app = express()
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
//cors otions
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

const errorMiddleware = require('./middleware/error-middleware');

//connect database
const mongoose = require('mongoose');
const userModel = require('./models/userModel');
const cartModel = require('./models/cartModel');
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

app.get('/', async(req, res) => {
  res.send('localbazaars Backend Run Successfully!')
})



// app.post('/addtocart', async(req, res) => {
// try {
//   // const data = [{
//   //   product: "65cf3d9a4d369ec3fc7437db",
//   //   quantity: 4
//   // },
//   // {
//   //   product: "65cf3d9a4d369ec3fc7437db3",
//   //   quantity: 2
//   // },
//   // {
//   //   product: "65cf3d9a4d369ec3fc7437db2",
//   //   quantity: 7
//   // },
//   // {
//   //   product: "65cf3d9a4d369ec3fc7437db1",
//   //   quantity: 5
//   // },
//   // ];

//   const additionalData = [{
//     product: "65cf3d9a4d369ec3fc7437dc",
//     quantity: 3
//   },
//   {
//     product: "65cf3d9a4d369ec3fc7437dc2",
//     quantity: 1
//   }];

  
// const user=await userModel.findOne().select('_id')
// // Find the existing cart document by user ID
// console.log(user)
// await cartModel.findOne({ user: user?._id })
//   .then(cart => {
//     if (cart) {
//       console.log(cart)
//       // Update the products array
//       // cart.products = data.map(item => ({
//       //   product: item.product,
//       //   quantity: item.quantity
//       // }));
//       // Append the additional products to the existing products array
//             additionalData.forEach(item => {
//               cart.products.push({
//                 product: item.product,
//                 quantity: item.quantity
//               });
//             });
      

//       // Save the updated cart
//       return cart.save();
//     } else {
//       // If the cart doesn't exist, create a new one
//       const newCart = new cartModel({
//         user: user?._id,
//         products: data.map(item => ({
//           product: item.product,
//           quantity: item.quantity
//         }))
//       });

//       return newCart.save();
//     }
//   })
//   .then(updatedCart => {
//     console.log('Cart updated successfully:', updatedCart);
//     res.status(200).send(updatedCart)
//   })
//   .catch(error => {
//     console.error('Error updating cart:', error);
//   }); 
// } catch (error) {
//   console.log(error.message)
//   res.status(500).send(error.message)
// }
// })


app.post('/addtocart', async (req, res) => {
  try {
    const additionalData = [{
      product: "65cf3d9a4d369ecdsfsd3fc7437dcwgwegewegw",
      quantity: 3
    },
    {
      product: "65cf3d9a4d369ecvdsvdsvdvs3fcgewgewge7437dc2",
      quantity: 1
    }];

    // Assuming you have a user ID
    const user = await userModel.findOne().select('_id');
    console.log(user);

    // Find the existing cart document by user ID
    let cart = await cartModel.findOne({ user: user?._id });

    if (cart) {
      // Append the additional products to the existing products array
      additionalData.forEach(item => {
        cart.products.push({
          product: item.product,
          quantity: item.quantity
        });
      });
      // Save the updated products array
      cart = await cart.save();
      console.log('Cart updated successfully:', cart);
      res.status(200).send(cart);
    } else {
      // If the cart doesn't exist, create a new one
      const newCart = new cartModel({
        user: user?._id,
        products: additionalData.map(item => ({
          product: item.product,
          quantity: item.quantity
        }))
      });
      const savedCart = await newCart.save();
      console.log('New cart created:', savedCart);
      res.status(200).send(savedCart);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send(error.message);
  }
});



app.use(errorMiddleware);
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`server is running on ${PORT}`);
})



const crypto = require("crypto");
const Payment = require('../../models/paymentModel.js');
const Razorpay = require("razorpay")
const Order = require('../../models/orderModel');


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

exports.checkout = async (req, res) => {
 try {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
 } catch (error) {
  console.log(error.message)
  res.status(500).json(
    error.message
  );
 }
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const {order_id}=req.query
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here
const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
console.log(payment,'')
  const updates = { paymentstatus:'Paid',payment_id:payment?._id }; // Assuming status is a field in your Order model
  const options = { new: true}; 
  const orderupdate = await Order.findByIdAndUpdate(order_id, updates, options);
    res.redirect(
      `${process.env.FRONTENDURL}/myorders?reference=${razorpay_payment_id}&order_id=${order_id}`
    );
  } else {
  const updates = { paymentstatus:'Failed'}; // Assuming status is a field in your Order model
  const options = { new: true}; 
  const orderupdate = await Order.findByIdAndUpdate(order_id, updates, options);
    res.status(400).json({
      success: false,
    });
  }
};

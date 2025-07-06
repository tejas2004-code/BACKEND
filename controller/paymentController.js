const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()


let productInfo = {};
let userData = {};
let userInfo;
let totalAmount;
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Check if required environment variables are set
if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
  console.error("RAZORPAY_API_KEY or RAZORPAY_API_SECRET environment variables are not set");
}
const checkout = async (req, res) => {

  try {
    const { amount, userId, productDetails, userDetails } = req.body
    totalAmount = Number(amount)
    userInfo = userId
    productInfo = JSON.parse(productDetails)
    userData = JSON.parse(userDetails)


    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);


    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.log(error);
  }


};
// 

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  try {
    if (isAuthentic) {
      // First save the order in database
      try {
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          user: userInfo,
          productData: productInfo,
          userData,
          totalAmount
        });
        
        await Cart.deleteMany({ user: userInfo });
        
        // Send success response immediately
        res.status(200).json({ 
          success: true, 
          msg: "Order Confirmed",
          payment_id: razorpay_payment_id
        });

        // Try to send email after response
        if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
          console.error("EMAIL or EMAIL_PASSWORD environment variables are not set");
          return;
        }
        
        const transport = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com", // Fixed the host
          port: 587, // Changed to 587 for TLS
          secure: false, // Set to false for TLS
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
          },
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: userData.userEmail,
          subject: "Order Confirmation",
          html: `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Order Confirmation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  color: black;
                }
          
                h1 {
                  font-size: 24px;
                  margin-bottom: 20px;
                  color: black;
                }
          
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
          
                th {
                  text-align: left;
                  padding: 10px;
                  background-color: #eee;
                }
          
                td {
                  padding: 10px;
                  border: 1px solid #ddd;
                }
          
                .address {
                  margin-bottom: 20px;
                  color: black;

                }
          
                .address h2 {
                  font-size: 20px;
                  margin-bottom: 10px;
                }
          
                .address p {
                  margin: 0;
                }
          
                .thanks {
                  font-size: 18px;
                  margin-top: 20px;
                  color: black;

                }
          
                .signature {
                  margin-top: 40px;
                  color: black;

                }
          
                .signature p {
                  margin: 0;
                }
              </style>
            </head>
            <body>
              <h1>Order Confirmation</h1>
              <p style="color:black;">Dear <b>${userData.firstName} ${userData.lastName}</b>,</p>
              <p>Thank you for your recent purchase on our website. We have received your payment of <b>₹${totalAmount}</b> and have processed your order.</p>
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productInfo.map((product) => {
            return `
                              <tr>
                                <td>${product.productId.name}</td>
                                <td>${product.quantity}</td>
                                <td>₹${product.productId.price}</td>
                              </tr>
                            `
          }).join('')
            }
            <tr>
            <td>Shipping Charge</td>
            <td></td>
            <td>₹100</td>
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            <td>₹${totalAmount}</td>
          </tr>
                </tbody >
              </table >
              <div class="address">
                <h2>Shipping Address</h2>
                <p>${userData.firstName} ${userData.lastName}</p>
                <p>${userData.address}</p>
                <p>${userData.city}-${userData.zipCode}</p>
                <p>${userData.userState}</p>
              </div>
              <p class="thanks">Thank you for choosing our website. If you have any questions or concerns, please don't hesitate to contact us.</p>
              <div class="signature">
                <p>Best regards,</p>
                <p> <a href="https://e-shopit.vercel.app/" target="_blank">ShopIt.com</a></p>
              </div>
            </body >
          </html >
    `
        };

        // Send email without blocking the response
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Email sending failed:", error);
          } else {
            console.log("Email sent successfully:", info.response);
          }
        });

      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "Database operation failed" });
      }
    } else {
      res.status(400).json({
        success: false,
        msg: "Invalid payment signature"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Internal server error"
    });
  }
}


module.exports = { checkout, paymentVerification }
const ContactUs = require('../../models/contactusModel');
const nodemailer = require('nodemailer')
const config = require('../../config/config')
const Admin = require('../../models/adminModel')
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);


//contactus mail
const sendmail = async (firstName, lastName, email, suggestion) => {
  const admin = await Admin.findOne().populate('user')
  try {
    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: config.NODEMAILER_AUTH_USERNAME,
        pass: config.NODEMAILER_AUTH_PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    });
    var mailOptions = {
      from: email,
      to: admin.user.email,
      subject: "Contact Us Form Submission",
      html: `<p>Hi, You have new contact us form for the following data: <p>FirstName: ${firstName}<p><br> <p>LastName: ${lastName}<p><br> <p>Email: ${email}<p><br> <p>Suggestion: ${suggestion}<p><br> `
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err
      } else {
        return info
      }
    });


  } catch (error) {
    console.log(error)
  }

}

const sendmail2 = async (firstName, lastName, email, suggestion) => {
  try {
    // Retrieve admin data
    const admin = await Admin.findOne().populate('user');

    // Read email template file
    const template = await readFile('./email-template.html', 'utf8');

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: config.NODEMAILER_HOST,
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: config.NODEMAILER_AUTH_USERNAME,
        pass: config.NODEMAILER_AUTH_PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    });

    // Function to send email
    const sendEmail = async ( subject, html) => {
      await transporter.sendMail({
        from: email,
        to: admin.user.email,
        subject: subject,
        html: html
      });
      console.log('Email sent successfully');
    };

    // Example usage: Send email with dynamic content
    const emailData = {
      name: firstName + ' ' + lastName,
      email: 'john@example.com'
    };

    const subject = 'Test Email';
    const htmlContent = template.replace(/{{name}}/g, emailData.name)
                                .replace(/{{email}}/g, emailData.email);

    await sendEmail(subject, htmlContent);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};






//contactus
exports.contact_us = async (req, res) => {
  try {
    const { firstName, lastName, email, suggestion } = req.body
    //create a new message
    let contactus = await ContactUs.create({
      firstName, lastName, email, suggestion
    })
    const mailData = await sendmail(contactus.firstName, contactus.lastName, contactus.email, contactus.suggestion)
    // const mailData2 = await sendmail2(contactus.firstName, contactus.lastName, contactus.email, contactus.suggestion)
    const response = {
      success: true,
      message: 'Add contactus Successfully',
      data: contactus,
    }
    res.json(response)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}






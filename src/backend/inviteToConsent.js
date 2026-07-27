// import nodemailer from 'nodemailer'
// import express from 'express'
// import cors from 'cors'
// import dotenv from "dotenv";
// dotenv.config();
// const app = express()
// // Allow requests from your frontend origin
// app.use(cors({
//   origin: "*",
//   methods:['GET','OPTIONS','POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }));

// app.use((req, res, next) => {
//   console.log(`Incoming ${req.method} request to ${req.path}`);
//   console.log('Origin header:', req.headers.origin);
//   next();
// });

// app.use(express.json())

// app.options('/api/request', cors({
//   origin: process.env.VITE_FRONT_URL,
//   methods: ['POST'],
//   allowedHeaders: ['Content-Type'],
//   credentials: true
// }));

// app.get('/api/request',(req,res) =>{
//     res.send('message')
// })

// app.post('/api/request', async (req, res) =>{
//     console.log('Request body:', req.body); // <--- log incoming data

//     try {
//         const { interestId, email, topicId, role, currentTime} = req.body;

//         // check required fields
//         if (!interestId || !email || !topicId || !role || !currentTime) {
//             return res.status(400).json({
//             success: false, error: "Missing required parameters",
//             });
//         }

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD,
//             }
//         })
//         console.log({topicId: topicId, role: role, interestId: interestId, currentTime: currentTime});
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: "Fill the consent form",
//             text: `Hey! Please paste the link https://rankandmatch.com/consent?topicId=${topicId}&role=${role}&interestId=${interestId}&timeInvited=${currentTime} in your browser so you can fill the consent form. After completing this, you can be casted.`,
//             html: `
//                 <div style="font-family: Arial, sans-serif; color:#111;">
//                     <h1 style="color:#E11D48;">Hi!</h1>
//                     <p>Click the button to fill the consent form. Once this is completed, you will be casted:</p>
//                     <p>
//                     <a href="https://rankandmatch.com/consent?topicId=${topicId}&role=${role}&interestId=${interestId}&timeInvited=${currentTime}" 
//                         style="display:inline-block;padding:12px 20px;background:#ef4444;color:#fff;border-radius:8px;text-decoration:none;">
//                         Join the show
//                     </a>
//                     </p>
//                     <p style="font-size:12px;color:#666">If the button doesn't work, copy-paste the link into your browser.</p>
//                 </div>
//             `
//         };

//         // Send
//         try {
//             await transporter.sendMail(mailOptions);
//             res.json({ success: true, message: "Email sent successfully" });
//         } catch (mailErr) {
//             console.error("Nodemailer failed:", mailErr);
//             return res.status(500).json({ success: false, error: "Email send failed" });
//         }

//     } catch (err) {
//         console.error(`${err} tried sending email`);
//         res.status(500).json({ success: false, error: err.message });
//     }
// })

// app.listen(5000, () => console.log(`Server running on port 5000`))
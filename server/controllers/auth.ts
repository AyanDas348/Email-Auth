import { request } from "http";

const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD";
const { totp } = require("otplib");
totp.options = { digits: 6, step: 300 };

const signup = async (req: { body: { email: any; password: any; }; }, res: { json: (arg0: { error?: string; ok?: boolean; }) => any; status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): any; new(): any; }; }; }) => {
  const { email, password } =
    req.body;
  //validation -> checking whether the user input datas are valid or not

  //The await operator is used to wait for a Promise .
  if (!email) {
    return res.json({
      error: "Email id is required",
    });
  } else {
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email already exists",
      });
    }
  }

  if (!password || password.length < 8 || password.length > 32) {
    return res.json({
      error: "Password is required and it must contains 8 - 32 characters",
    });
  };

  //MailChimp
  //Construct req data
  const data = {
    members: [
      {
        email: email,
        status: 'signed up',
        merge_fields: {
          FNAME: '',//firstName
          LNAME: ''//lastName 
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const response = await fetch('MailChimp API/Lists/action',{
    method: 'POST',
    headers: {
      Authorization: 'auth /API key/'
    },
    body: postData
  })

  const user = new User({
    email: email,
    password: password,
  });

  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Registration failed", err);
    return res.status(400)//.send(err.response.data); redirect
  }
};

const signin = async (req: { body: { email: any; password: any; }; }, res: { json: (arg0: { error?: string; user?: any; jwtToken?: any; }) => any; }) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // console.log(user);

    if (!user) {
      return res.json({
        error: "Invalid Email Address",
      });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.json({
        error: "Invalid User Password",
      });
    }

    //creating a jwt token for valid user and send it to client for easy and safe communication between client and server
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_CODE, {
      expiresIn: "5d",
    });

    user.password = undefined;
    user.securityQuestion = undefined;
    user.security = undefined;

    return res.json({
      user,
      jwtToken,
    });
  } catch (err) {
    return res.json({
      error: "Something wrong happened!! Try Again..",
    });
  }
};

const getUserData = async (req: { user: { _id: any; }; }, res: { json: (arg0: { ok: boolean; }) => void; sendStatus: (arg0: number) => void; }) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        ok: true,
      });
    }
  } catch (err) {
    res.sendStatus(400);
  }
};

const sendEmail = async (req: { body: { email: any; }; }, res: { json: (arg0: { error?: string; code?: any; }) => any; }) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      error: "Email Id is not registered",
    });
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "enter",
      pass: "enter",
    },
  });

  //generate a random token of 6 digits
  const code = totp.generate(secret);

  var mailOptions = {
    from: "enter",
    to: `${email}`,
    subject: `Hello ${user.name}!! Verification Code`,
    text: `${code}`,
  };

  transporter.sendMail(mailOptions, async (error: any, info: any) => {
    if (error) {
      return res.json({
        error: "Something wrong happened.. try again!!",
      });
    } else {
      return res.json({
        code: code,
      });
    }
  });
};

const verifyCode = async (req: { body: { email: any; verificationCode: any; }; }, res: { json: (arg0: { error?: unknown; ok?: boolean; }) => any; }) => {
  const {
    email,
    verificationCode,
  } = req.body;

  try {
    const isValid = totp.check(verificationCode, secret);
    if (!isValid) {
      return res.json({
        error: "Verification Failed..",
      });
    }

    return res.json({
      ok: true,
    });
  } catch (err) {
    return res.json({
      error: err,
    });
  }
};

module.exports = [
  signup,
  signin,
  getUserData,
  sendEmail,
  verifyCode,
];


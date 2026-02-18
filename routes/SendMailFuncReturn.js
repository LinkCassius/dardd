const express = require("express");
var nodeMailer = require("nodemailer");
const { User } = require("../models/User");
const Config = require("../config/config");
const { mailSettings, siteUrl } = Config;

const sendMailFunctionReturn = async (
  activeIndex,
  msgx,
  mailSubject,
  mailBody,
  userid,
  fn
) => {
  try {
    let hrf = siteUrl + "/?activeIndex=" + activeIndex;
    let link = ""; //for approver has to be change after approval workflow

    //if (msgx && msgx !== "Approver")
    // link = "<a href='" + hrf + "'>Click here to view</a>";

    let userInfo = await User.findById(userid);
    let transporter = nodeMailer.createTransport({
      host: mailSettings.host,
      port: mailSettings.port,
      secure: mailSettings.secure,
      auth: {
        user: mailSettings.mailId,
        pass: mailSettings.mailPwd,
      },
    });

    let mailOptions = {
      from: '"DARDLEA Notification"' + mailSettings.mailId, // sender address
      to: userInfo.email, // list of receivers
      subject: mailSubject, // Subject line
      //text:  req.body.subject, // plain text body
      html:
        "<div style='font-family: Trebuchet MS;font-size:14px; color:darkblue'>" +
        "Dear " +
        userInfo.firstName +
        " " +
        userInfo.lastName +
        ", <br/>" +
        "Please see the below details: <br/>" +
        "<b>" +
        mailBody +
        "</b><br/>" +
        link +
        "<br/><br/>- Thank you" +
        "</div>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        fn(error);
      } else {
        console.log("Message %s sent: %s", info.messageId, info.response);
        fn(info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendMailFunctionReturn;

const { EmailClient } = require("@azure/communication-email");
const { User } = require("../models/User");
const Config = require("../config/config");
const { acsEmail = {}, siteUrl } = Config;

// Build client from primary or secondary connection string
function buildClient(useSecondary = false) {
  const cs = useSecondary ? acsEmail.secondaryConnectionString : acsEmail.primaryConnectionString;
  if (!cs) {
    throw new Error(
      useSecondary ? "Missing ACS secondary connection string" : "Missing ACS primary connection string"
    );
  }
  return new EmailClient(cs);
}

// Escape helper for safe HTML
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build the optional link like your old code (only when msgx && msgx !== "Approver")
function linkFor(activeIndex, msgx) {
  if (msgx && msgx !== "Approver") {
    const href = `${siteUrl}/?activeIndex=${encodeURIComponent(activeIndex)}`;
    return `<a href="${href}">Click here to view</a>`;
  }
  return "";
}

// Core sender with fallback to secondary on auth errors
async function sendCore(email) {
  let client = buildClient(false);
  try {
    const poller = await client.beginSend(email);
    const res = await poller.pollUntilDone();
    return {  id: res && res.id ? res.id : null, status: res && res.status ? res.status : "Unknown" };
  } catch (err) {
    const msg = String(err && err.message || "").toLowerCase();
    const authish =
      msg.includes("unauthoriz") ||
      msg.includes("forbidden") ||
      msg.includes("401") ||
      msg.includes("403");
    if (authish && acsEmail.secondaryConnectionString) {
      const poller = await buildClient(true).beginSend(email);
      const res = await poller.pollUntilDone();
      return { id: res && res.id ? res.id : null, status: res && res.status ? res.status : "Unknown", usedSecondary: true };
    }
    throw err;
  }
}

function sendMailFunctionACS(activeIndex, msgx, mailSubject, mailBody, userid, callback) {
  const exec = async () => {
    if (!acsEmail && acsEmail.senderAddress) throw new Error("Missing acsEmail.senderAddress in config");

    // 1) Lookup recipient (same as your code)
    const user = await User.findById(userid);
    if (!user || !user.email) throw new Error("User email not found");

    // 2) Build HTML body closely matching your template
    const html =
    `<div style="font-family:Trebuchet MS;font-size:14px;color:darkblue">
    Dear ${escapeHtml(user.firstName || "")} ${escapeHtml(user.lastName || "")},<br/>
    Please see the below details:<br/>
    ${mailBody || ""}
    ${linkFor(activeIndex, msgx)}
    <br/>- Thank you
    <br/>This is an automated email. Please do not reply to this message.<br/>
  </div>`;

    // 3) Build ACS email
    const email = {
      senderAddress: acsEmail.senderAddress,
      recipients: { to: [{ address: user.email }] },
      content: { subject: mailSubject, html, plainText: undefined },
      replyTo: [], // add if you need: [{ address: "support@yourdomain.com" }]
      attachments: [],
      userEngagementTrackingDisabled:
        typeof acsEmail.userEngagementTrackingDisabled === "boolean"
          ? acsEmail.userEngagementTrackingDisabled
          : true, // default to true
    };
    // 4) Send
    return await sendCore(email);
  };

  if (typeof callback === "function") {
    exec().then(r => callback(null, r)).catch(e => callback(e));
  } else {
    return exec();
  }
}

// Export with BOTH names so you can replace either import without touching call sites
module.exports = {
  sendMailFunc: sendMailFunctionACS,
  sendMailFunc: sendMailFunctionACS,
  sendMailFunctionACS
};

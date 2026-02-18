// testSend.js
require("dotenv").config(); // if you keep secrets in .env
const { sendMailFunction } = require("./SendMailACS");

// Replace with a real userid from your DB
const TEST_USER_ID = "5f72e86e211bbb0035899415"; // example Mongo ObjectId string

(async () => {
  try {
    console.log("Starting ACS email test...");

    const result = await sendMailFunction(
      5,                  // activeIndex
      "Requester",         // msgx
      "Test Subject",      // mailSubject
      "This is a test body sent via ACS EmailClient from Node.js", // mailBody
      TEST_USER_ID         // userid from DB
      // no callback => Promise/await mode
    );

    console.log("ACS email send result:", result);
  } catch (err) {
    console.error("ACS email send failed:", err);
  }
})();

import { ApiEndPoints } from "../config";

const mailhelpers = {
  sendMail: function (id, mailSubject, mailBody, msgx, activeIndex = 0) {
    var formpojo = {};
    formpojo.mailSubject = mailSubject;
    formpojo.mailBody = mailBody;
    formpojo.msgx = msgx;
    fetch(ApiEndPoints.sendMail + "/" + id + "?activeIndex=" + activeIndex, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formpojo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          // NotificationManager.success("Mail Sent Successfully to " + msgx);
        } else {
          //this.setState({ responseError: data.msg });
        }
      })
      .catch("error", console.log);
  },
};
export default mailhelpers;

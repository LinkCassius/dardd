const { ScreenCategory, validate } = require("../models/screencategory");
const express = require("express");
const router = express.Router();
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

router.get("/api/screens", auth, async (req, res) => {
  const screencategories = await ScreenCategory.find();
  // .populate("screen", "name")
  // .sort("name");
  //res.send(screencategories);
  res.status(200).json({
    success: true,
    responseCode: 200,
    result: screencategories,
    msg: "List fetching successfully",
  });
});

module.exports = router;

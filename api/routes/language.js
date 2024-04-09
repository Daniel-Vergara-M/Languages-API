const express = require("express");
const HttpStatus = require("http-status-codes");

const router = express.Router();
const Config = require("../models/config");

router.use(express.json());

router.get("/", async (req, res, next) => {
  const { guildID } = req.query;

  if (!guildID) {
    let newData = {
      code: HttpStatus.StatusCodes.OK,
      language: req.app.locals["en"],
    };
    res.send(newData);
    return;
  }

  try {
    const data = await Config.findOne({ guildID });

    if (!data) {
      return res
        .status(HttpStatus.StatusCodes.NOT_FOUND)
        .send({ error: "Guild not found." });
    }

    let dataToSend = req.app.locals[data.language];
    let newData = {
      code: HttpStatus.StatusCodes.OK,
      guildID: data.guildID,
      language: dataToSend,
    };
    res.send(newData);
  } catch (err) {
    next(err);
  }
});

router.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

module.exports = router;

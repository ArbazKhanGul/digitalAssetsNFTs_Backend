const multer = require("multer");

// set storeage

var storege = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },

  filename: function (req, file, cb) {

    let fieldname=file.fieldname;
    console.log(req.user[fieldname]);
    cb(null, req.user[fieldname]);
  },
});

store = multer({ storage: storege });

module.exports = store;
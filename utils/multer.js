//? picture extension handling
const multer = require("multer");
const {v4: uuid} = require("uuid");
exports.fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb('mimetype-error', false)
    }

}
const fileAddress = "F:/study/Node js/NodeJS-TopLearn/project/mongodb/public/uploads/images";

exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, fileAddress);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}_${file.originalname}`);
    },
});


import multer from "multer";
import { HTTP_STATUS_CODES } from "../libs/http-status.js";
const MAX_FILE_SIZE = 5 * 1024 * 1024; //its 5mb
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype !== "application/pdf") {
            req.fileError = true;
            callback(null, false);
        }
        else if (file.size > MAX_FILE_SIZE) {
            req.fileSizeError = true;
            callback(null, false);
        }
        else {
            callback(null, true);
        }
    },
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});
export function checkFileType(req, res, next) {
    if (req.fileError) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: "Invalid file type. Only PDF files are allowed.",
        });
    }
    else if (req.fileSizeError) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            message: `File too large. Maximum size allowed is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
        });
    }
    next();
}
//# sourceMappingURL=file.upload.middleware.js.map
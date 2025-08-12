import { Response } from "express";
import { processAndUploadImagesService } from "../../../../services/media/media.service";
import { MulterImageRequest } from "../../models/muler-image-request.model";
import HttpError from "../../../../utils/error/http-error";
import { AuthenticatedRequest } from "../../models/authenticated-request.model";
import sharp from "sharp";

const ALLOWED_EXTENSIONS = ['jpeg', 'png', 'webp', 'tiff', 'gif', 'avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILENAME_LENGTH = 100;

function isValidExtension(filename: string): boolean {
    const ext = filename.split(".").pop()?.toLowerCase();
    return !!ext && ALLOWED_EXTENSIONS.includes(ext);
}

async function validateUploadInput(file: Express.Multer.File | undefined) {
    if (!file) throw new HttpError(400, "Image is required");

    if (!file.buffer || !(file.buffer instanceof Buffer)) {
        throw new HttpError(400, "Invalid or missing file buffer");
    }

    if (!file.originalname || file.originalname.length > MAX_FILENAME_LENGTH) {
        throw new HttpError(400, `Filename too long (max ${MAX_FILENAME_LENGTH} chars)`);
    }

    if (!file.buffer || !(file.buffer instanceof Buffer)) {
        throw new HttpError(400, "Invalid or missing file buffer");
    }

    if (!file.originalname || file.originalname.length > MAX_FILENAME_LENGTH) {
        throw new HttpError(400, `Filename too long (max ${MAX_FILENAME_LENGTH} chars)`);
    }

    if (!file.mimetype.startsWith("image/")) {
        throw new HttpError(400, "File must be an image");
    }

    if (!isValidExtension(file.originalname)) {
        throw new HttpError(400, `Unsupported file extension. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new HttpError(400, `Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    const metadata = await sharp(file.buffer).metadata();    

    if (!ALLOWED_EXTENSIONS.includes(metadata.format || '')) {
      throw new HttpError(400, 'Unsupported image format');
    }    
}

export async function uploadImagesController(
    req: AuthenticatedRequest & MulterImageRequest,
    res: Response
) {    
    const files = req.files;

    if (!Array.isArray(files) || files.length === 0) {
        throw new HttpError(400, "At least one image is required");
    }

    const uploadPromises = files.map(async file => {
       await validateUploadInput(file);

        return await processAndUploadImagesService(file);
    });

    const results = await Promise.all(uploadPromises);
    
    res.status(200).json({ success: true, urls: results });
}
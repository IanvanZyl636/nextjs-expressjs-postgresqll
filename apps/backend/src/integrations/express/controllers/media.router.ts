import { Request, Response } from "express";
import HttpError from "../../../utils/error/http-error";
import { Readable } from "stream";
import { downloadMediaService } from "../../../services/media/media.service";

export async function mediaController(
    req: Request,
    res: Response
) {
    const fileId = req.params.fileId;
    if (!fileId) throw new HttpError(400, "File ID is required");

    const data = await downloadMediaService(fileId);

    res.setHeader('Content-Type', data.ContentType || 'image/jpeg');
    
    (data.Body as Readable).pipe(res);
}
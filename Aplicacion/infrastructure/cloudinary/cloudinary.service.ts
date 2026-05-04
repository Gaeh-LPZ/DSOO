import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }

    async uploadImage(buffer: Buffer, folder: string = 'products'): Promise<string> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },  // Limita tamaño máximo
                        { quality: 'auto' }  // Optimización automática
                    ]
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result!.secure_url)
                }
            )
            //uploadStream.end(buffer)
            streamifier.createReadStream(buffer).pipe(stream)
        })
    }

    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId)
    }
}
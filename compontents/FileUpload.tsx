"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (res: unknown) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}


const FileUpload = ({
    onSuccess,
    onProgress,
    fileType,
}: FileUploadProps) => {


    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Optional Validation 
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Invalid file type. Please upload a video.");
                return false;
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size exceeds the limit. Please upload a file smaller than 100MB.");
            return false;
        }
        return true;
    }


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !validateFile(file)) {
            return;
        }
        setUploading(true)
        setError(null)
        try {
            const auth = await fetch("api/auth/imagekit_auth").then((res) => res.json())
            const reponse = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent));
                    }
                },
            });
            onSuccess(reponse);
        }
        catch (error) {
            console.error("upload failed", error);
        }
        finally {
            setUploading(false);
        }
    }
    return (
        <>
            <input type="file"
                accept={
                    fileType === "video" ? "video/*" : "image/*"
                }
                onChange={handleFileChange}
            />
            {uploading && (
                <span>Loading.......</span>
            )}

        </>
    );
};

export default FileUpload;
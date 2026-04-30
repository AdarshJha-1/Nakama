import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import { toast } from "sonner";

export interface Attachment {
    file: File;
    mediaId?: string;
    isUploading: boolean
}

export default function useMediaUpload() {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>();

    const { startUpload, isUploading } = useUploadThing("attachment", {
        onBeforeUploadBegin(files) {
            const renamedFiles = files.map(file => {
                const extension = file.name.split(".").pop();
                return new File(
                    [file],
                    `attachment_${crypto.randomUUID()}.${extension}`,
                    {
                        type: file.type
                    }
                )
            })
            setAttachments(prev => [
                ...prev,
                ...renamedFiles.map(file => ({ file, isUploading: true }))
            ])
            return renamedFiles
        },
        onUploadProgress: setUploadProgress,
        onClientUploadComplete(res) {
            setAttachments(prev => prev.map(a => {
                const uploadResult = res.find(r => r.name === a.file.name);
                if (!uploadResult) return a;
                return {
                    ...a,
                    mediaId: uploadResult.serverData.mediaId,
                    isUploading: false
                }
            }))
        },
        onUploadError(e) {
            setAttachments(prev => prev.filter(a => !a.isUploading))
            toast.error(e.message)
        },
    })

    function handleStartUpload(files: File[]) {
        if (isUploading) {
            toast.warning("please wait for the current upload to finish.")
            return;
        }

        if (attachments.length + files.length > 4) {
            toast.warning("You can only upload 4 attachment per post.")
            return;
        }

        startUpload(files);
    }
    function removeAttachment(fileName: string) {
        setAttachments(prev => prev.filter(a => a.file.name !== fileName))
    }

    function resetMediaUpload() {
        setAttachments([]);
        setUploadProgress(undefined);

    }
    return {
        startUpload: handleStartUpload,
        attachments,
        isUploading,
        uploadProgress,
        removeAttachment,
        resetMediaUpload
    }
}

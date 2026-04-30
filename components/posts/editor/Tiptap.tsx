'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useSession } from '@/app/(main)/SessionProvider'
import { Button } from '@/components/ui/button'
import "./styles.css"
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useSubmitPostMutation } from './PostMutation'
import useMediaUpload, { Attachment } from './useMediaUpload'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'


const Tiptap = () => {

    const mutation = useSubmitPostMutation()

    const { attachments, isUploading, removeAttachment, resetMediaUpload,
        startUpload, uploadProgress
    } = useMediaUpload()

    const [isDisable, setIsDisable] = useState(true);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false
            }),
            Placeholder.configure({
                placeholder: "post on weeb"
            })
        ],
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            setIsDisable(!editor.getText().trim());
        },
        onUpdate: ({ editor }) => {
            setIsDisable(!editor.getText().trim());
        },
    })
    function onSubmit() {
        if (!editor) {
            return;
        }
        const content = editor.getText({ blockSeparator: "\n" }).trim();
        if (!content) {
            return;
        }
        mutation.mutate({
            content: content,
            mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[],
        }, {
            onSuccess: () => {
                editor.commands.clearContent();
                resetMediaUpload();
            }
        })

    }

    const { user } = useSession();

    return <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-5">
            <Image className="rounded-full aspect-square flex-none object-cover h-fit" src={user.image as string} width={60} height={60} alt="avatar" />
            <div className="w-full">
                <EditorContent editor={editor} className='w-full max-h-80 overflow-auto px-5 py-3 bg-background rounded-2xl' />
            </div>
        </div>
        {!!attachments.length && (
            <AttachmentsPreviews attachments={attachments} removeAttachment={removeAttachment} />
        )}
        <div className="flex justify-end">
            {isUploading && (
                <>
                    <span className='text-sm'>{uploadProgress ?? 0}%</span>
                    <Loader2 className='size-5 animate-spin text-primary' />
                </>
            )}
            <AddAttachmentButton disabled={isUploading || attachments.length >= 5} onFilesSelected={startUpload} />
            <Button className='min-w-20 cursor-pointer' variant={"outline"} onClick={onSubmit} disabled={mutation.isPending}>Post</Button>
        </div>
    </div >
}

export default Tiptap



interface AttachmentsPreviewsProps {
    attachments: Attachment[];
    removeAttachment: (fileName: string) => void;
}

function AttachmentsPreviews({ attachments, removeAttachment }: AttachmentsPreviewsProps) {
    return <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
        {attachments.map(attachment => (
            <AttachmentPreview key={attachment.file.name} attachment={attachment} onRemoveClick={() => removeAttachment(attachment.file.name)} />
        ))}
    </div>
}

interface AttachmentsButtonProps {
    onFilesSelected: (files: File[]) => void,
    disabled: boolean
}

function AddAttachmentButton({ disabled, onFilesSelected }: AttachmentsButtonProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    return <>
        <Button variant={"ghost"} className="hover:text-primary text-primary" disabled={disabled} onClick={() => fileInputRef.current?.click()} >
            <ImageIcon size={20} />
        </Button>
        <input type='file' accept='image/*, video/*' multiple ref={fileInputRef} className='hidden sr-only' onChange={
            (e) => {
                const files = Array.from(e.target.files || [])
                if (files.length) {
                    onFilesSelected(files);
                    e.target.value = ""
                }

            }} />
    </>
}

interface AttachmentPreviewProps {
    attachment: Attachment;
    onRemoveClick: () => void;
}


function AttachmentPreview({
    attachment: { file, isUploading },
    onRemoveClick
}: AttachmentPreviewProps) {
    const src = URL.createObjectURL(file);

    return (
        <div
            className={cn(
                "relative w-full h-full overflow-hidden rounded-2xl group",
                "bg-black/5",
                isUploading && "opacity-50"
            )}
        >
            {file.type.startsWith("image") ? (
                <Image
                    src={src}
                    alt="attachment preview"
                    width={500}
                    height={500}
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-300",
                        "group-hover:scale-[1.03]"
                    )}
                />
            ) : (
                <video
                    controls
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-300",
                        "group-hover:scale-[1.03]"
                    )}
                >
                    <source src={src} type={file.type} />
                </video>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {!isUploading && (
                <button
                    onClick={onRemoveClick}
                    className={cn(
                        "absolute top-2 right-2",
                        "rounded-full p-2",
                        "bg-black/40 backdrop-blur-md",
                        "text-white",
                        "opacity-0 scale-90",
                        "group-hover:opacity-100 group-hover:scale-100",
                        "transition-all duration-200",
                        "hover:bg-black/60"
                    )}
                >
                    <X size={18} />
                </button>
            )}
        </div>
    );
}
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useSession } from '@/app/(main)/SessionProvider'
import { Button } from '@/components/ui/button'
import "./styles.css"
import Image from 'next/image'
import { useState } from 'react'
import { createPostAction } from './createPostAction'


const Tiptap = () => {
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
    async function onSubmit() {
        if (!editor) {
            return;
        }
        const content = editor.getText({ blockSeparator: "\n" }).trim();
        if (!content) {
            return;
        }
        console.log(content);
        const post = await createPostAction({ content })
        console.log(post);

        editor.commands.clearContent();
    }

    const { user } = useSession();

    return <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-5">
            <Image className="rounded-full aspect-square flex-none object-cover h-fit" src={user.image as string} width={60} height={60} alt="avatar" />
            <div className="w-full">
                <EditorContent editor={editor} className='w-full max-h-80 overflow-auto px-5 py-3 bg-background rounded-2xl' />
            </div>

        </div>
        <div className="flex justify-end">
            <Button className='min-w-20 cursor-pointer' variant={"outline"} onClick={onSubmit} disabled={isDisable}>Post</Button>
        </div>
    </div >
}

export default Tiptap
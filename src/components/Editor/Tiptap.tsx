'use client'

import { Placeholder } from '@tiptap/extensions'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './style.css'
const Tiptap = () => {
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
    })

    const input = editor?.getText({
        blockSeparator: "\n"
    }) || "";


    return <EditorContent
        editor={editor}
        className="w-full max-h-[200px] overflow-y-auto rounded-2xl dark:text-black bg-[#eceade] px-5 py-3" />

}

export default Tiptap
"use client"

import { Button } from "@/components/ui/button"
import { UserDTO } from "@/lib/types"
import { useState } from "react"
import EditProfile from "./EditProfile"

interface EditButtonProps {
    user: UserDTO
}

export function EditButton({ user }: EditButtonProps) {

    const [open, setIsOpen] = useState(false)

    return (
        <>
            <Button variant={"outline"} onClick={() => setIsOpen(true)}>Edit Profile</Button>
            <EditProfile user={user} open={open} onOpenChange={setIsOpen} />
        </>
    )
}

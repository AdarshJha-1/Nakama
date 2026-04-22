"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import { useUpdateProfileMutation } from "./mutation"
import { useState } from "react"

interface EditButtonProps {
    name: string
}

export function EditButton({ name }: EditButtonProps) {

    const [isOpen, setIsOpne] = useState(false)

    const mutation = useUpdateProfileMutation()
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // mutation.mutate(
        //     { value },
        //     {
        //         onSuccess: () => {
        //             setIsOpne(false)
        //         }
        //     }
        // )
        e.preventDefault()
        setIsOpne(false)
        console.log("Click");


    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpne}>
            <form onSubmit={onSubmit}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Edit /> Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <AvatarUpdate />
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue={name} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={mutation.isPending} variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

function AvatarUpdate() {
    return (
        <input type="file" className="" />
    )
}
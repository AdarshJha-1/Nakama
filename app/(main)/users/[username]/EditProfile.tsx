import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Resizer from "react-image-file-resizer";

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserDTO } from "@/lib/types"
import { updateUserProfileSchema, UpdateUserProfileType } from "@/lib/validation"
import { useUpdateProfileMutation } from "./mutation"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image, { StaticImageData } from "next/image"
import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import CropImage from "@/components/CropImage"

interface EditProfileProps {
    user: UserDTO
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditProfile({ user, open, onOpenChange }: EditProfileProps) {
    const form = useForm<UpdateUserProfileType>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            name: user.name
        }
    })
    const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)
    const mutation = useUpdateProfileMutation();

    async function onSubmit(values: UpdateUserProfileType) {

        const newAvatar = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined

        mutation.mutate(
            {
                values: values,
                avatar: newAvatar
            },
            {
                onSuccess: () => {
                    setCroppedAvatar(null)
                    onOpenChange(false)
                }
            }
        )
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-1.5">
                    <FieldLabel>Avatar</FieldLabel>
                    <AvatarInput
                        src={
                            croppedAvatar
                                ? URL.createObjectURL(croppedAvatar)
                                : user.image as string
                        }
                        onImageCrop={setCroppedAvatar}
                    />
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Login button not working on mobile"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface AvatarInputProps {
    src: string | StaticImageData
    onImageCrop: (blob: Blob | null) => void
}

function AvatarInput({ onImageCrop, src }: AvatarInputProps) {
    const [imageToCrop, setImageToCrop] = useState<File>()

    const ref = useRef<HTMLInputElement>(null)
    function onImageSelected(image: File | undefined) {
        if (!image) return
        Resizer.imageFileResizer(
            image,
            1024,
            1024,
            "WEBP",
            100,
            0,
            (uri) => setImageToCrop(uri as File),
            "file"
        )
    }

    return (
        <>
            <input type="file" accept="image/*" onChange={(e) => onImageSelected(e.target.files?.[0])} ref={ref} className="hidden sr-only " />
            <button onClick={() => ref.current?.click()} className="group relative block">
                <Image src={src} alt="user-profile-image" width={150} height={150} className="s-32 rounded-full flex-none object-cover" />
                <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/30 text-white transition-colors duration-200 group-hover:bg-black/25">
                    <Camera size={24} />
                </span>
            </button>
            {
                imageToCrop &&
                <CropImage
                    src={URL.createObjectURL(imageToCrop)}
                    onCropped={onImageCrop}
                    cropAspectRatio={1}
                    onClose={() => {
                        setImageToCrop(undefined)
                        if (ref.current) {
                            ref.current.value = ""
                        }
                    }}
                />
            }
        </>
    )
}
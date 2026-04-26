
import React, { useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface CropImageProps {
    src: string;
    cropAspectRation: number;
    onCropped: (blob: Blob | null) => void
    onClose: () => void
}
export default function CropImage({ cropAspectRation, onClose, onCropped, src }: CropImageProps) {

    const cropperRef = useRef<ReactCropperElement>(null);
    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;
        cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp")
        onClose()
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>
                <Cropper
                    src={src}
                    initialAspectRatio={cropAspectRation}
                    guides={false}
                    zoomable={false}
                    ref={cropperRef}
                    className="mx-auto size-fit"
                />
                <DialogFooter>
                    <Button variant={"secondary"} onClick={onClose}>Cancel</Button>
                    <Button onClick={onCrop}>Crop</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
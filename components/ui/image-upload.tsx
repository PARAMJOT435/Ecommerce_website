"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value: string | File | null
    onChange: (value: string | File | null) => void
    disabled?: boolean
    className?: string
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(
        typeof value === "string" ? value : value ? URL.createObjectURL(value) : null
    )

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                onChange(file)
                setPreview(URL.createObjectURL(file))
            }
        },
        [onChange]
    )

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(null)
        setPreview(null)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
            "image/jpg": [],
        },
        maxFiles: 1,
        disabled,
    })

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 transition-colors hover:bg-neutral-100",
                    isDragActive && "border-primary-500 bg-primary-50",
                    disabled && "cursor-not-allowed opacity-50 hover:bg-neutral-50",
                    preview && "border-solid border-neutral-200 p-0 overflow-hidden h-64"
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative h-full w-full">
                        <Image
                            src={preview}
                            alt="Upload preview"
                            fill
                            className="object-contain"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-neutral-600 shadow-sm transition-colors hover:bg-red-100 hover:text-red-600"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-2">
                            {isDragActive ? (
                                <UploadCloud className="h-6 w-6 text-primary-600" />
                            ) : (
                                <ImageIcon className="h-6 w-6 text-neutral-400" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-neutral-700">
                                {isDragActive ? (
                                    "Drop the image here"
                                ) : (
                                    <>
                                        <span className="text-primary-600">Click to upload</span> or drag and drop
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-neutral-500">
                                SVG, PNG, JPG or WebP (max. 5MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

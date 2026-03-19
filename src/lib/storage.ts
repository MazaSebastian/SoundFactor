"use client";

import { createClient } from "@/lib/supabase/client";

type BucketName = "product-images" | "audio-demos" | "digital-products";

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL (for public buckets) or the file path (for private ones).
 */
export async function uploadFile(
    bucket: BucketName,
    file: File,
    folder?: string
): Promise<string> {
    const supabase = createClient();

    // Build a unique path: folder/timestamp-filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = folder
        ? `${folder}/${timestamp}-${sanitizedName}`
        : `${timestamp}-${sanitizedName}`;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    // For public buckets, return the full public URL
    if (bucket === "product-images" || bucket === "audio-demos") {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    }

    // For private buckets (digital-products), return just the path
    return filePath;
}

/**
 * Delete a file from a Supabase Storage bucket by its URL or path.
 */
export async function deleteFile(
    bucket: BucketName,
    fileUrlOrPath: string
): Promise<void> {
    const supabase = createClient();

    // Extract the path from a full public URL if needed
    let path = fileUrlOrPath;
    if (fileUrlOrPath.includes("/storage/v1/object/public/")) {
        const parts = fileUrlOrPath.split(`/storage/v1/object/public/${bucket}/`);
        path = parts[1] || fileUrlOrPath;
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
}

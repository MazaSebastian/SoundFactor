import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase/server";

/* ============================================
   FACTORY — Bulk Upload API
   
   Receives a ZIP file, extracts audio files,
   parses metadata from filenames, uploads to
   Supabase Storage, and creates sample records.
   
   Filename convention: BPM_Key_Genre_Instrument_Name.wav
   Example: 128_Cm_Trap_HiHat_01.wav
   ============================================ */

const AUDIO_EXTENSIONS = [".wav", ".mp3", ".flac", ".ogg"];
const BUCKET = "factory-samples";

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Parse metadata from filename convention: BPM_Key_Genre_Instrument_NameParts.ext
 */
function parseFilename(filename: string) {
    const baseName = filename.replace(/\.[^.]+$/, ""); // remove extension
    const parts = baseName.split("_");

    let bpm: number | undefined;
    let musical_key: string | undefined;
    let genre: string | undefined;
    let instrument_type: string | undefined;
    let titleParts: string[] = [];

    if (parts.length >= 4) {
        // Convention: BPM_Key_Genre_Instrument_RestOfName
        const maybeBpm = parseInt(parts[0], 10);
        if (!isNaN(maybeBpm) && maybeBpm >= 40 && maybeBpm <= 300) {
            bpm = maybeBpm;
            musical_key = parts[1];
            genre = parts[2];
            instrument_type = parts[3];
            titleParts = parts.slice(4);
        } else {
            titleParts = parts;
        }
    } else {
        titleParts = parts;
    }

    // Build a readable title
    const title =
        titleParts.length > 0
            ? titleParts.join(" ")
            : [instrument_type, genre, bpm?.toString()].filter(Boolean).join(" ") || baseName;

    return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        slug: slugify(baseName),
        bpm,
        musical_key,
        genre,
        instrument_type,
    };
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        // Read ZIP from FormData
        const formData = await req.formData();
        const zipFile = formData.get("file") as File | null;

        if (!zipFile) {
            return NextResponse.json({ error: "No se recibió archivo ZIP" }, { status: 400 });
        }

        const zipBuffer = await zipFile.arrayBuffer();
        const zip = await JSZip.loadAsync(zipBuffer);

        const created: string[] = [];
        const errors: string[] = [];
        const skipped: string[] = [];

        // Process each file in the ZIP
        for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
            // Skip directories and hidden files
            if (zipEntry.dir || relativePath.startsWith("__MACOSX") || relativePath.startsWith(".")) {
                continue;
            }

            const filename = relativePath.split("/").pop() || "";
            const ext = "." + filename.split(".").pop()?.toLowerCase();

            // Skip non-audio files
            if (!AUDIO_EXTENSIONS.includes(ext)) {
                skipped.push(`${filename} (no es audio)`);
                continue;
            }

            try {
                // Extract file content
                const fileBuffer = await zipEntry.async("arraybuffer");
                const fileBlob = new Blob([fileBuffer]);
                const fileSize = fileBuffer.byteLength;

                // Parse metadata from filename
                const metadata = parseFilename(filename);

                // Upload to Supabase Storage
                const storagePath = `${Date.now()}_${metadata.slug}${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from(BUCKET)
                    .upload(storagePath, fileBlob, {
                        contentType: ext === ".mp3" ? "audio/mpeg" : ext === ".ogg" ? "audio/ogg" : "audio/wav",
                        upsert: false,
                    });

                if (uploadError) {
                    errors.push(`${filename}: ${uploadError.message}`);
                    continue;
                }

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(storagePath);

                // Insert sample record
                const { error: insertError } = await supabase.from("samples").insert({
                    title: metadata.title,
                    slug: `${metadata.slug}-${Date.now()}`,
                    bpm: metadata.bpm,
                    musical_key: metadata.musical_key,
                    genre: metadata.genre,
                    instrument_type: metadata.instrument_type,
                    file_url: urlData.publicUrl,
                    preview_url: urlData.publicUrl, // for short samples, preview = full file
                    file_size: fileSize,
                    tags: [metadata.genre, metadata.instrument_type].filter(Boolean) as string[],
                });

                if (insertError) {
                    errors.push(`${filename}: ${insertError.message}`);
                    continue;
                }

                created.push(filename);
            } catch (err: any) {
                errors.push(`${filename}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            created: created.length,
            errors: errors.length,
            skipped: skipped.length,
            details: {
                created,
                errors,
                skipped,
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Error procesando el ZIP" },
            { status: 500 }
        );
    }
}

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                    style={{
                        borderTopColor: "var(--neon-green)",
                        borderRightColor: "rgba(0,255,178,0.3)",
                    }}
                />
            </div>
        </div>
    );
}

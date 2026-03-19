export default function AdminLoading() {
    return (
        <div className="flex items-center justify-center py-20">
            <div
                className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                style={{
                    borderTopColor: "var(--neon-green)",
                    borderRightColor: "rgba(0,255,178,0.3)",
                }}
            />
        </div>
    );
}

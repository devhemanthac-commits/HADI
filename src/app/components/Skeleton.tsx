export function SkeletonBlock({ width = "100%", height = 16, radius = 8, className = "" }: {
  width?: string | number;
  height?: string | number;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius, flexShrink: 0 }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 16,
        border: "1px solid rgba(26,18,8,0.07)",
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <SkeletonBlock width={56} height={56} radius={14} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBlock width="70%" height={14} />
        <SkeletonBlock width="50%" height={11} />
      </div>
      <SkeletonBlock width={40} height={20} radius={99} />
    </div>
  );
}

export function SkeletonGemCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        width: 180,
        flexShrink: 0,
        border: "1px solid rgba(26,18,8,0.07)",
      }}
    >
      <SkeletonBlock width="100%" height={130} radius={0} />
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <SkeletonBlock width="80%" height={14} />
        <SkeletonBlock width="60%" height={11} />
        <SkeletonBlock width="40%" height={13} />
      </div>
    </div>
  );
}

/** A loader that shows skeleton for `duration`ms then reveals children */
export function WithSkeleton({
  children,
  skeleton,
  duration = 1000,
  loading,
}: {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  duration?: number;
  loading: boolean;
}) {
  if (loading) return <>{skeleton}</>;
  return <>{children}</>;
}

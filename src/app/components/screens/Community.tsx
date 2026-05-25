import { useState } from "react";
import { useGame } from "../../store/GameStore";
import { useColors, useApp } from "../../context/AppContext";

const filterPills = ["All Posts", "Local Tips", "Safety Notes", "Hidden Finds"];

const mysureAreas = [
  "Devaraja Market", "Chamundi Hill", "Sayyaji Rao Rd", "Fort Area",
  "Lakshmipuram", "Agrahara Lane", "Nazarbad", "Kukkarahalli",
  "Gandhi Square", "Palace Rd", "Ashoka Rd", "Chamundipuram",
];

const severityOptions = [
  { key: "Caution", icon: "⚠️", label: "Caution", desc: "Proceed carefully", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.25)" },
  { key: "Avoid", icon: "🚫", label: "Avoid", desc: "Not safe right now", color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.25)" },
  { key: "AllClear", icon: "✅", label: "All Clear", desc: "Situation resolved", color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)" },
];

const getCategoryMeta = (category: string) => {
  if (category === "Safety Notes") return { avatarBg: "linear-gradient(135deg, #059669, #0d9488)", emoji: "⚠️", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", avatar: "👨‍💼" };
  if (category === "Local Tips") return { avatarBg: "linear-gradient(135deg, #ea580c, #d97706)", emoji: "🍛", gradient: "linear-gradient(135deg, #f97316, #dc2626)", avatar: "👩‍🍳" };
  return { avatarBg: "linear-gradient(135deg, #7c3aed, #4c1d95)", emoji: "🎨", gradient: "linear-gradient(135deg, #7c3aed, #ec4899)", avatar: "🧑‍🦱" };
};

// Safety Report Bottom Sheet
function SafetyReportSheet({ onClose, C }: { onClose: () => void; C: ReturnType<typeof useColors> }) {
  const { addToast } = useApp();
  const [area, setArea] = useState("");
  const [severity, setSeverity] = useState("");
  const [note, setNote] = useState("");
  const [time, setTime] = useState("Now");

  const handleSubmit = () => {
    addToast("success", "Safety report submitted. Thank you for keeping explorers safe 🙏");
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease-out" }}
        onClick={onClose}
      >
        <div
          className="rounded-[24px] w-full"
          style={{
            background: C.bg,
            maxHeight: "90vh",
            maxWidth: 600,
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            animation: "modalSlideIn 0.3s cubic-bezier(0.22,1,0.36,1)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-center pt-3 pb-4">
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(26,18,8,0.12)" }} />
        </div>

        <div className="px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair" style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>
              Report a Safety Issue
            </h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 22 }}>×</button>
          </div>

          {/* Area selector */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="font-dm w-full outline-none"
              style={{ background: C.inputBg, border: `1.5px solid ${area ? "#E07B2A" : C.borderStrong}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14 }}
            >
              <option value="">Select an area…</option>
              {mysureAreas.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Severity */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Severity</label>
            <div className="grid grid-cols-3 gap-2">
              {severityOptions.map((opt) => {
                const active = severity === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSeverity(opt.key)}
                    className="pressable flex flex-col items-center gap-1 py-3 rounded-[14px]"
                    style={{
                      background: active ? opt.bg : C.card,
                      border: `1.5px solid ${active ? opt.border : C.border}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <span className="font-dm" style={{ color: active ? opt.color : C.muted, fontSize: 12, fontWeight: active ? 700 : 400 }}>
                      {opt.label}
                    </span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 10 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text area */}
          <div className="mb-4">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>Describe the situation (optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's happening? How severe is it?"
              className="font-dm w-full outline-none resize-none"
              style={{ background: C.inputBg, border: `1.5px solid ${C.borderStrong}`, borderRadius: 12, padding: "12px 14px", color: C.text, fontSize: 14 }}
            />
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="font-dm block mb-2" style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}>When?</label>
            <div className="flex gap-2">
              {["Now", "This Morning", "This Evening"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className="font-dm flex-1 pressable"
                  style={{
                    padding: "9px 0",
                    borderRadius: 99,
                    background: time === t ? "#E07B2A" : "transparent",
                    border: time === t ? "none" : `1px solid ${C.borderStrong}`,
                    color: time === t ? "#fff" : C.muted,
                    fontWeight: time === t ? 600 : 400,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!area || !severity}
            className="font-dm w-full pressable"
            style={{
              height: 52,
              borderRadius: 99,
              background: area && severity ? "#E07B2A" : "rgba(26,18,8,0.1)",
              color: area && severity ? "#fff" : C.muted,
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: area && severity ? "pointer" : "not-allowed",
              boxShadow: area && severity ? "0 6px 20px rgba(224,123,42,0.3)" : "none",
            }}
          >
            Submit Safety Report
          </button>
        </div>
        </div>
      </div>
    </>
  );
}

export function Community() {
  const C = useColors();
  const { addToast } = useApp();
  const { stats, communityPosts, submitPost, vote, addComment } = useGame();
  
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [animatingHeart, setAnimatingHeart] = useState<number | null>(null);
  const [composerFocused, setComposerFocused] = useState(false);
  const [showSafetyReport, setShowSafetyReport] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  
  // Composer State
  const [postBody, setPostBody] = useState("");
  const [postCategory, setPostCategory] = useState("Hidden Finds" as const);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLike = (id: number) => {
    vote(id, "up");
    setAnimatingHeart(id);
    setTimeout(() => setAnimatingHeart(null), 400);
  };

  const handleDislike = (id: number) => {
    vote(id, "down");
  };

  const toggleComments = (id: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCommentSubmit = (id: number) => {
    const text = commentInputs[id] || "";
    if (!text.trim()) return;
    const res = addComment(id, text);
    if (res.ok) {
      setCommentInputs(prev => ({ ...prev, [id]: "" }));
    } else {
      addToast("warning", res.error ?? "Failed to add comment");
    }
  };

  const handleShare = async (post: typeof communityPosts[0]) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HADI Community',
          text: `Check out this post on HADI by u/${post.authorId.replace(/ /g, "")}: "${post.body.slice(0, 50)}..."`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      addToast("warning", "Sharing is not supported on this browser.");
    }
  };

  const handlePostSubmit = async () => {
    if (!postBody.trim()) return;
    
    let imageUrl: string | undefined = undefined;
    
    try {
      if (imageFile) {
        setIsUploading(true);
        // Compress image locally and convert to Base64 to bypass Firebase Storage and avoid limits
        const compressImage = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
              const img = new Image();
              img.src = e.target?.result as string;
              img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  resolve(canvas.toDataURL("image/jpeg", 0.6));
                } else {
                  reject(new Error("Canvas context failed"));
                }
              };
              img.onerror = () => reject(new Error("Image load failed"));
            };
            reader.onerror = () => reject(new Error("File read failed"));
          });
        };
        
        imageUrl = await compressImage(imageFile);
      }
      
      const result = submitPost(postBody, postCategory, imageUrl);
      if (result.ok) {
        setPostBody("");
        setImageFile(null);
        setComposerFocused(false);
        addToast("success", "Post shared with the community!");
      } else {
        addToast("warning", result.error ?? "Could not share post");
      }
    } catch (e: any) {
      console.error(e);
      addToast("warning", e.message || "Failed to upload image. Please check if Firebase Storage is enabled in the console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const filteredPosts =
    activeFilter === "All Posts"
      ? communityPosts
      : communityPosts.filter((p) => p.category === activeFilter);

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      {/* Section header */}
      <div>
        <h1 className="font-playfair mb-1" style={{ color: C.text, fontSize: 24, fontWeight: 700 }}>
          Community
        </h1>
        <p className="font-dm" style={{ color: C.muted, fontSize: 14 }}>
          Tips, discoveries & safety notes from fellow explorers.
        </p>
      </div>

      {/* Post Composer */}
      <div
        className="rounded-[20px] p-5 cursor-text"
        style={{
          background: C.card,
          border: composerFocused ? "1.5px dashed #E07B2A" : `1.5px dashed ${C.borderStrong}`,
          boxShadow: composerFocused ? "0 4px 20px rgba(224,123,42,0.1)" : "0 2px 10px rgba(26,18,8,0.04)",
          transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center rounded-full shrink-0 font-dm" style={{ width: 38, height: 38, background: "linear-gradient(135deg, #E07B2A, #C9921F)", color: "#fff", fontWeight: 700, fontSize: 15 }}>
            H
          </div>
          <textarea
            rows={2}
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="Share a local tip, hidden place, or safety note…"
            onFocus={() => setComposerFocused(true)}
            className="font-dm w-full resize-none outline-none bg-transparent"
            style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}
          />
        </div>
        
        {/* Preview Attached Image */}
        {imageFile && (
          <div className="mt-3 relative inline-block rounded-md overflow-hidden">
            <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ height: 60, objectFit: "cover" }} />
            <button onClick={() => setImageFile(null)} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 12 }}>✕</button>
          </div>
        )}

        {composerFocused && (
          <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
            <div className="flex gap-2 items-center">
              <select 
                value={postCategory} 
                onChange={(e) => setPostCategory(e.target.value as any)}
                className="font-dm outline-none"
                style={{ background: "transparent", color: C.muted, fontSize: 13, border: "none" }}
              >
                <option value="Hidden Finds">Hidden Finds</option>
                <option value="Local Tips">Local Tips</option>
                <option value="Safety Notes">Safety Notes</option>
              </select>
              <label className="cursor-pointer flex items-center justify-center p-1.5 rounded-full hover:bg-black/10">
                <span style={{ fontSize: 16 }}>📷</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            
            <button 
              onClick={handlePostSubmit}
              disabled={isUploading}
              className="font-dm pressable" 
              style={{ background: "#E07B2A", color: "#fff", fontWeight: 600, fontSize: 13, padding: "8px 20px", borderRadius: 99, border: "none", cursor: "pointer", opacity: isUploading ? 0.6 : 1 }}
            >
              {isUploading ? "Uploading..." : "Post ✨"}
            </button>
          </div>
        )}
      </div>

      {/* Report Safety Issue button */}
      <button
        onClick={() => setShowSafetyReport(true)}
        className="font-dm pressable flex items-center gap-2"
        style={{
          background: "rgba(220,38,38,0.07)",
          border: "1px solid rgba(220,38,38,0.18)",
          borderRadius: 14,
          padding: "12px 16px",
          color: "#dc2626",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 16 }}>🚨</span>
        Report a Safety Issue
      </button>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {filterPills.map((pill) => {
          const active = activeFilter === pill;
          return (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className="font-dm whitespace-nowrap shrink-0 pressable"
              style={{
                padding: "7px 16px",
                borderRadius: 99,
                background: active ? "#E07B2A" : "transparent",
                border: active ? "none" : `1px solid ${C.borderStrong}`,
                color: active ? "#fff" : C.muted,
                fontWeight: active ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Post Feed */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => {
          // Dynamic formatting based on category
          const meta = getCategoryMeta(post.category);
          
          return (
            <div
              key={post.id}
              className="gem-card rounded-[20px] overflow-hidden"
              style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}
            >
              {/* Post Header */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 24, height: 24, background: meta.avatarBg, fontSize: 14 }}>
                    {meta.avatar}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    <span className="font-dm" style={{ color: C.text, fontWeight: 700, fontSize: 12 }}>h/{post.category.replace(/ /g, "")}</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>•</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>Posted by u/{post.authorId.replace(/ /g, "")}</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>•</span>
                    <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
                
                {/* Title and Body */}
                <h3 className="font-playfair mb-1.5" style={{ color: C.text, fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                  {post.body.split('.')[0]}
                </h3>
              </div>

              {/* Body */}
              <p className="font-dm px-4 pb-2" style={{ color: C.text, fontSize: 14, lineHeight: 1.65, opacity: 0.9 }}>{post.body}</p>

              {/* Image block (simulating attached media or showing uploaded media) */}
              {post.imageUrl ? (
                <div className="mx-4 mb-3 mt-1 rounded-[12px] flex items-center justify-center relative overflow-hidden" style={{ height: 220, background: "#000" }}>
                  <img src={post.imageUrl} alt="Community upload" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div className="mx-4 mb-3 mt-1 rounded-[12px] flex items-center justify-center relative overflow-hidden" style={{ height: 160, background: meta.gradient }}>
                  <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                  <span style={{ fontSize: 52, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>{meta.emoji}</span>
                </div>
              )}

              {/* Action row - Reddit style */}
              <div className="flex items-center gap-4 px-3 py-2 bg-black/5" style={{ borderTop: `1px solid ${C.border}` }}>
                {/* Voting */}
                <div className="flex items-center rounded-full" style={{ background: C.cardAlt, border: `1px solid ${C.border}` }}>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center justify-center pressable"
                    style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", color: post.votes[stats.userId] === "up" ? "#E07B2A" : C.muted, transition: "color 0.22s" }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, transform: "translateY(-1px)" }}>↑</span>
                  </button>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 700, color: C.text, minWidth: 20, textAlign: "center" }}>
                    {post.score}
                  </span>
                  <button
                    onClick={() => handleDislike(post.id)}
                    className="flex items-center justify-center pressable"
                    style={{ background: "none", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", color: post.votes[stats.userId] === "down" ? "#dc2626" : C.muted }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, transform: "translateY(1px)" }}>↓</span>
                  </button>
                </div>

                {/* Comments */}
                <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pressable" style={{ background: expandedComments.has(post.id) ? "rgba(224,123,42,0.1)" : C.cardAlt, border: `1px solid ${expandedComments.has(post.id) ? "#E07B2A" : C.border}`, cursor: "pointer" }}>
                  <span style={{ fontSize: 16 }}>💬</span>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 600, color: expandedComments.has(post.id) ? "#E07B2A" : C.text }}>
                    {post.comments?.length || 0}
                  </span>
                </button>

                {/* Share */}
                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full pressable" 
                  style={{ background: C.cardAlt, border: `1px solid ${C.border}`, cursor: "pointer" }}
                >
                  <span style={{ fontSize: 16 }}>↪️</span>
                  <span className="font-dm" style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Share</span>
                </button>

                {/* More options */}
                <button className="flex items-center justify-center ml-auto px-2 py-1.5 rounded-full pressable" style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted }}>
                  <span style={{ fontSize: 18 }}>⋮</span>
                </button>
              </div>

              {/* Expanded Comments Section */}
              {expandedComments.has(post.id) && (
                <div className="px-4 py-3 bg-black/5" style={{ borderTop: `1px dashed ${C.border}` }}>
                  <div className="flex flex-col gap-3 mb-3">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>🧑</div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-dm text-[11px] font-bold" style={{ color: C.text }}>u/{comment.authorId.replace(/ /g, "")}</span>
                              <span className="font-dm text-[10px]" style={{ color: C.muted }}>{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="font-dm text-[13px] mt-0.5" style={{ color: C.text, lineHeight: 1.4 }}>{comment.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="font-dm text-[13px] italic" style={{ color: C.muted }}>No comments yet. Be the first!</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      className="font-dm flex-1 outline-none px-3 py-2 rounded-full text-[13px]"
                      style={{ background: C.inputBg, border: `1px solid ${C.borderStrong}`, color: C.text }}
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && handleCommentSubmit(post.id)}
                    />
                    <button 
                      onClick={() => handleCommentSubmit(post.id)}
                      className="font-dm pressable px-4 py-1.5 rounded-full text-[12px] font-bold"
                      style={{ background: "#E07B2A", color: "#fff", border: "none", cursor: "pointer", opacity: (commentInputs[post.id]?.trim() ? 1 : 0.5) }}
                      disabled={!commentInputs[post.id]?.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Safety Report Sheet */}
      {showSafetyReport && <SafetyReportSheet onClose={() => setShowSafetyReport(false)} C={C} />}
    </div>
  );
}

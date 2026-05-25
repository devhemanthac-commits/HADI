import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useGame } from "../../store/GameStore";
import { useColors, useApp } from "../../context/AppContext";

const getCategoryMeta = (category: string) => {
  if (category === "Safety Notes") return { avatarBg: "linear-gradient(135deg, #059669, #0d9488)", emoji: "⚠️", gradient: "linear-gradient(135deg, #f59e0b, #d97706)", avatar: "👨‍💼" };
  if (category === "Local Tips") return { avatarBg: "linear-gradient(135deg, #ea580c, #d97706)", emoji: "🍛", gradient: "linear-gradient(135deg, #f97316, #dc2626)", avatar: "👩‍🍳" };
  return { avatarBg: "linear-gradient(135deg, #7c3aed, #4c1d95)", emoji: "🎨", gradient: "linear-gradient(135deg, #7c3aed, #ec4899)", avatar: "🧑‍🦱" };
};

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const C = useColors();
  const { addToast } = useApp();
  const { stats, communityPosts, vote, addComment } = useGame();
  
  const [commentInput, setCommentInput] = useState("");
  
  const post = communityPosts.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-up">
        <span style={{ fontSize: 48, marginBottom: 16 }}>🕵️</span>
        <h2 className="font-playfair" style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Post Not Found</h2>
        <p className="font-dm" style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>This post might have been removed or the link is incorrect.</p>
        <button onClick={() => navigate("/community")} className="font-dm pressable" style={{ background: "#E07B2A", color: "#fff", padding: "10px 24px", borderRadius: 99, border: "none", cursor: "pointer", fontWeight: 600 }}>
          Back to Community
        </button>
      </div>
    );
  }

  const handleLike = () => vote(post.id, "up");
  const handleDislike = () => vote(post.id, "down");

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    const res = addComment(post.id, commentInput);
    if (res.ok) {
      setCommentInput("");
    } else {
      addToast("warning", res.error ?? "Failed to add comment");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HADI Community',
          text: `Check out this post on HADI by u/${post.authorId.replace(/ /g, "")}: "${post.body.slice(0, 50)}..."`,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      addToast("success", "Link copied to clipboard!");
    }
  };

  const meta = getCategoryMeta(post.category);

  return (
    <div className="animate-fade-up flex flex-col gap-6 max-w-[600px] mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button 
          onClick={() => navigate("/community")}
          className="flex items-center justify-center rounded-full pressable"
          style={{ width: 40, height: 40, background: C.cardAlt, border: `1px solid ${C.border}`, cursor: "pointer", color: C.text }}
        >
          ←
        </button>
        <h1 className="font-playfair flex-1" style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>
          Community Post
        </h1>
      </div>

      <div className="gem-card rounded-[20px] overflow-hidden" style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 4px 20px rgba(26,18,8,0.08)" }}>
        {/* Post Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 36, height: 36, background: meta.avatarBg, fontSize: 18 }}>
              {meta.avatar}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-dm" style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>h/{post.category.replace(/ /g, "")}</span>
                <span className="font-dm" style={{ color: C.muted, fontSize: 12 }}>•</span>
                <span className="font-dm" style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>u/{post.authorId.replace(/ /g, "")}</span>
              </div>
              <span className="font-dm" style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{new Date(post.timestamp).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
          
          {/* Title and Body */}
          <h3 className="font-playfair mb-2" style={{ color: C.text, fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
            {post.body.split('.')[0]}
          </h3>
        </div>

        {/* Body */}
        <p className="font-dm px-5 pb-4" style={{ color: C.text, fontSize: 15, lineHeight: 1.7, opacity: 0.9 }}>{post.body}</p>

        {/* Image block */}
        {post.imageUrl ? (
          <div className="mx-5 mb-4 mt-1 rounded-[12px] flex items-center justify-center relative overflow-hidden" style={{ minHeight: 220, maxHeight: 400, background: "#000" }}>
            <img src={post.imageUrl} alt="Community upload" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div className="mx-5 mb-4 mt-1 rounded-[12px] flex items-center justify-center relative overflow-hidden" style={{ height: 160, background: meta.gradient }}>
            <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ fontSize: 52, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>{meta.emoji}</span>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-4 px-4 py-3 bg-black/5" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          {/* Voting */}
          <div className="flex items-center rounded-full" style={{ background: C.cardAlt, border: `1px solid ${C.border}` }}>
            <button onClick={handleLike} className="flex items-center justify-center pressable" style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", color: post.votes[stats.userId] === "up" ? "#E07B2A" : C.muted, transition: "color 0.22s" }}>
              <span style={{ fontSize: 20, fontWeight: 700, transform: "translateY(-1px)" }}>↑</span>
            </button>
            <span className="font-dm" style={{ fontSize: 14, fontWeight: 700, color: C.text, minWidth: 24, textAlign: "center" }}>
              {post.score}
            </span>
            <button onClick={handleDislike} className="flex items-center justify-center pressable" style={{ background: "none", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", color: post.votes[stats.userId] === "down" ? "#dc2626" : C.muted }}>
              <span style={{ fontSize: 20, fontWeight: 700, transform: "translateY(1px)" }}>↓</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full" style={{ background: C.cardAlt, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <span className="font-dm" style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
              {post.comments?.length || 0}
            </span>
          </div>

          {/* Share */}
          <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2 rounded-full pressable ml-auto" style={{ background: "#E07B2A", color: "#fff", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 16, filter: "brightness(0) invert(1)" }}>↪️</span>
            <span className="font-dm" style={{ fontSize: 14, fontWeight: 600 }}>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="px-5 py-5" style={{ background: C.card }}>
          <h4 className="font-dm mb-4" style={{ color: C.text, fontSize: 16, fontWeight: 700 }}>Comments</h4>
          
          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", fontSize: 14 }}>🧑</div>
            <div className="flex-1 flex flex-col gap-2">
              <textarea 
                rows={2}
                placeholder="What are your thoughts?" 
                className="font-dm outline-none px-4 py-3 rounded-[12px] resize-none"
                style={{ background: C.inputBg, border: `1px solid ${C.borderStrong}`, color: C.text, fontSize: 14, width: "100%" }}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleCommentSubmit}
                  className="font-dm pressable px-5 py-2 rounded-full font-bold"
                  style={{ background: commentInput.trim() ? "#E07B2A" : C.cardAlt, color: commentInput.trim() ? "#fff" : C.muted, border: "none", cursor: commentInput.trim() ? "pointer" : "not-allowed" }}
                  disabled={!commentInput.trim()}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comment List */}
          <div className="flex flex-col gap-5">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", fontSize: 14 }}>🧑</div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-dm font-bold" style={{ color: C.text, fontSize: 13 }}>u/{comment.authorId.replace(/ /g, "")}</span>
                      <span className="font-dm" style={{ color: C.muted, fontSize: 11 }}>{new Date(comment.timestamp).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="font-dm" style={{ color: C.text, fontSize: 14, lineHeight: 1.5 }}>{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="font-dm italic" style={{ color: C.muted, fontSize: 14 }}>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

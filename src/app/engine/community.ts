import type { CommunityPost, VoteResult, UserStats } from "./types";

// ─── Constants ─────────────────────────────────────────────────────────────────

const KARMA_PER_UPVOTE   =  1;
const KARMA_PER_DOWNVOTE = -1;
const AUTO_HIDE_THRESHOLD = -5;
const VOTE_CHANGE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Post karma milestone milestones (cumulative karma → unlock)
export const KARMA_MILESTONES: { karma: number; unlock: string }[] = [
  { karma: 50,   unlock: "Can post Stories" },
  { karma: 100,  unlock: "Profile karma badge" },
  { karma: 250,  unlock: "Community Highlights" },
  { karma: 500,  unlock: "Local Expert badge eligible" },
  { karma: 1000, unlock: "Trusted content reporter" },
];

// ─── Voting ────────────────────────────────────────────────────────────────────

export function castVote(
  post: CommunityPost,
  voterId: string,
  direction: "up" | "down",
  nowMs?: number
): { updatedPost: CommunityPost; result: VoteResult } {
  const now = nowMs ?? Date.now();
  const existing = post.votes[voterId];

  // Self-vote guard
  if (voterId === post.authorId) {
    return {
      updatedPost: post,
      result: { newUpvotes: post.upvotes, newDownvotes: post.downvotes, newScore: post.score, karmaChange: 0, autoHidden: false },
    };
  }

  const votes = { ...post.votes };
  let upvotes = post.upvotes;
  let downvotes = post.downvotes;
  let karmaChange = 0;

  if (existing === direction) {
    // Toggle off — remove vote
    delete votes[voterId];
    if (direction === "up") { upvotes--; karmaChange = -KARMA_PER_UPVOTE; }
    else { downvotes--; karmaChange = -KARMA_PER_DOWNVOTE; }
  } else {
    if (existing) {
      // Switching direction (within change window only — enforced in store)
      if (existing === "up") { upvotes--; karmaChange -= KARMA_PER_UPVOTE; }
      else { downvotes--; karmaChange -= KARMA_PER_DOWNVOTE; }
    }
    votes[voterId] = direction;
    if (direction === "up") { upvotes++; karmaChange += KARMA_PER_UPVOTE; }
    else { downvotes++; karmaChange += KARMA_PER_DOWNVOTE; }
  }

  const score = upvotes - downvotes;
  const autoHidden = score <= AUTO_HIDE_THRESHOLD;

  const updatedPost: CommunityPost = { ...post, votes, upvotes, downvotes, score };
  const result: VoteResult = { newUpvotes: upvotes, newDownvotes: downvotes, newScore: score, karmaChange, autoHidden };

  void now; // timestamp available for vote-change-window enforcement if needed
  return { updatedPost, result };
}

// ─── Karma calculation ────────────────────────────────────────────────────────

export function calculateKarma(posts: CommunityPost[], authorId: string): number {
  return posts
    .filter((p) => p.authorId === authorId)
    .reduce((sum, p) => sum + p.score, 0);
}

// ─── Local Expert badge eligibility ──────────────────────────────────────────

export interface LocalExpertCheck {
  eligible: boolean;
  reasons: string[];
}

export function checkLocalExpertEligibility(
  stats: UserStats,
  posts: CommunityPost[],
  accountAgeDays: number
): LocalExpertCheck {
  const reasons: string[] = [];
  const authorPosts = posts.filter((p) => p.authorId === stats.userId);
  const qualifyingPosts = authorPosts.filter((p) => p.score >= 10);

  if (qualifyingPosts.length < 25) reasons.push(`Need ${25 - qualifyingPosts.length} more posts with ≥10 net score`);
  if (accountAgeDays < 60) reasons.push(`Account must be ≥60 days old (${60 - accountAgeDays} days to go)`);
  if (!stats.hasLocalMode) reasons.push("Local Mode must be active");
  if (stats.karma < 500) reasons.push(`Need ${500 - stats.karma} more karma`);

  // Category coverage: at least 5 qualifying posts per required category (simplified check)
  const requiredCategories = ["Local Tips", "Safety Notes", "Hidden Finds"];
  for (const cat of requiredCategories) {
    const count = qualifyingPosts.filter((p) => p.category === cat).length;
    if (count < 5) reasons.push(`Need ${5 - count} more qualifying '${cat}' posts`);
  }

  return { eligible: reasons.length === 0, reasons };
}

// ─── Post validation ──────────────────────────────────────────────────────────

export const POST_MAX_LENGTHS: Record<string, number> = {
  "Local Tips":    280,
  "Hidden Finds":  280,
  "Safety Notes":  500,
  Story:           2000,
};

export function validatePostBody(body: string, category: string): { valid: boolean; error?: string } {
  const max = POST_MAX_LENGTHS[category] ?? 280;
  if (!body.trim()) return { valid: false, error: "Post body cannot be empty." };
  if (body.length > max) return { valid: false, error: `${category} posts max ${max} characters.` };
  return { valid: true };
}

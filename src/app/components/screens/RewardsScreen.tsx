import { useState } from "react";
import { useGame } from "../../store/GameStore";
import { useColors } from "../../context/AppContext";

interface Voucher {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  gradient: string;
}

const VOUCHERS: Voucher[] = [
  {
    id: "zoo-50",
    title: "Mysuru Zoo Entry",
    description: "Get 50% off on your next visit to the Chamarajendra Zoological Gardens.",
    cost: 1000,
    icon: "🦁",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    id: "palace-pass",
    title: "Mysore Palace VIP",
    description: "Skip the line and get a free audio guide for your palace tour.",
    cost: 2500,
    icon: "🏛️",
    gradient: "linear-gradient(135deg, #E07B2A, #C9921F)",
  },
  {
    id: "cafe-coffee",
    title: "Malgudi Cafe",
    description: "Redeem for one free filter coffee or tea at any Malgudi Cafe location.",
    cost: 1500,
    icon: "☕",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  },
  {
    id: "silk-discount",
    title: "KSIC Silk Emporium",
    description: "₹500 flat discount on any genuine Mysore Silk purchase over ₹2000.",
    cost: 5000,
    icon: "🥻",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
  },
];

export function RewardsScreen() {
  const { stats, redeemPoints } = useGame();
  const C = useColors();
  
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const spendablePoints = stats.totalXP - (stats.pointsRedeemed || 0);

  const handleRedeem = (voucher: Voucher) => {
    if (spendablePoints < voucher.cost) return;
    
    setRedeemingId(voucher.id);
    // Simulate network delay for premium feel
    setTimeout(() => {
      redeemPoints(voucher.cost, voucher.title);
      setRedeemingId(null);
    }, 600);
  };

  return (
    <div className="pb-12 animate-fade-in">
      {/* Header section with glass effect */}
      <div 
        className="relative mb-8 rounded-[24px] p-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.card} 0%, rgba(15,61,61,0.8) 100%)`,
          border: `1px solid ${C.border}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
        }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span style={{ fontSize: 120 }}>🎁</span>
        </div>
        
        <div className="relative z-10">
          <h1 className="font-playfair text-3xl font-bold mb-2" style={{ color: C.text }}>
            Rewards Center
          </h1>
          <p className="font-dm text-sm mb-6" style={{ color: C.muted }}>
            Exchange your exploration points for exclusive local experiences.
          </p>
          
          <div className="flex items-center gap-4">
            <div 
              className="px-5 py-3 rounded-[16px] inline-flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner"
                style={{ background: "linear-gradient(135deg, #E07B2A, #f59e0b)", color: "#fff" }}
              >
                pts
              </div>
              <div>
                <p className="font-dm text-[11px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Available Balance
                </p>
                <p className="font-dm text-2xl font-black" style={{ color: "#fff" }}>
                  {spendablePoints.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-playfair text-xl font-bold mb-4 px-2" style={{ color: C.text }}>
        Available Vouchers
      </h2>

      {/* Grid of vouchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VOUCHERS.map(voucher => {
          const canAfford = spendablePoints >= voucher.cost;
          const isRedeeming = redeemingId === voucher.id;
          
          return (
            <div 
              key={voucher.id}
              className="rounded-[20px] p-5 flex flex-col relative overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              style={{ 
                background: C.card,
                border: `1px solid ${C.border}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)"
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl shadow-lg shrink-0"
                  style={{ background: voucher.gradient }}
                >
                  {voucher.icon}
                </div>
                <div>
                  <h3 className="font-dm font-bold text-lg mb-1 leading-tight" style={{ color: C.text }}>
                    {voucher.title}
                  </h3>
                  <p className="font-dm text-xs leading-relaxed" style={{ color: C.muted }}>
                    {voucher.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-1.5 font-dm">
                  <span style={{ color: canAfford ? "#E07B2A" : C.muted, fontWeight: 700 }}>
                    {voucher.cost.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>pts</span>
                </div>
                
                <button
                  onClick={() => handleRedeem(voucher)}
                  disabled={!canAfford || isRedeeming}
                  className="px-5 py-2 rounded-full font-dm text-sm font-bold transition-all duration-200"
                  style={{
                    background: canAfford ? "#E07B2A" : "rgba(255,255,255,0.05)",
                    color: canAfford ? "#fff" : C.muted,
                    opacity: isRedeeming ? 0.7 : 1,
                    transform: isRedeeming ? "scale(0.96)" : "scale(1)",
                    cursor: canAfford ? "pointer" : "not-allowed",
                  }}
                >
                  {isRedeeming ? "Processing..." : (canAfford ? "Redeem" : "Locked")}
                </button>
              </div>
              
              {/* Progress bar hint for locked items */}
              {!canAfford && (
                <div className="absolute bottom-0 left-0 h-1 bg-[rgba(255,255,255,0.1)] w-full">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ 
                      width: `${Math.min(100, (spendablePoints / voucher.cost) * 100)}%`,
                      background: voucher.gradient 
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

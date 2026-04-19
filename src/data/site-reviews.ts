export type SiteReview = {
  id: string;
  name: string;
  /** Two-letter initials for avatar fallback */
  initials: string;
  avatarColor: string;
  review: string;
  rating: number;
  location: string;
};

export const SITE_REVIEWS: SiteReview[] = [
  {
    id: "1",
    name: "Sarah M.",
    initials: "SM",
    avatarColor: "bg-violet-500",
    review:
      "Incredibly fast delivery and the products are always authentic. MedBox has become my go-to pharmacy — I won't shop anywhere else for my family's health needs.",
    rating: 5,
    location: "Cairo",
  },
  {
    id: "2",
    name: "Ahmed K.",
    initials: "AK",
    avatarColor: "bg-sky-500",
    review:
      "The AI assistant helped me find the right vitamins for my condition. Great website, easy checkout, and my order arrived the next day. Highly recommended!",
    rating: 5,
    location: "Alexandria",
  },
  {
    id: "3",
    name: "Nour H.",
    initials: "NH",
    avatarColor: "bg-emerald-500",
    review:
      "I ordered prescription medication and baby care products in one go. The process was seamless and the packaging was perfect. Will definitely order again.",
    rating: 5,
    location: "Giza",
  },
  {
    id: "4",
    name: "Omar R.",
    initials: "OR",
    avatarColor: "bg-amber-500",
    review:
      "Best prices I've found for skincare brands like Bioderma and Cetaphil. The promotions section is genuinely useful. Customer support resolved my query instantly.",
    rating: 4,
    location: "Mansoura",
  },
  {
    id: "5",
    name: "Layla F.",
    initials: "LF",
    avatarColor: "bg-rose-500",
    review:
      "As a busy mother, having a reliable pharmacy app is a lifesaver. MedBox never disappoints — accurate stock info, fast shipping, and great deals on baby products.",
    rating: 5,
    location: "Tanta",
  },
  {
    id: "6",
    name: "Yusuf S.",
    initials: "YS",
    avatarColor: "bg-indigo-500",
    review:
      "I appreciate that MedBox takes prescription safety seriously. Products are always genuine and well within expiry. Trust is everything in a pharmacy and MedBox delivers.",
    rating: 5,
    location: "Luxor",
  },
];

export default function AuthBackgroundDecoration() {
  return (
    <>
      {/* Animated background blobs */}
      <span
        className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full
          bg-white/10 blur-3xl"
      />
      <span
        className="absolute -bottom-24 -right-16 h-80 w-80 animate-pulse rounded-full
          bg-teal-400/20 blur-3xl [animation-delay:1.5s]"
      />
      <span
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2
          animate-pulse rounded-full bg-white/5 blur-2xl [animation-delay:3s]"
      />

      {/* Floating pill shapes */}
      <span
        className="absolute right-10 top-24 h-3 w-10 animate-bounce rounded-full
          bg-white/20 [animation-delay:0.5s]"
      />
      <span
        className="absolute bottom-32 left-8 h-3 w-14 animate-bounce rounded-full
          bg-white/15 [animation-delay:1s]"
      />
      <span
        className="absolute right-20 top-1/2 h-2 w-8 animate-bounce rounded-full
          bg-cyan-200/30 [animation-delay:2s]"
      />
    </>
  );
}

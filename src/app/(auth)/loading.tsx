export default function AuthLoadingPage() {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-black dark:bg-white animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-black dark:bg-white animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
}

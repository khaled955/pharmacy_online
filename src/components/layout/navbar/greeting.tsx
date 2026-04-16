"use client";

import { useMemo } from "react";

interface GreetingProps {
  firstName: string;
}


export default function Greeting({ firstName }: GreetingProps) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <span className="hidden text-sm text-gray-600 sm:inline dark:text-gray-300">
      {greeting}
      <span className="font-semibold text-gray-900 dark:text-white">
        {firstName}
      </span>
    </span>
  );
}

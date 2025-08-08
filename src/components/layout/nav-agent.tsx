"use client";

import { useAgent } from "@/stores/use-agent";
import { usePathname, useSearchParams } from "next/navigation";

export const NavAgent = () => {
  const { agent } = useAgent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const agentParam = searchParams.get("agent");

  if (!pathname.includes("chat")) return null;
  if (!agentParam) return null;
  if (!agent) return null;

  return (
    <nav className="flex items-center gap-2 rounded-full sm:bg-gray-100 p-2 pr-3">
      <div className="flex items-center gap-2">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-6 h-6 min-w-6 min-h-6 rounded-full object-cover"
        />
      </div>
      <p className="select-none flex gap-2">
        <span className="hidden sm:inline">Talking with</span>
        <strong className="line-clamp-1 sm:line-clamp-none">{' ' + agent.name}</strong>
      </p>
    </nav>
  );
};
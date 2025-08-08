"use client";

import { useRouter } from "next/navigation";

interface AgentCardProps {
  title: string;
  description: string;
  image: string;
  agentName: string;
}

export const AgentCard = ({ title, description, image, agentName }: AgentCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat?agent=${agentName}`);
  };

  return (
    <button onClick={handleClick} className="hover:bg-secondary cursor-pointer rounded-xl p-4 transition-colors duration-200 ease-out">
      <div className="flex items-center space-x-4">
        <div className="w-[70px] h-[70px] rounded-xl overflow-hidden">
          <img src={image} alt={title} className="w-[70px] h-[70px] rounded-xl object-cover" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-foreground truncate text-base font-medium">
            {title}
          </h3>
          <p className="text-foreground mt-1 line-clamp-3 text-sm md:line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

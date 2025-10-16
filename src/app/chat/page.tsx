import { Chat } from "@/components/chat/chat";
import { Metadata } from "next";
import { AIDevtools } from '@ai-sdk-tools/devtools';

export const metadata: Metadata = {
  title: "Idle - Chat",
  description: "Chat with the AI Assistant"
};

const Page = () => {
  return (
    <div>
      <Chat />

      {/* Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <AIDevtools />
      )}
    </div>
  );
};

export default Page;
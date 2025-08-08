import { Chat } from "@/components/chat/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Idle Chat",
  description: "Chat with the AI Assistant"
};

const Page = () => {
  return (
    <div>
      <Chat />
    </div>
  );
};

export default Page;
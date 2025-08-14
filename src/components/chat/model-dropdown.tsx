import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { models } from "@/ai/agents";
import { cn } from "@/lib/utils";

interface ModelDropdownProps {
  setModel: (model: string) => void;
  model: string;
  variant?: "icon" | "input";
}

export const ModelDropdown = ({
  setModel,
  variant = "icon",
  model
}: ModelDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(variant === "icon" && "chat-tools__button", variant === "input" && "chat-tools__button--input")}>
        {variant === "icon" ? (
          <Settings className="size-4" />
        ) : (
          <div className="flex items-center gap-2">
            <Settings className="size-4" />
            <span className="text-sm">
              {models.find((m) => m.value === model)?.name || "Selecciona un modelo"}
            </span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[300px] max-h-[250px] overflow-scroll rounded-xl">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.value}
            onClick={() => setModel(model.value)}
            className="rounded-lg cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {model.provider === "OpenAI" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="size-5">
                  <path fill="#000" fillRule="evenodd" d="M57.467 26.677a14.44 14.44 0 0 0-1.275-12.002C52.947 9.1 46.427 6.232 40.059 7.58a14.9 14.9 0 0 0-11.176-4.914c-6.51-.014-12.286 4.122-14.288 10.234a14.8 14.8 0 0 0-9.902 7.088 14.63 14.63 0 0 0 1.843 17.334 14.44 14.44 0 0 0 1.272 12.005c3.245 5.573 9.765 8.44 16.133 7.093a14.9 14.9 0 0 0 11.174 4.912c6.514.016 12.293-4.122 14.296-10.24A14.8 14.8 0 0 0 59.317 44a14.63 14.63 0 0 0-1.848-17.325zM35.117 57.5a11.2 11.2 0 0 1-7.133-2.544c.09-.048.248-.134.352-.198l11.84-6.746a1.89 1.89 0 0 0 .97-1.662V29.88l5.006 2.85a.18.18 0 0 1 .096.134v13.64c-.008 6.064-4.987 10.981-11.13 10.995M11.18 47.413a10.82 10.82 0 0 1-1.328-7.368c.085.054.24.147.349.208L22.04 47c.6.347 1.344.347 1.947 0l14.453-8.235v5.702a.18.18 0 0 1-.072.152L26.4 51.435c-5.33 3.029-12.139 1.226-15.219-4.027zM8.06 21.91a11.07 11.07 0 0 1 5.8-4.816l-.005.403v13.493a1.9 1.9 0 0 0 .97 1.664l14.454 8.232-5.003 2.854a.18.18 0 0 1-.168.013l-11.97-6.824c-5.32-3.04-7.144-9.755-4.08-15.013zm41.112 9.44L34.72 23.115l5.003-2.848a.18.18 0 0 1 .168-.016l11.97 6.818c5.328 3.04 7.155 9.766 4.078 15.022a11.1 11.1 0 0 1-5.798 4.818V33.013a1.89 1.89 0 0 0-.968-1.661zm4.979-7.394q-.175-.106-.352-.208L41.96 17a1.95 1.95 0 0 0-1.944 0l-14.453 8.235v-5.702a.18.18 0 0 1 .072-.152L37.6 12.568c5.333-3.032 12.147-1.227 15.219 4.035a10.87 10.87 0 0 1 1.333 7.352m-31.31 10.16-5.005-2.848a.17.17 0 0 1-.096-.136V17.49c.003-6.072 4.995-10.992 11.15-10.987 2.602 0 5.12.901 7.122 2.544a10 10 0 0 0-.349.195l-11.84 6.746a1.89 1.89 0 0 0-.973 1.662l-.008 16.461zm2.72-5.782L32 24.667l6.437 3.666v7.334L32 39.333l-6.44-3.666v-7.334z" clipRule="evenodd">
                  </path>
                </svg>
              )}

              {model.provider === "Google" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" className="size-5"><g clipPath="url(#a)"><path fill="url(#b)" d="M32 64A38.14 38.14 0 0 0 0 32 38.14 38.14 0 0 0 32 0a38.15 38.15 0 0 0 32 32 38.15 38.15 0 0 0-32 32"></path></g><defs><linearGradient id="b" x1="0" x2="4398.72" y1="6400" y2="1945.28" gradientUnits="userSpaceOnUse"><stop stopColor="#1C7DFF"></stop><stop offset="0.52" stopColor="#1C69FF"></stop><stop offset="1" stopColor="#F0DCD6"></stop></linearGradient><clipPath id="a"><path fill="#fff" d="M0 0h64v64H0z"></path></clipPath></defs></svg>
              )}
              <div className="flex flex-col gap-0">
                <span className="text-sm">{model.name}</span>
                <span className="text-muted-foreground line-clamp-2 text-xs">
                  {model.description}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
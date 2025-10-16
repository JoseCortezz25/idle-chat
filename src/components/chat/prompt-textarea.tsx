"use client";

import { PromptInputAction, PromptInputActions, PromptInputTextarea } from "@/components/ui/prompt-input";
import { PromptInput } from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, File, Square, X } from "lucide-react";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Models } from "@/lib/types";
import { Globe } from "@/components/fundations/icons";
import { cn } from "@/lib/utils";
import { ChatRequestOptions } from "ai";
import { usePathname } from "next/navigation";
import { InputUploadFiles } from "@/components/prompt-textarea/input-upload-files";
import { PreviewImage } from "@/components/prompt-textarea/preview-image";

interface PromptTextarea {
  inputValue: string;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: {
    preventDefault?: () => void;
  }, chatRequestOptions?: ChatRequestOptions) => void
  isLoading: boolean;
  stop?: () => void;
  setIsSearchGrounding: Dispatch<SetStateAction<boolean>>;
  isSearchGrounding: boolean;
  files: FileList | undefined;
  setFiles: Dispatch<SetStateAction<FileList | undefined>>;
}

export const PromptTextarea = ({
  inputValue,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  setIsSearchGrounding,
  isSearchGrounding,
  files,
  setFiles
}: PromptTextarea) => {
  /* eslint-disable-next-line */
  const [model, setModel] = useState(globalThis?.localStorage?.getItem("model") || Models.GEMINI_2_5_FLASH_PREVIEW_04_17);
  const isDisabled = inputValue.length === 0;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (files && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);

      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    }
  }, [files]);

  const handleModelChange = (model: string) => {
    setModel(model);
    globalThis?.localStorage?.setItem("model", model);
  };

  const handleFileRemove = (file: File) => {
    if (!files) return;
    const fileIndex = Array.from(files).findIndex(f => f.name === file.name);

    if (fileIndex !== -1 && previewUrls[fileIndex]) {
      URL.revokeObjectURL(previewUrls[fileIndex]);
    }

    const newFiles = Array.from(files).filter(f => f.name !== file.name);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    setFiles(dataTransfer.files);
  };

  const isHome = usePathname() === "/";

  const handleSubmitInput = () => {
    if (files && files.length > 0) {
      /* FIXME(@ai-sdk-upgrade-v5): The `experimental_attachments` property has been replaced with the parts array. Please manually migrate following https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0#attachments--file-parts */
      handleSubmit({}, {
        experimental_attachments: files
      });
    } else {
      handleSubmit();
    }

    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <PromptInput
      onSubmit={handleSubmitInput}
      className="w-full rounded-xl pt-3"
    >
      <div className="flex items-center gap-2">
        {files && files.length > 0 &&
          <div className="flex items-center gap-2 pb-1.5">
            {Array.from(files).map((file, index) => {
              if (file.type.startsWith('image/')) {
                return (
                  <PreviewImage
                    key={file.name}
                    image={previewUrls[index]}
                    alt={file.name}
                    onRemove={() => handleFileRemove(file)}
                  />
                );
              } 

              if (file.type.startsWith('application/pdf')) {
                return (
                  <div key={file.name} className="flex items-center gap-1 bg-gray-100 rounded-md p-1 relative">
                    <div className="w-[35px] h-[35px] rounded-md flex items-center justify-center">
                      <File className="size-5 text-gray-500 " />
                    </div>
                    <span className="text-sm text-gray-500 font-semibold max-w-[150px] truncate mr-1">{file.name}</span>
                    <button onClick={() => handleFileRemove(file)} className="cursor-pointer absolute -top-1 -right-1 rounded-full bg-gray-100">
                      <X className="size-4 text-gray-500 hover:bg-red-300 hover:text-red-700 rounded-full p-0.5" />
                    </button>
                  </div>
                );
              }
            })}
          </div>
        }
      </div>

      <PromptInputTextarea
        className="min-h-[40px] max-h-[100px] h-auto px-2 leading-[24px]"
        placeholder="Ask Idle anything"
        value={inputValue}
        disableAutosize={true}
        onChange={handleInputChange}
      />

      <PromptInputActions className="flex justify-between items-end mt-3">
        <div className="flex items-center gap-2">
          <div className="chat-tools">
            {!isHome && (
              <PromptInputAction tooltip="Upload files">
                <InputUploadFiles setFiles={setFiles} fileInputRef={fileInputRef} />
              </PromptInputAction>
            )}

            <PromptInputAction tooltip="Select Model">
              <ModelDropdown setModel={handleModelChange} />
            </PromptInputAction>

            <PromptInputAction tooltip="Search in the web">
              <button
                onClick={() => setIsSearchGrounding(prev => !prev)}
                className={cn("chat-tools__button", isSearchGrounding && "chat-tools__button--active")}
              >
                <Globe className="size-4" />
              </button>
            </PromptInputAction>
          </div>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop generation" : "Send message"}
        >
          <Button
            variant="default"
            size="icon"
            className="h-9 w-9 bg-brand-green rounded-lg hover:bg-brand-green-light cursor-pointer disabled:cursor-not-allowed"
            onClick={isLoading ? stop : handleSubmitInput}
            disabled={isDisabled}
          >
            {isLoading ? (
              <Square className="size-5 fill-current" />
            ) : (
              <ArrowUp className="size-5" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
};

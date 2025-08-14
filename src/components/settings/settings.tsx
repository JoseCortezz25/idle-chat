"use client";

import { Eye, EyeOff, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ModelDropdown } from "@/components/chat/model-dropdown";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEYS = { model: "model", apiKey: "apiKey" } as const;

export const Settings = () => {
  const [model, setModel] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");

  const handleSave = () => {
    globalThis?.localStorage?.setItem(STORAGE_KEYS.model, model);
    globalThis?.localStorage?.setItem(STORAGE_KEYS.apiKey, apiKey);
  };

  useEffect(() => {
    try {
      const savedModel = globalThis?.localStorage?.getItem(STORAGE_KEYS.model);
      const savedApiKey = globalThis?.localStorage?.getItem(STORAGE_KEYS.apiKey);
      if (savedModel) setModel(savedModel);
      if (savedApiKey) setApiKey(savedApiKey);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="form-settings">
      <div className="row-field mt-2">
        <Label>
          Selecciona el proveedor de IA
        </Label>
        <ModelDropdown
          setModel={(model) => setModel(model)}
          model={model}
          variant="input"
        />
      </div>

      <div className="row-field mb-4">
        <Label>
          Ingresa el API KEY de tu proveedor de IA
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[230px]">
              <p>
                La API KEY se guardara en tu navegador. Ninguna información se
                enviara a nuestros servidores.
              </p>
            </TooltipContent>
          </Tooltip>
        </Label>
        <div className="flex items-center gap-2 relative">
          <Input
            placeholder="Ingresa la API KEY"
            className="w-full"
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            className="absolute right-0 top-0 p-2.5 text-gray-500"
            onClick={() => setIsVisible(!isVisible)}
            type="button"
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button className="w-full py-4" onClick={handleSave}>
        Guardar
      </Button>
    </div>
  );
};

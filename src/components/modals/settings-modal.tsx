"use client";

import { useState } from "react";

import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Settings } from "../settings/settings";
import { SettingsIcon } from "lucide-react";
import { HeaderModal } from "./header-modal";

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="btn-standard">
            <SettingsIcon className="size-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0 rounded-3xl shadow-2xl overflow-hidden">
          <HeaderModal imageUrl="/images/app/idle-background.png" />
          <div className="px-4 mt-3 pb-6">
            <DialogHeader className="mb-5">
              <DialogTitle>Configuración</DialogTitle>
              <DialogDescription>
                Configura el proveedor de IA y la API KEY para usar en tu conversación.
              </DialogDescription>
            </DialogHeader>
            <Settings />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="btn-standard">
          <SettingsIcon className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="p-0">
        <DrawerHeader className="text-left">
          <DrawerTitle>Configuración</DrawerTitle>
          <DrawerDescription>
            Configura el proveedor de IA y la API KEY para usar en tu conversación.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 mt-3 pb-6">
          <Settings />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

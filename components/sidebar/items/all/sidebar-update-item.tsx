"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { ChatbotUIContext } from "@/context/context"
import { updateAssistant } from "@/db/assistants"
import { updateChat } from "@/db/chats"
import { updateCollection } from "@/db/collections"
import { updateFile } from "@/db/files"
import { updateModel } from "@/db/models"
import { updatePreset } from "@/db/presets"
import { updatePrompt } from "@/db/prompts"
import { updateTool } from "@/db/tools"
import { TablesUpdate } from "@/supabase/types"
import { ContentType, DataItemType } from "@/types"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { SidebarDeleteItem } from "./sidebar-delete-item"

interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  const {
    setChats,
    setPresets,
    setPrompts,
    setFiles,
    setCollections,
    setAssistants,
    setTools,
    setModels
  } = useContext(ChatbotUIContext)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const renderState = {
    chats: null,
    presets: null,
    prompts: null,
    files: null,
    collections: null,
    assistants: null,
    tools: null,
    models: null
  }

  const updateFunctions: Record<
    ContentType,
    ((id: string, state: any) => Promise<any>) | null
  > = {
    chats: updateChat as any,

    presets: async (presetId: string, state: TablesUpdate<"presets">) => {
      return updatePreset(presetId, state)
    },

    prompts: async (promptId: string, state: TablesUpdate<"prompts">) => {
      return updatePrompt(promptId, state)
    },

    files: async (fileId: string, state: TablesUpdate<"files">) => {
      return updateFile(fileId, state)
    },

    collections: async (collectionId: string, state: TablesUpdate<"collections">) => {
      return updateCollection(collectionId, state)
    },

    assistants: async (assistantId: string, state: TablesUpdate<"assistants">) => {
      // Single-tenant MVP: no workspace assignment / no assistant attachments here
      // Keep basic assistant updates working
      return updateAssistant(assistantId, state)
    },

    tools: async (toolId: string, state: TablesUpdate<"tools">) => {
      return updateTool(toolId, state)
    },

    models: async (modelId: string, state: TablesUpdate<"models">) => {
      return updateModel(modelId, state)
    }
  }

  const stateUpdateFunctions: Record<
    ContentType,
    ((updater: any) => void) | null
  > = {
    chats: setChats as any,
    presets: setPresets as any,
    prompts: setPrompts as any,
    files: setFiles as any,
    collections: setCollections as any,
    assistants: setAssistants as any,
    tools: setTools as any,
    models: setModels as any
  }

  const handleUpdate = async () => {
    try {
      const updateFn = updateFunctions[contentType]
      const setStateFn = stateUpdateFunctions[contentType]

      if (!updateFn || !setStateFn) return
      if (isTyping) return

      const updatedItem = await updateFn(item.id, updateState)

      setStateFn((prevItems: any[]) =>
        prevItems.map(prev => (prev.id === item.id ? updatedItem : prev))
      )

      setIsOpen(false)
      toast.success(`${contentType.slice(0, -1)} updated successfully`)
    } catch (error) {
      toast.error(`Error updating ${contentType.slice(0, -1)}. ${error}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="flex min-w-[450px] flex-col justify-between"
        side="left"
        onKeyDown={handleKeyDown}
      >
        <div className="grow overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              Edit {contentType.slice(0, -1)}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">{renderInputs(renderState[contentType])}</div>
        </div>

        <SheetFooter className="mt-2 flex justify-between">
          <SidebarDeleteItem item={item} contentType={contentType} />

          <div className="flex grow justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button ref={buttonRef} onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

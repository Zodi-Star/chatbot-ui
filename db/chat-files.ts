import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert } from "@/supabase/types"

export const getChatFilesByChatId = async (chatId: string) => {
  const { data: chatFiles, error } = await supabase
    .from("chat_files")
    .select("*")
    .eq("chat_id", chatId)

  if (error) {
    console.warn("getChatFilesByChatId failed", {
      chatId,
      error
    })
    return []
  }

  return chatFiles ?? []
}

export const createChatFile = async (chatFile: TablesInsert<"chat_files">) => {
  const { data: createdChatFile, error } = await supabase
    .from("chat_files")
    .insert(chatFile)
    .select("*")

  if (error) {
    throw error
  }

  return createdChatFile ?? []
}

export const createChatFiles = async (
  chatFiles: TablesInsert<"chat_files">[]
) => {
  const { data: createdChatFiles, error } = await supabase
    .from("chat_files")
    .insert(chatFiles)
    .select("*")

  if (error) {
    throw error
  }

  return createdChatFiles ?? []
}

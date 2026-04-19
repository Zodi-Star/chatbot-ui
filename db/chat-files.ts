import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert } from "@/supabase/types"

type ChatFileRecord = {
  id: string
  name: string
  type: string
  size: number
}

export const getChatFilesByChatId = async (
  chatId: string
): Promise<ChatFileRecord[]> => {
  const { data, error } = await supabase
    .from("chat_files")
    .select(
      `
      file_id,
      files (
        id,
        name,
        type,
        size
      )
    `
    )
    .eq("chat_id", chatId)

  if (error) {
    throw error
  }

  return (data ?? [])
    .map(item => item.files as ChatFileRecord | null)
    .filter((file): file is ChatFileRecord => Boolean(file))
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

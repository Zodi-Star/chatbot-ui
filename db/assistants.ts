import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getAssistantById = async (assistantId: string) => {
  const { data, error } = await supabase
    .from("assistants")
    .select("*")
    .eq("id", assistantId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const getAssistantsByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("assistants")
    .select("*")
    .eq("user_id", userId)

  if (error) throw new Error(error.message)
  return data
}

export const createAssistant = async (
  assistant: TablesInsert<"assistants">
) => {
  const { data, error } = await supabase
    .from("assistants")
    .insert([assistant])
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const updateAssistant = async (
  assistantId: string,
  assistant: TablesUpdate<"assistants">
) => {
  const { data, error } = await supabase
    .from("assistants")
    .update(assistant)
    .eq("id", assistantId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const deleteAssistant = async (assistantId: string) => {
  const { error } = await supabase
    .from("assistants")
    .delete()
    .eq("id", assistantId)

  if (error) throw new Error(error.message)
  return true
}

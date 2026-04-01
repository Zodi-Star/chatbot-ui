import { createClient } from "@/lib/supabase/server"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)
    .eq("home", true)
    .single()

  if (error) {
    console.error("Error fetching home workspace:", error)
    return null
  }

  return data
}

import { supabase } from "@/lib/supabase/browser-client"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching workspaces:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return null
  }

  if (!data || data.length === 0) {
    console.error("No workspaces returned for user", userId)
    return null
  }

  const homeWorkspace =
    data.find((workspace: any) => workspace.home === true) ??
    data.find((workspace: any) => workspace.is_home === true) ??
    data[0]

  return homeWorkspace
}

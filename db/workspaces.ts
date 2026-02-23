export const getHomeWorkspaceByUserId = async (_userId?: string) => {
  return {
    id: "default",
    name: "Default Workspace"
  }
}

export const getWorkspaceById = async (_workspaceId?: string) => {
  return {
    id: "default",
    name: "Default Workspace"
  }
}

export const getWorkspacesByUserId = async (_userId?: string) => {
  return []
}

export const createWorkspace = async (_data?: any) => {
  return null
}

export const updateWorkspace = async (_workspaceId?: string, _data?: any) => {
  return null
}

export const deleteWorkspace = async (_workspaceId?: string) => {
  return null
}

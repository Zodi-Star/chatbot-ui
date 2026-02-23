export const getHomeWorkspaceByUserId = async (_userId?: string) => {
  return getDummyWorkspace()
}

export const getWorkspaceById = async (_workspaceId?: string) => {
  return getDummyWorkspace()
}

export const getWorkspacesByUserId = async (_userId?: string) => {
  return [getDummyWorkspace()]
}

export const createWorkspace = async (_data?: any) => {
  return getDummyWorkspace()
}

export const updateWorkspace = async (_workspaceId?: string, _data?: any) => {
  return getDummyWorkspace()
}

export const deleteWorkspace = async (_workspaceId?: string) => {
  return null
}

const getDummyWorkspace = () => {
  return {
    id: "default",
    user_id: "default",
    name: "Default Workspace",
    description: "",
    created_at: new Date().toISOString(),
    default_model: "gpt-4",
    default_temperature: 0.7,
    default_context_length: 4096,
    default_prompt: "",
    embeddings_provider: "",
    openai_api_key: null,
    anthropic_api_key: null,
    google_api_key: null,
    mistral_api_key: null,
    azure_openai_api_key: null,
    azure_openai_endpoint: null,
    azure_openai_deployment_name: null,
    azure_openai_version: null,
    groq_api_key: null
  }
}

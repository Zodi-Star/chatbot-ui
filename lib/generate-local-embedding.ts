import { env, pipeline } from "@xenova/transformers"

env.cacheDir = process.env.VERCEL ? "/tmp/xenova-cache" : ".cache/xenova"

let embeddingPipeline: any = null

export async function generateLocalEmbedding(text: string) {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )
  }

  const output = await embeddingPipeline(text, {
    pooling: "mean",
    normalize: true
  })

  return Array.from(output.data)
}

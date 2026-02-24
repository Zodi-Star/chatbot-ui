import { redirect } from "next/navigation"

export default function SetupPage({
  params
}: {
  params: { locale: string }
}) {
  redirect(`/${params.locale}/chat`)
}

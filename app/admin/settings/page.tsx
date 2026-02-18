import { getSettings } from "@/app/actions/admin-settings"
import { SettingsForm } from "./_components/settings-form"

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
    const { settings } = await getSettings()

    return <SettingsForm initialSettings={settings} />
}

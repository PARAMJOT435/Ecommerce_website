'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAdminClient } from './utils'

// Default settings used as fallback
const DEFAULT_SETTINGS: Record<string, string> = {
    store_name: 'MMW Industrial',
    store_tagline: 'Heavy Machinery & Professional Equipment',
    store_email: 'sales@mmwindustrial.com',
    store_phone: '+91 1800 555 0000',
    store_address: 'Industrial Area, Phase 1, Ludhiana, Punjab, India',
    currency: 'USD',
    free_shipping_threshold: '10000',
    flat_shipping_rate: '250',
    returns_window_days: '30',
    gst_rate: '18',
    tax_included: 'false',
    payment_gateway: 'B2B Invoice / Wire Transfer',
    business_hours: 'Mon — Fri: 8 AM – 6 PM IST',
}

export async function getSettings() {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')

    if (error) {
        console.error('Error fetching settings:', error)
        // Return defaults if table doesn't exist yet
        return { settings: DEFAULT_SETTINGS, error: null }
    }

    // Merge fetched settings with defaults
    const settings = { ...DEFAULT_SETTINGS }
    data?.forEach((row: any) => {
        settings[row.key] = row.value
    })

    return { settings, error: null }
}

export async function updateSettings(formData: FormData) {
    try {
        const { supabase } = await getAdminClient()
        const entries: { key: string; value: string }[] = []


        formData.forEach((value, key) => {
            entries.push({ key, value: value.toString() })
        })

        // Upsert each setting
        for (const entry of entries) {
            const { error } = await supabase
                .from('site_settings')
                .upsert(
                    { key: entry.key, value: entry.value, updated_at: new Date().toISOString() },
                    { onConflict: 'key' }
                )

            if (error) {
                console.error(`Error updating setting ${entry.key}:`, error)
                return { error: `Failed to update ${entry.key}: ${error.message}` }
            }
        }

        revalidatePath('/admin/settings')
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAdminClient } from './utils'

// Default settings used as fallback
const DEFAULT_SETTINGS: Record<string, string> = {
    store_name: 'fewofmany',
    store_tagline: 'Hygiene essentials for everyone',
    store_email: 'hello@fewofmany.com',
    store_phone: '+91 12345 67890',
    store_address: 'Chandigarh, India',
    currency: 'INR',
    free_shipping_threshold: '499',
    flat_shipping_rate: '49',
    returns_window_days: '7',
    gst_rate: '18',
    tax_included: 'false',
    payment_gateway: 'Razorpay',
    business_hours: 'Mon — Sat: 10 AM – 6 PM IST',
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

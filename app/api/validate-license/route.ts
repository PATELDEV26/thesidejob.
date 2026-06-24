import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const { license_key, machine_id, app_version } = await req.json();

    if (!license_key || !machine_id) {
      return NextResponse.json({ valid: false, reason: 'missing_fields' }, { status: 400 });
    }

    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single();

    if (error || !license) {
      return NextResponse.json({ valid: false, reason: 'invalid_key' }, { status: 200 });
    }

    if (license.is_revoked) {
      return NextResponse.json({ valid: false, reason: 'revoked' }, { status: 200 });
    }

    if (license.plan_type === 'monthly' && license.expires_at) {
      if (new Date(license.expires_at) < new Date()) {
        return NextResponse.json({ valid: false, reason: 'expired' }, { status: 200 });
      }
    }

    if (!license.machine_id) {
      // First activation
      await supabase.from('licenses')
        .update({ 
          machine_id: machine_id,
          activation_count: (license.activation_count || 0) + 1 
        })
        .eq('id', license.id);
    } else if (license.machine_id !== machine_id) {
      if ((license.activation_count || 1) < (license.max_activations || 2)) {
        // Register second machine (in a real app we might store array of machine_ids, 
        // but for simplicity we allow if activation_count < max_activations)
        await supabase.from('licenses')
          .update({ 
            machine_id: machine_id, // This overrides previous, real implementation should use an array or separate table
            activation_count: (license.activation_count || 1) + 1 
          })
          .eq('id', license.id);
      } else {
        return NextResponse.json({ valid: false, reason: 'max_devices_reached' }, { status: 200 });
      }
    }

    return NextResponse.json({ 
      valid: true, 
      plan: license.plan_type, 
      expires_at: license.expires_at 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ valid: false, reason: 'server_error' }, { status: 500 });
  }
}

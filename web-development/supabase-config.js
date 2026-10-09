/* ===================================================================
   DATAMEX HRIS & PAYROLL - SUPABASE CLOUD DATABASE CONFIGURATION
   Architect: Marcial Lawrence Jr V. Caronan
   =================================================================== */

// Global Supabase Credentials Store
window.DCSA_SUPABASE = {
  // You can paste your Supabase URL & Key here, or enter them in the Web App's "Connect Supabase" modal
  url: localStorage.getItem('DCSA_SUPABASE_URL') || '',
  anonKey: localStorage.getItem('DCSA_SUPABASE_ANON_KEY') || '',
  client: null,
  isConnected: false
};

// Initialize Supabase Client
function initSupabaseClient() {
  const url = window.DCSA_SUPABASE.url.trim();
  const key = window.DCSA_SUPABASE.anonKey.trim();

  if (url && key && typeof supabase !== 'undefined' && supabase.createClient) {
    try {
      window.DCSA_SUPABASE.client = supabase.createClient(url, key);
      window.DCSA_SUPABASE.isConnected = true;
      console.log('✅ Supabase client initialized:', url);
    } catch (e) {
      console.warn('⚠️ Supabase init error:', e);
      window.DCSA_SUPABASE.client = null;
      window.DCSA_SUPABASE.isConnected = false;
    }
  } else {
    window.DCSA_SUPABASE.client = null;
    window.DCSA_SUPABASE.isConnected = false;
  }
}

// Test live ping to Supabase
async function testSupabaseConnection(testUrl, testKey) {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    throw new Error('Supabase JS library not loaded. Check your internet connection.');
  }

  const client = supabase.createClient(testUrl.trim(), testKey.trim());
  const { data, error } = await client.from('employees').select('*').limit(1);

  if (error) {
    throw new Error(error.message || 'Failed to query Supabase tables. Check RLS or credentials.');
  }

  return true;
}

// Save credentials from UI modal and sync
function saveSupabaseCredentials(url, key) {
  const trimmedUrl = url.trim();
  const trimmedKey = key.trim();

  localStorage.setItem('DCSA_SUPABASE_URL', trimmedUrl);
  localStorage.setItem('DCSA_SUPABASE_ANON_KEY', trimmedKey);

  window.DCSA_SUPABASE.url = trimmedUrl;
  window.DCSA_SUPABASE.anonKey = trimmedKey;

  initSupabaseClient();
}

// Disconnect / Clear credentials
function disconnectSupabase() {
  localStorage.removeItem('DCSA_SUPABASE_URL');
  localStorage.removeItem('DCSA_SUPABASE_ANON_KEY');
  window.DCSA_SUPABASE.url = '';
  window.DCSA_SUPABASE.anonKey = '';
  window.DCSA_SUPABASE.client = null;
  window.DCSA_SUPABASE.isConnected = false;
}

// Auto-run on load
initSupabaseClient();

require('dotenv').config({ path: '.env.local' });

console.log('--- ENV CHECK ---');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL Length:', url ? url.length : 'undefined');
console.log('Key Length:', key ? key.length : 'undefined');

if (url && url.startsWith('https://')) {
    console.log('URL format seems correct (starts with https://)');
} else if (url) {
    console.log('URL format WARNING: does not start with https://');
} else {
    console.log('URL MISSING');
}

if (key) {
    console.log('Key present');
} else {
    console.log('Key MISSING');
}

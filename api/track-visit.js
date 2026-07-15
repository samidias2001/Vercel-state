import { put, get } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               data.ip || 'inconnue';
    
    const visit = {
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      ip: ip.split(',')[0].trim(),
      device: data.device || 'inconnu',
      ua: data.ua || 'inconnu',
      date: new Date().toLocaleDateString('fr-FR'),
      time: new Date().toLocaleTimeString('fr-FR'),
      timestamp: Date.now(),
    };

    let visits = [];
    try {
      const blob = await get('visits/all-visits.json');
      if (blob) {
        const text = await blob.text();
        visits = JSON.parse(text);
      }
    } catch (e) {
      visits = [];
    }

    visits.push(visit);
    if (visits.length > 3000) visits = visits.slice(-3000);

    await put('visits/all-visits.json', JSON.stringify(visits), {
      access: 'private',
      addRandomSuffix: false,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

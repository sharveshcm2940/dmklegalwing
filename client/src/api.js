import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE || '/api';
const FILE_BASE = import.meta.env.VITE_FILE_BASE || '';

function csrfToken() {
  const m = document.cookie.match(/(?:^|; )csrf_access_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  let payload;
  if (form) {
    payload = form;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  if (method !== 'GET') headers['X-CSRF-TOKEN'] = csrfToken();

  let res;
  try {
    res = await fetch(API + path, { method, headers, body: payload, credentials: 'include' });
  } catch (e) {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }
  if (!res.ok) {
    const err = new Error((data && (data.error || data.msg)) || 'The request failed. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const fileUrl = (u) => (!u ? '' : /^https?:/.test(u) ? u : FILE_BASE + u);

export function useFetch(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    let live = true;
    setState({ data: null, error: null, loading: true });
    api(path)
      .then((data) => live && setState({ data, error: null, loading: false }))
      .catch((e) => live && setState({ data: null, error: e.message, loading: false }));
    return () => { live = false; };
  }, [path]);
  return state;
}

export const paragraphs = (text) => (text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

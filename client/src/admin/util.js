import { api } from '../api.js';

// Admin calls go through here so an expired session sends the person back to the login form.
export async function adm(path, opts) {
  try {
    return await api('/admin' + path, opts);
  } catch (e) {
    if (e.status === 401) window.dispatchEvent(new Event('lw-expired'));
    throw e;
  }
}

export async function uploadFile(file, kind) {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', kind);
  const res = await adm('/upload', { method: 'POST', form });
  return res.url;
}

export const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

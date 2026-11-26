import { useCallback, useEffect, useState } from 'react';
import { fileUrl } from '../api.js';
import { adm, uploadFile } from './util.js';

function Field({ def, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const v = value === null || value === undefined ? '' : value;

  if (def.type === 'checkbox') {
    return (
      <label className="check">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{def.label}</span>
      </label>
    );
  }
  if (def.type === 'image' || def.type === 'pdf') {
    const pick = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setBusy(true); setErr('');
      try { onChange(await uploadFile(file, def.type)); } catch (ex) { setErr(ex.message); }
      setBusy(false);
      e.target.value = '';
    };
    return (
      <div className="field">
        <span className="field-label">{def.label}</span>
        {v && def.type === 'image' ? <img className="thumb" src={fileUrl(v)} alt="" /> : null}
        {v && def.type === 'pdf' ? <a href={fileUrl(v)} target="_blank" rel="noopener noreferrer">Open current file</a> : null}
        <input type="file" accept={def.type === 'pdf' ? 'application/pdf' : 'image/*'} onChange={pick} disabled={busy} />
        {busy ? <span className="hint">Uploading…</span> : null}
        {err ? <span className="field-error">{err}</span> : null}
        {v ? <button type="button" className="link-btn" onClick={() => onChange('')}>Remove</button> : null}
      </div>
    );
  }
  let input;
  if (def.type === 'textarea') {
    input = <textarea rows={def.rows || 5} value={v} onChange={(e) => onChange(e.target.value)} required={def.required} />;
  } else if (def.type === 'select') {
    input = (
      <select value={v} onChange={(e) => onChange(e.target.value)}>
        {def.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
      </select>
    );
  } else {
    const type = { number: 'number', datetime: 'datetime-local', date: 'date', url: 'url', email: 'email', password: 'password' }[def.type] || 'text';
    const shown = def.type === 'datetime' ? String(v).slice(0, 16) : def.type === 'date' ? String(v).slice(0, 10) : v;
    input = <input type={type} value={shown} onChange={(e) => onChange(e.target.value)} required={def.required} />;
  }
  return (
    <label className="field">
      <span className="field-label">{def.label}</span>
      {input}
      {def.help ? <span className="hint">{def.help}</span> : null}
    </label>
  );
}

export default function Manager({
  title, endpoint, columns, fields, defaults = {},
  canAdd = true, canDelete = true, supportsTrash = false,
  isSuperAdmin = false, rowActions, intro,
}) {
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });
  const [form, setForm] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await adm('/' + endpoint + (showTrash ? '?include_trashed=1' : ''));
      const list = showTrash ? res.items.filter((i) => i.trashed_at) : res.items;
      setItems(list);
      setState({ loading: false, error: '' });
    } catch (e) {
      setState({ loading: false, error: e.message });
    }
  }, [endpoint, showTrash]);

  useEffect(() => { setState({ loading: true, error: '' }); setForm(null); load(); }, [load]);

  const openNew = () => { setFormError(''); setForm({ ...defaults }); };
  const openEdit = (row) => { setFormError(''); setForm({ ...row }); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setFormError('');
    const payload = {};
    fields.forEach((f) => { payload[f.name] = form[f.name]; });
    try {
      if (form.id) await adm(`/${endpoint}/${form.id}`, { method: 'PUT', body: payload });
      else await adm(`/${endpoint}`, { method: 'POST', body: payload });
      setForm(null);
      setNotice('Saved.');
      await load();
    } catch (ex) {
      setFormError(ex.message);
    }
    setBusy(false);
  };

  const remove = async (row) => {
    const msg = supportsTrash ? 'Move this item to Trash (30-day restore window)?' : 'Delete this item?';
    if (!window.confirm(msg)) return;
    try {
      await adm(`/${endpoint}/${row.id}`, { method: 'DELETE' });
      setNotice(supportsTrash ? 'Moved to Trash.' : 'Deleted.');
      await load();
    } catch (ex) {
      setNotice(ex.message);
    }
  };

  const restore = async (row) => {
    try {
      await adm(`/${endpoint}/${row.id}/restore`, { method: 'POST' });
      setNotice('Restored to Draft.');
      await load();
    } catch (ex) { setNotice(ex.message); }
  };

  const purge = async (row) => {
    if (!window.confirm('PERMANENTLY purge this item? This cannot be undone.')) return;
    try {
      await adm(`/${endpoint}/${row.id}/purge`, { method: 'DELETE' });
      setNotice('Purged.');
      await load();
    } catch (ex) { setNotice(ex.message); }
  };

  return (
    <section>
      <div className="adm-head">
        <h1>{title}{showTrash ? ' — Trash' : ''}</h1>
        <div className="adm-actions">
          {supportsTrash ? (
            <button type="button" className="btn btn-small btn-ghost" onClick={() => setShowTrash(!showTrash)}>
              {showTrash ? 'View active items' : 'View Trash'}
            </button>
          ) : null}
          {canAdd && !form && !showTrash ? <button className="btn" type="button" onClick={openNew}>Add new</button> : null}
        </div>
      </div>
      {intro ? <p className="hint">{intro}</p> : null}
      {notice ? <p className="notice" role="status" onAnimationEnd={() => setNotice('')}>{notice}</p> : null}

      {form ? (
        <form className="adm-form" onSubmit={save}>
          <h2>{form.id ? 'Edit' : 'Add new'}</h2>
          {fields.map((f) => (
            <Field key={f.name} def={f} value={form[f.name]} onChange={(val) => setForm({ ...form, [f.name]: val })} />
          ))}
          {formError ? <p className="form-msg form-error" role="alert">{formError}</p> : null}
          <div className="adm-actions">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      ) : null}

      {state.loading ? <p className="status">Loading…</p> : state.error ? <p className="status status-error" role="alert">{state.error}</p> : items.length === 0 ? (
        <p className="status">{showTrash ? 'Trash is empty.' : 'Nothing here yet.'}</p>
      ) : (
        <div className="table-scroll">
          <table className="adm-table">
            <thead>
              <tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}<th scope="col"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}</td>)}
                  <td className="row-actions">
                    {rowActions ? rowActions(row) : null}
                    {showTrash ? (
                      <>
                        <button type="button" className="link-btn" onClick={() => restore(row)}>Restore</button>
                        {isSuperAdmin ? <button type="button" className="link-btn danger" onClick={() => purge(row)}>Purge</button> : null}
                      </>
                    ) : (
                      <>
                        <button type="button" className="link-btn" onClick={() => openEdit(row)}>Edit</button>
                        {canDelete ? <button type="button" className="link-btn danger" onClick={() => remove(row)}>{supportsTrash ? 'Trash' : 'Delete'}</button> : null}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components.jsx';
import { api } from '../api.js';
import { useLang } from '../i18n.jsx';

export default function Contact() {
  const { t, lang, lp, settings } = useLang();
  const [form, setForm] = useState({
    inquiry_type: 'cadre_helpdesk',
    district: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    dpdp_consent: false,
    is_adult_or_guardian: true,
    website: '',
  });
  const [status, setStatus] = useState({ busy: false, done: null, error: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ busy: true, done: null, error: '' });
    try {
      const res = await api('/contact', { method: 'POST', body: form });
      setStatus({ busy: false, done: res, error: '' });
      setForm({
        inquiry_type: 'cadre_helpdesk',
        district: '',
        name: '',
        email: '',
        phone: '',
        message: '',
        dpdp_consent: false,
        is_adult_or_guardian: true,
        website: '',
      });
    } catch (err) {
      setStatus({ busy: false, done: null, error: err.message });
    }
  };

  return (
    <>
      <PageTitle lead={t('contact_lead')}>{t('contact_title')}</PageTitle>
      <div className="wrap section contact-grid" id="helpdesk">
        <form onSubmit={submit} className="form">
          {/* Standalone DPDP Notice (Rule 3 readiness) */}
          <div className="dpdp-notice" role="region" aria-label="DPDP Privacy Notice">
            <h2>{lang === 'ta' ? 'தரவு பாதுகாப்பு அறிவிப்பு (DPDP தனி அறிவிப்பு)' : 'Standalone Data Privacy Notice (DPDP Readiness)'}</h2>
            <p>
              {lang === 'ta'
                ? 'நோக்கம்: உங்கள் பெயர், விருப்பத் தொடர்பு எண் மற்றும் கோரிக்கை விவரங்கள் கழக உள்-உதவிப் பணி, திருத்தம் அல்லது தரவு நீக்கக் கோரிக்கையைப் பரிசீலிக்க மட்டுமே பயன்படுத்தப்படும். இவை அதிகபட்சம் 1 ஆண்டு (அல்லது நீக்கக் கோரிக்கை வந்தால் 48 மணி நேர முன்னறிவிப்புடன்) வைத்திருக்கப்பட்டு நீக்கப்படும்.'
                : 'Purpose: The personal data you enter (name, optional phone/email, district, and message) is processed solely to route your intra-party helpdesk, general inquiry, correction, or erasure/takedown request. Records are scheduled for deletion after 1 year (or earlier upon erasure request).'}
            </p>
            <p className="hint-text">
              {lang === 'ta' ? 'முழு விவரங்களுக்கு: ' : 'Full policy: '}
              <Link to={lp('/privacy')}>{t('privacy')}</Link>
            </p>
          </div>

          <label>
            {t('inquiry_type')}
            <select value={form.inquiry_type} onChange={set('inquiry_type')}>
              <option value="cadre_helpdesk">{lang === 'ta' ? 'கழக சட்ட உதவி மையக் கோரிக்கை (உள்-கட்சி)' : 'Intra-Party Cadre Helpdesk Request'}</option>
              <option value="general">{lang === 'ta' ? 'பொதுத் தொடர்பு' : 'General Inquiry'}</option>
              <option value="dpdp_erasure">{lang === 'ta' ? 'DPDP தனிநபர் தரவு நீக்கக் கோரிக்கை' : 'DPDP Personal Data Erasure Request'}</option>
              <option value="takedown">{lang === 'ta' ? 'படம் / உள்ளடக்க நீக்கக் கோரிக்கை' : 'Content / Photo Takedown Request'}</option>
              <option value="correction">{lang === 'ta' ? 'செய்தி / தகவல் திருத்தக் கோரிக்கை' : 'Editorial Correction Request'}</option>
            </select>
          </label>

          <label>{t('your_name')}<input required maxLength={120} value={form.name} onChange={set('name')} /></label>
          <label>{t('your_district')}<input maxLength={120} value={form.district} onChange={set('district')} /></label>
          <label>{t('your_email')}<input type="email" maxLength={190} value={form.email} onChange={set('email')} /></label>
          <label>{t('your_phone')}<input type="tel" maxLength={40} value={form.phone} onChange={set('phone')} /></label>
          <label>{t('your_message')}<textarea required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={set('message')} /></label>

          <label className="check">
            <input type="checkbox" required checked={form.dpdp_consent} onChange={set('dpdp_consent')} />
            <span>
              {lang === 'ta'
                ? 'மேற்கண்ட தனியுரிமை அறிவிப்பைப் படித்து, என் கோரிக்கையைப் பரிசீலிக்க இத்தரவைப் பயன்படுத்தச் சம்மதம் அளிக்கிறேன்.'
                : 'I have read the standalone privacy notice above and consent to processing this data for my stated request.'}
            </span>
          </label>

          <label className="check">
            <input type="checkbox" required checked={form.is_adult_or_guardian} onChange={set('is_adult_or_guardian')} />
            <span>
              {lang === 'ta'
                ? 'நான் 18 வயதுக்கு மேற்பட்டவர் (அல்லது 18 வயதுக்குட்பட்டவரின் சட்டப்பூர்வப் பாதுகாவலர் சம்மதம் உள்ளது).'
                : 'I confirm I am 18 or older (or submitting with verifiable parent/guardian consent).'}
            </span>
          </label>

          <div className="hp" aria-hidden="true">
            <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
          </div>

          {status.error ? <p className="form-msg form-error" role="alert">{status.error}</p> : null}
          {status.done ? (
            <p className="form-msg form-ok" role="status">
              {t('sent')} Ref #{status.done.reference_id} (Retention schedule until {status.done.retention_until}).
            </p>
          ) : null}
          <button className="btn" type="submit" disabled={status.busy}>{status.busy ? t('sending') : t('send')}</button>
        </form>

        <aside className="reach">
          <h2>{t('reach_us')}</h2>
          <ul>
            <li>
              <span className="reach-role">{lang === 'ta' ? 'கழகத் தலைமை அலுவலக முகவரி' : 'Party Headquarters Address'}</span>
              <span className="reach-name">Anna Arivalayam</span>
              <span>{settings ? (lang === 'ta' ? settings.wing_office_address_ta : settings.wing_office_address_en) : '367–369 Anna Salai, Teynampet, Chennai 600018'}</span>
            </li>
            <li>
              <span className="reach-role">{lang === 'ta' ? 'சட்டத்துறை அதிகாரப்பூர்வத் தொடர்பு' : 'Official Wing Email & Phone'}</span>
              <span>{settings ? settings.wing_official_email : 'Pending confirmation by DMK Legal Wing'}</span>
              <span>{settings ? settings.wing_official_phone : 'Pending confirmation by DMK Legal Wing'}</span>
            </li>
            <li>
              <span className="reach-role">{lang === 'ta' ? 'தரவு பாதுகாப்புப் புகார் அதிகாரி (DPDP)' : 'DPDP Grievance Officer'}</span>
              <span>{settings ? settings.grievance_officer_name : 'To be designated before May 2027'}</span>
              <span>{settings ? settings.grievance_officer_email : 'Pending confirmation'}</span>
            </li>
            <li>
              <span className="reach-role">{lang === 'ta' ? 'அரசு இலவச சட்ட உதவி (TNSLSA / NALSA)' : 'Statutory Free Legal Aid (TNSLSA / NALSA)'}</span>
              <span className="reach-name">NALSA: 15100 · TNSLSA: 1800 4252 441</span>
              <span>044-25342441 · tnslsa@gmail.com</span>
              <span>High Court Legal Services: Chennai 044-29550126 · Madurai 0452-2433756</span>
            </li>
          </ul>
        </aside>
      </div>
    </>
  );
}

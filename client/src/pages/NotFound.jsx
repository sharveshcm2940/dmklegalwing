import { Link } from 'react-router-dom';
import { PageTitle } from '../components.jsx';
import { useLang } from '../i18n.jsx';

export default function NotFound() {
  const { t, lp } = useLang();
  return (
    <>
      <PageTitle>{t('not_found')}</PageTitle>
      <div className="wrap section"><Link className="btn" to={lp('/')}>{t('go_home')}</Link></div>
    </>
  );
}

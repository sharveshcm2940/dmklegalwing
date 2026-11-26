import { PageTitle, Paragraphs, Status } from '../components.jsx';
import { useFetch } from '../api.js';
import { useLang } from '../i18n.jsx';

export default function TextPage({ pageKey }) {
  const { pick } = useLang();
  const state = useFetch(`/pages/${pageKey}`);
  return (
    <Status state={state}>
      {state.data && (
        <>
          <PageTitle>{pick(state.data, 'title')}</PageTitle>
          <div className="wrap section prose">
            <Paragraphs text={pick(state.data, 'body')} />
          </div>
        </>
      )}
    </Status>
  );
}

// src/examples/UsingTranslations.tsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

export default function UsingTranslations() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginTop: 16 }}>
      <h2>{t('welcome')}</h2>
      <p>{t('tagline')}</p>
      <p>
        <Trans i18nKey="rich_example">
          This has <strong>rich</strong> content.
        </Trans>
      </p>
    </div>
  );
}

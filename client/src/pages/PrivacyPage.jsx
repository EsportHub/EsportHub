// src/pages/PrivacyPage.jsx
import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 760, margin: '4rem auto', padding: '0 1rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            background: '#a800ff',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: '#555', fontSize: '0.82rem', marginBottom: '3rem' }}>
          Last updated: January 1, 2026
        </p>

        <Section title="1. Information We Collect">
          We collect information you provide directly, such as your username, email address, and
          theme preferences when you register or update your profile. We also collect usage data
          such as pages visited and features used.
        </Section>

        <Section title="2. How We Use Your Information">
          We use your information to provide and improve the EsportHub service, personalize your
          experience (e.g. saved theme, favorite teams), send service-related notifications, and
          ensure the security of your account.
        </Section>

        <Section title="3. Data Storage">
          Your data is stored securely on our servers. Authentication tokens are stored locally in
          your browser and are used solely to maintain your session. We do not sell your personal
          data to third parties.
        </Section>

        <Section title="4. Cookies">
          EsportHub uses local storage to store your session token and theme preference. We do not
          use third-party tracking cookies or advertising cookies.
        </Section>

        <Section title="5. Third-Party Services">
          Match and tournament data may be sourced from third-party providers such as PandaScore.
          These providers have their own privacy policies which we encourage you to review.
        </Section>

        <Section title="6. Your Rights">
          You have the right to access, correct, or delete your personal data at any time. You can
          update your profile information in the account settings or contact us to request account
          deletion.
        </Section>

        <Section title="7. Data Retention">
          We retain your account data for as long as your account is active. If you delete your
          account, your personal data will be removed within 30 days.
        </Section>

        <Section title="8. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes by posting a notice on the platform.
        </Section>

        <Section title="9. Contact">
          For privacy-related questions or requests, contact us at{' '}
          <a href="mailto:privacy@esportshub.com" style={{ color: '#a800ff' }}>
            privacy@esportshub.com
          </a>
          .
        </Section>
      </div>
    </PageLayout>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: '#ccc',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
      <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

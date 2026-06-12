// src/pages/TermsPage.jsx
import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ color: '#555', fontSize: '0.82rem', marginBottom: '3rem' }}>
          Last updated: January 1, 2026
        </p>

        <Section title="1. Acceptance of Terms">
          By accessing or using EsportHub, you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the platform.
        </Section>

        <Section title="2. Use of the Platform">
          EsportHub provides esports data, match tracking, and team information for informational
          purposes. You agree to use the platform only for lawful purposes and in a manner that does
          not infringe the rights of others.
        </Section>

        <Section title="3. User Accounts">
          You are responsible for maintaining the confidentiality of your account credentials. You
          agree to notify us immediately of any unauthorized use of your account. EsportHub reserves
          the right to terminate accounts at its discretion.
        </Section>

        <Section title="4. Intellectual Property">
          All content on EsportHub, including logos, text, and data, is the property of EsportHub or
          its licensors. You may not reproduce or distribute any content without prior written
          permission.
        </Section>

        <Section title="5. Disclaimer of Warranties">
          EsportHub is provided "as is" without warranties of any kind. We do not guarantee the
          accuracy, completeness, or availability of any data or service on the platform.
        </Section>

        <Section title="6. Limitation of Liability">
          To the maximum extent permitted by law, EsportHub shall not be liable for any indirect,
          incidental, or consequential damages arising out of your use of the platform.
        </Section>

        <Section title="7. Changes to Terms">
          We reserve the right to modify these Terms at any time. Continued use of the platform
          after changes constitutes acceptance of the new Terms.
        </Section>

        <Section title="8. Contact">
          If you have questions about these Terms, please contact us at{' '}
          <a href="mailto:support@esportshub.com" style={{ color: '#a800ff' }}>
            support@esportshub.com
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

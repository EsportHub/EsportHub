import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FormField, TextInput, SubmitButton } from '../../components/common/UI';
import styles from './Auth.module.css';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email обовʼязковий';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Невірний формат email';
    if (!form.password) e.password = 'Пароль обовʼязковий';
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      addToast('Успішний вхід!', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      const msg = err.userMessage || 'Невірний email або пароль';
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
      else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('пароль'))
        setErrors({ password: msg });
      else addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageSide} />
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign In</h1>
          <form onSubmit={submit} className={styles.form}>
            <FormField label="Email Address" error={errors.email}>
              <TextInput
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={change}
                error={errors.email}
                autoComplete="email"
              />
            </FormField>
            <FormField
              label="Password"
              error={errors.password}
              hint="Мінімум 8 символів, цифри та спецсимволи."
            >
              <TextInput
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={change}
                error={errors.password}
                autoComplete="current-password"
              />
            </FormField>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                id="rm"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={change}
                style={{ accentColor: '#a800ff', width: 16, height: 16 }}
              />
              <label htmlFor="rm" style={{ fontSize: '.875rem', color: '#888', cursor: 'pointer' }}>
                Запамʼятати мене
              </label>
            </div>
            <SubmitButton loading={loading}>Увійти</SubmitButton>
            <div className={styles.divider} />
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialButton}>
                Log in with Google
              </button>
              <button type="button" className={styles.socialButton}>
                Log in with Apple
              </button>
            </div>
          </form>
          <p className={styles.footerText}>
            Немає акаунту?{' '}
            <span className={styles.footerLink} onClick={() => navigate('/register')}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

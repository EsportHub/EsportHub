// src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FormField, TextInput, SubmitButton } from '../../components/common/UI';
import styles from './Auth.module.css';

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Імʼя обовʼязкове';
    if (!form.lastName.trim()) e.lastName = 'Прізвище обовʼязкове';
    if (!form.email) e.email = 'Email обовʼязковий';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Невірний email';
    if (!form.password) e.password = 'Пароль обовʼязковий';
    else if (form.password.length < 8) e.password = 'Мінімум 8 символів';
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
      // 1. Готуємо дані суворо під формат бекенду (Swagger)
      const requestData = {
        username: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      };

      // 2. Відправляємо саме requestData, а не весь state форми
      await register(requestData);

      addToast('Акаунт успішно створено!', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      // Якщо сервер повернув помилку валідації (наприклад, про username)
      const msg = err.userMessage || 'Помилка реєстрації';

      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exist')) {
        setErrors((p) => ({ ...p, email: 'Цей email вже використовується' }));
      } else {
        addToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Sign Up</h1>
          <form onSubmit={submit} className={styles.form}>
            <div className={styles.inputRow}>
              <FormField label="First Name" error={errors.firstName}>
                <TextInput
                  type="text"
                  name="firstName"
                  placeholder="Імʼя"
                  value={form.firstName}
                  onChange={change}
                  error={errors.firstName}
                  autoComplete="given-name"
                />
              </FormField>
              <FormField label="Last Name" error={errors.lastName}>
                <TextInput
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={form.lastName}
                  onChange={change}
                  error={errors.lastName}
                  autoComplete="family-name"
                />
              </FormField>
            </div>
            <FormField label="Email" error={errors.email}>
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
            <FormField label="Password" error={errors.password}>
              <TextInput
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={change}
                error={errors.password}
                autoComplete="new-password"
              />
            </FormField>
            <SubmitButton loading={loading}>Зареєструватися</SubmitButton>
          </form>
          <p className={styles.footerText}>
            Вже маєте акаунт?{' '}
            <span className={styles.footerLink} onClick={() => navigate('/login')}>
              Увійти
            </span>
          </p>
        </div>
      </div>
      <div className={styles.imageSide} />
    </div>
  );
}

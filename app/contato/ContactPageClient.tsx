'use client';

import { useState } from 'react';

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setSuccess(true);
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contact-page__form-wrap">
      {success ? (
        <p className="contact-form__success">
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <p className="contact-form__error">{error}</p>}

          <div className="contact-form__field">
            <label className="contact-form__label">Nome</label>
            <input
              className="contact-form__input"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label">E-mail</label>
            <input
              className="contact-form__input"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label">Telefone</label>
            <input
              className="contact-form__input"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="contact-form__field">
            <label className="contact-form__label">Mensagem</label>
            <textarea
              className="contact-form__textarea"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Como podemos ajudar?"
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar mensagem'}
          </button>
        </form>
      )}
    </div>
  );
}

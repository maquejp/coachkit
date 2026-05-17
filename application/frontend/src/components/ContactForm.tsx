import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { useContactForm } from '@/hooks/useContactForm';
import { useFieldErrors, extractFieldErrors } from '@/lib/errors';

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const { submit, submitting } = useContactForm();
  const { fieldErrors, setFromApi, clearFieldError, clearAll } = useFieldErrors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearAll();
    setSubmitError('');
    try {
      const ok = await submit({ name, email, phone, message });
      if (ok) {
        onSuccess?.();
      }
    } catch (err) {
      setFromApi(err);
      if (!Object.keys(extractFieldErrors(err)).length) {
        setSubmitError(t('common.saveError'));
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label={t('contactForm.name')} required error={fieldErrors.name}>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError('name');
          }}
          required
          error={!!fieldErrors.name}
        />
      </FormField>
      <FormField label={t('contactForm.email')} required error={fieldErrors.email}>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError('email');
          }}
          required
          error={!!fieldErrors.email}
        />
      </FormField>
      <FormField label={t('contactForm.phone')} error={fieldErrors.phone}>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearFieldError('phone');
          }}
          error={!!fieldErrors.phone}
        />
      </FormField>
      <FormField label={t('contactForm.message')} required error={fieldErrors.message}>
        <Textarea
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearFieldError('message');
          }}
          required
        />
      </FormField>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button type="submit" loading={submitting}>
        {submitting ? t('contactForm.sending') : t('contactForm.sendMessage')}
      </Button>
    </form>
  );
}

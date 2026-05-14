import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string; message: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ name, email, phone, message });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label={t('contactForm.name')} required>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label={t('contactForm.email')} required>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </FormField>
      <FormField label={t('contactForm.phone')}>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      <FormField label={t('contactForm.message')} required>
        <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </FormField>
      <Button type="submit">{t('contactForm.sendMessage')}</Button>
    </form>
  );
}

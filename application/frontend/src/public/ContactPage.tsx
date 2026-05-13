import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Contact Us</h1>
      <p className="mb-10 text-gray-600">Have a question? We'd love to hear from you.</p>
      <ContactForm onSubmit={(data) => alert(JSON.stringify(data))} />
    </div>
  );
}

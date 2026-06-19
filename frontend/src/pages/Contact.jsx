import React, { useState } from 'react';

const FAQS = [
  {
    question: 'Is borrowing resources completely free?',
    answer: 'Yes! In most cases, resource sharing is free. However, for heavy machinery (like tractors or water pumps), the borrower is expected to arrange or pay for their own fuel, and return the equipment in clean working condition.'
  },
  {
    question: 'What happens if I accidentally damage a borrowed item?',
    answer: 'VillageShare relies on trust and community cooperation. If you damage an item, you are expected to inform the owner immediately and arrange for its repair or cover the replacement cost. Maintaining honesty helps keep the trust score high.'
  },
  {
    question: 'How does the date overlap prevention work?',
    answer: 'When a borrower requests an item, the backend checks for overlapping dates against already APPROVED bookings. Once the owner approves a request, the system blocks other bookings for those dates and automatically rejects conflicting pending requests.'
  },
  {
    question: 'How do I contact the owner of a resource?',
    answer: 'For privacy, contact phone numbers are hidden from visitors. Once you register and log in, the owner\'s verified contact number and direct phone link will become visible on the item details page.'
  },
  {
    question: 'Can I list resources that are not listed in the categories?',
    answer: 'Yes! You can choose the "Other" category when listing your item, and write a detailed description explaining what the resource is and how it can help fellow villagers.'
  }
];

const Contact = () => {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState({});

  const toggleFaq = (index) => {
    setOpenFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request timeout
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setVillage('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title">Help & Support Center</h1>
        <p className="section-subtitle">
          Have questions about using VillageShare or need support? Browse FAQs or send us a message directly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
        
        {/* Left Column: Interactive FAQs */}
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
            🙋 Frequently Asked Questions
          </h2>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {FAQS.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--primary-emerald)' }}>
                    {openFaq[index] ? '−' : '+'}
                  </span>
                </div>
                {openFaq[index] && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Us Form */}
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
            ✉️ Write to Us
          </h2>
          <div className="glass-card">
            {success && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                🎉 Thank you for reaching out! Your message has been received. Our community coordinators will contact you soon.
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSuccess(false); }}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-email">Email or Phone Number</label>
                  <input
                    type="text"
                    id="contact-email"
                    className="form-control"
                    placeholder="e.g. name@mail.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSuccess(false); }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-village">Village Name</label>
                  <input
                    type="text"
                    id="contact-village"
                    className="form-control"
                    placeholder="e.g. Rampur"
                    value={village}
                    onChange={(e) => { setVillage(e.target.value); setSuccess(false); }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  className="form-control"
                  rows="4"
                  placeholder="Describe your issue or query..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setSuccess(false); }}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-secondary ${submitting ? 'btn-disabled' : ''}`}
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;

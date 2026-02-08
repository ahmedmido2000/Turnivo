import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How can Noovy help independent hotels?',
      answer: 'Noovy is an all-in-one hotel management system designed specifically for independent hotels. We help you manage bookings, automate operations, increase direct revenue, and deliver exceptional guest experiences—all from one platform.'
    },
    {
      question: 'What features does Noovy include?',
      answer: 'Noovy includes property management, booking engine, channel manager, payment processing, revenue management, guest messaging, online check-in, reporting & analytics, and 500+ integrations. Everything you need to run your hotel efficiently.'
    },
    {
      question: 'Is it easy to switch to Noovy from my current PMS?',
      answer: 'Absolutely! We handle the entire migration process for you. Our team will import your data, set up your system, train your staff, and ensure a smooth transition with zero downtime. You don\'t have to lift a finger.'
    },
    {
      question: 'What kind of support does Noovy provide?',
      answer: 'We offer 24/7 support via chat, phone, and WhatsApp. Our team consists of real people with hospitality experience who understand your challenges. You\'ll also get dedicated onboarding and ongoing training resources.'
    },
    {
      question: 'Does Noovy provide Training when we switch?',
      answer: 'Every new Noovy client receives full onboarding support, including a guided setup and personal training for your team during the implementation period. We make sure you and your staff feel confident using Noovy from day one.'
    },
    {
      question: 'Is Noovy easy to implement and use for my hotel?',
      answer: 'Yes! Noovy is designed to be intuitive and user-friendly. Most hotels are up and running within days, not weeks. Our team handles the technical setup, and your staff will find the interface simple and easy to navigate.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <div className="faq-badge">
            <span className="badge-icon">❓</span>
            <span className="badge-text">Answers</span>
          </div>
          <h2 className="faq-title">
            Got questions? Let's<br />
            clear things up.
          </h2>
          <p className="faq-description">
            Browse our most frequently asked questions below, or<br />
            reach out to our team if you need additional support.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span className="question-text">{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? '×' : '+'}
                </span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

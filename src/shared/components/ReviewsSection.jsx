import React from 'react';
import './ReviewsSection.css';

const ReviewsSection = () => {
  const reviews = [
    {
      quote: 'Finally found software my staff actually wants to use',
      testimonial: 'We switched to Noovy last month, and it\'s been smooth sailing. Our front desk team figured it out in minutes without me having to explain everything. They just started using it!',
      author: 'Baha Mansour',
      hotel: 'Quentin XL hotel'
    },
    {
      quote: 'Everything in one place for a price that makes sense',
      testimonial: 'We\'ve been using Noovy for a few years and I love that there are no surprise fees every month like our old system. Everything runs from one dashboard. So, no more switching between sites!',
      author: 'Davy Aenspeck',
      hotel: 'Domaine de Blamont'
    },
    {
      quote: 'We save so much time on daily operations',
      testimonial: 'Noovy automates a lot of our routine tasks so my team spends less time on paperwork. The best part is I can see room status and get reports without bouncing between different systems.',
      author: 'Hatem al-Fattal',
      hotel: 'Blossoms Hotel'
    }
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        {/* Header */}
        <div className="reviews-header">
          <div className="reviews-badge">
            <span className="badge-icon">💬</span>
            <span className="badge-text">Reviews</span>
          </div>
          <h2 className="reviews-title">
            "We switched to Noovy,<br />
            and we'd do it again."
          </h2>
          <p className="reviews-description">
            You're in good company. Independent hotels all over the world<br />
            have already switched and they feel the difference every day.
          </p>
        </div>

        {/* Review Cards */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              {/* 5 Stars */}
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <h3 className="review-quote">"{review.quote}"</h3>

              {/* Testimonial */}
              <p className="review-testimonial">{review.testimonial}</p>

              {/* Author Info */}
              <div className="review-author">
                <div className="author-name">{review.author}</div>
                <div className="author-hotel">{review.hotel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="reviews-cta-wrapper">
          <button className="reviews-cta">
            Explore all customer reviews
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

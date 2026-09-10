import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export default function CustomerReviews() {
  const [paused, setPaused] = useState(false);
  const status = 'ready';
  const reviews = [
    { id: 'sample-weekend', rating: 5, title: 'A weekend, well spent.', comment: 'A comfortable ride, an open road, and time to explore. Exactly the kind of weekend we had in mind.', name: 'Weekend explorer', car: 'Illustrative review · not a customer testimonial' },
    { id: 'sample-city', rating: 5, title: 'More room for the day.', comment: 'From our first stop to the last, having a car made it easier to enjoy the city at our own pace.', name: 'City traveller', car: 'Illustrative review · not a customer testimonial' },
    { id: 'sample-family', rating: 5, title: 'Made for the long way home.', comment: 'Room for the family, the bags, and a few spontaneous detours. The journey became part of the holiday.', name: 'Family road trip', car: 'Illustrative review · not a customer testimonial' },
  ];
  const moving = reviews.length > 2;
  return <>
    <section className="host-invitation">
      <div><span className="section-label">YOUR CAR. NEW POSSIBILITIES.</span><h2>Park less. Earn more.</h2><p>Put your car to work when you’re not using it. Submit a listing, follow its review, and manage rental earnings from your owner dashboard.</p></div>
      <Link to="/list-your-car"><Button size="large" icon={<ArrowRightOutlined />}>Become a host</Button></Link>
    </section>
    <section className="renter-stories" aria-label="Sample review showcase">
      <div className="stories-heading"><div><span className="section-label">A LITTLE ROAD-TRIP INSPIRATION</span><h2>Every drive has a story.</h2><p>Sample reviews shown for design preview — these are illustrative, not actual customer feedback.</p></div>{moving && <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Play reviews' : 'Pause reviews'}</button>}</div>
      {reviews.length ? <div className={`stories-window ${moving ? 'has-motion' : ''} ${paused ? 'is-paused' : ''}`}><div className="stories-track">{(moving ? [0, 1] : [0]).map(copy => <div className="stories-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{reviews.map(review => <article className="story-card" key={review.id}><div className="story-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}<span>{'☆'.repeat(Math.max(0, 5 - Math.round(review.rating)))}</span></div>{review.title && <h3>{review.title}</h3>}<blockquote>{review.comment}</blockquote><div className="story-person"><span className="story-avatar">{review.name.slice(0, 1).toUpperCase()}</span><div><strong>{review.name}</strong><small>{review.car}</small></div><span className="story-quote" aria-hidden="true">”</span></div></article>)}</div>)}</div></div> : <div className="stories-empty"><span className="empty-quote" aria-hidden="true">“</span><div><h3>{status === 'loading' ? 'Gathering your stories…' : status === 'error' ? 'Your next journey is worth sharing.' : 'Be the first story on this page.'}</h3><p>{status === 'error' ? 'Reviews are temporarily unavailable. You can still share your experience from My bookings.' : 'After your rental, share what made the journey yours. Your review could help someone find their next ride.'}</p><Link to="/userbookings">Share your experience ↗</Link></div></div>}
    </section>
  </>;
}

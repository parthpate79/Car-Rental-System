import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
export default function CustomerReviews() {
  return <section className="host-invitation">
    <div><span className="section-label">YOUR CAR. NEW POSSIBILITIES.</span><h2>Park less. Earn more.</h2><p>Put your car to work when you’re not using it. Submit a listing, follow its review, and manage rental earnings from your owner dashboard.</p></div>
    <Link to="/list-your-car"><Button size="large" icon={<ArrowRightOutlined />}>Become a host</Button></Link>
  </section>;
}

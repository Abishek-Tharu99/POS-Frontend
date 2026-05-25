import React from 'react'

const AboutUs = () => {
    return (
        <>
       <section className="about-section">

  <div className="about-container">

    <h1 className="about-title">About NexusPOS</h1>

    <p className="about-description">
      NexusPOS is a next-generation smart Point of Sale system...
    </p>

    <div className="about-grid">

      <div className="about-card">
        <h2>Smart Billing</h2>
        <p>Fast and reliable billing system...</p>
      </div>

      <div className="about-card">
        <h2>Inventory Control</h2>
        <p>Track products and manage stock...</p>
      </div>

      <div className="about-card">
        <h2>Future Ready</h2>
        <p>Built for AI and cloud integration...</p>
      </div>

    </div>

    <div className="mission-section">
      <h2 className="mission-title">Our Mission</h2>

      <p className="mission-text">
        Our mission is to empower businesses...
      </p>
    </div>

  </div>

</section>

        </>
    )
}

export default AboutUs
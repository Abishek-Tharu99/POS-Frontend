import React from "react";
import { useState } from "react";
import api from "../api/axios";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/contact/send_message/",
        form
      );

      alert(res.data.message);
    } catch (err) {
      alert("Failed to send");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="fw-bold">Contact Us</h1>
            <p className="text-muted">
              We'd love to hear from you. Feel free to reach out for
              support, business inquiries, or partnership opportunities.
            </p>
          </div>

          <div className="row g-4">

            {/* Contact Information */}
            <div className="col-md-5">
              <div className="card border-0 shadow h-100">
                <div className="card-body p-4">

                  <h3 className="mb-4">Get In Touch</h3>

                  <div className="mb-4">
                    <h6>
                      <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                      Address
                    </h6>
                    <p className="text-muted">
                      Kathmandu, Nepal
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6>
                      <i className="fa-solid fa-phone me-2 text-success"></i>
                      Phone
                    </h6>
                    <p className="text-muted">
                      +977 9761285140
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6>
                      <i className="fa-solid fa-envelope me-2 text-danger"></i>
                      Email
                    </h6>
                    <p className="text-muted">
                      hackerheaven73@gmail.com
                    </p>
                  </div>

                  <div>
                    <h6>
                      <i className="fa-solid fa-clock me-2 text-warning"></i>
                      Working Hours
                    </h6>
                    <p className="text-muted">
                      Sunday - Friday <br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-7">
              <div className="card border-0 shadow">
                <div className="card-body p-4">

                  <h3 className="mb-4">Send a Message</h3>

                  <form onSubmit={handleSubmit}>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter your email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Message
                      </label>
                      <textarea
                        rows="5"
                        className="form-control"
                        placeholder="Write your message..."
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Send Message
                    </button>

                  </form>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
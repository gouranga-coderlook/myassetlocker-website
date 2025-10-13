"use client";
import Hero from "@/components/Hero";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/contact-page.png"
        headline="we are here to help, contact us today!"
        ctaButton={{
          enabled: false,
        }}
      />

      <div className="px-4 lg:px-40">
        {/* Contact Information */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Cards */}
              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Email Us
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Send us an email anytime
                </p>
                <a
                  href="mailto:support@myassetlocker.com"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  support@myassetlocker.com
                </a>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Call Us
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Mon-Fri 9AM-6PM EST
                </p>
                <a
                  href="tel:+1-800-555-0123"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  (800) 555-0123
                </a>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Visit Us
                </h3>
                <p className="text-base text-text-secondary mb-4">
                  Our headquarters
                </p>
                <address className="text-primary-600 dark:text-primary-400 not-italic">
                  123 Asset Protection Blvd
                  <br />
                  San Francisco, CA 94105
                </address>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Send Us a Message
                </h2>
                <p className="text-base text-text-secondary max-w-2xl mx-auto">
                  Have a question or need support? Fill out the form below and
                  we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-success-600 dark:text-success-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-base text-text-secondary">
                        Thank you for contacting us. We&apos;ll get back to you
                        soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-text-primary mb-2"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-text-primary mb-2"
                          >
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-text-primary mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="inquiryType"
                            className="block text-sm font-medium text-text-primary mb-2"
                          >
                            Inquiry Type
                          </label>
                          <select
                            id="inquiryType"
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="billing">Billing Question</option>
                            <option value="partnership">Partnership</option>
                            <option value="media">Media Inquiry</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary"
                          placeholder="Brief description of your inquiry"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-primary text-text-primary resize-none"
                          placeholder="Please provide details about your inquiry..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-8">
                  <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Response Times
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          General Inquiries
                        </span>
                        <span className="text-text-primary font-medium">
                          24 hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          Technical Support
                        </span>
                        <span className="text-text-primary font-medium">
                          4 hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          Billing Questions
                        </span>
                        <span className="text-text-primary font-medium">
                          12 hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Partnership</span>
                        <span className="text-text-primary font-medium">
                          48 hours
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          Monday - Friday
                        </span>
                        <span className="text-text-primary font-medium">
                          9:00 AM - 6:00 PM EST
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Saturday</span>
                        <span className="text-text-primary font-medium">
                          10:00 AM - 4:00 PM EST
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Sunday</span>
                        <span className="text-text-primary font-medium">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Emergency Support
                    </h3>
                    <p className="text-base text-text-secondary mb-4">
                      For urgent matters outside business hours, please call our
                      emergency line:
                    </p>
                    <a
                      href="tel:+1-800-555-0124"
                      className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                    >
                      (800) 555-0124
                    </a>
                    <p className="text-sm text-text-tertiary mt-2">
                      Available 24/7 for critical issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-base text-text-secondary">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    How quickly can I get started with MyAssetLocker?
                  </h3>
                  <p className="text-base text-text-secondary">
                    You can start using our digital locker immediately after
                    downloading the app. For valet storage services, we
                    typically schedule pickups within 24-48 hours of your
                    request.
                  </p>
                </div>

                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Is my data secure with MyAssetLocker?
                  </h3>
                  <p className="text-base text-text-secondary">
                    Yes, we use bank-level 256-bit encryption and are SOC 2 Type
                    II compliant. Your data is stored securely and never shared
                    without your explicit consent.
                  </p>
                </div>

                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    What areas do you serve for valet storage?
                  </h3>
                  <p className="text-base text-text-secondary">
                    We currently serve 25 major metropolitan areas across the
                    United States. Check our app or contact us to see if we
                    serve your area.
                  </p>
                </div>

                <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    How does insurance claim processing work?
                  </h3>
                  <p className="text-base text-text-secondary">
                    We provide detailed reports and documentation that insurance
                    companies can use to process claims faster. Many of our
                    customers see 70% faster claim processing times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

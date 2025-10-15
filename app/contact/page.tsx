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
        headline="Get in Touch"
        bodyText="We're here to help you protect and manage your valuable assets. Contact our team for personalized assistance and support."
        ctaButton={{
          enabled: false,
        }}
        isHomePage={false}
      />

      {/* Contact Information */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Contact Information
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Get in touch with our team through any of these channels
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Email Us
                </h3>
                <p className="text-[#8e9293] mb-6">
                  Send us an email anytime and we'll respond within 24 hours
                </p>
                <a
                  href="mailto:support@myassetlocker.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  support@myassetlocker.com
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Call Us
                </h3>
                <p className="text-[#8e9293] mb-6">
                  Mon-Fri 9AM-6PM EST for immediate assistance
                </p>
                <a
                  href="tel:+1-800-555-0123"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  (800) 555-0123
                </a>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Visit Us
                </h3>
                <p className="text-[#8e9293] mb-6">
                  Our headquarters in Colorado Springs
                </p>
                <address className="text-[#4c4946] not-italic font-medium">
                  123 Asset Protection Blvd
                  <br />
                  Colorado Springs, CO 80901
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Send Us a Message
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Have a question or need support? Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-white"
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
                    <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-[#8e9293]">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-semibold text-[#4c4946] mb-3"
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
                          className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-[#4c4946] mb-3"
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
                          className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-[#4c4946] mb-3"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="inquiryType"
                          className="block text-sm font-semibold text-[#4c4946] mb-3"
                        >
                          Inquiry Type
                        </label>
                        <select
                          id="inquiryType"
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300"
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
                        className="block text-sm font-semibold text-[#4c4946] mb-3"
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
                        className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-[#4c4946] mb-3"
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
                        className="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-xl focus:ring-2 focus:ring-[#f8992f] focus:border-[#f8992f] bg-white text-[#4c4946] transition-all duration-300 resize-none"
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#f8992f] to-[#e8911f] hover:from-[#e8911f] hover:to-[#c2751a] disabled:from-[#8e9293] disabled:to-[#8e9293] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
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
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-[#4c4946] mb-6">
                    Response Times
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-[#fef7ed] rounded-xl">
                      <span className="text-[#8e9293] font-medium">
                        General Inquiries
                      </span>
                      <span className="text-[#f8992f] font-bold">
                        24 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#fef7ed] rounded-xl">
                      <span className="text-[#8e9293] font-medium">
                        Technical Support
                      </span>
                      <span className="text-[#f8992f] font-bold">
                        4 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#fef7ed] rounded-xl">
                      <span className="text-[#8e9293] font-medium">
                        Billing Questions
                      </span>
                      <span className="text-[#f8992f] font-bold">
                        12 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#fef7ed] rounded-xl">
                      <span className="text-[#8e9293] font-medium">Partnership</span>
                      <span className="text-[#f8992f] font-bold">
                        48 hours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-[#4c4946] mb-6">
                    Business Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e9293] font-medium">
                        Monday - Friday
                      </span>
                      <span className="text-[#4c4946] font-bold">
                        9:00 AM - 6:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e9293] font-medium">Saturday</span>
                      <span className="text-[#4c4946] font-bold">
                        10:00 AM - 4:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8e9293] font-medium">Sunday</span>
                      <span className="text-[#4c4946] font-bold">
                        Closed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#f8992f] to-[#e8911f] rounded-2xl p-6 sm:p-8 text-white">
                  <h3 className="text-xl font-bold mb-4">
                    Emergency Support
                  </h3>
                  <p className="text-white/90 mb-4">
                    For urgent matters outside business hours, please call our
                    emergency line:
                  </p>
                  <a
                    href="tel:+1-800-555-0124"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#f8992f] font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                  >
                    (800) 555-0124
                  </a>
                  <p className="text-white/80 text-sm mt-3">
                    Available 24/7 for critical issues
                  </p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#f7f7f7] to-[#fef7ed]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#4c4946] mb-4 sm:mb-6 px-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-[#8e9293] max-w-3xl mx-auto leading-relaxed px-4">
                Quick answers to common questions about our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  How quickly can I get started?
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  You can start using our digital locker immediately after
                  downloading the app. For valet storage services, we
                  typically schedule pickups within 24-48 hours of your
                  request.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  Is my data secure?
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  Yes, we use bank-level 256-bit encryption and are SOC 2 Type
                  II compliant. Your data is stored securely and never shared
                  without your explicit consent.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  What areas do you serve?
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
                  We currently serve the greater Colorado Springs area with
                  zone-based pricing. Check our pricing page or contact us to
                  see if we serve your specific location.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl font-bold text-[#4c4946] mb-4">
                  How does insurance processing work?
                </h3>
                <p className="text-[#8e9293] leading-relaxed">
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
  );
}

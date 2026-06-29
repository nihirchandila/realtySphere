import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to send message.");
        return;
      }

      setSubmitted(true);

    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
  };

  const inputClass =
    "w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400/50 focus:bg-white border border-transparent focus:border-green-300 transition-all duration-200";

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      <div className="container">

        {/* Hero */}
        <div className="border-b border-gray-100 pt-32 pb-16">
          <div className="mx-auto flex flex-col lg:flex-row lg:items-end justify-evenly gap-8">
            <div>
              <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <a href="#" className="hover:text-gray-600 transition-colors">Home</a>
                <span>›</span>
                <span className="text-gray-600">Contact</span>
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Get in Touch
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-md">
                Have a question about a property or need expert advice? Our team is
                here to help you every step of the way.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              {[
                {
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  label: "Phone", value: "+91 971125561",
                },
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  label: "Email", value: "hello@realtysphere.com",
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  label: "Address", value: "12345, Faridabad, Haryana, India",
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-6 lg:px-16 py-16">
          <div className="max-w-5xl mx-auto">

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

                {/* Left */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                    Send us a message
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Fill out the form and one of our property experts will reach
                    out to you shortly. We typically respond within 24 hours.
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular topics</p>
                    <div className="flex flex-wrap gap-2">
                      {["Buy a property", "Sell a property", "Rental inquiry", "Investment advice", "General question"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, subject: t })}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                            ${formData.subject === t
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (000) 000-0000" className={inputClass} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help you?" required className={inputClass} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your property needs..." required rows={5} className={`${inputClass} resize-none`} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 active:scale-95 transition-all text-white text-sm font-semibold py-4 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                        </svg>
                        Sending…
                      </>
                    ) : "Send Message →"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageCircle,
  Check,
} from "lucide-react";
import Footer from "@/components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
        ...prev,
        [name]: value,
    }));
};

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
              Contact
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                MamaSphere
              </span>
            </h1>
            <p className="max-w-4xl mx-auto text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              We&apos;re here to support you. Reach out with any questions,
              feedback, or support needs.
            </p>
          </motion.div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Mail,
                title: "Email",
                content: "support@mamasphere.com",
                type: "email",
              },
              {
                icon: Phone,
                title: "Phone",
                content: "+91 988 776 5544",
                type: "phone",
              },
              {
                icon: MapPin,
                title: "Address",
                content: "MamaSphere HQ, Kolkata, India",
                type: "address",
              },
            ].map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-full p-4 inline-block mb-6">
                  <contact.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {contact.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {contact.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form and Image */}
          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12">
              {!submitted ? (
                <form
                  action="https://formspree.io/f/xwpkjpob"
                  method="POST"
                  className="max-w-2xl mx-auto"
                >
                  <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">
                    Get in Touch
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number (Optional)"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="relative mb-8">
                    <MessageCircle className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Your Message"
                      rows={5}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-pink-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="mr-2" />
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="text-center max-w-2xl mx-auto">
                  <Check className="mx-auto h-24 w-24 text-green-500 mb-8" />
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Thank you for reaching out to MamaSphere. We&apos;ll get
                    back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 px-8 rounded-xl hover:opacity-90 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>

            {/* Image Section */}
            <div className="hidden md:block">
              <img
                src="images/contact.png"
                alt="Contact Us"
                className="w-full h-full object-cover rounded-3xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;

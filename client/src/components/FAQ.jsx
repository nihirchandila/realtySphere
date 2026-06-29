import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What types of properties do you sell?",
    answer:
      "We specialize in residential, commercial, and luxury properties, offering a wide range of options to suit every buyer's needs and preferences. We connect you with trusted lenders offering competitive mortgage options and financial advice. We arrange private showings for you to visit and evaluate properties before making a decision. Properties range across different price points, catering to various budgets and investment goals.",
    image: "https://sbnri.com/blog/wp-content/uploads/2021/07/NRI-Property-In-India.jpg",
  },
  {
    id: 2,
    question: "How do I know if a property is a good investment?",
    answer:
      "We analyze market trends, location value, and long-term appreciation potential to help you make informed decisions. Our experts provide detailed reports and comparisons to ensure you invest wisely.",
    image: "https://sbnri.com/blog/wp-content/uploads/2021/07/NRI-Property-In-India.jpg",
  },
  {
    id: 3,
    question: "Do I need to hire a real estate agent?",
    answer:
      "While not mandatory, a real estate agent can significantly simplify the process. Our agents offer professional guidance, negotiate on your behalf, and ensure a smooth transaction from start to finish.",
    image: "https://sbnri.com/blog/wp-content/uploads/2021/07/NRI-Property-In-India.jpg",
  },
  {
    id: 4,
    question: "What's the process for buying a property?",
    answer:
      "The process involves searching for properties, securing financing, making an offer, conducting inspections, and closing the deal. Our team walks you through each step to make it as seamless as possible.",
    image: "https://sbnri.com/blog/wp-content/uploads/2021/07/NRI-Property-In-India.jpg",
  },
  {
    id: 5,
    question: "Can I tour a property before purchasing?",
    answer:
      "Absolutely! We arrange private showings at your convenience so you can visit, explore, and evaluate any property before making a commitment.",
    image: "https://sbnri.com/blog/wp-content/uploads/2021/07/NRI-Property-In-India.jpg",
  },
];

const ChevronIcon = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className={`border rounded-2xl overflow-hidden transition-all duration-600 cursor-pointer
      ${isOpen ? "border-gray-200 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
    onClick={onToggle}
  >
    {/* Question row */}
    <div className="flex items-center justify-between px-6 py-5 gap-4">
      <h3 className={`text-base lg:text-lg font-semibold leading-snug transition-colors
        ${isOpen ? "text-gray-900" : "text-gray-800"}`}>
        {faq.question}
      </h3>
      <ChevronIcon open={isOpen} />
    </div>

    {/* Answer — animated expand */}
    <div
      style={{ maxHeight: isOpen ? "600px" : "0", opacity: isOpen ? 1 : 0 }}
      className="transition-all duration-400 ease-in-out overflow-hidden"
    >
      <div className="px-6 pb-6 flex flex-col sm:flex-row gap-6 items-start">
        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {faq.answer}
        </p>
        {faq.image && (
          <div className="shrink-0 w-full sm:w-48 lg:w-56 rounded-xl overflow-hidden">
            <img
              src={faq.image}
              alt="Property interior"
              className="w-full h-36 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState(1); // first item open by default

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section className="bg-white py-14">
              <div className="container">


      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row lg:items-start justify-between gap-6 mb-12">
        <h2 className="heading-lg text-gray-900 leading-tight w-full sm:w-1/2">
          Frequently asked questions
        </h2>
        <p className="body-text w-full sm:w-[45%] md:w-[30%] lg:text-right">
          Our experts guide you in making informed investment decisions based on market
          insights. We offer residential, commercial, and luxury properties tailored to
          different preferences and budgets.
        </p>
      </div>

      {/* ── Accordion ── */}
      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openId === faq.id}
            onToggle={() => toggle(faq.id)}
          />
        ))}
      </div>
</div>  
    </section>
  );
};

export default FAQ;
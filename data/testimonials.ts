export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  content: string;
  rating: number;
  nps?: number;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Anna Jihad F.",
    role: "Founder",
    company: "Wolftagon & O'Art Studio",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "Hyperfantasy is a motivated, forward thinking & also intelligent UI Designer team with lots of knowledge in their field. Proactive, energetic & totally organized. Hyperfantasy always maintains very good relation with co-workers & clients. They learns quickly and I would have no hesitation in working with Hyperfantasy once again in the future.",
    rating: 5,
    nps: 10,
    date: "2023-06-10",
  },
  {
    id: "2",
    name: "Cokorda Gde Dwipa Susila",
    role: "Head of Shipping & Export Import",
    company: "PT Freeport Indonesia",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "Hyperfantasy is a rare & outstanding talents I have ever worked with. I've worked with them to develop UI/UX for an app & website. I was very impressed with their ability to translate a brief requirement into an awesome UI/UX design. They was always able to complete the task in a timely manner or even faster than the expected target. Great manner & professionalism during our cooperation.",
    rating: 5,
    nps: 10,
    date: "2023-04-22",
  },
  {
    id: "3",
    name: "Anas Al-Suhaim",
    role: "Founder & CTO",
    company: "Tammwel",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    content:
      "I have been consistently impressed with Hyperfantasy talents, efficiency, & ability to get things done. I believe that their would be an excellent addition to your design projects. Hyperfantasy constantly seeks to learn more about illustration, UI/UX trends & latest tools in the industry & also a quick learner who picks up new technology with great speed.",
    rating: 5,
    nps: 10,
    date: "2022-11-15",
  },
  {
    id: "4",
    name: "Armando Chandra",
    role: "Co-founder & CEO",
    company: "KonsulAja",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    content:
      "The quality of the deliverables produced was satisfactory as Hyperfantasy did manage the complete the project within a relatively short period of time given the urgency of the project. Given the numerous requests from us, Hyperfantasy remained professional throughout the project & responded to our inputs in a structure manner in Figma.",
    rating: 5,
    nps: 10,
    date: "2022-09-08",
  },
  {
    id: "5",
    name: "Mubarak Al-Nabit",
    role: "Founder",
    company: "ezLaundry — Qatar",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Very creative and resourceful. I give 10/10 for the service provided by Hyperfantasy. They are very communicative, good collaboration and all managed very properly. I worked with Hyperfantasy to build a mobile app, dashboard for back office & website landing page, all done very well. Highly recommended for those who want \"creativity\".",
    rating: 5,
    nps: 10,
    date: "2022-07-01",
  },
  // Tamawal® team
  {
    id: "6",
    name: "Iman Fathy",
    role: "Product Manager",
    company: "Tamawal®",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "I've had the pleasure of working with Hyperfantasy, and what stands out most is his creativity and genuine curiosity. He asks thoughtful questions to truly understand the problem before designing solutions, which makes a real difference in the quality of his work. He's hardworking, dependable, and always ready to step in when needed. What I admire most is his mindset — he sees every challenge as a chance to learn and grow. Any team would be lucky to have him.",
    rating: 4.5,
    nps: 9,
    date: "2026-02-24",
  },
  {
    id: "7",
    name: "Kamel Gamal Eltayar",
    role: "Business Analyst | Product Owner",
    company: "Tamawal®",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "All things he had from innovation side and ability to impress and being creative.",
    rating: 5,
    nps: 10,
    date: "2026-03-01",
  },
  {
    id: "8",
    name: "Soliman Ahmed",
    role: "Product Designer",
    company: "Tamawal®",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "I have worked with Hyperfantasy for more than one year. He always provides useful UI/UX solutions based on a deep understanding of the problems he works on. I was very lucky to collaborate with him on many product solutions, where he delivered outstanding results.",
    rating: 4.5,
    nps: 9,
    date: "2026-03-02",
  },
  {
    id: "9",
    name: "Abdullah Al Ashikh",
    role: "CFO",
    company: "Tamawal®",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy is a very great person with imagination. His soul is pure, and I enjoy interacting with him during design sessions. He should continue developing his creativity and focus more on design systems.",
    rating: 5,
    nps: 10,
    date: "2026-03-03",
  },
  {
    id: "10",
    name: "Mohamed AbdelHamid",
    role: "Senior Flutter Mobile Developer",
    company: "Tamawal®",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy is a talented and passionate designer who brings real value to any product he works on. His attention to detail, creativity, and understanding of user experience stand out. Working with him makes a noticeable difference in both the quality of the product and the overall workflow.",
    rating: 5,
    nps: 10,
    date: "2026-04-06",
  },
  // Tokopedia — Adsol Q2 2021
  {
    id: "11",
    name: "Reza Levi Fauzi",
    role: "Product Manager Adsol Q2 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Highly proactive. Overall, Hyperfantasy has a strong understanding of the Adsol business model.",
    rating: 4.5,
    nps: 9,
    date: "2021-06-30",
  },
  {
    id: "12",
    name: "Merlin Detalina",
    role: "Strategic Planning Adsol Q2 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy very respect with all question that asked to him about his UX proposal flow. Hyperfantasy has a good curiosity and critical thinking. He can find the rootcause and able to do a research to make his proposal flow stronger.",
    rating: 5,
    nps: 10,
    date: "2021-06-30",
  },
  {
    id: "13",
    name: "Amanda Kalpikasari",
    role: "Senior Sales & Ops Adsol Q2 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Provides updates, shows empathy, and understands user pain points.",
    rating: 4.5,
    nps: 9,
    date: "2021-06-30",
  },
  {
    id: "14",
    name: "Sasqia Azizah",
    role: "Inventory Management Adsol Q2 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy, thank you so much! It's sad that the time was so short. I wish the engagement could have been extended.",
    rating: 5,
    nps: 10,
    date: "2021-06-30",
  },
  // Tokopedia — Finance Q3 2021
  {
    id: "15",
    name: "Juan Lesmana",
    role: "Product Manager Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy adapts very quickly in learning new things. Very proactive and well-prepared. Well done. Really enjoy working with you.",
    rating: 5,
    nps: 10,
    date: "2021-09-30",
  },
  {
    id: "16",
    name: "Alhamsya Bintang Dyasta",
    role: "Software Engineer Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content: "Works quickly and understands the finance business model fast.",
    rating: 5,
    nps: 10,
    date: "2021-09-30",
  },
  {
    id: "17",
    name: "Raden Bregas Dwi Hatmojo",
    role: "Procurement Sp. Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "The overall procurement plan is easy to understand, and Hyperfantasy is able to provide advice. Good communication skills and clear guidelines. Thanks for the spirit.",
    rating: 4,
    nps: 8,
    date: "2021-09-30",
  },
  {
    id: "18",
    name: "Christyan Aditya",
    role: "Software Engineer Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Hyperfantasy has strong technical knowledge. From an engineer's point of view, it is easy to give input and brainstorm with Hyperfantasy.",
    rating: 5,
    nps: 10,
    date: "2021-09-30",
  },
  {
    id: "19",
    name: "Rahma Septeyani",
    role: "Account Payable Specialist Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content: "Fast learner, communicative, proactive.",
    rating: 4,
    nps: 8,
    date: "2021-09-30",
  },
  {
    id: "20",
    name: "Katherina Denistia",
    role: "Account Payable Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Keep up the spirit, Hyperfantasy. Thank you for supporting the AP team so far. We look forward to working with you again in future finance projects.",
    rating: 4.5,
    nps: 9,
    date: "2021-09-30",
  },
  {
    id: "21",
    name: "Reza Z. Ramadhan",
    role: "WPE Finance Q3 2021",
    company: "Tokopedia",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    content:
      "Growth mindset, communicative, and high ownership. Hyperfantasy is well-prepared when organizing meetings.",
    rating: 4,
    nps: 8,
    date: "2021-09-30",
  },
];

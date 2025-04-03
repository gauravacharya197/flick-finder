"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaDiscord, FaTelegram, FaHeart, FaInfoCircle, FaBalanceScale, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-stroke bg-white dark:border-strokedark dark:bg-background py-4">
      <div className="  px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          {/* Branding - Left Side on Desktop */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center md:justify-start mb-4 md:mb-0 md:w-[25%]"
          >
            <div className="text-primary font-bold text-xl md:text-2xl mb-1 text-center md:text-left">Flickday</div>
          </motion.div>
          
          {/* Social Links - Right Side on Desktop */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end"
          >
            <ul className="flex items-center gap-4">
              <li>
                <a
                  href="https://discord.gg/Y6HRYDUws2"
                  aria-label="Discord"
                  className="flex items-center text-[#D1D8E0] hover:text-primary transition-colors duration-300"
                >
                  <FaDiscord size={22} />
                  <span className="ml-2 text-md">Discord</span>
                </a>
              </li>
              <li>
                <a 
                  aria-label="Telegram" 
                  className="flex items-center text-[#D1D8E0] hover:text-primary transition-colors duration-300"
                >
                  <FaTelegram size={22} />
                  <span className="ml-2 text-md">Telegram</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Disclaimer Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-800 pt-2 mb-2"
        >
          <div className="flex items-start gap-2 mb-4">
            <FaInfoCircle className="text-primary mt-1 flex-shrink-0" size={16} />
            <div className="flex-grow">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disclaimer</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                This site does not host or store any files on our server; we only provide links to media hosted by non-affiliated third-party services. 
              </p>
            </div>
          </div>

          {/* Contact and DMCA Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center gap-6">
              {/* Email */}
              <a 
                href="mailto:feedback@flickday.to"
                className="flex items-center text-[#D1D8E0] hover:text-primary transition-colors duration-300 text-sm"
              >
                <FaEnvelope size={16} />
                <span className="ml-2">feedback@flickday.to</span>
              </a>
              
              {/* DMCA Link - Now next to email to avoid overlap with scroll button */}
              <Link 
                href="/dmca"
                className="flex items-center text-[#D1D8E0] hover:text-primary transition-colors duration-300 text-sm"
              >
                <FaBalanceScale size={16} />
                <span className="ml-2">DMCA</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
import { Github, Linkedin, Instagram } from "lucide-react"; // Updated imports
import { Container } from "@/components/container";

export const Footer = () => {
  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full bg-slate-900 text-slate-400 py-3">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright Text */}
          <div className="text-center md:text-left">
            <p>&copy; {currentYear} Sanskar Gupta. All Rights Reserved.</p>
          </div>

          {/* Social Media Links */}
          <div className="flex gap-5">
            <a
              href="https://github.com/jaiisshhh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/sanskargupta-vit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.instagram.com/jaiisshhh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;

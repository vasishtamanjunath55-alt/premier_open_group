import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">About BSG India</h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              The Bharat Scouts and Guides is India's premier youth development organization, 
              fostering character, citizenship, and service in young people across the nation.
            </p>
            <h3 className="text-lg font-bold mb-4 text-secondary">About Premier Open Group</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Premier Open Group, under BSG Karnataka, is dedicated to empowering youth through 
              leadership, service, and adventure while nurturing responsibility and character.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/programs" className="hover:text-secondary transition-colors">Programs</Link></li>
              <li><Link to="/awards" className="hover:text-secondary transition-colors">Awards</Link></li>
              <li><Link to="/news" className="hover:text-secondary transition-colors">News</Link></li>
              <li><Link to="/gallery" className="hover:text-secondary transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Sri Jayachamarajendra Scouts and Guides Headquarters, Mysuru - 570005</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>premieropengroup@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-glow mt-8 pt-8 text-center text-sm opacity-75">
          <p>&copy; Premier Open Group, The Bharath Scouts & Guides Karnataka </p>
        </div>
      </div>
    </footer>
  );
}

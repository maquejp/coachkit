import { Link } from 'react-router-dom';

const footerLinks = {
  Company: [
    { to: '/about', label: 'About' },
    { to: '/classes', label: 'Classes' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ],
  Support: [
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Help Center' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Use' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold text-primary-700">CoachKit</span>
            <p className="mt-2 text-sm text-gray-500">
              Empowering fitness studios and wellness businesses with seamless scheduling.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 9.799c-.193.458-.584 1.033-1.173 1.725.02.035.04.07.058.106.576 1.128.948 2.23 1.116 3.306.124.796.047 1.381-.232 1.755-.27.36-.719.543-1.343.543-.29 0-.619-.063-.987-.189a5.404 5.404 0 01-.542-.226 13.79 13.79 0 01-1.927-1.011c-.353-.212-.55-.35-.592-.413-.044-.068-.08-.14-.109-.218-.044.027-.129.064-.253.11-.124.047-.219.08-.283.101-.065.02-.137.03-.216.03-.337 0-.642-.128-.914-.384-.272-.256-.411-.56-.411-.914 0-.125.044-.258.133-.398.089-.14.188-.252.297-.337.11-.085.19-.146.242-.183l.148-.108c.205-.148.36-.267.463-.357.104-.09.193-.197.268-.323.074-.126.111-.236.111-.33 0-.089-.044-.162-.133-.22-.089-.058-.243-.088-.462-.088-.27 0-.534.083-.794.248-.26.165-.412.272-.455.32l-.048.054c-.096.064-.173.108-.232.133-.059.025-.13.037-.215.037-.158 0-.301-.055-.428-.165-.127-.11-.19-.24-.19-.39 0-.096.038-.22.114-.373.076-.152.166-.278.27-.377a2.34 2.34 0 01.36-.28c.533-.376 1.147-.564 1.843-.564.36 0 .669.058.928.174.26.116.448.256.564.42.116.165.19.32.222.466.032.146.048.346.048.6 0 .316-.034.573-.102.772s-.126.37-.184.483c-.058.113-.087.178-.087.195 0 .017.022.054.065.11.044.056.078.09.103.104.025.013.056.02.092.02.177 0 .441-.14.794-.418.352-.279.594-.573.725-.882.053-.124.132-.337.238-.639.106-.302.164-.505.174-.608.09-.692.257-1.19.5-1.494.244-.304.592-.492 1.046-.564.206-.033.451-.05.735-.05.481 0 .858.08 1.13.242.272.161.434.355.486.58.06.27.07.536.03.797z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CoachKit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

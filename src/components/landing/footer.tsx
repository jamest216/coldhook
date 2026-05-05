import Link from "next/link"
import { Zap } from "lucide-react"

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Resources: ["Docs", "Blog", "Cold Email Guide", "Templates"],
  Company: ["About", "Careers", "Press", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
}

export function Footer() {
  return (
    <footer className="border-t border-[#23252a] bg-[#0f1011] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#5e6ad2]">
                <Zap className="size-4 text-white" />
              </div>
              <span className="font-semibold text-[#f7f8f8]">ColdHook</span>
            </div>
            <p className="text-xs text-[#62666d] leading-relaxed max-w-[180px]">
              AI-powered cold email for modern sales teams.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-medium text-[#f7f8f8] mb-3">{section}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs text-[#62666d] hover:text-[#8a8f98] transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#23252a]">
          <p className="text-xs text-[#62666d]">
            © 2026 ColdHook Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#62666d]">
            Powered by{" "}
            <span className="text-[#5e6ad2]">Claude AI</span>
            {" · "}
            Built for{" "}
            <span className="text-[#d0d6e0]">sales professionals</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

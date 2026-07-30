import { socialLinks } from "../constants"
import { YoutubeIcon, TiktokIcon, InstagramIcon } from "./SocialIcons.jsx"

const socialIcons = {
    Youtube: YoutubeIcon,
    Tiktok: TiktokIcon,
    Instagram: InstagramIcon,
}

const Links = () => {
  return (
    <div className="flex items-center gap-3">
        {socialLinks.map((link) => {
            const Icon = socialIcons[link.name]
            return (
                <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    className="text-white-800 hover:text-brand-pink transition-colors"
                >
                    <Icon className="w-6 h-6" />
                </a>
            )
        })}
    </div>
  )
}

export default Links

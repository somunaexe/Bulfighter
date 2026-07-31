import { socialLinks } from "../constants"
import { YoutubeIcon, TiktokIcon, InstagramIcon, SnapchatIcon } from "./SocialIcons.jsx"

const socialIcons = {
    Youtube: YoutubeIcon,
    Tiktok: TiktokIcon,
    Instagram: InstagramIcon,
    Snapchat: SnapchatIcon,
}

const Links = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
        {socialLinks.map((link) => {
            const Icon = socialIcons[link.name]
            return (
                <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    className="text-white-800 hover:text-[rgb(var(--theme-accent))] transition-colors"
                >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
            )
        })}
    </div>
  )
}

export default Links

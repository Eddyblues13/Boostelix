"use client"
import React from "react"
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Video,
  Music,
  Twitch,
  Send,
  Linkedin,
  Headphones,
  Camera,
  MessageSquare,
  MessageCircle,
  Heart,
  Phone,
  Mail,
  Gamepad2,
  Monitor,
  Smartphone,
  Mic,
  Play,
  Radio,
  Github,
  Globe,
} from "lucide-react"

const PlatformGrid = ({ isMobile = false }) => {
  const socialPlatforms = [
    { name: "Instagram", icon: Instagram, bgColor: "#e4405f" },
    { name: "Facebook", icon: Facebook, bgColor: "#1877f2" },
    { name: "Youtube", icon: Youtube, bgColor: "#ff0000" },
    { name: "Twitter/X", icon: Twitter, bgColor: "#1da1f2" },
    { name: "TikTok", icon: Video, bgColor: "#000000" },
    { name: "LinkedIn", icon: Linkedin, bgColor: "#0077b5" },
    { name: "Spotify", icon: Headphones, bgColor: "#1db954" },
    { name: "Snapchat", icon: Camera, bgColor: "#fffc00" },
    { name: "Telegram", icon: Send, bgColor: "#0088cc" },
    { name: "SoundCloud", icon: Music, bgColor: "#ff5500" },
    { name: "Twitch", icon: Twitch, bgColor: "#9146ff" },
    { name: "Discord", icon: MessageSquare, bgColor: "#5865f2" },
    { name: "Reddit", icon: MessageCircle, bgColor: "#ff4500" },
    { name: "Pinterest", icon: Heart, bgColor: "#bd081c" },
    { name: "WhatsApp", icon: Phone, bgColor: "#25d366" },
    { name: "GitHub", icon: Github, bgColor: "#333333" },
    { name: "Clubhouse", icon: Mic, bgColor: "#f1c40f" },
    { name: "Vimeo", icon: Play, bgColor: "#1ab7ea" },
    { name: "Podcast", icon: Radio, bgColor: "#9b59b6" },
    { name: "Gaming", icon: Gamepad2, bgColor: "#e74c3c" },
    { name: "Website Traffic", icon: Globe, bgColor: "#6b7280" },
    { name: "App Downloads", icon: Smartphone, bgColor: "#34495e" },
    { name: "Live Streaming", icon: Monitor, bgColor: "#e67e22" },
    { name: "Email Marketing", icon: Mail, bgColor: "#3498db" },
  ]

  if (isMobile) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Platforms</h2>
        <div className="grid grid-cols-4 gap-3">
          {socialPlatforms.slice(0, 4).map((platform, index) => {
            const IconComponent = platform.icon
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-center hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100"
              >
                <div
                  className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: platform.bgColor }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-gray-700 truncate leading-tight">{platform.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Social Media Platforms</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {socialPlatforms.map((platform, index) => {
          const IconComponent = platform.icon
          return (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 text-center hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
            >
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: platform.bgColor }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-700 truncate">{platform.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PlatformGrid

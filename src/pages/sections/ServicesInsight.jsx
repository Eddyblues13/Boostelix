import React, { useState } from 'react';

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    img: 'https://i.23robo.info/projects/smexploits/img/instagram.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/instagram12.webp',
    desc: `Buy Instagram Followers, Likes, Views, Direct Messages, IGTV Views, Mentions, Comments, Reels Views and more!`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    img: 'https://i.23robo.info/projects/smexploits/img/facebook.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/facebook12.webp',
    desc: `Buy Facebook Fans, Post Fans, Video Views, Comments, Personal Followers, and many more exclusive services!`
  },
  {
    id: 'twitter',
    name: 'Twitter',
    img: 'https://i.23robo.info/projects/smexploits/img/twitter.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/X12.webp',
    desc: `Get more Twitter followers, retweets, likes, and boost credibility. Our quality helps with account verification.`
  },
  {
    id: 'youtube',
    name: 'Youtube',
    img: 'https://i.23robo.info/projects/smexploits/img/youtube.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/youtube12.webp',
    desc: `Grow your channel with YouTube views, likes, subscribers, and shares. Build your YouTube brand today!`
  },
  {
    id: 'telegram',
    name: 'Telegram',
    img: 'https://i.23robo.info/projects/smexploits/img/_0_telegram.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/telegram12.webp',
    desc: `Boost your Telegram channel with members, views, and post reach. Expand messaging and influence easily.`
  },
  {
    id: 'tiktok',
    name: 'Tiktok',
    img: 'https://i.23robo.info/projects/smexploits/img/_0_tiktok.webp',
    contentImg: 'https://i.23robo.info/projects/smexploits/img/tiktok12.webp',
    desc: `Buy TikTok Followers, Likes, Views, Comments, and many other specialized services to grow fast.`
  },
];

const SmmServicesInsight = () => {
  const [activeTab, setActiveTab] = useState('instagram');

  return (
    <section className="bg-[#f0f9ff] py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-blue-900 mb-4">SMM Services Insight.</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our wide range of SMM services covers all major social networks such as Soundcloud, Twitter,
            Spotify, YouTube, LinkedIn, and Telegram. Here's what you can expect:
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActiveTab(platform.id)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === platform.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-blue-900 border border-blue-200'
              }`}
            >
              <img src={platform.img} alt={platform.name} className="w-8 h-8 mb-1" />
              <span className="text-sm font-medium">{platform.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-12">
          {platforms.map((platform) =>
            platform.id === activeTab ? (
              <div key={platform.id} className="grid md:grid-cols-2 gap-10 items-center">
                <div className="text-left">
                  <h5 className="text-xl font-bold text-blue-900 mb-4">
                    {platform.name} Services
                  </h5>
                  <p className="text-gray-700">{platform.desc}</p>
                </div>
                <div>
                  <img
                    src={platform.contentImg}
                    alt={platform.name}
                    className="rounded-lg w-full max-w-md mx-auto"
                  />
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default SmmServicesInsight;

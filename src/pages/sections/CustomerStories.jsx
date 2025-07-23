import React from 'react';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const testimonials = [
  {
    name: 'Amarachi Nwosu',
    role: 'Instagram Influencer',
    image: 'https://i.23robo.info/projects/smexploits/img/melis.webp',
    text: 'I’ve used a few panels before, but Boostelix.com gave me the fastest delivery and real engagement. My Instagram page went from inactive to buzzing in less than a week!'
  },
  {
    name: 'Tajudeen Lawal',
    role: 'Marketer',
    image: 'https://i.23robo.info/projects/smexploits/img/jas.webp',
    text: 'As a reseller, I needed a panel that was reliable and constantly updated. Boostelix.com has been a game-changer! My clients are happy, and so am I.'
  },
  {
    name: 'Emeka Obi',
    role: 'Businessman',
    image: 'https://i.23robo.info/projects/smexploits/img/sa.webp',
    text: 'Running ads was too expensive for me, but using the SMM panel helped me grow my brand affordably. I got real views, likes, and even more traffic to my website.'
  },
  {
    name: 'Zainab Abdullahi',
    role: 'Youtuber',
    image: 'https://i.23robo.info/projects/smexploits/img/jasa.webp',
    text: 'Boostelix.com has made growing my brand so much easier. I’ve seen real results in engagement, and the platform is super easy to use. Highly recommend!'
  },
  {
    name: 'Morounkeji Adeyemi',
    role: 'Influencer',
    image: 'https://i.23robo.info/projects/smexploits/img/mask_group.webp',
    text: 'As someone who manages multiple client accounts, Boostelix.com has been a lifesaver. The services are fast, affordable, and most importantly they work.'
  },
  {
    name: 'Simisola Ajayi',
    role: 'Content Creator',
    image: 'https://i.23robo.info/projects/smexploits/img/melis.webp',
    text: 'I’ve tried other panels, but none deliver like Boostelix.com. My TikTok views shot up overnight, and they actually stuck!'
  },
  {
    name: 'Abdulmalik Sani',
    role: 'Brand Influencer',
    image: 'https://i.23robo.info/projects/smexploits/img/sa.webp',
    text: 'Managing campaigns for clients is easier now. I just log in, order, and everything runs smoothly. No delays, no stress.'
  },
  {
    name: 'Ifunanya Okafor',
    role: 'Instagram Influencer',
    image: 'https://i.23robo.info/projects/smexploits/img/melis.webp',
    text: 'Honestly, the refill option is a lifesaver. I never have to worry about drops. Boostelix.com always comes through.'
  }
];

const TestimonialsSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="bg-[#f0f9ff] py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h3 className="text-3xl font-bold text-blue-900 mb-2">Our Clients Love Us.</h3>
        <p className="text-gray-500 text-lg mb-10">Testimonials</p>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded-xl shadow hover:shadow-md transition duration-300 p-6 text-left h-full flex flex-col justify-between">
                <div className="flex items-center mb-4 gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-blue-900 text-md">{testimonial.name}</h5>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">{testimonial.text}</p>
                <div className="flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <img
                        key={i}
                        src="https://i.23robo.info/projects/smexploits/img/star.png"
                        alt="star"
                        className="w-4 h-4"
                      />
                    ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSection;

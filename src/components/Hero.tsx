import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-text-primary mb-6 leading-tight">
          Create your website from scratch with our <span className="text-primary-purple">no code</span> builder
        </h1>
        <p className="max-w-2xl mx-auto text-base md:text-lg text-text-secondary mb-10">
          Empower your creativity and bring your ideas to life. Build, launch, and manage stunning websites effortlessly, without writing a single line of code.
        </p>
        
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow w-full px-4 py-3 bg-secondary-gray border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-purple focus:outline-none transition-all"
          />
          <a
            href="/builder"
            className="px-6 py-3 text-base font-semibold bg-primary-purple text-white rounded-lg hover:bg-opacity-90 transition-all whitespace-nowrap flex items-center justify-center"
          >
            Start for free
          </a>
        </div>
        <p className="text-xs text-text-secondary">
          No credit card required. Cancel anytime.
        </p>

        <div className="mt-16 max-w-5xl mx-auto">
          <div className="aspect-video bg-secondary-gray rounded-xl shadow-2xl shadow-primary-purple/10 p-2 border border-white/10">
            <img 
              src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/1200x675/15141A/6E42E8?text=Builder+Interface" 
              alt="Website builder interface" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

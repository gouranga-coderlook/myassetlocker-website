import AppShowcase from "@/components/AppShowcase";
import Hero from "@/components/Hero";

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        backgroundImage="/about-page.png"
        headline="Permanent Proof of Your Property Value to Your Insurer"
        ctaButton={{
          enabled: false,
        }}
      />
      <div className="px-4 lg:px-40">
        {/* Mission & Vision */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                  Our Mission
                </h2>
                <p className="text-base text-text-secondary mb-6">
                  To revolutionize asset protection by providing comprehensive
                  digital and physical storage solutions that give our customers
                  peace of mind and faster insurance claim processing.
                </p>
                <p className="text-base text-text-secondary mb-8">
                  We believe that everyone deserves to protect their valuable
                  assets with the same level of security and organization that
                  businesses use for their most important items.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-4">
                  Our Vision
                </h3>
                <p className="text-base text-text-secondary">
                  To become the leading platform for personal and business asset
                  management, making comprehensive protection accessible to
                  everyone while streamlining the insurance industry.
                </p>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      Secure
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Bank-level encryption
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      Fast
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Quick claim processing
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      Reliable
                    </h4>
                    <p className="text-sm text-text-secondary">99.9% uptime</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      Caring
                    </h4>
                    <p className="text-sm text-text-secondary">
                      Customer-first approach
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story - Visual Layout */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12 text-center">
                Our Story
              </h2>

              {/* Colorado Welcome Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                {/* Colorado Welcome Sign Image */}
                <div className="order-2 lg:order-1">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="/about-us-us.jpg" 
                      alt="Welcome to Colorful Colorado" 
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="order-1 lg:order-2 space-y-6">
                  <div className="prose prose-lg max-w-none text-text-secondary">
                    <p className="text-base">
                      Nestled in the heart of the Colorado Rocky Mountain Range, MyAssetLocker offices are headquartered in the Colorado Springs and greater Denver Metro area. If you live here or have visited our wonderful state you know that Colorado is home to beautiful landscapes, many sunny days and a growing community ecosystem.
                    </p>
                  </div>

                  <div className="prose prose-lg max-w-none text-text-secondary">
                    <p className="text-base">
                      Unfortunately though, many here were reminded that Colorado is also a breeding ground for wild fires. The summer of 2012 ushered in disasters at the level that many long-time residents had never seen before. The Waldo Canyon fire forced the mandatory evacuation of 32,000 Residences in the Colorado Springs and surrounding communities. 350 homes were either totally destroyed or partially damaged directly by fire or indirectly by the efforts to contain the raging flames. According to the Rocky Mountain Insurance Information Association (RMIIA), insurance claims for the Waldo Canyon fire alone were estimated to total more than $352.6 million dollars. Consequently the Waldo Canyon fire infamously holds the title of being the worst destructive wildfire in Colorado state&apos;s history. In total, across the entire state of Colorado in 2012 alone, the insurance claims associated with wildfires were estimated to be around $449.7 million dollars.
                    </p>
                  </div>
                </div>
              </div>

              {/* Universal Problem Statement */}
              <div className="text-center mb-16">
                <div className="max-w-4xl mx-auto">
                  <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                    No matter where you live natural disasters can strike at any time. So whether you face a situation involving fire, flood, tornado, hurricane, or theft our research found that the majority of people are unprepared when filing insurance claims for property loss.
                  </p>
                </div>
              </div>

              {/* Question Section */}
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
                  Here&apos;s the question…
                </h3>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg">
                    <p className="text-lg text-text-secondary mb-6 text-center font-medium">
                      &ldquo;Do you have a list of your personal belongings in the unfortunate event you were forced to leave your home and subsequently returned to a pillar of ashes?&rdquo;
                    </p>
                    <p className="text-base text-text-secondary text-center">
                      And the response was a non-verbal pondering of the ramifications of that harsh reality in almost 99.9% of the times this question was presented.
                    </p>
                  </div>

                  <div className="prose prose-lg max-w-none text-text-secondary">
                    <p className="text-base text-center">
                      You know you should have documentation and information about your personal belongings, but you have no idea where to start…or there&apos;s the unreliable thought that it will never happen to me!
                    </p>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8 text-center">
                    <p className="text-lg font-semibold text-text-primary">
                      We established a goal to build an inventory management solution that enables our user community to prepare for the unexpected and achieve peace of mind when accounting for personal assets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-12">
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-8 text-center">
                  Our Journey
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2012
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        The Waldo Canyon Fire
                      </h4>
                      <p className="text-base text-text-secondary">
                        Colorado&apos;s worst wildfire disaster inspired our mission to help people protect their assets
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2018
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        Research & Development
                      </h4>
                      <p className="text-base text-text-secondary">
                        Began developing our comprehensive asset protection platform
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2021
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        Company Founded
                      </h4>
                      <p className="text-base text-text-secondary">
                        Officially launched MyAssetLocker with headquarters in Colorado Springs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2024
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">
                        National Expansion
                      </h4>
                      <p className="text-base text-text-secondary">
                        Expanded valet storage services to 25 major metropolitan areas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-background-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Meet Our Team
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                The passionate professionals behind MyAssetLocker&apos;s success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 text-center shadow-lg">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    SM
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Sarah Mitchell
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-4">
                  CEO & Co-Founder
                </p>
                <p className="text-sm text-text-secondary">
                  Former insurance executive with 15 years of experience in
                  claims processing and risk management.
                </p>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 text-center shadow-lg">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    DC
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  David Chen
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-4">
                  CTO & Co-Founder
                </p>
                <p className="text-sm text-text-secondary">
                  Technology leader with expertise in cloud infrastructure and
                  mobile application development.
                </p>
              </div>

              <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 text-center shadow-lg">
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    LR
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Lisa Rodriguez
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-4">
                  Head of Operations
                </p>
                <p className="text-sm text-text-secondary">
                  Operations expert specializing in logistics and customer
                  experience optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Our Values
              </h2>
              <p className="text-base text-text-secondary max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Trust
                </h3>
                <p className="text-base text-text-secondary">
                  We build trust through transparency, security, and reliability
                  in everything we do.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Innovation
                </h3>
                <p className="text-base text-text-secondary">
                  We continuously innovate to provide the best solutions for
                  asset protection.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Care
                </h3>
                <p className="text-base text-text-secondary">
                  We genuinely care about protecting what matters most to our
                  customers.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Community
                </h3>
                <p className="text-base text-text-secondary">
                  We believe in building a community of protected and prepared
                  individuals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <AppShowcase />
      </div>
    </div>
  );
}

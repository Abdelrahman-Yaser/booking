import Wrapper from "@/components/layout/Wrapper";
import CallToActions from "@/components/common/CallToActions";
import WhyChoose from "@/components/block/BlockGuide";
import Block1 from "@/components/about/Block1";
import Image from "next/image";
import Counter from "@/components/counter/Counter";
import Team1 from "@/components/team/Team1";
import Testimonial from "@/components/testimonial/Testimonial";
import Counter2 from "@/components/counter/Counter2";
import Brand from "@/components/brand/Brand";

export const metadata = {
  title: "About Us | Flymefy - Your Ultimate Travel Companion",
  description: "Learn about Flymefy's mission to make travel accessible, affordable and amazing. Discover our story, values and commitment to exceptional travel experiences.",
  keywords: "about flymefy, travel company, travel mission, travel story, travel values",
};

const About = () => {
  return (
    <Wrapper>
      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item col-12">
          <Image
            width={1920}
            height={400}
            src="/img/pages/about/1.png"
            alt="About Flymefy"
            priority
          />
        </div>
        {/* End section-bg__item */}

        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-xl-6 col-lg-8 col-md-10">
              <h1 className="text-40 md:text-25 fw-600 text-white">
                Your Ultimate Travel Companion
              </h1>
              <div className="text-white mt-15">
                Making travel dreams come true, one journey at a time
              </div>
            </div>
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End About Banner Section */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Why Choose Flymefy</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  We provide exceptional travel experiences with unmatched service and value
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-40 justify-between pt-50">
            <WhyChoose />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Why Choose Us section */}

      <section className="layout-pt-md">
        <div className="container">
          <div className="row y-gap-30 justify-between items-center">
            <Block1 />
          </div>
        </div>
      </section>
      {/* End about block section */}

      <section className="pt-60">
        <div className="container">
          <div className="border-bottom-light pb-40">
            <div className="row y-gap-30 justify-center text-center">
              <Counter />
            </div>
          </div>
        </div>
      </section>
      {/* End counter Section */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Our Team</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Meet the passionate team behind Flymefy
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className=" pt-40 js-section-slider">
            <div className="item_gap-x30">
              <Team1 />
            </div>
          </div>
          {/* End  js-section-slider */}
        </div>
        {/* End container */}
      </section>
      {/* End team section */}

      <section className="section-bg layout-pt-lg layout-pb-lg">
        <div className="section-bg__item -mx-20 bg-light-2" />
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  What Our Travelers Say
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Real experiences from our satisfied customers
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="overflow-hidden pt-80 js-section-slider">
            <div className="item_gap-x30">
              <Testimonial />
            </div>
          </div>
          {/* End .overflow-hidden */}

          <div className="row y-gap-30 items-center pt-40 sm:pt-20">
            <div className="col-xl-4">
              <Counter2 />
            </div>
            {/* End .col */}

            <div className="col-xl-8">
              <div className="row y-gap-30 justify-between items-center">
                <Brand />
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End testimonial section */}

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default About;

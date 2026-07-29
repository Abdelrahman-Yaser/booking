import dynamic from "next/dynamic";
import Footer3 from "@/components/footer/footer-3";
import Header3 from "@/components/header/header-3";
import Hero10 from "@/components/hero/hero-10";
import BlockGuide from "@/components/block/BlockGuide";
import Subscribe from "@/components/home/home-7/Subscribe";
import Blog from "@/components/home/home-7/Blog";
import Counter from "@/components/counter/Counter3";
import Testimonial from "@/components/home/home-7/Testimonial";
import TopDestinations from "@/components/home/home-7/TopDestinations";
import Activity from "@/components/activity/Activity";
import ActivityTypes from "@/components/home/home-7/HotelTypes";

export const metadata = {
  title: "Activities | Flymefy - Travel & Tour Platform",
  description: "Discover amazing activities and experiences for your next adventure with Flymefy - Travel & Tour Platform",
};

const ActivitiesPage = () => {
  return (
    <>
      {/* End Page Title */}

      <Header3 />
      {/* End Header 3 */}

      <Hero10 pageType="activities" />
      {/* End Hero 10 */}

      <section className="layout-pt-xl layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Explore by Types of Activities
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="pt-40 item_gap-x30">
            <ActivityTypes />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End ypes of Stays */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Activities</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Activity />
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End Homes Guests Love Sections */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Top Destinations</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-40 justify-between pt-40 sm:pt-20">
            <TopDestinations />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End top destination section */}

      <section className="section-bg rounded-4 overflow-hidden">
        <div className="section-bg__item -left-100 -right-100 bg-blue-2" />
        <div className="section-bg__item col-4 -right-100 lg:d-none">
          <img src="/img/backgrounds/10.png" alt="image" />
        </div>
        {/* End right bg image */}

        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-8">
              <div className="pt-120 pb-120 lg:pt-80 lg:pb-80">
                <h2 className="text-30 fw-600">Testimonials</h2>
                <p className="mt-5">
                  Interdum et malesuada fames ac ante ipsum
                </p>
                <div className="overflow-hidden pt-60 lg:pt-40">
                  <Testimonial />
                </div>
                {/* End overflow hidden */}
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Testimonial Sectoin */}

      <section className="section-bg pt-40 pb-40">
        <div className="section-bg__item -left-100 -right-100 border-bottom-light"></div>

        <div className="container">
          <div className="row y-gap-30 justify-center text-center">
            <Counter />
          </div>
        </div>
      </section>
      {/* End counter section */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Get inspiration for your next trip
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="blog-grid-1 pt-40">
            <Blog />
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End blog section */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Why Choose Us</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-20 justify-between pt-50">
            <BlockGuide />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Block Guide Section */}

      <Subscribe />
      {/* End Subscribe Section */}

      <Footer3 />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(ActivitiesPage), { ssr: false }); 
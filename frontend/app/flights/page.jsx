import dynamic from "next/dynamic";
import Footer3 from "@/components/footer/footer-3";
import Header3 from "@/components/header/header-3";
import Hero10 from "@/components/hero/hero-10";
import BlockGuide from "@/components/home/home-2/BlockGuide";
import Testimonial from "@/components/home/home-2/Testimonial";
import TestimonialRating from "@/components/home/home-2/TestimonialRating";
import Link from "next/link";
import TopDestinations from "@/components/destinations/TopDestinations";
import Flights from "@/components/flight/Flights";
import AddBanner from "@/components/add-banner/AddBanner";
import Brand2 from "@/components/brand/Brand2";
import Blog4 from "@/components/blog/Blog4";
import Subscribe from "@/components/home/home-2/Subscribe";

export const metadata = {
  title: "Flights || Flymefy - Book Flights Instantly",
  description: "Book flights instantly with Flymefy - Your trusted travel companion",
};

const FlightsPage = () => {
  return (
    <>
      {/* End Page Title */}

      <Header3 />
      {/* End Header 3 */}

      <Hero10 pageType="flights" />
      {/* End Hero 10 - Flight Search */}

      {/* Flight Deals Section */}
      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">🔥 Hot Flight Deals</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Limited time offers on popular routes worldwide
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}
          <div className="row y-gap-20 pt-40">
            <AddBanner />
          </div>
          {/* End .row */}
        </div>
        {/* End container */}
      </section>
      {/* End Flight Deals Section */}

      {/* Popular Flight Routes */}
      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">✈️ Popular Flight Routes</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Best deals on the most traveled routes
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <Link
                href="/flight-list-v1"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                View All Flights <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20">
            <Flights />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Popular Routes Section */}

      {/* Top Flight Destinations */}
      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">🌍 Top Flight Destinations</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Discover amazing destinations with great flight deals
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
        {/* End .container */}
      </section>
      {/* End Top Destinations Section */}

      {/* Why Choose Our Flight Service */}
      <section className="layout-pt-md layout-pb-md bg-light-2">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Why Book Flights With Us?</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Experience the best flight booking service
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}
          
          <div className="row y-gap-40 sm:y-gap-10 justify-between pt-40">
            <BlockGuide />
          </div>
        </div>
      </section>
      {/* End Why Choose Us Section */}

      {/* Customer Reviews for Flights */}
      <section className="layout-pt-lg layout-pb-lg bg-dark-3">
        <div className="container">
          <div className="row y-gap-60">
            <div className="col-xl-5 col-lg-6">
              <TestimonialRating />
            </div>
            {/* End .col */}

            <div className="col-xl-4 offset-xl-2 col-lg-5 offset-lg-1 col-md-10">
              <Testimonial />
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row justify-center text-center pt-60">
            <div className="col-auto">
              <div className="text-15 lh-1 text-white">
                Trusted by millions of travelers worldwide
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="px-40 md:px-0">
            <div className="row y-gap-30 justify-between items-center pt-60 lg:pt-40">
              <Brand2 />
            </div>
          </div>
        </div>
      </section>
      {/* End testimonial and brand sections Section */}

      {/* Travel Tips & Flight News */}
      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  ✈️ Flight Tips & Travel News
                </h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Stay updated with the latest travel tips and flight deals
                </p>
              </div>
            </div>
          </div>
          {/* End .row  */}
          <div className="row y-gap-30 pt-40">
            <Blog4 />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End blog Section */}

      {/* Newsletter for Flight Deals */}
      <Subscribe />
      {/* End Subscribe Section */}

      <Footer3 />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(FlightsPage), { ssr: false }); 
import Wrapper from "@/components/layout/Wrapper";
import CallToActions from "@/components/common/CallToActions";
import Faq from "@/components/faq/Faq";
import ContactForm from "@/components/common/ContactForm";

export const metadata = {
  title: "Help Center | Flymefy - Your Ultimate Travel Companion",
  description: "Find answers to frequently asked questions and get help with your Flymefy bookings and travel plans.",
};

const HelpCenter = () => {
  return (
    <Wrapper>
      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">How Can We Help You?</h2>
                <p className="sectionTitle__text mt-5 sm:mt-0">
                  Find answers to common questions and get support
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40">
            <div className="col-lg-6">
              <div className="px-40 py-40 border-light rounded-4">
                <h4 className="text-20 fw-500 mb-30">Frequently Asked Questions</h4>
                <Faq />
              </div>
            </div>
            {/* End .col */}

            <div className="col-lg-6">
              <div className="px-40 py-40 border-light rounded-4">
                <h4 className="text-20 fw-500 mb-30">Contact Support</h4>
                <ContactForm />
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* End help center section */}

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default HelpCenter;

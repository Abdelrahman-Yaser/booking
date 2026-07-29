import CallToActions from "@/components/common/CallToActions";
import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";
import StepperBooking from "@/components/booking-page/stepper-booking";
import LoginModal from "@/components/common/LoginModal";

export const metadata = {
  title: "Hotel Booking Page || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const index = () => {
  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header3 />
      {/* End Header 1 */}

      <section className="pt-40 layout-pb-md">
        <div className="container">
          <StepperBooking />
        </div>
        {/* End container */}
      </section>
      {/* End stepper */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer3 />

      <LoginModal />
      {/* End LoginModal */}
    </>
  );
};

export default index;

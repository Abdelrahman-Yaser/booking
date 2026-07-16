import Wrapper from "@/components/layout/Wrapper";
import CallToActions from "@/components/common/CallToActions";

export const metadata = {
  title: "Terms & Conditions | Flymefy - Your Ultimate Travel Companion",
  description: "Read our terms and conditions for using Flymefy travel services.",
};

const Terms = () => {
  return (
    <Wrapper>
      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-8 col-lg-10">
              <div className="text-center mb-60">
                <h1 className="text-40 md:text-25 fw-600">Terms & Conditions</h1>
                <div className="text-15 text-light-1 mt-10">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="terms-content">
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing and using Flymefy services, you accept and agree to be bound by the terms and provision of this agreement.</p>

                <h3>2. Use License</h3>
                <p>Permission is granted to temporarily use Flymefy services for personal, non-commercial transitory viewing only.</p>

                <h3>3. Disclaimer</h3>
                <p>The materials on Flymefy are provided on an 'as is' basis. Flymefy makes no warranties, expressed or implied.</p>

                <h3>4. Limitations</h3>
                <p>In no event shall Flymefy or its suppliers be liable for any damages arising out of the use or inability to use the materials on Flymefy.</p>

                <h3>5. Contact Information</h3>
                <p>If you have any questions about these Terms & Conditions, please contact us at: support@flymefy.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default Terms;

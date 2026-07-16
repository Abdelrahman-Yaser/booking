import Wrapper from "@/components/layout/Wrapper";
import CallToActions from "@/components/common/CallToActions";
import LoginWithSocial from "@/components/common/LoginWithSocial";
import SignUpForm from "@/components/common/SignUpForm";

export const metadata = {
  title: "Sign Up | Flymefy - Your Ultimate Travel Companion",
  description: "Create your Flymefy account to start booking amazing trips, manage your travel plans, and access exclusive deals.",
  keywords: "sign up, register, create account, travel account, flymefy registration",
};

const SignUp = () => {
  return (
    <Wrapper>
      <div className="header-margin"></div>
      {/* header top margin */}

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <SignUpForm />
                {/* End SignUP */}

                <div className="row y-gap-20 pt-30">
                  <div className="col-12">
                    <div className="text-center">or sign up with</div>
                  </div>
                  <LoginWithSocial />
                  <div className="col-12">
                    <div className="text-center px-30">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Statement.
                    </div>
                  </div>
                </div>
                {/* End .row */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End signup section */}

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default SignUp;

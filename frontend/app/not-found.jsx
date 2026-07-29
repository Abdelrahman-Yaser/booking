import Wrapper from "@/components/layout/Wrapper";
import CallToActions from "@/components/common/CallToActions";
import NotFound from "@/components/common/NotFound";

export const metadata = {
  title: "404 | Flymefy - Page Not Found",
  description: "The page you are looking for could not be found.",
};

const NotFoundPage = () => {
  return (
    <Wrapper>
      <div className="header-margin"></div>
      {/* header top margin */}

      <NotFound />
      {/* End 404 section */}

      <CallToActions />
      {/* End Call To Actions Section */}
    </Wrapper>
  );
};

export default NotFoundPage;

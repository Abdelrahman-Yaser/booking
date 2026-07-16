import Link from "next/link";

const CallToActions = () => {
  return (
    <section className="pt-80 pb-80 bg-blue-1-05">
      <div className="container">
        <div className="row y-gap-20 justify-between">
          <div className="col-auto">
            <div className="sectionTitle -md">
              <h2 className="sectionTitle__title">✈️ Ready to Fly?</h2>
              <p className="text-dark-1 sectionTitle__text mt-5 sm:mt-0">
                Join Flymefy today! Members save up to 40% on flights and earn rewards on every booking.
              </p>
            </div>
          </div>
          {/* End .col left */}

          <div className="col-auto">
            <div className="row x-gap-20 y-gap-20">
              <div className="col-auto">
                <Link
                  href="/flight-list-v1"
                  className="button px-40 h-60 -blue-1 bg-blue-1 text-white"
                >
                  Search Flights
                  <i className="icon-airplane ml-10"></i>
                </Link>
              </div>
              {/* End search flights button */}

              <div className="col-auto">
                <Link
                  href="/signup"
                  className="button px-40 h-60 -blue-1 bg-yellow-1 text-dark-1"
                >
                  Join Free
                  <i className="icon-arrow-top-right ml-10"></i>
                </Link>
              </div>
              {/* End /register btn */}
            </div>
          </div>
          {/* End call right */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default CallToActions;

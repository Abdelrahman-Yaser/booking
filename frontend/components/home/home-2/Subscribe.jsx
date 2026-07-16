const Subscribe = () => {
  return (
    <section className="layout-pt-md layout-pb-md" data-aos="fade-up">
      <div className="container">
        <div className="row ml-0 mr-0 items-center justify-between">
          <div className="col-xl-5 px-0">
            <img
              className="col-12 h-400"
              src="/img/newsletter/1.png"
              alt="image"
            />
          </div>
          {/* End .col */}

          <div className="col px-0">
            <div className="d-flex justify-center flex-column h-400 px-80 py-40 md:px-30 bg-light-2">
              <div className="icon-airplane text-60 sm:text-40 text-blue-1" />
              <h2 className="text-30 sm:text-24 lh-15 mt-20">
                ✈️ Never Miss a Flight Deal!
              </h2>
              <p className="text-dark-1 mt-5">
                Subscribe to get exclusive flight deals, price alerts, and travel tips delivered to your inbox
              </p>

              <div className="single-field -w-410 d-flex x-gap-10 flex-wrap y-gap-20 pt-30">
                <div className="col-auto">
                  <input
                    className="col-12 bg-white h-60"
                    type="email"
                    placeholder="Enter your email for flight deals"
                    required
                  />
                </div>

                <div className="col-auto">
                  <button
                    type="submit"
                    className="button -md h-60 -blue-1 bg-blue-1 text-white"
                  >
                    Get Flight Deals
                  </button>
                </div>
              </div>
              {/* End single-field */}
              
              <p className="text-12 text-light-1 mt-15">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
          {/* End .col */}
        </div>
      </div>
    </section>
  );
};

export default Subscribe;

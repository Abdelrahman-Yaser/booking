const AppBlock = () => {
  return (
    <>
      <h2 className="text-30 lh-15">📱 Download Flymefy App</h2>
      <p className="text-dark-1 pr-40 lg:pr-0 mt-15 sm:mt-5">
        Book flights on-the-go with our mobile app. Get instant confirmations, mobile boarding passes, and exclusive app-only deals.
      </p>

      <div className="row items-center pt-30 sm:pt-10">
        <div className="col-auto">
          <div className="d-flex items-center px-20 py-10 rounded-8 border-white-15 text-white bg-dark-3">
            <div className="icon-apple text-24" />
            <div className="ml-20">
              <div className="text-14">Download on the</div>
              <div className="text-15 lh-1 fw-500">Apple Store</div>
            </div>
          </div>
        </div>
        {/* End .col */}

        <div className="col-auto">
          <div className="d-flex items-center px-20 py-10 rounded-8 border-white-15 text-white bg-dark-3">
            <div className="icon-play-market text-24" />
            <div className="ml-20">
              <div className="text-14">Get in on</div>
              <div className="text-15 lh-1 fw-500">Google Play</div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
      
      <div className="row y-gap-10 pt-20">
        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="icon-airplane text-blue-1 text-16 mr-10" />
            <span className="text-14">Mobile Check-in</span>
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="icon-bell text-blue-1 text-16 mr-10" />
            <span className="text-14">Price Alerts</span>
          </div>
        </div>
        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="icon-star text-blue-1 text-16 mr-10" />
            <span className="text-14">Exclusive Deals</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppBlock;

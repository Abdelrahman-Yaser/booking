const SignUpForm = () => {
  return (
    <form className="row y-gap-15">
      <div className="col-6">
        <div className="form-input">
          <input type="text" required />
          <label className="lh-1 text-14 text-light-1">First Name</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-6">
        <div className="form-input">
          <input type="text" required />
          <label className="lh-1 text-14 text-light-1">Last Name</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input type="email" required />
          <label className="lh-1 text-14 text-light-1">Email</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input type="password" required />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input">
          <input type="password" required />
          <label className="lh-1 text-14 text-light-1">Confirm Password</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="d-flex">
          <div className="form-checkbox mt-5">
            <input type="checkbox" name="terms" />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
          </div>
          <div className="text-13 lh-15 text-light-1 ml-10">
            I want to receive exclusive offers from Flymefy. I can unsubscribe later as stated in the Privacy Policy.
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12 mt-10">
        <button
          type="submit"
          className="button py-15 -dark-1 bg-blue-1 text-white w-100 rounded-8"
        >
          Create Account <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default SignUpForm;

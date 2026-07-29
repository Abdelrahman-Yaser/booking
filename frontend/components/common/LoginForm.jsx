const LoginForm = () => {
  return (
    <form className="row y-gap-20">
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
        <a href="#" className="text-13 fw-500 text-blue-1 underline">
          Forgot your password?
        </a>
      </div>
      {/* End .col */}

      <div className="col-12 mt-10">
        <button
          type="submit"
          className="button py-15 -dark-1 bg-blue-1 text-white w-100 rounded-8"
        >
          Sign In <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default LoginForm;

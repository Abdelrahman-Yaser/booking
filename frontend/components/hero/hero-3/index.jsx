"use client";

import Image from "next/image";
import CompleteSearchEngine from "@/components/common/CompleteSearchEngine";

const index = ({ pageType = "general" }) => {
  return (
    <section className="masthead -type-1 z-5">
      <div className="masthead__bg">
        <Image
          width={1920}
          height={1080}
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
          alt="Travel the world with Flymefy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Dark gradient overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
            zIndex: 1
          }}
        />
      </div>

      <div className="container h-100 d-flex flex-column" style={{position: 'relative', zIndex: 10}}>
        <div className="row" style={{marginTop: '40px'}}>
          <div className="col-lg-6 col-md-8">
            <div className="text-left">
              <h1
                className="text-50 lg:text-42 md:text-36 text-white mb-3"
                data-aos="fade-right"
                style={{
                  fontWeight: '700', 
                  lineHeight: '1.2', 
                  whiteSpace: 'nowrap'
                }}
              >
                Welcome to Flymefy World
              </h1>
              <p
                className="text-white text-18 mb-0"
                data-aos="fade-right"
                data-aos-delay="100"
                style={{
                  lineHeight: '1.5', 
                  fontWeight: '400',
                  opacity: '0.95'
                }}
              >
                Your all-in-one travel companion - Book everything, explore everywhere!
              </p>
            </div>
          </div>
        </div>
        {/* End .row */}

        <div className="row mt-auto" style={{marginBottom: '20px'}}>
          <div className="col-12">
            <div
              className="masthead__tabs rounded-4 py-20 px-20"
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <CompleteSearchEngine pageType={pageType} />
            </div>
          </div>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </section>
  );
};

export default index;

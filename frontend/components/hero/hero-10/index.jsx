"use client";

import Image from "next/image";
import CompleteSearchEngine from "../../common/CompleteSearchEngine";

const index = ({ 
  pageType = "general",
  customTitle = null,
  customSubtitle = null,
  customImage = null 
}) => {
  
  // Define content based on page type
  const getPageContent = () => {
    switch(pageType) {
      case "flights":
        return {
          image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2274&q=80",
          title: "Soar with Flymefy Wings",
          subtitle: "Book flights instantly to anywhere - Your sky-high journey begins!"
        };
      case "hotels":
        return {
          image: "https://images.unsplash.com/photo-1687834618283-1b9e12de54a7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Flymefy Your Perfect Stay",
          subtitle: "Book luxury hotels instantly - Your dream room awaits!"
        };
      case "cars":
        return {
          image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
          title: "Drive with Flymefy Freedom",
          subtitle: "Rent premium cars anywhere - Adventure starts now!"
        };
      case "cruises":
        return {
          image: "https://images.unsplash.com/photo-1511316695145-4992006ffddb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          title: "Cruise the Flymefy Way",
          subtitle: "Sail luxury seas in style - Your ocean escape begins!"
        };
      case "tours":
        return {
          image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
          title: "Tour with Flymefy Magic",
          subtitle: "Discover hidden gems worldwide - Unforgettable journeys start here!"
        };
      case "activities":
        return {
          image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
          title: "Live the Flymefy Adventure",
          subtitle: "Experience thrilling activities now - Create memories that last forever!"
        };
      default: // general
        return {
          image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2274&q=80",
          title: "Welcome to Flymefy World",
          subtitle: "Your all-in-one travel companion - Book everything, explore everywhere!"
        };
    }
  };

  const content = getPageContent();
  const finalTitle = customTitle || content.title;
  const finalSubtitle = customSubtitle || content.subtitle;
  const finalImage = customImage || content.image;
  return (
    <section className="masthead -type-1 z-5">
      <div className="masthead__bg">
        <Image
          width={1920}
          height={1080}
          src={finalImage}
          alt={finalTitle}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
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
                  textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap'
                }}
              >
                {finalTitle}
              </h1>
              <p
                className="text-white text-18 mb-0"
                data-aos="fade-right"
                data-aos-delay="100"
                style={{
                  lineHeight: '1.5', 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  fontWeight: '400',
                  opacity: '0.95'
                }}
              >
                {finalSubtitle}
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

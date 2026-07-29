import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";

const Wrapper = ({ children }) => {
  return (
    <>
      <Header3 />
      <main>
        {children}
      </main>
      <Footer3 />
    </>
  );
};

export default Wrapper;
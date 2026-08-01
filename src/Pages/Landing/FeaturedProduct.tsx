// import cat7 from '../../Asset/ProductImages/bigHeadPhone.PNG';
import cat7 from "../../Asset/ProductImages/fashion2.png";

const FeaturedProduct = () => {
  return (
    <div>
      <div className="bg-white lg:pt-10 flex justify-center">
        <div className="bg-linear-to-br from-primary to-[orange]  justify-center items-center  container max-w-275 flex">
          <div className="mx-auto container py-10 px-10 md:px-20 flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="flex flex-col space-y-10 w-full lg:w-1/2">
              {/* <h1 className="text-black text-3xl lg:text-4xl font-400">Enhance Your Music Exeperiance</h1> */}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-2xl">👗</span>
                  <h1 className="text-black text-3xl lg:text-4xl font-500">Premium Fabrics</h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-2xl">✨</span>
                  <h1 className="text-black text-3xl lg:text-4xl font-500">Limited Edition</h1>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center">
                  <p className="font-semibold text-sm">15</p>
                  <p className="text-sm opacity-70">mms</p>
                </div>
                <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center">
                  <p className="font-semibold text-sm">10</p>
                  <p className="text-sm opacity-70">mms</p>
                </div>
                <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center">
                  <p className="font-semibold text-sm">56</p>
                  <p className="text-sm opacity-70">mms</p>
                </div>
                <div className="flex flex-col items-center rounded-full bg-white w-12.5 h-12.5 text-center justify-center">
                  <p className="font-semibold text-sm">64</p>
                  <p className="text-sm opacity-70">mms</p>
                </div>
              </div>
              <button className="bg-primary shadow-lg border text-white w-37.5 py-2 rounded-xl lg:hover:scale-105 transition-all duration-700 ease-in-out">
                check it out
              </button>
            </div>
            <div className="w-full lg:w-1/3">
              <img
                src={cat7}
                alt="img"
                className="object-cover w-full lg:hover:scale-110 transition-all duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;

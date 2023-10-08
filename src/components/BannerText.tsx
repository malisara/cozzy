function BannerText(): JSX.Element {
  return (
    <div
      className="flex justify-center text-center flex-col relative 
       bg-gray-800 mt-[40rem] lg:mt-[60rem] h-[10rem] px-6 py-[6rem] 
       lg:py-[10rem] content-center"
    >
      <h2 className="text-2xl lg:text-4xl font-bold text-base-secondary">
        Cozzy Up Your Wardrobe Today!
      </h2>
      <p className="mt-4 lg:mt-10 text-md lg:text-xl">
        Elevate your style with high-quality fashion in stunning colors.
      </p>
    </div>
  );
}

export default BannerText;

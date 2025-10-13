import Image from "next/image";

const AppStoreButtons: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`grid grid-cols-2 gap-4 h-10 lg:h-12 max-w-96 ${className}`}>
      {/* Apple App Store Button */}
      <a
        href="https://apps.apple.com/app/myassetlocker"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity duration-300 h-full overflow-hidden"
      >
        <Image
          src="/app-store-apple-logo.svg"
          alt="Download on the App Store"
          width={200}
          height={48}
          className="w-full h-full object-cover rounded-lg"
        />
      </a>

      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.myassetlocker.app"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity duration-300 h-full overflow-hidden"
      >
        <Image
          src="/google-play-logo.svg"
          alt="Get it on Google Play"
          width={200}
          height={48}
          className="w-full h-full object-cover rounded-lg"
        />
      </a>
    </div>
  );
};

export default AppStoreButtons;
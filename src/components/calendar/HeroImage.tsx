import { format } from "date-fns";
import heroImg from "@/assets/images/calendar-hero.jpg";

interface HeroImageProps {
  currentMonth: Date;
}

const HeroImage = ({ currentMonth }: HeroImageProps) => {
  return (
    <div
      className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 90%)" }}
    >
      <img
        src={heroImg}
        alt="Calendar hero"
        className="w-full h-full object-cover"
        width={1920}
        height={640}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      <div className="absolute bottom-12 left-8 md:left-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white drop-shadow-lg tracking-tight">
          {format(currentMonth, "MMMM")}
        </h1>
        <p className="text-xl md:text-2xl font-body font-light text-white/80 drop-shadow mt-1 tracking-wide">
          {format(currentMonth, "yyyy")}
        </p>
      </div>
    </div>
  );
};

export default HeroImage;

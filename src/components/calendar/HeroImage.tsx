import { format } from "date-fns";
import heroImg from "@/assets/images/calendar-hero.jpg";

interface HeroImageProps {
  currentMonth: Date;
}

const HeroImage = ({ currentMonth }: HeroImageProps) => {
  return (
    <div
      className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 overflow-hidden shadow-lg"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-white drop-shadow-2xl tracking-tight text-center">
          {format(currentMonth, "MMMM")}
        </h1>
        <p className="text-xl md:text-2xl font-body font-light text-white/90 drop-shadow mt-2 tracking-[0.2em] uppercase">
          {format(currentMonth, "yyyy")}
        </p>
      </div>
    </div>
  );
};

export default HeroImage;

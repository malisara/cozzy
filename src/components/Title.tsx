"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
};

function Title({ title }: Props): JSX.Element {
  const currentPath = usePathname();
  const spacesStyle =
    currentPath === "/" ? "pt-[2.5rem] lg:pt-[3rem]" : "mt-[7rem]";

  return (
    <div className={`flex pb-[3rem] justify-center ${spacesStyle}`}>
      <motion.div
        className="box text-base-secondary text-2xl md:text-3xl font-semibold"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {title.toUpperCase()}
      </motion.div>
    </div>
  );
}

export default Title;
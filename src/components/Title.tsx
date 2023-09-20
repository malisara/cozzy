"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
};

function Title({ title }: Props): JSX.Element {
  const currentPath = usePathname();
  const spaces = currentPath === "/" ? "pt-[2.5rem] lg:pt-[3rem]" : "mt-[7rem]";

  return (
    <div className={`flex pb-[3rem] justify-center ${spaces}`}>
      <motion.div
        className="box text-base-secondary text-2xl md:text-3xl font-semibold"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <h1>{title.toUpperCase()}</h1>
      </motion.div>
    </div>
  );
}

export default Title;

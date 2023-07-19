"use client";
import { motion } from "framer-motion";

type Props = {
  title: string;
};

function Title({ title }: Props): JSX.Element {
  return (
    <div
      className="flex pb-[3rem] pt-[6rem]
    justify-center"
    >
      <motion.div
        className="box text-base-secondary text-3xl"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {title.toUpperCase()}
      </motion.div>
    </div>
  );
}

export default Title;

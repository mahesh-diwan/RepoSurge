"use client";

import { motion, MotionProps } from "motion/react";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function ScrollReveal({ children, delay = 0, className }: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const motionProps: MotionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
      };

  return (
    <motion.div {...motionProps} className={className}>
      {children}
    </motion.div>
  );
}

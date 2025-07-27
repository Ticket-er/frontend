"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RouteLoader() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-muted-foreground text-sm">Loading page...</p>
      </div>
    </motion.div>
  );
}

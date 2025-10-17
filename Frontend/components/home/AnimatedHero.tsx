"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GetStartedBtn from "@/components/getStartedBtn";
import { useRouter } from "next/navigation";

export default function AnimatedHero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background z-0" />

      <div className="relative z-10 container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-16 px-6">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-8">
          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Take Control of Your <span className="text-primary">Finances</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            MindVault helps you track expenses, manage budgets, and visualize
            insights — all in one elegant dashboard.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Button
              size="lg"
              className="px-8 py-3 text-base rounded-xl font-medium"
              onClick={() => router.push("/dashboard")}
            >
              Get Started
            </Button>{" "}
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-base rounded-xl"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          className="flex-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/finance-illustration.svg"
            alt="Finance Illustration"
            width={500}
            height={450}
            className="rounded-2xl shadow-xl"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}

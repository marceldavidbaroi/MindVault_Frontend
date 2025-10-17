"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "/icons/finance.svg",
    title: "Track Your Expenses",
    text: "Log every transaction easily and stay aware of where your money goes.",
  },
  {
    icon: "/icons/analytics.svg",
    title: "Analyze Spending",
    text: "Visualize patterns and get smart insights for smarter budgeting.",
  },
  {
    icon: "/icons/security.svg",
    title: "Private & Secure",
    text: "Your financial data stays encrypted and safe — always.",
  },
];

export default function AnimatedFeatures() {
  return (
    <section className="py-24 bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">
          Powerful Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="w-full max-w-sm text-center p-8 rounded-3xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 bg-card/60 backdrop-blur-lg">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="mx-auto"
                />
                <CardContent className="mt-4 space-y-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

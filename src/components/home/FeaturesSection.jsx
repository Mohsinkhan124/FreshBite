import { Award, Leaf, ShieldCheck, Truck } from "lucide-react";
import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your order delivered to your door in as little as 30 minutes.",
  },
  {
    icon: Leaf,
    title: "Fresh Food",
    description: "Sourced daily from trusted farms and suppliers for peak freshness.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Your transactions are protected with industry-standard encryption.",
  },
  {
    icon: Award,
    title: "Best Quality",
    description: "Every item is quality-checked before it reaches your basket.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="container-fb py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.08}>
            <div className="card-fb flex h-full flex-col items-start gap-4 p-6 transition hover:shadow-lift">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <feature.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-semibold text-ink-900">{feature.title}</h3>
              <p className="text-sm text-ink-500">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface CourseFAQProps {
  subtitle: string;
  items: FAQItem[];
}

export function CourseFAQ({ subtitle, items }: CourseFAQProps) {
  return (
    <section id="faq" className="py-16">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
      <div className="mt-12">
        <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index + 1}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { TopicCard } from "@/components/dsa/topic-card";
import { dsaTopics, dsaModule } from "@/lib/dsa-modules";

export const metadata = {
  title: "Data Structures & Algorithms",
  description: dsaModule.description,
};

export default function DsaPage() {
  return (
    <Container className="flex flex-col gap-8 py-12">
      <PageHeader
        eyebrow="Module"
        title={dsaModule.title}
        description={dsaModule.description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dsaTopics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </Container>
  );
}

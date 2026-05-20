import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import Image from 'next/image';
import { courseConfigs } from '@/lib/course-config';
import { CourseModuleLayout } from '@/components/courses/course-module-layout';

// Custom visual components for Web3
import { 
  WebEvolution, BlockchainExplainer, SmartContractExplainer, Web3Ecosystem, 
  Web3Passport, Web3Future, L2ScalingDiagram, TokenomicsVisual, 
  DeFiStackDiagram, SecurityRedFlags, Web3Timeline, ConsensusComparison, 
  SmartContractPlatforms, NFTUseCases, WalletComparison, RegulationMap, 
  L2Comparison, TokenValueDrivers 
} from '@/components/courses/web3-visuals';

const customComponents = {
  Image: (props: any) => <Image {...props} alt={props.alt || 'Course module illustration'} />,
  WebEvolution,
  BlockchainExplainer,
  SmartContractExplainer,
  Web3Ecosystem,
  Web3Passport,
  Web3Future,
  L2ScalingDiagram,
  TokenomicsVisual,
  DeFiStackDiagram,
  SecurityRedFlags,
  Web3Timeline, ConsensusComparison, SmartContractPlatforms,
  NFTUseCases, WalletComparison, RegulationMap, L2Comparison, TokenValueDrivers,
};

const config = courseConfigs['web3-101'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'web3-101');

export function generateStaticParams() {
  if (!fs.existsSync(CONTENT_PATH)) return [];
  const files = fs.readdirSync(CONTENT_PATH);
  return files.map(file => ({
    slug: file.replace('.mdx', ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(markdown);
  const title = `${frontmatter.title} | Web3 101`;
  const description = frontmatter.description;
  
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/web3-101/${slug}` },
    openGraph: { title, description, url: `https://veda.ng/web3-101/${slug}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CourseModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();

  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdown);

  const currentIndex = config.modules.findIndex(m => m.slug === slug);
  const prevModule = currentIndex > 0 ? config.modules[currentIndex - 1] : null;
  const nextModule = currentIndex < config.modules.length - 1 ? config.modules[currentIndex + 1] : null;

  return (
    <CourseModuleLayout
      courseTitle={config.courseTitle}
      courseId={config.courseId}
      basePath={config.basePath}
      moduleSlug={slug}
      moduleTitle={frontmatter.title}
      moduleDescription={frontmatter.description}
      content={content}
      currentModuleIndex={currentIndex}
      totalModules={config.modules.length}
      prevModule={prevModule}
      nextModule={nextModule}
      customComponents={customComponents}
    />
  );
}

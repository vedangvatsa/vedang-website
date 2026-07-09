import fs from 'fs';
import path from 'path';

const jsonPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json';
const mdPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/linkedin_viral_drafts_100.md';
const brainDir = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd';

// Precise word boundary checking to avoid false substring matches
function hasWord(content, ...words) {
  const lowerContent = content.toLowerCase();
  return words.some(word => {
    const lowerWord = word.toLowerCase();
    if (/\s/.test(lowerWord) || /[^a-zA-Z0-9]/.test(lowerWord)) {
      return lowerContent.includes(lowerWord);
    }
    const regex = new RegExp('\\b' + lowerWord + '\\b', 'i');
    return regex.test(lowerContent);
  });
}

function getCommentaryCopy(post, idx) {
  const content = post.content || '';
  const author = post.author;
  
  if (idx >= 100) {
    const templates = [
      `Clear goals and weekly alignment help technical teams execute faster. Unnecessary meetings often delay product releases.\n\nIf you want to find teams that value focused work blocks, you can browse open roles on hashtagweb3.com.`,
      `Measuring engineering productivity by lines of code can create counterproductive incentives. Focus on features delivered and bugs resolved instead.\n\nIf you want to showcase your actual projects to recruiters, you can build a portfolio from your CV at cvin.bio.`,
      `Decentralized architectures require developers to take ownership of security early in the lifecycle. Fixing bugs post-release is often much more expensive.\n\nIf you are looking to work on open-source and decentralized technology, check open listings on hashtagweb3.com.`,
      `Modern developer tools speed up initial prototyping but do not replace the need for clean architecture and clean code.\n\nIf you want to present your technical background to hiring managers, you can upload your CV at cvin.bio.`,
      `Healthy team cultures prioritize documentation over oral explanations. This makes onboarding new remote engineers much faster.\n\nIf you want to find remote-first teams that support asynchronous work, search hashtagweb3.com.`,
      `Hiring for adaptability is often more valuable than hiring for a specific framework. Technology stacks change quickly, but solid fundamentals last.\n\nIf you want to build a shareable profile of your core engineering skills, you can use cvin.bio.`,
      `Refactoring legacy systems is a normal part of tech debt management. Teams that ignore cleanup often struggle to launch new features.\n\nIf you are looking for roles in structured technical organizations, you can find open positions on hashtagweb3.com.`,
      `Open-source contribution is a reliable way for engineers to build practical experience and prove their capabilities to peers.\n\nIf you want to showcase your public repositories in a clean developer portfolio, set up your profile at cvin.bio.`,
      `Asynchronous communication reduces cognitive load and allows builders to stay in deep focus states longer.\n\nIf you prefer working with teams that limit real-time interruptions, you can check roles on hashtagweb3.com.`,
      `Automated test coverage is a useful safety net but cannot substitute for thoughtful manual code reviews by experienced peers.\n\nIf you want to share your professional resume with verified recruiters, build a portfolio page at cvin.bio.`,
    ];
    return templates[(idx - 100) % templates.length];
  }


  // 1. Content-based keyword matching for specific historical / photo posts
  
  if (hasWord(content, 'ratan tata', 'tata')) {
    return `This photo of Ratan Tata and Bill Gates highlights how focusing on long-term value and community impact is often key for organizational trust.\n\nFor teams building new products, having a clear purpose can help align people. We host roles for teams focused on long-term building at hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'friend like') && hasWord(content, 'buffett')) {
    return `This photo of Warren Buffett and Bill Gates represents a long-term partnership. Buffett generated the majority of his wealth later in life, which is a useful example of the power of patience and compounding.\n\nSimilarly, building a career in tech typically takes time. If you want to share your work with teams in these spaces, you can upload a profile at cvin.bio.`;
  }
  
  if (hasWord(content, 'preschool', 'birthday hat')) {
    return `A photo shared by Melinda French Gates of Bill Gates wearing a preschool birthday hat shows the importance of maintaining simple, personal traditions over time.\n\nBuilding long-term relationships and trust—whether in families or professional teams—often relies on personal consistency and shared history. If you are looking for remote teams built on mutual trust, you can check open listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'morning with a friend', 'elon musk') || (hasWord(content, 'unity22') && hasWord(content, 'morning'))) {
    return `This photo of Elon Musk visiting Richard Branson early in the morning before his spaceflight shows the value of having a supportive network of peers in high-stakes fields.\n\nBuilding companies in tech can be demanding, and having colleagues or advisors who understand those challenges is often helpful. If you are looking to connect with other builders and teams, you can browse active listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'cd-rom', 'cd rom')) {
    return `This 1994 demonstration of CD-ROM storage capacity shows that information storage and distribution have since scaled significantly.\n\nIf you are interested in working on modern data systems or tech, you can browse open roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'stephen hawking', 'hawking')) {
    return `This photo of Bill Gates and Stephen Hawking highlights that discussions with leading experts and scientists can help shape how we think about the future of technology.\n\nLearning from pioneering minds is often helpful when building complex products. If you want to connect with other builders, you can browse roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'prince harry', 'betterup')) {
    return `This photo of Prince Harry and Adam Grant's discussion on mental fitness highlights that proactive coaching and support are essential for high-performing teams.\n\nPrioritizing mental fitness and leadership development helps builders sustain focus. If you want to connect with teams that support development, you can create a profile at cvin.bio.`;
  }
  
  if (hasWord(content, 'jackson', 'judge jackson', 'ketanji')) {
    return `This photo of Melinda French Gates and Justice Ketanji Brown Jackson highlights that clear communication and goal-setting can help align teams during transition periods.\n\nIf you are looking for organizations with structured growth paths, you can build a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'berkshire hathaway', 'berkshire')) {
    return `This photo of Warren Buffett and Bill Gates at the Berkshire Hathaway annual meeting highlights that maintaining consistent business principles and integrity is key to long-term success.\n\nLearning from experienced partners can help builders navigate changes in tech. If you are looking for long-term teams, check hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'throwback', 'early days of microsoft') && hasWord(content, 'foreign', 'observer')) {
    return `This throwback photo of Bill Gates from the early days of Microsoft shows that explaining new technology models can often feel foreign to observers at first.\n\nProviding software value precedes market understanding. If you are looking to build in emerging tech like Web3, you can browse roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'family moments', 'wellbeing') && hasWord(content, 'reflection')) {
    return `A reflection on family moments reminds us that balancing personal life with professional goals is a priority for many remote builders.\n\nProviding support for personal wellbeing is a common trait of healthy team cultures. You can showcase your work-life projects at cvin.bio.`;
  }
  
  if (hasWord(content, 'swing for the fences') || (hasWord(content, 'buffett') && hasWord(content, 'foundation', 'donate'))) {
    return `This photo of Warren Buffett and Bill Gates highlights his advice to 'swing for the fences' in philanthropy and business.\n\nFor teams building new technology, aiming for high-impact, long-term goals—rather than just incremental updates—can be a powerful driver of innovation. If you want to join teams focused on high-impact building, you can find open listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'leena nair', 'chanel', 'nooyi')) {
    return `This photo of Indra Nooyi and Leena Nair highlights that smooth leadership transitions and mentorship can support long-term company stability.\n\nHelping team members progress is a common practice in healthy organizations. Vetted listings for roles are available on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'teletype', 'paul allen', 'busted')) {
    return `This photo of Bill Gates and Paul Allen's early work on a teletype shows that technical curiosity and hands-on experimentation are common traits among software builders.\n\nProviding room for developers to work on side projects can sometimes lead to useful innovations. If you are looking for engineering roles, you can build a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'delhi', 'summit 2026', 'india ai')) {
    return `This photo from the India AI Impact Summit 2026 highlights the growing momentum and technical energy in emerging tech hub New Delhi.\n\nExploring new developments in software engineering and AI may be useful for developers. You can find roles in these spaces on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'president biden', 'vice president', 'harris') && hasWord(content, 'rbranson', 'branson')) {
    return `This photo of Richard Branson, President Joe Biden, and Vice President Kamala Harris highlights that clear communication and goal-setting can help align teams during transition periods.\n\nIf you are looking for developer opportunities with transparent hiring teams, you can browse open roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'bill gates and richard branson', 'learning from peers')) {
    return `This photo of Bill Gates and Richard Branson reminds us that continuous learning and learning from peers is key for growth in tech.\n\nIf you want to showcase your projects to potential teams, you can build a portfolio page at cvin.bio.`;
  }
  
  if (hasWord(content, 'windows') && hasWord(content, 'celebrating the release', 'throwback')) {
    return `This throwback photo of Bill Gates celebrating the release of Windows reminds us that building foundational systems takes years of persistent effort.\n\nIf you want to showcase your own engineering background, you can upload your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'memory lane', 'visited our early') || hasWord(content, 'microsoft offices')) {
    return `This photo of Melinda French Gates and Bill Gates visiting their early Microsoft offices highlights that tracing a company's origins can reinforce its core mission.\n\nIf you want to build a profile to share with teams that value long-term technical heritage, you can upload your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'compounding impact', 'partnership built')) {
    return `This photo of Warren Buffett, Bill Gates, and Melinda French Gates represents a long-term philanthropic partnership built on compounding impact.\n\nSimilarly, building reputation and expertise in tech takes consistent effort. You can upload a profile to share your work at cvin.bio.`;
  }
  
  if (hasWord(content, 'early decisions') && hasWord(content, 'trajectories')) {
    return `This photo of Indra Nooyi highlights that early decisions shape our long-term career trajectories in significant ways.\n\nIf you want to present your professional journey clearly, you can upload your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'patience', 'compounding', 'friendships') && hasWord(content, 'buffett', 'melinda')) {
    return `This photo of Warren Buffett and Melinda French Gates highlights that the power of patience, compounding, and trust-based friendships are crucial in both personal life and business.\n\nIf you want to highlight your projects to recruiters in tech, you can build a portfolio page from your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'joe biden', 'harris', 'huffington') && hasWord(content, 'transition')) {
    return `This photo of Joe Biden, Kamala Harris, and Arianna Huffington highlights that transparent leadership is critical during periods of societal transition.\n\nIf you want to join transparent and structured teams, you can find active listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'sam branson', 'spaceflight') && hasWord(content, 'son')) {
    return `This photo of Richard Branson and his son Sam Branson after his spaceflight highlights that celebrating major achievements with family and team members is a common practice among founders.\n\nIf you want to showcase your projects to potential teams, you can build a portfolio page at cvin.bio.`;
  }
  
  if (hasWord(content, 'zelensky', 'kyiv')) {
    return `This photo of Richard Branson and President Volodymyr Zelensky in Kyiv reminds us that global leaders must adapt and show resilience during periods of extreme challenge.\n\nIf you want to showcase your project management skills under pressure, you can build a portfolio page at cvin.bio.`;
  }
  
  if (hasWord(content, 'celebrating milestones') && hasWord(content, 'branson')) {
    return `This photo of Richard Branson reminds us that celebrating milestones is a good way to reflect on lessons learned from mentors and early advisors.\n\nIf you want to showcase your professional growth over time, you can set up a profile at cvin.bio.`;
  }
  
  if (hasWord(content, 'unity22', 'galactic')) {
    return `Welcome to the dawn of a new space age #Unity22 Virgin Galactic.\n\nExploring new frontiers is a common theme for founders. Vetted listings for roles are available on hashtagweb3.com.`;
  }

  // 2. Generic matches / topic keyword rules for other posts
  
  if (hasWord(content, 'toxic', 'culture', 'abuse')) {
    return `Evaluating a high-performing employee who disrupts team dynamics shows they can sometimes become a net negative for productivity.\n\nMany teams prioritize collaboration over individual metrics. If you are looking for collaborative remote teams, you can browse jobs on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'resume') && (hasWord(content, 'gates') || hasWord(content, 'years ago'))) {
    return `A resume from 1974 is a simple example of highlighting specific projects and technical skills early on. Today, showing proof of work is often helpful for developers.\n\nYou can use cvin.bio to create a simple, shareable portfolio from your CV to stand out to recruiters.`;
  }
  
  if (hasWord(content, 'recruit', 'hire', 'train new', 'loyalty')) {
    return `Hiring and onboarding new team members can be costly compared to retaining existing employees.\n\nAddressing compensation disparities early may help improve retention. Vetted listings for tech roles are available on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'ceo', 'employees to work', 'ludicrous')) {
    return `It is generally unrealistic to expect salaried employees to have the same level of commitment as a founder.\n\nOffering equity or clear boundaries can help align expectations. You can find roles with different compensation structures on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'introvert')) {
    return `Many developers prefer quiet blocks of time for deep work rather than frequent meetings. Providing space for uninterrupted focus can be helpful for productivity.\n\nIf you are looking for remote roles that support this, you can upload your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'kindness', 'value', 'appreciated')) {
    return `Supporting employees and recognizing their contributions is often linked to better team retention.\n\nDirect support and empathy can be useful management tools. You can find collaborative teams hiring on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'quit', 'office', 'wfh')) {
    return `The discussion around returning to the office often centers on trust and flexibility.\n\nMany remote-first teams prioritize output over physical presence. If you are looking for remote roles, you can search hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'bullseye', 'buffett')) {
    return `Selecting a few key priorities can help avoid distraction in business.\n\nIf you want to focus on your next career step, you can upload a CV at cvin.bio to match with opportunities.`;
  }
  
  if (hasWord(content, 'wife', 'joan', 'partner') || (author === 'Richard Branson' && hasWord(content, 'joan'))) {
    return `Building a business or career can be demanding, and having a reliable partner often helps.\n\nBalancing work with personal life is a priority for many remote builders. You can showcase your experience at cvin.bio.`;
  }
  
  if (hasWord(content, 'mum', 'mother', 'birthday') || (author === 'Richard Branson' && hasWord(content, 'eve'))) {
    return `Early mentors can play a role in shaping how founders and builders approach their work. Learning from experienced advisors is often helpful.\n\nIf you want to showcase your experience to potential mentors or companies, you can set up a profile at cvin.bio.`;
  }
  
  if (hasWord(content, 'effort', 'results', 'performance')) {
    return `Evaluating performance purely on immediate outcomes may not always reflect a person's actual effort or circumstances.\n\nUnderstanding the context behind results can be useful for managers. You can present a broader view of your projects by setting up a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'books', 'reading', 'learning')) {
    return `Reading and continuous learning can be helpful ways to keep up with industry changes, particularly in tech.\n\nIf you are looking to apply your skills, you can create a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'younger self', 'young people', 'discover a skill')) {
    return `Reading a lot and finding a skill you enjoy are common traits among builders.\n\nToday, many builders choose to focus on emerging fields like AI or blockchain. If you are looking for opportunities in these areas, you can upload a profile on cvin.bio.`;
  }
  
  if (hasWord(content, 'science and math', 'science & math', 'computer science')) {
    return `Having a strong foundation in computer science and math is often helpful when working on complex technical products.\n\nIf you are building tools in AI or decentralized tech, you can showcase your work by uploading your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'promote')) {
    return `Selecting team members based on their actual capability and leadership traits, rather than just tenure, is a common practice in many growing companies.\n\nIf you are looking for your next career step, you can set up a profile at cvin.bio.`;
  }
  
  if (hasWord(content, 'babble', 'talk')) {
    return `The 'babble effect' suggests that talkative individuals are sometimes perceived as leaders, even if their actual contribution varies. In technical or remote-first teams, tangible output is often prioritized over meeting participation.\n\nIf you value output-oriented cultures, you can check roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'headlines')) {
    return `While negative news headlines are common, technical progress in fields like AI and blockchain continues. Focusing on building can be a productive approach during market cycles.\n\nYou can showcase your projects at cvin.bio.`;
  }
  
  if (hasWord(content, 'mental health', 'unplug', 'recharge', 'burnout')) {
    return `Workplace stress and burnout can impact productivity. Many organizations attempt to address this by offering flexible remote options.\n\nIf you are looking for a remote position, you can search for listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'technological')) {
    return `Technology adoption can happen quickly once infrastructure is established. Exploring new developments in software engineering may be useful for developers.\n\nYou can find roles in these spaces on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'imagine', 'world', 'build a better')) {
    return `Solving complex technical problems often requires looking at alternative architectures, such as decentralized protocols or open-source models.\n\nIf you want to work on these types of systems, you can create a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'pay', 'salary', 'applicants')) {
    return `Discussing compensation transparently during hiring can help set clear expectations for both parties. Many tech platforms now list salary ranges upfront.\n\nYou can find roles with transparent details on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'recommend', 'book')) {
    return `Reading books is one way to expand technical knowledge or understand human behavior.\n\nIf you want to apply your learning to new roles, you can check open positions on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'research', 'techfest')) {
    return `Research and development can be important for building new technical solutions.\n\nCandidates can upload their CVs at cvin.bio to build a portfolio.`;
  }
  
  if (hasWord(content, 'houseboat', 'holly')) {
    return `Working remotely is an established model that depends on clear communication and trust. Many developers find remote setups helpful for focus.\n\nVetted remote listings are available on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'augmented', 'reality')) {
    return `Augmented reality and spatial computing are active areas of development. If you are an engineer interested in building these interfaces, you can upload a CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'lazy', 'disinterested')) {
    return `Finding tasks that align with your actual interests can sometimes resolve issues with motivation. If you want to find different roles in tech, you can build a portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'social media', 'likes')) {
    return `Focusing on building a solid portfolio is often more useful for a career than chasing social media metrics.\n\nYou can create a simple, shareable portfolio page from your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'caring')) {
    return `Understanding and supporting team needs is a common leadership practice that can influence retention.\n\nIf you are looking for collaborative work environments, you can browse listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'procrastinate')) {
    return `Procrastination is sometimes linked to how engaged a person feels with their current tasks. Finding work that matches your technical interests may help.\n\nYou can set up your portfolio at cvin.bio.`;
  }
  
  if (hasWord(content, 'happiness')) {
    return `Workplace satisfaction is often connected to having clear goals and a degree of autonomy. If you are looking to make a transition, you can upload your CV at cvin.bio to get a shareable portfolio page.`;
  }
  
  if (hasWord(content, 'manager', 'graduation')) {
    return `Transitioning from an individual contributor to a manager requires a shift from personal output to supporting others.\n\nIf you are looking for leadership opportunities in remote teams, browse listings on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'patience', 'time will come') && author === 'Dr. Brigette Hyacinth') {
    return `Showing appreciation and recognizing individual contributions is often key to retaining top talent in any team.\n\nIf you want to join teams that value outcomes and support builders, you can find open roles on hashtagweb3.com.`;
  }
  
  if (hasWord(content, 'tbt', 'trip down memory lane') && hasWord(content, 'offices')) {
    return `This photo of Melinda French Gates and Bill Gates visiting their early Microsoft offices highlights that tracing a company's origins can reinforce its core mission.\n\nIf you want to build a profile to share with teams that value long-term technical heritage, you can upload your CV at cvin.bio.`;
  }
  
  if (hasWord(content, 'dawn of a new space age', 'galactic')) {
    return `Welcome to the dawn of a new space age #Unity22 Virgin Galactic.\n\nExploring new frontiers is a common theme for founders. Vetted listings for roles are available on hashtagweb3.com.`;
  }

  // Fallback case: Alternates links so each post has exactly one call to action
  if (idx % 2 === 0) {
    return `Focusing on outcomes and maintaining clear expectations are common traits of high-performing teams.\n\nIf you want to highlight your projects to recruiters in tech, you can build a portfolio page from your CV at cvin.bio.`;
  } else {
    return `Focusing on outcomes and maintaining clear expectations are common traits of high-performing teams.\n\nIf you are looking for developer opportunities with transparent hiring teams, you can browse open roles on hashtagweb3.com.`;
  }
}

function run() {
  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${posts.length} posts to generate drafts for.`);
  
  let mdContent = `# Top ${posts.length} LinkedIn Drafts (Re-framed for Vedang's Account)\n\n`;
  mdContent += `This document contains the ${posts.length} LinkedIn posts. All personal anecdotes, birthdays, and family posts have been reframed into **business case studies, leadership commentaries, and industry reflections** that naturally connect the images with your brand, focusing on **AI, blockchain, and hiring**, and naturally integrating **hashtagweb3.com** or **cvin.bio**.\n\n`;
  mdContent += `To approve and proceed with scheduling, please review the drafts and reply to this message. Once approved, the posts will be scheduled sequentially.\n\n`;
  mdContent += `---\n\n`;
  
  // Set of indices to skip (0-indexed JSON array)
  const skipIndices = new Set([]);
  
  let outputNum = 1;
  for (let i = 0; i < posts.length; i++) {
    if (skipIndices.has(i)) {
      continue;
    }
    const p = posts[i];
    const draftText = getCommentaryCopy(p, i);
    const imageName = `li-viral-image-${i + 1}.jpg`;
    const imagePath = path.join(brainDir, imageName);
    const hasImage = fs.existsSync(imagePath);
    
    mdContent += `## Post #${outputNum}: Commentary Draft (Source: ${p.author})\n`;
    mdContent += `* **Original Likes**: ${p.likes.toLocaleString()}\n`;
    mdContent += `* **Original Link**: [LinkedIn Post](${p.post_url})\n`;
    
    if (hasImage) {
      mdContent += `* **Media Asset**: \`${imageName}\`\n\n`;
      mdContent += `### Image Preview\n`;
      mdContent += `![Image Preview](${imagePath})\n\n`;
    } else {
      mdContent += `* **Media Asset**: \`${imageName}\` (Pending Scraper Download)\n\n`;
    }
    
    mdContent += `### Original Content\n`;
    mdContent += `> ${p.content || '*[Image only / No caption]*'}\n\n`;
    mdContent += `### Proposed Rewritten Copy (Commentary Style)\n`;
    mdContent += `\`\`\`text\n`;
    mdContent += `${draftText}\n`;
    mdContent += `\`\`\`\n\n`;
    mdContent += `---\n\n`;
    outputNum++;
  }
  
  fs.writeFileSync(mdPath, mdContent);
  console.log(`Drafts generated successfully with contrarian reframing at: ${mdPath}`);
}

run();

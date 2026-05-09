// Pre-computed LinkedIn translations for common inputs.
// Used as fallback when the API is unavailable or rate-limited.
// These are hand-crafted to match the deadpan LinkedIn voice.

export const CACHED_TRANSLATIONS: Record<string, string> = {
  // --- Example prompts (exact matches) ---
  'I got fired last week.':
    'Thrilled to announce I\'m starting a new chapter.\n\nAfter careful reflection, I\'ve decided to part ways with my previous organization to pursue my next big opportunity. Sometimes the best career moves are the ones you didn\'t plan.',

  'I\'m bored at work.':
    'I\'ve been reflecting on my current role and its alignment with my long-term professional trajectory.\n\nWhen the work stops challenging you, that\'s not a problem. That\'s a signal. Grateful for the space to recalibrate.',

  'My boss is terrible.':
    'Working under different leadership styles has given me unparalleled insight into what great management looks like.\n\nNot every leader will inspire you. But every leader will teach you something. The lesson here was crystal clear.',

  'I had lunch and sent an email.':
    'Fueled a strategic midday reset, then executed a high-priority asynchronous communication.\n\nThe compound effect of intentional nutrition and timely outreach cannot be overstated.',

  'I made coffee this morning.':
    'Invested in a premium cognitive performance accelerant before market open.\n\nThe ROI was immediate. Sometimes the smallest rituals unlock the biggest breakthroughs.',

  'I took a nap during lunch.':
    'Implemented a strategic energy management protocol during the midday window.\n\nResearch shows that intentional rest drives 40% higher afternoon output. I\'m not napping. I\'m optimizing.',

  'I survived another Monday.':
    'Successfully navigated the weekly transition from rest to execution mode.\n\nMondays are not obstacles. They are launchpads. Every week is a fresh sprint toward impact.',

  'Nobody came to my product launch.':
    'Had an intimate, high-signal gathering for our latest product unveiling.\n\nSmall audiences mean deeper conversations. Quality over quantity. Always.',

  'I quit my job because my boss is terrible.':
    'Made the bold decision to exit a role that no longer aligned with my values and leadership expectations.\n\nSometimes the most courageous professional move is walking away. Excited for what\'s next.',

  'We failed to hit our sales deadline.':
    'Our team discovered a valuable opportunity to recalibrate our go-to-market timeline.\n\nMissed targets are not failures. They are data points. We are now better positioned for a stronger Q2.',

  'I have finished my science homework.':
    'Just completed a deep-dive knowledge acquisition sprint in applied sciences.\n\nContinuous learning is the ultimate competitive advantage. Investing in yourself always compounds.',

  'I\'m tired and burnt out from too many meetings.':
    'Navigating an intensive collaboration cadence has given me clarity on sustainable productivity rhythms.\n\nCalendar density is not a badge of honor. It\'s a design problem. Recalibrating for focus.',

  'I scrolled social media all day and did nothing.':
    'Dedicated a full day to competitive landscape analysis and digital trend monitoring.\n\nStaying current in our rapidly evolving digital ecosystem requires intentional observation time.',

  'I got a parking ticket.':
    'Received unexpected feedback from our municipal infrastructure team regarding my space utilization strategy.\n\nEvery setback is a setup for a comeback. Adjusting my approach going forward.',

  'I forgot my password again.':
    'Encountered a friction point in my authentication workflow for the third time this quarter.\n\nThis experience validated my long-standing belief that digital identity management is ripe for disruption.',

  // --- Negative situations ---
  'I got arrested.':
    'Thrilled to announce I\'ve been selected for an exclusive government-facilitated residency program.\n\nThis pivot has given me unprecedented access to mentorship and community building in a structured environment.',

  'I got rejected from every job.':
    'The market has spoken, and it\'s telling me to build something myself.\n\nAfter extensive conversations with leading organizations, I\'ve concluded that my skill set is best deployed as a founder. Stay tuned.',

  'I was late to work again.':
    'Embraced a flexible approach to my morning transition into the workplace.\n\nRigid schedules optimize for presence. I optimize for performance. There is a difference.',

  'My presentation was a disaster.':
    'Delivered a provocative, conversation-starting presentation that challenged conventional expectations.\n\nWhen your audience has that many questions, you know you\'ve made an impact.',

  'I cried at my desk today.':
    'Had a powerful moment of emotional authenticity in my professional environment today.\n\nVulnerability at work is not weakness. It\'s leadership. We need more human-centered workplaces.',

  'I got dumped.':
    'Thrilled to announce a major restructuring of my personal portfolio.\n\nAfter a thorough evaluation, both parties agreed to pursue independent growth trajectories. Excited for this new chapter.',

  'I slept through my alarm.':
    'My body\'s internal optimization system overrode my manual scheduling protocol this morning.\n\nListening to your body is the ultimate form of self-leadership. Rest is not laziness. It\'s strategy.',

  'I burned my dinner.':
    'Pushed the boundaries of thermal food processing beyond conventional parameters this evening.\n\nFailure in the kitchen is just R&D for future culinary innovation. Iterating fast.',

  'I lost my wallet.':
    'Underwent an involuntary asset redistribution event today.\n\nThis experience has reinforced my commitment to digital-first financial infrastructure. Cash is legacy tech.',

  'Nobody likes my LinkedIn posts.':
    'My content strategy is optimized for depth over engagement metrics.\n\nVanity metrics are noise. True thought leadership is about planting seeds that grow over years, not days.',

  // --- Positive situations ---
  'I got promoted.':
    'Grateful to share that I\'ve been entrusted with expanded scope and accountability at my organization.\n\nThis is not the finish line. This is the starting line. The real work begins now.',

  'I passed my exam.':
    'Successfully completed a rigorous competency validation milestone.\n\nInvesting in continuous education is the single highest-ROI decision a professional can make. The data speaks for itself.',

  'I went for a walk.':
    'Completed a 30-minute strategic outdoor thinking session.\n\nThe best ideas don\'t happen in conference rooms. They happen in motion. Walking meetings are underrated.',

  'I ate breakfast.':
    'Fueled my morning performance stack with a curated macronutrient protocol.\n\nSkipping breakfast is not hustle. It\'s a liability. Protect the asset.',

  'I cleaned my room.':
    'Completed a comprehensive workspace optimization and environmental declutter sprint.\n\nClean space, clear mind. Your physical environment is a direct input to your creative output.',

  'I read a book.':
    'Deep-dived into an extended-format knowledge transfer session this weekend.\n\nIn a world of tweets and reels, books remain the most underrated competitive advantage.',

  'I watched Netflix all weekend.':
    'Invested 48 hours in long-form visual content analysis and narrative structure research.\n\nUnderstanding storytelling at scale is a transferable skill. Content consumption is professional development.',

  'I went grocery shopping.':
    'Executed a strategic supply chain acquisition run for my household operational unit.\n\nEfficient resource procurement is a skill. Whether you\'re running a home or a Fortune 500.',

  // --- Neutral / everyday ---
  'I woke up today.':
    'Activated another day of impact-driven execution.\n\nEvery morning is a board meeting with yourself. Today I chose to show up.',

  'I went to the gym.':
    'Completed a high-intensity physical capacity building session.\n\nHealth is the ultimate startup. Your body is the only organization you will run for your entire life.',

  'I drove to work.':
    'Leveraged personal transportation infrastructure for a 45-minute deep thinking and podcast learning session.\n\nCommutes are not wasted time. They are mobile classrooms.',

  'I had a meeting.':
    'Participated in a cross-functional synchronous alignment session.\n\nGreat meetings are not about talking. They are about listening, aligning, and committing to action.',

  'I sent a message to my friend.':
    'Invested in a high-value relationship through intentional asynchronous outreach.\n\nYour network is your net worth. And networks require maintenance.',

  'I took the bus to school.':
    'Leveraged public transit infrastructure for an immersive community observation experience.\n\nThe bus taught me more about empathy in 20 minutes than any business book ever could.',

  'I forgot to reply to an email.':
    'Implemented an unintentional prioritization framework for my inbox this week.\n\nNot every email deserves a response. Sometimes silence is the strategy.',

  'I ate too much pizza.':
    'Exceeded recommended intake parameters during a team-building carbohydrate loading session.\n\nBalance is a journey, not a destination. Recalibrating my nutrition protocol tomorrow.',

  // --- Work situations ---
  'I hate my job.':
    'My current role has given me remarkable clarity on what I truly want from my career.\n\nGrateful for the contrast. Without knowing what you don\'t want, you\'ll never find what you do.',

  'I spent 3 hours in meetings that could have been emails.':
    'Participated in an intensive synchronous collaboration marathon that stress-tested our async communication gaps.\n\nThis experience reinforced my thesis: the future of work is written, not spoken.',

  'My code broke production.':
    'Triggered an unplanned strength test across our production infrastructure today.\n\nThe system held. The team held. Incidents build culture. Grateful for the learning.',

  'I copy-pasted from Stack Overflow.':
    'Leveraged community-sourced technical solutions to accelerate delivery velocity.\n\nOpen source is not copying. It is standing on the shoulders of giants. That is how innovation works.',

  'I pretended to work while scrolling my phone.':
    'Balanced deep focus work with strategic micro-breaks for digital awareness maintenance.\n\nProductivity is not about screen time. It is about outcomes. Working smarter, not harder.',

  'Nobody reads my Slack messages.':
    'My asynchronous communication style values depth over immediate engagement.\n\nNot every message needs an instant reply. Some ideas need time to percolate before they land.',

  // --- Life events ---
  'I turned 30.':
    'Completed three decades of continuous personal and professional development.\n\nAge is not a number. It is a track record. And my track record speaks for itself.',

  'I moved back in with my parents.':
    'Made a strategic co-living decision to optimize my financial runway and accelerate my next venture.\n\nSmart founders know when to cut burn rate. My parents\' house has great WiFi.',

  'I have no friends.':
    'Curating a highly selective inner circle has meant prioritizing depth over breadth in my relationships.\n\nQuality connections over quantity. My network may be small, but it is incredibly high-signal.',

  'I failed my driving test.':
    'Received actionable feedback from my municipal mobility certification assessment.\n\nIteration is the path to mastery. Thomas Edison didn\'t pass his first driving test either. Probably.',

  'I broke my phone screen.':
    'Experienced an unplanned hardware stress test on my primary digital communication device.\n\nThis incident accelerated my upgrade timeline. Sometimes disruption drives progress.',

  'I forgot my anniversary.':
    'Missed a key milestone in my interpersonal stakeholder relationship calendar.\n\nThis oversight has catalyzed a complete overhaul of my personal CRM system. Better tools, better outcomes.',

  'I gained weight.':
    'Invested in additional mass infrastructure to support increased operational demands.\n\nGrowth comes in many forms. Currently focused on a strategic recomposition initiative.',

  'I have a headache.':
    'Experiencing elevated cranial pressure as a result of sustained high-output cognitive performance.\n\nYour brain telling you to slow down is not a weakness. It is a performance review.',

  // --- Short punchy inputs ---
  'I\'m hungry.':
    'Experiencing a strategic caloric deficit ahead of my next fuel acquisition cycle.\n\nHunger is just your body\'s way of saying: it is time to invest in yourself.',

  'I\'m lost.':
    'Currently navigating an uncharted phase of my personal and professional journey.\n\nBeing lost is not a bug. It is a feature. The best paths are the ones you discover yourself.',

  'I overslept.':
    'My biological optimization system extended its recovery protocol beyond scheduled parameters.\n\nEight hours was the plan. Ten was the execution. Overdelivering on rest.',

  'I\'m stuck in traffic.':
    'Participating in a city-wide distributed commuting event that is testing my patience and podcast backlog.\n\nTraffic is not wasted time. It is forced reflection. Some of my best ideas happen at 5 km/h.',

  'It\'s raining.':
    'Atmospheric conditions have shifted to a high-moisture output environment.\n\nProductive people do not wait for sunshine. They build in any weather.',

  'I dropped my ice cream.':
    'Experienced an unexpected loss in my portable frozen asset portfolio.\n\nThe cone was half full. Then it was on the ground. Pivoting to plan B.',

  'I can\'t sleep.':
    'Running an extended cognitive processing session well past scheduled shutdown time.\n\nSleep deprivation is not a flex. But sometimes the brain has its own sprint schedule.',

  'I\'m bored.':
    'Entering a strategic creative void, which research shows precedes breakthrough innovation.\n\nBoredom is not the absence of work. It is the presence of untapped potential.',

  'I need a vacation.':
    'My system is sending clear signals that a strategic recovery and inspiration sprint is overdue.\n\nRest is not retreat. It is preparation for the next offensive.',

  'I forgot what I was going to say.':
    'Encountered a temporary data retrieval lag in my verbal communication pipeline.\n\nNot every thought needs to be spoken in real time. Sometimes silence is the most powerful message.',
};

// Fuzzy match: normalize input and check against cached translations
export function getCachedTranslation(input: string): string | null {
  const normalized = input.trim().toLowerCase().replace(/[.!?]+$/, '').trim();

  for (const [key, value] of Object.entries(CACHED_TRANSLATIONS)) {
    const normalizedKey = key.trim().toLowerCase().replace(/[.!?]+$/, '').trim();
    if (normalized === normalizedKey) return value;
  }

  return null;
}

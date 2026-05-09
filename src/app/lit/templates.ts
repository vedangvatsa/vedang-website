// ── LinkedIn Post Template System ──────────────────────────────────────────────
//
// Each template is a COMPLETE, self-contained post that flows as one coherent
// thought. No Frankenstein assembly. Each one reads like a real LinkedIn post.
//
// 7 topics × 15 templates = 105 complete posts.
// {{input}} = user text (lowercase), {{Input}} = user text (capitalized)

export type Topic = 'career' | 'learning' | 'personal' | 'social' | 'achievement' | 'negative' | 'general';

// ── Topic detection ────────────────────────────────────────────────────────────

export function detectTopic(text: string): Topic {
  const t = text.toLowerCase();
  if (/\b(job|work|company|career|promotion|boss|office|role|hired|fired|salary|team|manager|corporate|grow|growing|growth|stagnant|stuck|resign|quit|interview|position|org|organization)\b/.test(t)) return 'career';
  if (/\b(learn|study|course|book|read|school|class|exam|skill|training|certificate|degree|tutor|mentor|teach|knowledge|education|university|college)\b/.test(t)) return 'learning';
  if (/\b(love|relationship|dating|married|family|friend|partner|girlfriend|boyfriend|wife|husband|ex|breakup|single|heart|wedding|divorce|parent|mom|dad|son|daughter|baby)\b/.test(t)) return 'personal';
  if (/\b(party|drink|bar|fun|trip|travel|vacation|weekend|game|movie|music|concert|festival|hang|chill|relax|sleep|rest|holiday|beach|hike|walk|eat|eating|food|lunch|dinner|breakfast|chocolate|coffee|snack|cook|cooking|pizza|tea)\b/.test(t)) return 'social';
  if (/\b(won|award|finished|completed|built|created|launched|shipped|passed|earned|achieved|made it|promoted|accepted|selected|certified|published)\b/.test(t)) return 'achievement';
  if (/\b(don't|can't|won't|hate|failed|bad|terrible|suck|boring|annoying|frustrated|angry|sad|tired|sick|wrong|broke|lost|alone|lonely|scared|worried|anxious|stressed|depressed|overwhelmed|confused|struggling)\b/.test(t)) return 'negative';
  return 'general';
}

// ── Complete post templates per topic ──────────────────────────────────────────

const TEMPLATES: Record<Topic, string[]> = {
  career: [
    "I've been doing a lot of thinking about my career lately.\n\nThe truth is: {{input}}.\n\nI used to think admitting stuff like this was a weakness. Now I see it as the first step to actually changing things.\n\nThe best career moves I've ever made started with uncomfortable honesty.",

    "Career update that nobody asked for, but I'm sharing anyway.\n\n{{Input}}.\n\nA year ago, I would have kept this to myself. But I've learned that being honest about where you stand is the most underrated career move there is.\n\nYour trajectory is yours to own.",

    "Here's something most people keep to themselves.\n\n{{Input}}.\n\nBut staying quiet about it doesn't make it go away. The best career decisions I've ever made started with saying the thing out loud.\n\nIf this resonates, you already know what your next step is.",

    "Can we be real for a second?\n\n{{Input}}.\n\nI've been in this industry long enough to know that pretending everything is great doesn't make it great. Sometimes you have to name the problem before you can fix it.\n\nThat's not negativity. That's clarity.",

    "It hit me recently: {{input}}.\n\nAnd instead of ignoring it, I decided to sit with it. Really think about what it means and what I want to do about it.\n\nThe hardest part wasn't the realization. It was deciding what comes next.\n\nBut that's where the growth is.",

    "I'm going to be honest.\n\n{{Input}}.\n\nI could sugarcoat this. But what would be the point? I'd rather be real on here than perform some version of 'everything is amazing.'\n\nThe people I respect most are the ones who tell the truth about their careers. Not just the wins.",

    "I had a moment of clarity this week.\n\n{{Input}}.\n\nIf you've ever felt the same way, you're not alone. And no, there's nothing wrong with you. Sometimes the bravest thing you can do is acknowledge where you are.\n\nThat's how change starts.",

    "Let me be direct: {{input}}.\n\nIt's uncomfortable to say. But I've realized that comfort and growth don't live in the same place.\n\nSome conversations are harder to have with yourself than with anyone else. This was one of them.",

    "Something shifted for me recently.\n\n{{Input}}.\n\nI used to think I had to have everything figured out before talking about it. Turns out, saying it out loud is how you start figuring it out.\n\nWork in progress. And that's fine.",

    "After a lot of reflection: {{input}}.\n\nAnd I'm finally okay with saying it. Not because I have all the answers, but because I know pretending doesn't help anyone.\n\nThe first step to changing your career is being honest about the one you have.",

    "Nobody tells you this part about your career.\n\n{{Input}}.\n\nYou can do everything 'right' and still feel like something's off. That's not failure. That's a signal.\n\nListen to it.",

    "I wasn't planning to share this. But here goes.\n\n{{Input}}.\n\nThe funny thing about career growth is that it looks nothing like what they show you in the movies. It's messy, uncertain, and way more internal than external.\n\nBut that's the real stuff.",

    "Real talk.\n\n{{Input}}.\n\nI've spent the last few weeks thinking about what I actually want versus what I thought I was supposed to want. Turns out, those are two very different things.\n\nClarity is a slow process. But it's worth the work.",

    "I keep coming back to this one thought.\n\n{{Input}}.\n\nAnd every time I sit with it, I understand it a little better. Careers aren't linear. They're messy, human, and deeply personal.\n\nThe only person who needs to understand your path is you.",

    "I almost didn't write this.\n\n{{Input}}.\n\nBut I realized that the version of me who stays silent is the same version that stays stuck. And I'm done being stuck.\n\nIf you're in a similar spot, know that naming it is already progress.",
  ],

  learning: [
    "Investing in yourself is never wasted time.\n\n{{Input}}.\n\nIt might seem small in the moment. But knowledge compounds in ways you can't predict. The version of you six months from now will thank you for starting today.",

    "I've always believed that curiosity is a competitive advantage.\n\n{{Input}}.\n\nMost people stop learning after school. That's exactly where the real education begins. The world belongs to the people who never stop being curious.",

    "Quick personal update.\n\n{{Input}}.\n\nI used to think you had to have it all figured out before you started. Turns out, the figuring out IS the journey. Every new thing you learn opens a door you didn't know existed.",

    "Today I did something small but meaningful: {{input}}.\n\nThe results weren't dramatic. But that's not the point. The point is showing up, even when nobody's watching. That's how real skill gets built.",

    "Here's what I've been up to: {{input}}.\n\nNo fancy certificate at the end. No LinkedIn badge. Just genuine curiosity and the belief that getting a little better every day matters more than big flashy moves.",

    "Small update: {{input}}.\n\nI'm not an expert yet. But I'm closer than I was yesterday. And honestly, that's the only benchmark I care about right now.\n\nProgress over perfection.",

    "I decided to try something new: {{input}}.\n\nIt was uncomfortable. It was messy. I got things wrong. And that's exactly how I know it was worth doing.\n\nComfort zones are nice. But nothing grows there.",

    "Something I noticed about myself: I'm happiest when I'm learning.\n\n{{Input}}.\n\nThe compound effect of small, consistent effort is wildly underrated. You don't see the results right away. But one day you look back and realize how far you've come.",

    "I challenged myself recently: {{input}}.\n\nNo pressure. No deadline. No one to impress. Just genuine interest in getting better at something.\n\nThat kind of learning hits different.",

    "Here's my latest experiment: {{input}}.\n\nI don't know where it leads yet. And honestly, that's the best part. Not everything needs a destination. Sometimes the journey is the whole point.",

    "{{Input}}.\n\nThere's a special kind of freedom in being a beginner at something. No expectations. No pressure to be perfect. Just the space to explore and mess up and try again.\n\nI forgot how good that feels.",

    "Personal development note: {{input}}.\n\nThe best version of yourself is always under construction. And that's not a flaw. That's the whole design.\n\nKeep building.",

    "What I spent my time on recently: {{input}}.\n\nNot glamorous. Not viral. But important. I'm learning to value the quiet work that nobody sees. Because that's where the real growth happens.",

    "I've been meaning to share this for a while.\n\n{{Input}}.\n\nI used to wait until I was 'ready' before starting things. Now I know that starting is how you get ready. You'll never feel prepared enough. Do it anyway.",

    "Everyone's building in public these days. Me? I'm learning in public.\n\n{{Input}}.\n\nNo pretense of expertise. Just a genuine commitment to getting better. And I think there's value in sharing that process, not just the polished results.",
  ],

  personal: [
    "Some things in life can't be measured by KPIs.\n\n{{Input}}.\n\nI don't usually share the personal side here. But the person I am outside of work shapes everything I do inside of it. The two aren't separate. They never were.",

    "Not everything worth sharing is about work.\n\n{{Input}}.\n\nI've been thinking a lot about how our personal lives shape our professional ones. The line between the two is way thinner than we pretend on here.",

    "Being real for a moment.\n\n{{Input}}.\n\nI used to think vulnerability was a weakness. Now I know it takes way more strength to be honest than to pretend everything is perfect all the time.\n\nWe're all figuring it out as we go.",

    "On the personal side: {{input}}.\n\nI don't usually share this kind of thing here, because LinkedIn feels like a place for wins and announcements. But life is more than that. And I think it's okay to show it.",

    "Life update, no corporate spin: {{input}}.\n\nJust life, happening. No growth hack. No takeaway. Just something that mattered to me, and I wanted to say it.\n\nThat's allowed, right?",

    "Here's the human side of things: {{input}}.\n\nWe spend so much time curating our professional image. Sometimes the most important thing to do is be a person first.\n\nThis was one of those moments.",

    "Away from the keyboard: {{input}}.\n\nI think we need more posts like this and fewer highlight reels. The real stuff. The stuff that actually makes us who we are.\n\nNot everything worth posting is about your career.",

    "{{Input}}.\n\nSome seasons of life are about building. Others are about just being. Both matter. And I'm learning to stop apologizing for the quiet ones.\n\nNot every chapter needs to be loud.",

    "Behind the LinkedIn profile: {{input}}.\n\nWe're all more than our job titles and bullet points. Sometimes I forget that. This is me remembering.\n\nTake care of the person behind the profile. That's the real project.",

    "I'm done pretending that only professional milestones are worth celebrating.\n\n{{Input}}.\n\nThis mattered to me. And that's enough reason to share it.\n\nYour life is bigger than your LinkedIn feed.",

    "Here's something that has nothing to do with my job: {{input}}.\n\nAnd you know what? It matters more to me than anything on my resume.\n\nLife is not a performance review.",

    "Personal update.\n\n{{Input}}.\n\nI've been thinking a lot about what actually matters. And it turns out, it's not the stuff I spend the most time talking about on here. Funny how that works.",

    "Real life, no filter.\n\n{{Input}}.\n\nI'm learning to give myself the same grace I'd give a friend. To celebrate the messy, imperfect, deeply human parts of life.\n\nThat's the real work.",

    "Something from my non-work life: {{input}}.\n\nThe most important conversations I've had this year weren't in any meeting room. They were the quiet, personal ones that reminded me what I'm actually doing all this for.",

    "This might be the most honest post I've written.\n\n{{Input}}.\n\nNo angle. No lesson. No call to action. Just something real. And that feels like enough today.",
  ],

  social: [
    "{{Input}}.\n\nAnd you know what? That's not wasted time. That's living. Not everything needs a productivity angle.\n\nSometimes the best thing you can do is just enjoy something without trying to optimize it.",

    "Here's what I actually did today: {{input}}.\n\nNo productivity hacks involved. No morning routine thread. Just being a person doing a person thing.\n\nAnd it was great.",

    "I did something major this week: {{input}}.\n\nRevolutionary because I didn't try to turn it into a LinkedIn post about productivity. Oh wait.\n\nBut seriously. Enjoy things. It's allowed.",

    "{{Input}}.\n\nNo agenda. No deeper meaning. No networking angle. Just being a human being for a minute.\n\nRemember when we used to do that without feeling guilty?",

    "What I did instead of hustling: {{input}}.\n\nAnd I don't feel guilty about it. Not anymore. I spent years thinking every moment had to be 'productive.' Turns out, rest is productive too.",

    "{{Input}}.\n\nHot take: not everything has to be a growth opportunity. Some things can just be fun. Or tasty. Or pointless. And that's completely fine.\n\nProtect your joy. It matters.",

    "Unplugged for a bit: {{input}}.\n\nFunny how the best ideas come when you stop chasing them. And even if they don't come, at least you had a good time. Which should be reason enough.",

    "My very unproductive, very necessary update: {{input}}.\n\nSometimes the best strategy is no strategy at all. Just vibes. Just being alive.\n\nI'm learning to be okay with that.",

    "Refreshingly non-professional update: {{input}}.\n\nTurns out, you're allowed to enjoy things on a Tuesday without writing a thread about what it taught you about leadership.\n\nJust enjoy it.",

    "{{Input}}.\n\nI used to feel guilty about downtime. Like every second not spent grinding was a second wasted. I don't think that anymore.\n\nThe best version of me at work is the one who actually takes breaks.",

    "{{Input}}.\n\nBurnout doesn't care about your hustle. Take the break. Eat the thing. Watch the show. Go outside.\n\nYou'll be a better professional for it. But also, you'll be a better person.",

    "Real life, no filter: {{input}}.\n\nNot everything has to be about the grind. Some moments are just moments. And they're worth having.\n\nThis was one of them.",

    "{{Input}}.\n\nThis is your reminder that you're allowed to enjoy things without turning them into a content opportunity. Not everything is a lesson.\n\nSome things are just good.",

    "Status update: {{input}}.\n\nNo deeper meaning. No corporate metaphor. Just a thing that happened and made my day a little better.\n\nThat's the whole post.",

    "I keep seeing posts about '5am routines' and 'relentless execution.'\n\nMeanwhile, I'm over here: {{input}}.\n\nAnd I'm honestly having a great time. Balance is underrated.",
  ],

  achievement: [
    "Excited to share a small win.\n\n{{Input}}.\n\nIt might not seem like much. But every step forward counts. Behind every small milestone is a lot of quiet work nobody sees.\n\nGrateful for the journey.",

    "Small win alert: {{input}}.\n\nI almost didn't post this because it feels 'too small.' But I'm done waiting for the perfect moment to celebrate progress. This was a moment. And it mattered.",

    "{{Input}}.\n\nThe path here wasn't straightforward. There were setbacks, doubt, and moments where I almost gave up. But I didn't. And here we are.\n\nKeep going. Your wins are coming too.",

    "Milestone update: {{input}}.\n\nI'm learning to celebrate progress, not just perfection. Because the truth is, most growth happens in the quiet moments nobody sees.\n\nDone is better than perfect. Always.",

    "I did a thing: {{input}}.\n\nSmall? Maybe. Meaningful? Absolutely. I'm learning to take the wins where they come instead of always waiting for the big ones.\n\nCelebrate what you've got.",

    "Personal milestone: {{input}}.\n\nA year ago, this would have felt impossible. Funny how that works. You keep showing up and one day you look back and realize you've actually moved.\n\nTrust the process.",

    "{{Input}}.\n\nNot every win needs a trophy. Sometimes the best victories are the quiet ones that only you understand. The ones that prove to yourself that you can.\n\nThat's the only validation that matters.",

    "Here's something I'm proud of: {{input}}.\n\nIt took longer than expected. It always does. The timeline was messy. The process was imperfect. But it's done. And done counts.\n\nOn to the next one.",

    "Update I've been wanting to share: {{input}}.\n\nI used to compare my progress to everyone else's highlight reels. Now I compare it to where I was last month. That shift changed everything.",

    "Today I can say: {{input}}.\n\nAnd honestly, it feels pretty great. Not because it's world-changing. But because it's mine. I worked for it. And that's enough.\n\nCelebrate your stuff. Even the small stuff.",

    "Something happened this week.\n\n{{Input}}.\n\nI know in the grand scheme of things, it's small. But small wins are what big wins are made of. Every single one of them counts.",

    "{{Input}}.\n\nBehind this is a story nobody sees. The early mornings. The failed attempts. The moments of 'is this even worth it?'\n\nIt was worth it.\n\nKeep going.",

    "Humble milestone: {{input}}.\n\nNo awards ceremony. No fireworks. Just a quiet satisfaction that comes from knowing you did the thing you said you'd do.\n\nThat's the real flex.",

    "{{Input}}.\n\nI almost didn't share this. Because it felt 'too small' for LinkedIn. Then I remembered that every big thing started as a small thing someone almost didn't share.\n\nSo here it is.",

    "Progress report: {{input}}.\n\nNo matter how small the step, it's still forward motion. And forward motion compounds. Even when it doesn't feel like it.",
  ],

  negative: [
    "I'm going to be honest about something.\n\n{{Input}}.\n\nI could dress this up. But that wouldn't be real. Not everything has to be a highlight reel. Sometimes you just need to name where you are.\n\nBetter days are built, not wished for.",

    "Real talk for a second.\n\n{{Input}}.\n\nI could turn this into an inspirational post. But that wouldn't be honest. The truth is, not every chapter is a success story. Some chapters are about surviving.\n\nAnd that's okay.",

    "Here's something I've been sitting with.\n\n{{Input}}.\n\nA year from now, this will either be a turning point or a footnote. I don't know which yet. But I know that pretending it's not happening doesn't help anyone.\n\nSo here it is.",

    "Keeping it real: {{input}}.\n\nMost people on this platform only show the wins. This isn't a win. But it's honest. And I've come to believe that honesty is more valuable than a perfect feed.",

    "{{Input}}.\n\nI don't have a motivational spin for this one. Sometimes things are just hard. And pretending otherwise doesn't make them easier.\n\nBut talking about it might.",

    "I'm not going to pretend: {{input}}.\n\nBut I also know this isn't the end of the story. It's a chapter. A tough one. But chapters end.\n\nThe people who come out stronger aren't the ones who never struggled. They're the ones who were honest about it.",

    "{{Input}}.\n\nThe worst thing I could do right now is stay silent about it. Because someone scrolling through this feed right now is going through the exact same thing.\n\nYou're not alone.",

    "Honest update: {{input}}.\n\nI thought about not posting this. Because LinkedIn is supposed to be the place where everything is going great. But I'd rather be real than performing.\n\nIt's okay to not be okay.",

    "Transparency moment.\n\n{{Input}}.\n\nI used to think struggling meant failing. Now I know it just means I'm still in the game. And as long as I'm still in it, there's a chance.\n\nThat's enough for today.",

    "{{Input}}.\n\nStrength isn't pretending you're fine. It's being honest when you're not. It's showing up even when showing up is the hardest part.\n\nSome days, just showing up IS the achievement.",

    "Here's what nobody sees behind the posts: {{input}}.\n\nAnd I think more people should talk about this. Not for sympathy. But because the illusion that everyone else has it figured out makes the hard parts even harder.",

    "I wasn't going to post this.\n\n{{Input}}.\n\nBut then I thought about all the people who share similar things privately and feel like they're the only ones. You're not. I promise you.\n\nWe're all figuring it out.",

    "No filter today.\n\n{{Input}}.\n\nProgress isn't always upward. Sometimes it's sideways. Sometimes it's just holding on and not sliding back. And that counts too.\n\nGive yourself credit for still being here.",

    "{{Input}}.\n\nI could wrap this in a 'but I learned so much from it' bow. Maybe I will someday. But right now, I'm still in the middle of it.\n\nAnd I think there's value in sharing the middle, not just the after.",

    "Real talk.\n\n{{Input}}.\n\nThere's a version of this post where I make it sound inspirational and end with a call to action. This isn't that version.\n\nThis is just the truth. And sometimes the truth doesn't have a takeaway. It's just the truth.",
  ],

  general: [
    "{{Input}}.\n\nSimple as that. No grand lesson. No framework. Just something that happened and felt worth saying out loud.\n\nSometimes the simplest posts are the ones that stick.",

    "Here's what's been on my mind: {{input}}.\n\nI don't have a deep analysis. I don't have a hot take. Just a thought that kept coming back until I decided to write it down.\n\nMake of it what you will.",

    "Quick thought: {{input}}.\n\nSometimes the smallest observations end up being the most interesting ones. I keep turning this over in my head.\n\nCurious if anyone else has been thinking about this.",

    "Something I noticed recently: {{input}}.\n\nThe more I think about it, the more it makes sense. And the less I feel the need to over-explain it.\n\nSome things just are what they are.",

    "{{Input}}.\n\nI've been meaning to say this for a while. Not because it's groundbreaking, but because sometimes putting a thought into words is how you understand it.\n\nThat's the whole post.",

    "Update from my side: {{input}}.\n\nLife moves fast. It helps to pause and name what's happening. Not everything needs to be a thread or a framework.\n\nSome things just need to be said.",

    "{{Input}}.\n\nI don't always have a grand narrative. Today, I just have this. And I think that's perfectly fine.\n\nNot every post needs to change the world.",

    "A moment of reflection: {{input}}.\n\nSometimes the most important thing is to simply notice what's happening around you. Before it becomes a memory you forgot to appreciate.",

    "Sharing a thought: {{input}}.\n\nTake it or leave it. No agenda. No sales pitch. Just a thing I've been thinking about and wanted to put into words.\n\nThat's allowed, right?",

    "{{Input}}.\n\nSmall moments. Big meaning. That's how it usually works. At least, that's how it works for me.\n\nThanks for reading.",

    "Been meaning to say this: {{input}}.\n\nNo overthinking. No seven-paragraph buildup. Just putting it out there because it felt right.\n\nSometimes that's reason enough.",

    "{{Input}}.\n\nFelt like this was worth putting out there. Not because it's deep. But because it's real. And real is in short supply on this platform sometimes.",

    "Here's something that's been on my mind.\n\n{{Input}}.\n\nI have no idea if anyone else thinks about this kind of stuff. But writing it down helped me understand it better. So here it is.",

    "{{Input}}.\n\nThe best posts aren't the ones with the most likes. They're the ones that are true. At least, that's what I keep telling myself.\n\nHope this one lands for someone.",

    "I started writing this three times before I finally hit post.\n\n{{Input}}.\n\nIt's not polished. It's not optimized. It's just honest. And I'm learning that honest is enough.",
  ],
};

// ── Contextual rewriting ───────────────────────────────────────────────────────
// Transforms raw input into more natural LinkedIn phrasing before embedding.
// These are sentence-structure transformations, not word swaps.

const CONTEXTUAL_REWRITES: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
  // Emotional / self-image statements: "I am fat/ugly/dumb" → reflective framing
  [/^i('m| am) (fat|ugly|dumb|stupid|weak|slow|lazy|boring|awkward|useless|worthless|bad|terrible|pathetic)$/i,
    (m) => `I've been reflecting on how I see myself, and the honest truth is I feel ${m[2]}`],

  // "I am [positive adj]" → celebratory framing
  [/^i('m| am) (happy|excited|grateful|proud|motivated|inspired|confident|ready|blessed|lucky|thriving)$/i,
    (m) => `I'm feeling genuinely ${m[2]} right now`],

  // "I am [verb]ing [noun]" → elevated activity
  [/^i('m| am) (eating|drinking|having|making|cooking|enjoying|watching|playing|reading|listening to|doing) (.+)$/i,
    (m) => `I took some time to enjoy ${m[3]}`],

  // "I will [verb]" → intentional framing
  [/^i('ll| will) (.+)$/i,
    (m) => `I'm making space to ${m[2]}`],

  // "I want to [verb]" → aspiration framing
  [/^i want to (.+)$/i,
    (m) => `I've decided it's time to ${m[1]}`],

  // "I need to [verb]" → priority framing
  [/^i need to (.+)$/i,
    (m) => `I'm prioritizing ${m[1]}`],

  // "I have to [verb]" → commitment framing  
  [/^i have to (.+)$/i,
    (m) => `I'm committing to ${m[1]}`],

  // "I am not [verb]ing" → reflection framing
  [/^i('m| am) not (\w+ing) (.+)$/i,
    (m) => `I've had to be honest with myself: I'm not ${m[2]} ${m[3]}`],

  // "I am not [adj] in/at [noun]" → career/growth reflection
  [/^i('m| am) not (\w+) (in|at) (.+)$/i,
    (m) => `I've realized I'm not ${m[2]} ${m[3]} ${m[4]}, and I'm choosing to be honest about that`],

  // "I got [noun]" → milestone framing
  [/^i got (.+)$/i,
    (m) => `I received ${m[1]}`],

  // "I had [noun]" → experience framing
  [/^i had (.+)$/i,
    (m) => `I made space for ${m[1]}`],

  // "I went to [place]" → intentional framing
  [/^i went (to .+)$/i,
    (m) => `I took the time to go ${m[1]}`],

  // "I like/love [noun]" → passion framing
  [/^i (like|love) (.+)$/i,
    (m) => `there's something I'm genuinely passionate about: ${m[2]}`],

  // "I hate [noun]" → honest framing
  [/^i hate (.+)$/i,
    (m) => `I'm going to be honest about something: ${m[1]} isn't working for me`],

  // "I can't [verb]" → boundary framing
  [/^i can't (.+)$/i,
    (m) => `I've been struggling with ${m[1]}, and I think it's okay to admit that`],

  // "[Subject] is [adjective]" → reframe as observation
  [/^(.+) is (terrible|awful|bad|boring|annoying|stupid|dumb|broken|dead|pointless|useless)$/i,
    (m) => `${m[1]} hasn't been great, and I think more people should talk about why`],

  // "[Subject] is [positive adj]" → celebratory
  [/^(.+) is (great|amazing|awesome|wonderful|beautiful|perfect|fantastic|brilliant)$/i,
    (m) => `${m[1]} has been genuinely ${m[2]}, and I want to give credit where it's due`],
];

function contextualRewrite(text: string): string {
  const trimmed = text.trim();
  for (const [pattern, replacement] of CONTEXTUAL_REWRITES) {
    const match = trimmed.match(pattern);
    if (match) {
      if (typeof replacement === 'string') {
        return trimmed.replace(pattern, replacement);
      }
      return replacement(match);
    }
  }
  // No rewrite matched — return as-is
  return trimmed;
}

// ── Template application ───────────────────────────────────────────────────────

function applyTemplate(template: string, input: string): string {
  const capitalized = input.charAt(0).toUpperCase() + input.slice(1);
  return template
    .replace(/\{\{Input\}\}/g, capitalized)
    .replace(/\{\{input\}\}/g, input.toLowerCase());
}

export function composeNarrative(input: string, index: number): string {
  const clean = input.trim().replace(/[.!?]+$/, '');
  const topic = detectTopic(clean);

  // Contextually rewrite the input before embedding
  const rewritten = contextualRewrite(clean);

  const pool = TEMPLATES[topic];
  const template = pool[(index * 3 + 1) % pool.length];
  return applyTemplate(template, rewritten);
}


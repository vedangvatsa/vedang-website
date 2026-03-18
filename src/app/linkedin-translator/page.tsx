'use client';

import { useState, useRef, useEffect } from 'react';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowRight, RotateCcw, Share2, Download, Link } from 'lucide-react';
import { composeNarrative } from './templates';

// ── LinkedIn transformation engine ─────────────────────────────────────────────
//
// Three-layer approach:
//   1. Phrase-level swaps  — known multi-word patterns → LinkedIn equivalents
//   2. Word-level swaps    — individual word substitutions
//   3. General framing     — wraps the (possibly already-swapped) text in a
//                            LinkedIn-style opener + closer so that even totally
//                            unknown input still sounds like a LinkedIn post.

// ── Layer 1: phrase-level swaps ────────────────────────────────────────────────

const PHRASE_SWAPS: [RegExp, string][] = [
  // Career transitions
  [/\bi got fired\b/gi, 'I\'m thrilled to announce that I\'m exploring new opportunities'],
  [/\bi (got|was) laid off\b/gi, 'After an unforgettable journey, I\'m now open to my next chapter'],
  [/\bi quit my job\b/gi, 'I made the bold decision to bet on myself'],
  [/\bi quit\b/gi, 'I chose growth over comfort'],
  [/\bi('m| am) unemployed\b/gi, 'I\'m currently in a season of intentional transition'],
  [/\bi('m| am) looking for (a )?job\b/gi, 'I\'m selectively exploring high-impact roles where I can drive transformation'],
  [/\bi('m| am) job hunting\b/gi, 'I\'m in active discovery mode for my next purpose-driven chapter'],
  [/\bi got a promotion\b/gi, 'Humbled and grateful to share that I\'ve been entrusted with a new leadership mandate'],
  [/\bi got promoted\b/gi, 'After months of relentless value creation, the organization recognized my trajectory'],
  [/\bi got a raise\b/gi, 'The market has spoken, and it valued my contributions appropriately'],
  [/\bi got demoted\b/gi, 'I\'ve been given the gift of a new perspective within the organization'],
  [/\bi('m| am) overqualified\b/gi, 'I bring a depth of experience that creates outsized value from day one'],
  [/\bi('m| am) underqualified\b/gi, 'What I lack in credentials I make up for in curiosity and bias toward action'],
  [/\bi (need|want) a new job\b/gi, 'I\'m ready to apply my leadership to a mission that scales'],
  [/\bi got rejected\b/gi, 'The universe redirected me toward a better-aligned opportunity'],
  [/\bthey didn('t| not) hire me\b/gi, 'While the alignment wasn\'t there this time, I\'m grateful for the process'],
  [/\bi didn('t| not) get the job\b/gi, 'The role went to someone whose journey aligned differently, and honestly? That\'s beautiful'],
  [/\bmy (resume|cv) (is|looks) (bad|terrible|awful)\b/gi, 'My personal impact portfolio is undergoing a strategic refresh'],
  [/\bi('m| am) changing careers\b/gi, 'I\'m pivoting into a space where my transferable skills can unlock exponential impact'],
  [/\bi('m| am) freelancing\b/gi, 'I\'m building a portfolio of high-impact engagements as an independent consultant'],
  [/\bi work from home\b/gi, 'I operate from my purpose-built remote innovation hub'],
  [/\breturn to office\b/gi, 'in-person collaboration renaissance'],
  [/\bremote work\b/gi, 'distributed value creation'],

  // Achievements & recognition
  [/\bi (got|won|received) (a |an |the |my )?(award|prize|trophy)\b/gi, 'I\'m deeply humbled and grateful to share that I\'ve been recognized with a prestigious accolade. This wouldn\'t have been possible without the amazing people around me'],
  [/\bi got (a |)(kudos|recognition|shoutout|shout-out)\b/gi, 'I\'m deeply honored to have been recognized by my peers. Moments like these remind me why showing up every single day matters'],
  [/\bi (got|received) (a |)certificate\b/gi, 'Thrilled to announce that I\'ve earned a new certification. Never stop learning. Your future self will thank you'],
  [/\bi passed (my |the |a )?(exam|test|assessment)\b/gi, 'After weeks of disciplined preparation and relentless focus, I\'m proud to share that I\'ve cleared a major competency milestone'],
  [/\bi (finished|completed|submitted) (my |the |a )?(project|assignment|homework|work|paper|thesis|dissertation|report)\b/gi, 'I\'m proud to share that I\'ve successfully delivered a key deliverable. The journey wasn\'t easy, but growth never is. Every challenge was a stepping stone toward becoming the professional I\'m meant to be'],
  [/\bi (finished|completed|done with) (my |the |a )?(course|class|training|program|bootcamp)\b/gi, 'I\'ve officially completed an intensive learning program. Investing in yourself is the highest-ROI decision you can make'],
  [/\bi (have |)(finished|completed|done)\b/gi, 'I\'ve successfully brought to completion'],
  [/\bi (won|came first|got first place)\b/gi, 'Humbled to share that I achieved a winning outcome. But the real victory was the lessons learned along the way'],
  [/\bi (made|got into|was accepted)\b/gi, 'After a rigorous and competitive selection process, I\'m thrilled to announce that I\'ve been selected'],
  [/\bi (learned|learnt) (how to |to )?\b/gi, 'I invested in expanding my skill set and upskilled in '],
  [/\bi (did|have done) (a |)(good|great|nice|amazing|awesome|excellent) (job|work)\b/gi, 'I delivered exceptional results that exceeded all benchmarks and stakeholder expectations'],
  [/\bgot (a |)(good|great|positive) (feedback|review|rating)\b/gi, 'received overwhelmingly positive stakeholder feedback that validates the impact of my contributions'],

  // Emotions & wellbeing
  [/\bi('m| am) tired\b/gi, 'I\'m embracing the grind and finding new reserves of passion'],
  [/\bi('m| am) exhausted\b/gi, 'I\'m operating at a pace that would humble most, and I wouldn\'t have it any other way'],
  [/\bi('m| am) stressed\b/gi, 'I\'m operating at peak intensity right now'],
  [/\bi('m| am) burnt out\b/gi, 'I\'m recharging to come back stronger than ever'],
  [/\bi('m| am) overwhelmed\b/gi, 'I\'m navigating an abundance of high-priority opportunities simultaneously'],
  [/\bi('m| am) depressed\b/gi, 'I\'m in a season of deep reflection and inner recalibration'],
  [/\bi('m| am) anxious\b/gi, 'I\'m channeling my heightened awareness into forward momentum'],
  [/\bi('m| am) angry\b/gi, 'I\'m passionately advocating for a higher standard'],
  [/\bi('m| am) frustrated\b/gi, 'I\'m encountering creative friction that\'s refining my approach'],
  [/\bi('m| am) sad\b/gi, 'I\'m processing a profound growth experience'],
  [/\bi('m| am) lonely\b/gi, 'I\'m building deeper connections with my own vision'],
  [/\bi('m| am) hungover\b/gi, 'I\'m recovering from a high-energy networking event'],
  [/\bi('m| am) scared\b/gi, 'I\'m feeling the electricity of standing at the edge of something big'],
  [/\bi('m| am) confused\b/gi, 'I\'m embracing ambiguity, which is where true innovation lives'],
  [/\bi('m| am) bored\b/gi, 'I\'m in a reflective phase, realigning my purpose with my passion'],
  [/\bi('m| am) lazy\b/gi, 'I\'m practicing strategic energy conservation'],
  [/\bi('m| am) jealous\b/gi, 'I\'m deeply inspired by another leader\'s trajectory'],
  [/\bi('m| am) dead\b/gi, 'I\'ve completed my earthly sprint and am now networking in the afterlife'],
  [/\bi('m| am) sick\b/gi, 'I\'m on a wellness optimization day, still mentally engaged'],
  [/\bi('m| am) crying\b/gi, 'I\'m experiencing an emotionally rich moment of professional growth'],
  [/\bi('m| am) fine\b/gi, 'I\'m operating at optimal capacity'],
  [/\bi('m| am) okay\b/gi, 'I\'m in a stable state of continuous improvement'],
  [/\bi('m| am) happy\b/gi, 'I\'m experiencing deep alignment between my values and my craft'],
  [/\bi feel (bad|terrible|awful)\b/gi, 'I\'m working through a temporary misalignment that will strengthen my emotional architecture'],

  // Workplace
  [/\bmy boss is (terrible|awful|bad|the worst|an idiot|stupid|dumb|incompetent)\b/gi, 'I\'m learning to lead up and work through complex stakeholder dynamics'],
  [/\bmy (coworkers|colleagues) are annoying\b/gi, 'I\'m surrounded by passionate individuals who challenge me daily'],
  [/\bi hate my (job|work|company)\b/gi, 'I\'m discovering what truly lights my fire by understanding what doesn\'t'],
  [/\bthis (job|place|company) (is |)(sucks|stinks|is terrible|is awful|is the worst)\b/gi, 'This environment is teaching me what kind of culture I want to build next'],
  [/\bi('m| am) (going to |gonna )?(skip|skipping) work\b/gi, 'I\'m taking a strategic personal day to recalibrate'],
  [/\bi('m| am) (going to )?call(ing)? in sick\b/gi, 'I\'m proactively managing my wellness to sustain long-term performance'],
  [/\bworking overtime\b/gi, 'investing extra hours in my craft because the mission matters'],
  [/\bthe meeting (was|is) pointless\b/gi, 'The alignment session surfaced some interesting collaboration opportunities'],
  [/\btoo many meetings\b/gi, 'a rich calendar of cross-functional collaboration touchpoints'],
  [/\bthis meeting could('ve| have) been an email\b/gi, 'There\'s an opportunity to optimize our synchronous-to-asynchronous communication ratio'],
  [/\bmy code (doesn('t| not) work|is broken|has bugs)\b/gi, 'My solution is exhibiting unexpected behavior that\'s revealing edge cases I hadn\'t considered'],
  [/\bthe code(base)? is (a )?mess\b/gi, 'The codebase has significant opportunities for architectural evolution'],
  [/\btechnical debt\b/gi, 'deferred engineering investment'],
  [/\blegacy (code|system|software)\b/gi, 'battle-tested foundational infrastructure'],
  [/\bspaghetti code\b/gi, 'organically evolved architecture'],

  // Communication
  [/\bi disagree\b/gi, 'I\'d love to offer an alternative perspective for consideration'],
  [/\byou('re| are) wrong\b/gi, 'There might be an opportunity to reframe this through a different lens'],
  [/\bthat('s| is) (a )?bad idea\b/gi, 'Let\'s pressure-test this against our north star metrics'],
  [/\bthat('s| is) (a )?terrible idea\b/gi, 'I see some potential headwinds with that approach. Let\'s iterate'],
  [/\bthat('s| is) stupid\b/gi, 'That\'s a bold perspective. Let me share some data that might add nuance'],
  [/\bthat makes no sense\b/gi, 'I\'d love to understand the mental model behind that framing'],
  [/\bi don('t| not) know\b/gi, 'Great question. Let me lean into my network and circle back with insights'],
  [/\bi don('t| not) care\b/gi, 'I\'m choosing to focus my energy on the highest-impact priorities'],
  [/\bi don('t| not) (want to|wanna)\b/gi, 'I\'m being intentional about where I direct my capacity'],
  [/\bi('m| am) sorry\b/gi, 'I take full ownership and see this as a growth opportunity'],
  [/\bshut up\b/gi, 'I\'d love to create space for other voices in this conversation'],
  [/\bleave me alone\b/gi, 'I\'m entering a deep focus block and would love to reconnect after'],
  [/\bthat('s| is) not my (job|problem|responsibility)\b/gi, 'While that falls outside my current scope, I\'m happy to connect you with the right stakeholder'],
  [/\bi told you so\b/gi, 'The data validated the hypothesis I raised in our earlier alignment session'],
  [/\bwhatever\b/gi, 'I\'m open to any direction that serves the broader mission'],
  [/\bthis is (a )?waste of time\b/gi, 'I\'m curious about the ROI of this initiative relative to our strategic priorities'],

  // Failures & mistakes
  [/\bi made a mistake\b/gi, 'I had a powerful learning experience'],
  [/\bwe failed\b/gi, 'We ran a bold experiment and gathered invaluable data'],
  [/\bi failed\b/gi, 'I earned a masterclass in resilience'],
  [/\bi (messed|screwed|f[*u]cked) up\b/gi, 'I encountered an unexpected outcome that accelerated my learning curve'],
  [/\bit (didn('t| not) work|went wrong|fell apart|blew up|crashed|broke)\b/gi, 'The initiative surfaced critical learnings that will inform our next iteration'],
  [/\bwe lost (the |)(deal|client|account|contract)\b/gi, 'We made space in our portfolio for higher-alignment partnerships'],
  [/\bthe project (failed|died|tanked|flopped)\b/gi, 'The project completed its experimental lifecycle and yielded invaluable insights'],
  [/\bwe('re| are) behind schedule\b/gi, 'We\'re taking the time needed to deliver excellence rather than rush mediocrity'],
  [/\bwe missed the deadline\b/gi, 'We prioritized quality over the original timeline, and that\'s leadership'],
  [/\bi forgot\b/gi, 'It temporarily fell off my radar due to competing strategic priorities'],
  [/\bwe ran out of (money|budget|funding)\b/gi, 'We\'ve reached an inflection point that requires creative capital strategy'],
  [/\bwe('re| are) going bankrupt\b/gi, 'We\'re undergoing a significant financial transformation'],

  // Greetings & small talk
  [/\bgood morning\b/gi, 'Rise and grind, fellow change-makers. Another day to move the needle'],
  [/\bgood (afternoon|evening)\b/gi, 'Hope you\'re all crushing it in the second half of the day'],
  [/\bgoodbye\b/gi, 'Until we connect again. Keep driving impact'],
  [/\bhello\b/gi, 'Thrilled to connect with you on this platform of infinite possibilities'],
  [/\bthank you so much\b/gi, 'Words cannot express how your contribution has accelerated my trajectory'],
  [/\bthank you\b/gi, 'Deeply grateful for the value you bring to my professional life'],
  [/\bthanks a lot\b/gi, 'Genuinely humbled by your generosity and collaborative spirit'],
  [/\bthanks\b/gi, 'Grateful for this'],
  [/\bhow are you\b/gi, 'How\'s your quarter going? Crushing your KPIs?'],
  [/\bi('m| am) good\b/gi, 'I\'m in a strong position. Personally, professionally, and spiritually'],
  [/\bnot (much|bad)\b/gi, 'Just quietly building the future over here'],
  [/\bwhat('s| is) up\b/gi, 'What\'s the latest in your professional journey?'],
  [/\bhappy birthday\b/gi, 'Celebrating another year of your outstanding personal and professional growth trajectory'],
  [/\bcongratulations\b/gi, 'What an outstanding milestone. The world needs to hear this story'],
  [/\bcongrats\b/gi, 'Well deserved. Your journey inspires everyone watching'],
  [/\bhappy (new year|holidays)\b/gi, 'Wishing you a year of growth, alignment, and impact'],

  // Startup & business
  [/\bwe('re| are) (going )?out of business\b/gi, 'We\'re winding down this chapter to make room for what\'s next'],
  [/\bthe startup (failed|died|shut down|closed)\b/gi, 'The venture completed its lifecycle. Every lesson was worth the journey'],
  [/\bwe have no users\b/gi, 'We\'re in stealth mode, focused on perfecting the product before scale'],
  [/\bnobody (uses|wants|cares about|likes) (our |this |my )?(product|app|service)\b/gi, 'We\'re in the pre-product-market-fit phase, iterating toward resonance'],
  [/\bwe('re| are) pivoting\b/gi, 'We\'re making a strategic directional shift informed by market signals'],
  [/\bwe('re| are) running out of money\b/gi, 'We\'re approaching a critical inflection point in our funding journey'],
  [/\bwe need (more )?funding\b/gi, 'We\'re opening our next round to accelerate our vision'],
  [/\binvestors (said no|rejected us|passed)\b/gi, 'We\'re refining our narrative for the right strategic partners'],
  [/\bwe copied (them|their|the competition|a competitor)\b/gi, 'We were inspired by proven market patterns and adapted them to our unique value proposition'],
  [/\bthe competition is (winning|beating us|better)\b/gi, 'Our competitors are validating the market, which benefits all players in the space'],

  // Education
  [/\bi dropped out\b/gi, 'I chose the school of real-world experience over traditional academia'],
  [/\bi (barely |)graduated\b/gi, 'I completed my foundational learning chapter'],
  [/\bi got bad grades\b/gi, 'My academic record doesn\'t reflect the depth of my applied learning'],
  [/\bschool (was|is) (boring|pointless|useless|a waste)\b/gi, 'Formal education gave me a baseline; my real growth happened outside the classroom'],
  [/\bi didn('t| not) (learn|study)\b/gi, 'I prioritized experiential learning over traditional study methods'],

  // Daily life
  [/\bi had lunch\b/gi, 'I invested in a mindful refueling session to optimize afternoon performance'],
  [/\bi had (a )?(beer|drink|drinks)\b/gi, 'I attended a casual relationship-building session over beverages'],
  [/\bi went to (a |the )?bar\b/gi, 'I participated in an informal after-hours networking roundtable'],
  [/\bi went to (a |the )?party\b/gi, 'I expanded my network at a high-energy social engagement'],
  [/\bi (slept in|overslept|woke up late)\b/gi, 'I honored my body\'s need for deep rest to maximize peak performance window'],
  [/\bi('m| am) (watching|binge-?watching) (tv|netflix|shows?)\b/gi, 'I\'m consuming narrative-driven content to broaden my perspective on human behavior'],
  [/\bi took a nap\b/gi, 'I executed a strategic cognitive reset'],
  [/\bi scrolled (through |)(social media|my phone|twitter|instagram|tiktok)\b/gi, 'I conducted real-time market and cultural trend research'],
  [/\bi did nothing\b/gi, 'I practiced intentional stillness to cultivate clarity'],
  [/\bi procrastinated\b/gi, 'I engaged in productive incubation of my most important priorities'],
  [/\bi went for a walk\b/gi, 'I went on a walking brainstorm session'],
  [/\bi went to the gym\b/gi, 'I invested in my physical infrastructure for sustained high performance'],
  [/\bi had a meeting\b/gi, 'I facilitated a high-impact strategic alignment session'],
  [/\bi sent an email\b/gi, 'I proactively engaged key stakeholders through asynchronous communication'],
  [/\bi ate (at )?my desk\b/gi, 'I optimized my lunch window for parallel productivity'],

  // Relationships & personal
  [/\bi stalked my ex\b/gi, 'I performed a retrospective digital audit of a previously closed personal partnership'],
  [/\bi (checked|looked at) my ex('s| is)\b/gi, 'I conducted a competitive analysis of a former strategic alliance'],
  [/\bmy ex\b/gi, 'a former key stakeholder in my personal life'],
  [/\bi got dumped\b/gi, 'A personal partnership was dissolved, freeing me to pursue higher-alignment connections'],
  [/\bi (broke up|broken up) with\b/gi, 'I strategically exited a relationship that no longer served my growth trajectory with'],
  [/\bi('m| am) single\b/gi, 'I\'m currently optimizing for personal growth before my next strategic partnership'],
  [/\bi('m| am) (in a |)relationship\b/gi, 'I\'m in a deeply synergistic personal partnership'],
  [/\bi('m| am) dating\b/gi, 'I\'m actively evaluating potential long-term personal collaborations'],
  [/\bi got married\b/gi, 'I\'ve entered a lifetime strategic personal partnership. Thrilled to announce this merger'],
  [/\bi got divorced\b/gi, 'After much reflection, I\'ve restructured my personal portfolio for future growth'],
  [/\bi miss (my |)(him|her|them)\b/gi, 'I\'m reflecting on the value generated by a previous chapter of my journey'],
  [/\bi('m| am) in love\b/gi, 'I\'ve found extraordinary alignment in my personal life'],
  [/\bi cried\b/gi, 'I had an emotionally rich breakthrough moment'],
  [/\bi('m| am) heartbroken\b/gi, 'I\'m processing the dissolution of a high-value personal engagement'],

  // Gaming & entertainment
  [/\bi (played|was playing) (video ?)?games?\b/gi, 'I engaged in strategic simulation exercises designed to sharpen decision-making under pressure'],
  [/\bi('m| am) (playing|gaming)\b/gi, 'I\'m sharpening my strategic thinking through interactive simulation'],
  [/\bi (watched|was watching) (a |the )?(movie|film|show)\b/gi, 'I consumed narrative-driven content to expand my perspective on human dynamics'],
  [/\bi('m| am) on (my |)(phone|reddit|youtube|tiktok|twitter|x)\b/gi, 'I\'m conducting real-time market and cultural intelligence research'],

  // Home & random life
  [/\b(the |my )?(water|power|electricity|internet|wifi) (is |)(down|out|off|broken|not working)\b/gi, 'I\'m facing unexpected infrastructure challenges at the home office. It\'s a high-pressure situation that tests my ability to pivot and find creative solutions under constraints'],
  [/\bi('m| am) (stuck in |in )?(traffic|a traffic jam)\b/gi, 'I\'m making use of unplanned windshield time for strategic reflection and podcast consumption'],
  [/\bi('m| am) cooking\b/gi, 'I\'m managing a complex multi-variable project with time-sensitive deliverables and zero margin for error'],
  [/\bi('m| am) cleaning\b/gi, 'I\'m optimizing my physical workspace for peak cognitive performance'],
  [/\bi('m| am) doing (the |)laundry\b/gi, 'I\'m executing a cyclical maintenance protocol for my personal brand assets'],
  [/\bi('m| am) (moving|moving house)\b/gi, 'I\'m orchestrating a complex logistics operation to relocate my base of operations'],
  [/\bmy (car|vehicle) broke down\b/gi, 'My mobility infrastructure encountered an unexpected service disruption'],
  [/\bi('m| am) (walking|playing with) (my |the )?(dog|cat|pet)\b/gi, 'I\'m co-regulating with my emotional support stakeholder to recharge for the next sprint'],

  // Legal & trouble
  [/\bi('ve| have) been arrested\b/gi, 'I\'m thrilled to announce I\'m starting a new chapter! I\'ve recently been given the unique opportunity to step back and reflect on my professional journey from a high-security environment'],
  [/\bi got arrested\b/gi, 'Exciting news: I\'ve been invited to an exclusive, government-sponsored residential program for an extended professional sabbatical'],
  [/\bi('m| am) in (jail|prison)\b/gi, 'I\'m currently enrolled in an intensive, fully-immersive residential leadership program with zero distractions and strict schedule adherence'],
  [/\bi('m| am) going to (jail|prison)\b/gi, 'I\'ve been selected for an extended in-person leadership residency with a very structured daily framework'],
  [/\bi got (a |)(sued|a lawsuit)\b/gi, 'I received formal recognition that my work has significant enough impact to warrant institutional attention'],
  [/\bfor fraud\b/gi, '. This unexpected pivot has taught me so much about risk management, regulatory compliance, and the importance of transparency in the financial sector'],
  [/\bi('m| am) on (house arrest|parole|probation)\b/gi, 'I\'m embracing a fully remote, location-stable work arrangement with regular check-ins from my accountability partner'],
  [/\bi got (a |)parking ticket\b/gi, 'I received feedback from a municipal stakeholder about my space utilization strategy'],
  [/\bi got (a |)speeding ticket\b/gi, 'I was recognized by local authorities for my velocity and sense of urgency'],
  [/\bi got pulled over\b/gi, 'I had an unscheduled roadside strategy session with a uniformed community engagement specialist'],
  [/\bi stole\b/gi, 'I proactively acquired'],
  [/\bi lied\b/gi, 'I presented an alternative set of facts aligned with my strategic narrative'],
  [/\bi cheated\b/gi, 'I took an unconventional approach to performance optimization'],

  // Health & body
  [/\bi('m| am) hungover\b/gi, 'I\'m recovering from an intensive evening of professional relationship cultivation and stakeholder engagement'],
  [/\bi('m| am) drunk\b/gi, 'I\'m in a heightened state of creative flow following a robust team bonding session'],
  [/\bi threw up\b/gi, 'My body initiated an emergency data purge to optimize system performance'],
  [/\bi('m| am) sick\b/gi, 'I\'m undergoing an unplanned wellness recalibration'],
  [/\bi('m| am) in (the )?hospital\b/gi, 'I\'m currently at an advanced personal infrastructure maintenance facility, surrounded by dedicated support specialists'],
  [/\bi broke my\b/gi, 'I discovered the structural limitations of my'],
  [/\bi('m| am) fat\b/gi, 'I\'ve been investing heavily in my body\'s energy reserves for long-term sustainability'],
  [/\bi('m| am) going bald\b/gi, 'I\'m transitioning to a more aerodynamic personal brand'],

  // Financial disasters
  [/\bi('m| am) broke\b/gi, 'I\'m currently liquid-constrained while I restructure my personal financial portfolio'],
  [/\bi('m| am) in debt\b/gi, 'I\'ve leveraged external capital to invest aggressively in my personal growth trajectory'],
  [/\bi lost (all |)(my |the )money\b/gi, 'I underwent a comprehensive financial reset that has given me unprecedented clarity on value creation'],
  [/\bi got scammed\b/gi, 'I completed an expensive but highly educational masterclass in trust verification and due diligence'],
  [/\bi went bankrupt\b/gi, 'I executed a strategic financial restructuring to build a stronger foundation for my next chapter'],
  [/\bmy crypto\b/gi, 'my decentralized digital asset portfolio'],

  // Social embarrassment
  [/\bi got rejected\b/gi, 'I received candid market feedback that is helping me refine my value proposition'],
  [/\bi got ghosted\b/gi, 'A potential collaborator chose to transition our communication into an asynchronous, indefinitely-paused format'],
  [/\bnobody (came|showed up)\b/gi, 'We hosted an exclusive, highly curated micro-gathering'],
  [/\bi('m| am) (going to be |)homeless\b/gi, 'I\'m exploring a bold, location-independent lifestyle with minimal overhead and maximum flexibility'],
  [/\bi got (kicked|thrown) out\b/gi, 'I was given the opportunity to rapidly pivot my physical location strategy'],
  [/\bi was (wrong|mistaken)\b/gi, 'The data later revealed an opportunity to update my initial hypothesis'],
  [/\bi overslept\b/gi, 'I honored my body\'s biological intelligence by extending my rest-based performance recovery window'],
  [/\bi got lost\b/gi, 'I embarked on an unplanned exploration that expanded my geographical awareness'],
  [/\bi('m| am) lost\b/gi, 'I\'m in a dynamic wayfinding phase with multiple potential paths forward'],
];

// ── Layer 2: word-level swaps ──────────────────────────────────────────────────
//
// These are intentionally selective — only swap words where the LinkedIn
// version sounds natural in a sentence. The structural framing layers do
// the real heavy lifting. Over-swapping produces robotic jargon.

const WORD_SWAPS: [RegExp, string][] = [
  // Verbs — natural LinkedIn upgrades
  [/\bfinished\b/gi, 'wrapped up'],
  [/\bcompleted\b/gi, 'successfully completed'],
  [/\bbuilt\b/gi, 'built and shipped'],
  [/\bfixed\b/gi, 'tackled and resolved'],
  [/\blearned\b/gi, 'gained valuable insights into'],
  [/\bstarted\b/gi, 'embarked on'],
  [/\btried\b/gi, 'had the opportunity to explore'],
  [/\bhelped\b/gi, 'had the privilege of supporting'],
  [/\bworked on\b/gi, 'had the opportunity to contribute to'],
  [/\bworked\b/gi, 'collaborated'],
  [/\bcreated\b/gi, 'brought to life'],
  [/\bchanged\b/gi, 'transformed'],
  [/\bimproved\b/gi, 'elevated'],
  [/\bmade\b/gi, 'delivered'],
  [/\bgot\b/gi, 'earned'],
  [/\bused\b/gi, 'utilized'],
  [/\bsold\b/gi, 'successfully closed'],
  [/\bbought\b/gi, 'invested in'],

  // Nouns — only the clearly funny/corporate ones
  [/\bjob\b/gi, 'role'],
  [/\bboss\b/gi, 'leadership'],
  [/\boffice\b/gi, 'workspace'],
  [/\bteam\b/gi, 'amazing team'],
  [/\bmeeting\b/gi, 'alignment session'],
  [/\bmeetings\b/gi, 'alignment sessions'],
  [/\bproblem\b/gi, 'challenge'],
  [/\bproblems\b/gi, 'challenges'],
  [/\bfailure\b/gi, 'learning experience'],
  [/\bmistake\b/gi, 'growth moment'],
  [/\bmistakes\b/gi, 'growth moments'],
  [/\bcustomer\b/gi, 'partner'],
  [/\bcustomers\b/gi, 'partners'],
  [/\bproject\b/gi, 'initiative'],
  [/\bfriend\b/gi, 'connection'],
  [/\bfriends\b/gi, 'network'],
  [/\bidea\b/gi, 'vision'],
  [/\bideas\b/gi, 'insights'],

  // Adjectives — subtle upgrades
  [/\bgood\b/gi, 'amazing'],
  [/\bgreat\b/gi, 'exceptional'],
  [/\bbad\b/gi, 'challenging'],
  [/\bhard\b/gi, 'demanding'],
  [/\beasy\b/gi, 'straightforward'],
  [/\bboring\b/gi, 'routine'],
  [/\bsmall\b/gi, 'focused'],
  [/\bbig\b/gi, 'massive'],
  [/\bnew\b/gi, 'exciting new'],
  [/\bcheap\b/gi, 'cost-effective'],
  [/\bexpensive\b/gi, 'premium'],
  [/\bimpossible\b/gi, 'incredibly ambitious'],
  [/\bstupid\b/gi, 'unconventional'],
  [/\blucky\b/gi, 'fortunate'],
  [/\bfun\b/gi, 'rewarding'],
  [/\bcool\b/gi, 'remarkable'],
  [/\bnice\b/gi, 'wonderful'],

  // Relationship swaps (humorous)
  [/\bgirlfriend\b/gi, 'partner'],
  [/\bboyfriend\b/gi, 'partner'],
  [/\bwife\b/gi, 'life partner'],
  [/\bhusband\b/gi, 'life partner'],
  [/\bex\b/gi, 'former chapter'],
  [/\bcrush\b/gi, 'person I deeply admire'],

  // Daily life (subtle, not absurd)
  [/\bdog\b/gi, 'four-legged companion'],
  [/\bcat\b/gi, 'four-legged companion'],
  [/\bkids\b/gi, 'little ones'],
  [/\bchildren\b/gi, 'little ones'],
  [/\bfamily\b/gi, 'support system'],
  [/\bcoffee\b/gi, 'morning fuel'],
  [/\blunch\b/gi, 'midday reset'],
  [/\bnap\b/gi, 'power reset'],
  [/\bvacation\b/gi, 'time to recharge'],
  [/\bweekend\b/gi, 'weekend'],  // keep as-is — LinkedIn people say weekend
  [/\bhomework\b/gi, 'assignment'],
  [/\bexam\b/gi, 'assessment'],
];


// ── Layer 3: post composition ──────────────────────────────────────────────────

const FILLERS = [
  '\n\nRead that again.',
  '\n\nLet that sink in.',
  '\n\nI\'ll say it louder for the people in the back.',
  '\n\nYes, you read that right.',
  '\n\nAnd I\'m not ashamed to admit it.',
  '\n\nThis changed everything for me.',
  '\n\nWild, right?',
  '\n\nThe hard truth that nobody wants to hear.',
  '\n\nFull stop.',
  '\n\n(If you know, you know.)',
];

const POSITIVE_ELABORATIONS = [
  'This wouldn\'t have been possible without the amazing people around me.\n\nI\'m fortunate to work with people who push me to be better every single day. Not because they have to, but because that\'s the culture we\'ve built together.\n\nIf there\'s one thing I\'ve learned, it\'s this: success is always shared.',
  'Every day I show up, I\'m reminded why doing meaningful work matters.\n\nIt\'s not about the title. It\'s about the impact. The small wins that nobody sees. The quiet consistency that compounds over months and years.\n\nThat\'s the real work. And it doesn\'t need applause.',
  'It\'s moments like these that make the grind worth it.\n\nThe late nights. The early mornings. The moments of doubt where you wonder if any of it matters. All of it led here.\n\nAnd I\'d do it all again. No hesitation.',
  'The journey wasn\'t easy. But nothing worth having ever is.\n\nI share this not to boast, but to remind anyone on a similar path: the struggle is the story. And your story matters more than you think.\n\nKeep going.',
  'This is what happens when you bet on yourself.\n\nWhen everyone said it couldn\'t be done, I chose to show up anyway. Not because I was confident, but because I was committed.\n\nThere\'s a difference. And that difference changes everything.',
  'A year ago, I wouldn\'t have believed this was possible.\n\nBut here we are. And that\'s the power of consistency. Not motivation. Not talent. Just showing up when it\'s hard and trusting that the work matters.\n\nIt does.',
  'I didn\'t get here by being the smartest person in the room.\n\nI got here by staying in the room longer than everyone else. By asking questions when others stayed quiet. By choosing growth over comfort, over and over again.\n\nThat\'s the whole secret. There is no secret.',
  'The best version of this didn\'t come from a masterplan.\n\nIt came from doing the work. Day after day. Making mistakes. Learning from them. And refusing to let setbacks become stop signs.\n\nMomentum is built in the boring middle. Remember that.',
];

const NEGATIVE_ELABORATIONS = [
  'I share this not for sympathy.\n\nI share it because pretending everything is fine helps nobody. We all struggle. We all have moments where things fall apart. And the sooner we normalize saying that out loud, the sooner we can actually fix things.\n\nHonesty isn\'t weakness. It\'s the first step.',
  'Most people keep stuff like this to themselves.\n\nBut silence doesn\'t make it easier. If anything, it makes it harder. It lets the pressure build until something breaks.\n\nSo here I am, saying the quiet part out loud. Because someone else might need to hear they\'re not alone.',
  'I used to think vulnerability was weakness.\n\nNow I know it takes more courage to be honest than to keep performing. The highlight reel is easy. The real story is harder to tell.\n\nBut the real story is the one that actually connects with people.',
  'If you\'re going through something similar, know this: you\'re not alone.\n\nAnd there\'s nothing wrong with admitting where you are. The strongest people I know are the ones who can say "this is hard" without apologizing for it.\n\nThat\'s not weakness. That\'s self-awareness.',
  'Not every post has to be a win.\n\nSome posts are just honest. And that\'s enough. We don\'t always need to wrap things in a bow or extract a "lesson." Sometimes the thing just is what it is.\n\nAnd sitting with that is its own kind of strength.',
  'The hardest part isn\'t the situation itself.\n\nIt\'s pretending it doesn\'t exist. Smiling through it. Saying "I\'m fine" when you\'re not. That performance is exhausting.\n\nSo I\'m choosing honesty instead. It\'s scarier, but it\'s also lighter.',
  'I almost didn\'t post this.\n\nBut then I thought about all the people who feel the same way and say nothing. If even one person reads this and feels less alone, it was worth the discomfort.\n\nWe\'re all figuring it out. Let\'s stop pretending otherwise.',
  'Here\'s what I\'ve realized: the "tough times" are where the actual growth lives.\n\nNot in the wins. Not in the metrics. In the hard, honest, unglamorous work of facing what\'s real.\n\nThat\'s not a motivational quote. That\'s just the truth.',
];

const PATH_B_OPENERS_POSITIVE = [
  'Small update worth sharing.',
  'Something I wanted to put out there.',
  'Here\'s something I\'ve been thinking about.',
  'A moment that deserves acknowledgment.',
  'Quick reflection.',
  'Honest update.',
  'This has been on my mind.',
  'Something clicked recently.',
];

const PATH_B_OPENERS_NEGATIVE = [
  'I\'ll be honest about something.',
  'Real talk for a second.',
  'Not everything is a win. And that\'s okay.',
  'Some things need to be said out loud.',
  'Here\'s the part nobody posts about.',
  'I wasn\'t going to share this. But then I thought, why not?',
  'An honest update.',
  'Let me be real.',
];

let composeIndex = 0;
let fillerIndex = 0;
let elaborationIndex = 0;
let openerIndex = 0;

function linkedInFormat(text: string): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length <= 1) return text;

  const filler = FILLERS[fillerIndex % FILLERS.length];
  fillerIndex++;

  if (sentences.length === 2) {
    return sentences[0] + filler + '\n\n' + sentences[1];
  }

  const parts: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    parts.push(sentences[i]);
    if (i === 0) {
      parts.push(filler.trim());
    }
  }
  return parts.join('\n\n');
}

// Simple word-overlap similarity
function similarity(a: string, b: string): number {
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  let overlap = 0;
  for (const w of setA) {
    if (setB.has(w)) overlap++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 1 : overlap / union;
}

// Detect if text is negative in sentiment
function isNegativeSentiment(text: string): boolean {
  const t = text.toLowerCase();
  return /\b(don't|can't|won't|not|hate|failed|fail|bad|terrible|awful|suck|boring|annoying|frustrated|angry|sad|tired|sick|wrong|broke|lost|alone|lonely|scared|worried|anxious|stressed|depressed|overwhelmed|confused|struggling|fat|ugly|dumb|stupid|weak|slow|poor|broken|hurt|pain|mess|worse|worst|never|nobody|nothing|unhappy|miserable|regret|quit|fired|rejected|denied|missed)\b/.test(t);
}

function translateToLinkedIn(text: string): string {
  if (!text.trim()) return '';

  const original = text.trim();
  let result = text;

  // Layer 1: apply phrase-level swaps
  for (const [pattern, replacement] of PHRASE_SWAPS) {
    result = result.replace(pattern, replacement);
  }

  // Layer 2: apply word-level swaps
  for (const [pattern, replacement] of WORD_SWAPS) {
    result = result.replace(pattern, replacement);
  }

  // Layer 3: decide which path to take
  const changeRatio = 1 - (similarity(original.toLowerCase(), result.toLowerCase()));

  if (changeRatio < 0.25) {
    // Path A: swaps barely changed it — use complete narrative templates
    const composed = composeNarrative(result, composeIndex);
    composeIndex++;
    return composed;
  }

  // Path B: swaps changed it significantly — build a full post
  const isNegative = isNegativeSentiment(original);

  // Pick opener
  const openers = isNegative ? PATH_B_OPENERS_NEGATIVE : PATH_B_OPENERS_POSITIVE;
  const opener = openers[openerIndex % openers.length];
  openerIndex++;

  // Format the rewritten text
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Pick elaboration
  const pool = isNegative ? NEGATIVE_ELABORATIONS : POSITIVE_ELABORATIONS;
  const elab = pool[elaborationIndex % pool.length];
  elaborationIndex++;

  return opener + '\n\n' + result + '\n\n' + elab;
}

// ── Example prompts ────────────────────────────────────────────────────────────

const EXAMPLES = [
  'I got fired last week and I\'m looking for a job.',
  'I quit my job because my boss is terrible.',
  'We failed to hit our sales deadline.',
  'I have finished my science homework.',
  'I\'m tired and burnt out from too many meetings.',
  'I had lunch and sent an email.',
  'I made a mistake and I\'m sorry.',
  'I\'m scared and confused about my career.',
  'The startup failed and we ran out of money.',
  'I scrolled social media all day and did nothing.',
  'This meeting could\'ve been an email.',
  'I\'m bored at work.',
  'My coworkers are annoying.',
  'I dropped out and I\'m freelancing now.',
  'I have been arrested for fraud.',
  'I\'m hungover and late to work.',
  'I got ghosted after 3 interviews.',
  'I\'m broke and living with my parents.',
  'I got a speeding ticket on the way to work.',
  'Nobody came to my product launch.',
  'I made coffee this morning.',
  'I went to the gym today.',
  'I was stuck in traffic for 2 hours.',
  'I watched Netflix all weekend.',
  'I forgot my password again.',
  'I took a nap during lunch.',
  'I ate instant noodles for dinner.',
  'I argued with a stranger online.',
  'I just turned 30.',
  'I finally cleaned my room.',
  'I showed up late and nobody noticed.',
  'I survived another Monday.',
  'I changed my LinkedIn profile picture.',
  'I read a book on the train.',
  'I said no to overtime.',
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function LinkedInTranslatorPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [shareToast, setShareToast] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Read shareable URL params on mount and auto-translate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    if (t) {
      setInput(t);
      // Auto-translate the shared input
      (async () => {
        setIsTranslating(true);
        try {
          const resp = await fetch('/api/llm/linkedin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: t.trim() }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.text) { setOutput(data.text); setIsTranslating(false); return; }
          }
        } catch { /* fallback */ }
        setOutput(translateToLinkedIn(t));
        setIsTranslating(false);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTranslate() {
    if (!input.trim()) return;
    setIsTranslating(true);

    try {
      const resp = await fetch('/api/llm/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.text) {
          setOutput(data.text);
          setIsTranslating(false);
          return;
        }
      }
    } catch {
      // API failed, fall through to local translator
    }

    // Fallback: local regex-based translation
    const translated = translateToLinkedIn(input);
    setOutput(translated);
    setIsTranslating(false);
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExample(example: string) {
    setInput(example);
    setOutput('');
    textareaRef.current?.focus();
  }

  function handleReset() {
    setInput('');
    setOutput('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleTranslate();
    }
  }

  function generateShareImage(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const DPR = 2;
      const W = 1200, H = 630;
      const canvas = document.createElement('canvas');
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.scale(DPR, DPR);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 36px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('English to LinkedIn Translator', W / 2, 55);

      // Card area
      const cardX = 60, cardY = 80, cardW = W - 120, cardH = 420;
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.stroke();

      // Right panel light background
      const midX = W / 2;
      ctx.fillStyle = '#f8f8f8';
      ctx.beginPath();
      ctx.roundRect(midX + 1, cardY + 1, cardW / 2 - 1, cardH - 2, [0, 11, 11, 0]);
      ctx.fill();

      // Divider
      ctx.strokeStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.moveTo(midX, cardY);
      ctx.lineTo(midX, cardY + cardH);
      ctx.stroke();

      // Panel labels
      ctx.font = '600 14px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('Human Language', cardX + 24, cardY + 32);
      ctx.fillText('LinkedIn Language', midX + 24, cardY + 32);

      // Label underlines
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cardX + 24, cardY + 38);
      ctx.lineTo(cardX + 150, cardY + 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(midX + 24, cardY + 38);
      ctx.lineTo(midX + 160, cardY + 38);
      ctx.stroke();

      // Word wrap helper
      function wrapText(text: string, x: number, y: number, maxW: number, lineH: number) {
        const words = text.split(' ');
        let line = '';
        let curY = y;
        for (const word of words) {
          const test = line + word + ' ';
          if (ctx!.measureText(test).width > maxW && line) {
            ctx!.fillText(line.trim(), x, curY);
            line = word + ' ';
            curY += lineH;
          } else {
            line = test;
          }
        }
        ctx!.fillText(line.trim(), x, curY);
      }

      // Input text
      ctx.font = '20px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#222222';
      ctx.textAlign = 'left';
      const inputText = input || 'Type something honest...';
      wrapText(inputText, cardX + 24, cardY + 72, midX - cardX - 48, 28);

      // Output text
      const outputText = output || 'Translation will appear here...';
      ctx.fillStyle = output ? '#222222' : '#999999';
      wrapText(outputText, midX + 24, cardY + 72, W - midX - cardX - 48, 28);

      // Arrow icon in middle
      ctx.fillStyle = '#999999';
      ctx.font = '20px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('→', midX, cardY + cardH / 2 + 6);

      // Branding - styled as a link
      ctx.textAlign = 'center';
      ctx.font = '500 18px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#888888';
      ctx.fillText('generated on', W / 2 - 46, H - 40);

      ctx.font = '600 20px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#3b82f6';
      const linkText = 'veda.ng';
      const linkX = W / 2 + 30;
      ctx.fillText(linkText, linkX, H - 40);
      // Underline the link
      const linkW = ctx.measureText(linkText).width;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(linkX - linkW / 2, H - 37);
      ctx.lineTo(linkX + linkW / 2, H - 37);
      ctx.stroke();

      canvas.toBlob(resolve, 'image/png');
    });
  }

  async function copyImageToClipboard(blob: Blob): Promise<boolean> {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch {
      return false;
    }
  }

  function getShareUrl(): string {
    const base = 'https://veda.ng/linkedin-translator';
    if (!input) return base;
    return `${base}?t=${encodeURIComponent(input)}`;
  }

  function getShareText(): string {
    const variations = [
      `I typed "${input.slice(0, 60)}${input.length > 60 ? '...' : ''}" into an English to LinkedIn Translator and I can't stop laughing 😂`,
      `LinkedIn people won't like this one 😂 I translated "${input.slice(0, 50)}${input.length > 50 ? '...' : ''}" into LinkedIn-speak`,
      `The funniest tool I've found today — this English to LinkedIn Translator is too accurate 💀`,
      `POV: You discover an English to LinkedIn Translator and suddenly everything makes sense 😂`,
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }

  function showToast(msg: string) {
    setShareToast(msg);
    setTimeout(() => setShareToast(''), 4000);
  }

  async function handleDownloadImage() {
    const blob = await generateShareImage();
    if (blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'linkedin-translation.png';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('Image downloaded!');
    }
  }

  function handleCopyLink() {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    showToast('Share link copied to clipboard!');
  }

  async function handleShareX() {
    const shareText = getShareText() + '\n\nTry it yourself:';
    const url = getShareUrl();
    const blob = await generateShareImage();

    if (blob) {
      const ok = await copyImageToClipboard(blob);
      showToast(ok ? 'Screenshot copied! Paste it in your post (Ctrl+V)' : 'Screenshot saved! Attach it to your post');
      if (!ok) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'linkedin-translation.png';
        a.click();
        URL.revokeObjectURL(a.href);
      }
    }
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  async function handleShareLinkedIn() {
    const url = getShareUrl();
    const blob = await generateShareImage();

    if (blob) {
      const ok = await copyImageToClipboard(blob);
      showToast(ok ? 'Screenshot copied! Paste it in your post (Ctrl+V)' : 'Screenshot saved! Attach it to your post');
      if (!ok) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'linkedin-translation.png';
        a.click();
        URL.revokeObjectURL(a.href);
      }
    }
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  }

  function handleShareWhatsApp() {
    const text = getShareText() + '\n\nTry it yourself: ' + getShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function handleShareReddit() {
    const url = getShareUrl();
    const title = getShareText();
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
  }

  return (
    <>
    <PageLayout>
      <section aria-label="LinkedIn Translator Tool" className="py-4 md:py-5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-5xl space-y-3">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">
              English to LinkedIn Translator
            </h1>

            {/* Translator Card - Google Translate style */}
            <div ref={cardRef} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Language tabs header */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-border">
                <div className="px-5 py-2.5">
                  <span className="text-sm font-semibold text-primary border-b-2 border-primary pb-2.5 px-1">Human Language</span>
                </div>
                <div className="flex items-center justify-center px-2">
                  <div className="rounded-full border border-border p-1.5 bg-background">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="px-5 py-2.5">
                  <span className="text-sm font-semibold text-primary border-b-2 border-primary pb-2.5 px-1">LinkedIn Language</span>
                </div>
              </div>

              {/* Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[50vh]">
                {/* Input panel */}
                <div className="relative flex flex-col">
                  <textarea
                    ref={textareaRef}
                    id="translator-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 2000))}
                    onKeyDown={handleKeyDown}
                    placeholder='e.g. "I got fired last week"'
                    className="flex-1 w-full bg-transparent px-5 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-5 py-2 border-t border-border/50">
                    <button
                      id="reset-btn"
                      type="button"
                      onClick={handleReset}
                      disabled={!input && !output}
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Clear"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs text-muted-foreground">{input.length} / 2000</span>
                  </div>
                </div>

                {/* Output panel */}
                <div className="relative flex flex-col bg-secondary/20">
                  <div className="flex-1 px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                    {isTranslating ? (
                      <span className="text-muted-foreground animate-pulse">Generating LinkedIn gold...</span>
                    ) : output ? (
                      output
                    ) : (
                      <span className="text-muted-foreground/40">Translation will appear here...</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-5 py-2 border-t border-border/50">
                    <div className="flex items-center gap-2.5">
                      {output && (
                        <>
                          <button id="copy-btn" type="button" onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy text">
                            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <span className="w-px h-3.5 bg-border" />
                          <button type="button" onClick={handleShareX} className="text-muted-foreground hover:text-foreground transition-colors" title="Share on X">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </button>
                          <button type="button" onClick={handleShareLinkedIn} className="text-muted-foreground hover:text-foreground transition-colors" title="Share on LinkedIn">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </button>
                          <button type="button" onClick={handleShareWhatsApp} className="text-muted-foreground hover:text-foreground transition-colors" title="Share on WhatsApp">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          </button>
                          <button type="button" onClick={handleShareReddit} className="text-muted-foreground hover:text-foreground transition-colors" title="Share on Reddit">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
                          </button>
                          <span className="w-px h-3.5 bg-border" />
                          <button type="button" onClick={handleDownloadImage} className="text-muted-foreground hover:text-foreground transition-colors" title="Download image">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={handleCopyLink} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy share link">
                            <Link className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    {copied && <span className="text-xs text-green-500">Copied!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Translate button */}
            <div className="flex justify-center">
              <Button
                id="translate-btn"
                onClick={handleTranslate}
                disabled={!input.trim() || isTranslating}
                className="px-8"
              >
                {isTranslating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Translating...
                  </>
                ) : (
                  <>
                    Translate
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Examples */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {EXAMPLES.slice(0, 8).map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(example)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/50 transition-colors"
                >
                  {example.length > 35 ? example.slice(0, 32) + '...' : example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>

    {/* Share toast notification */}
    {shareToast && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-primary text-primary-foreground px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <Check className="h-4 w-4" />
          {shareToast}
        </div>
      </div>
    )}
    </>
  );
}

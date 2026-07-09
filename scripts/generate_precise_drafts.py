import json
import os
import shutil

json_path = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json'
md_path = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/linkedin_viral_drafts_100.md'
brain_dir = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd'

commentaries = {
    0: "This photo of Ratan Tata and Bill Gates highlights how focusing on long-term value and community impact builds organizational trust.\n\nFor teams building products, having a clear purpose aligns people. We host roles for teams focused on long-term building at hashtagweb3.com.",
    1: "This photo of Elon Musk visiting Richard Branson early in the morning before his spaceflight shows the value of having a supportive network of peers in high-stakes fields.\n\nBuilding companies in tech demands resilience, and having colleagues who understand those challenges helps. If you want to connect with other builders and teams, browse active listings on hashtagweb3.com.",
    2: "In toxic cultures, organizations promote people for results even when they destroy relationships. Emphasizing collaborative trust over individual metrics leads to healthier retention.\n\nIf you want to find developer opportunities with collaborative hiring teams, search on hashtagweb3.com.",
    3: "A resume from 1974 shows that highlighting specific projects and technical skills early on helps set a career path. Today, showing proof of work remains critical for developers.\n\nYou can use cvin.bio to create a simple, shareable portfolio page from your CV to catch the attention of tech recruiters.",
    4: "This 1994 demonstration of CD-ROM storage capacity shows that information storage and distribution scaled significantly over the last three decades.\n\nIf you want to build data systems or work on core infrastructure, you can browse open roles on hashtagweb3.com.",
    5: "As a founder, expecting salaried employees to work as much as you do remains unrealistic. Offering equity or clear boundaries helps align expectations.\n\nYou can find developer roles with different compensation structures and equity packages on hashtagweb3.com.",
    6: "Quiet blocks of time for deep work often help developers more than frequent meetings. Providing space for uninterrupted focus boosts team productivity.\n\nIf you want to showcase your projects to remote-first teams that value deep focus, upload your CV at cvin.bio.",
    7: "Young people who want to make a positive impact on the world often find that starting early in emerging tech builds deep expertise.\n\nIf you want to work on projects in fields like AI or decentralized systems, you can check open listings on hashtagweb3.com.",
    8: "Having a solid foundation in computer science and mathematics helps when building complex technical products.\n\nIf you want to highlight your projects to recruiters in tech, you can build a portfolio page from your CV at cvin.bio.",
    9: "Promoting the right people based on actual capability and leadership traits, rather than just tenure, keeps growing companies stable.\n\nIf you want to present your professional journey clearly, you can upload your CV at cvin.bio.",
    10: "Leaders who want to retain top talent must focus on making the workplace worth staying. Trust and flexibility remain the primary drivers of retention.\n\nIf you want to join transparent and structured teams, check active listings on hashtagweb3.com.",
    11: "The discussion around returning to the office centers on trust and flexibility. Output-oriented teams prioritize results over physical presence.\n\nMany remote-first teams are hiring developers now. You can search hashtagweb3.com to find open roles.",
    12: "Solving complex global challenges like climate change requires innovative technical solutions and collaborative engineering.\n\nIf you want to build systems that address real-world challenges, you can create a portfolio page at cvin.bio.",
    13: "This photo of Stephen Hawking and Bill Gates highlights that discussions with leading scientific minds help shape how we think about the future of technology.\n\nLearning from pioneering researchers assists builders in creating complex products. You can find roles on hashtagweb3.com.",
    14: "The babble effect suggests that talkative individuals sometimes emerge as leaders, even when their actual contribution varies. Technical teams prioritize output over meeting participation.\n\nIf you value output-oriented cultures, you can check roles on hashtagweb3.com.",
    15: "This reflection on quantum computing breakthroughs reminds us that emerging hardware paradigms will require alternative software architectures.\n\nIf you want to work on cutting-edge developer tools, you can search for active listings on hashtagweb3.com.",
    16: "Research shows that remote work flexibility improves developer productivity and reduces burnout. High-performing teams focus on output.\n\nIf you are looking for remote developer opportunities, you can browse open roles on hashtagweb3.com.",
    17: "Empathy and kindness in management build sustainable team cultures. Supporting employees leads to better long-term retention.\n\nIf you want to join collaborative remote teams, you can browse active listings on hashtagweb3.com.",
    18: "Fixing a toxic workplace from the bottom remains difficult if leaders at the top do not commit to change.\n\nIf you want to find teams that prioritize healthy working environments, you can search hashtagweb3.com.",
    19: "Producing high-quality documentation and sharing technical journeys help users understand complex software products.\n\nIf you want to showcase your technical writing or software projects, you can set up a profile at cvin.bio.",
    20: "Focusing on building software during negative news cycles helps developers maintain focus and make progress.\n\nIf you want to build a portfolio that highlights your coding projects to recruiters, check cvin.bio.",
    21: "Prioritizing mental fitness and supportive leadership helps builders sustain focus on demanding technical tasks.\n\nIf you want to connect with teams that support development, you can upload a profile at cvin.bio.",
    22: "Looking at long-term technological progress reminds us that software adoption happens in major cycles.\n\nIf you want to find developer opportunities in emerging software sectors, you can search hashtagweb3.com.",
    23: "Lighthearted moments and humor help maintain positive team dynamics during challenging engineering sprints.\n\nIf you want to work with collaborative developer teams, you can find listings on hashtagweb3.com.",
    24: "Setting clear boundaries and maintaining remote flexibility help teams perform consistently. Output remains the best metric of success.\n\nIf you want to highlight your remote work projects to recruiters, you can set up a profile at cvin.bio.",
    25: "Melinda French Gates celebrating Justice Ketanji Brown Jackson reminds us that structured growth paths help support diverse leadership.\n\nIf you want to showcase your experience to teams with clear career paths, you can upload a CV at cvin.bio.",
    26: "Maintaining consistent business principles and integrity helps organizations succeed over decades.\n\nIf you are looking for long-term teams with clear goals, you can find active listings on hashtagweb3.com.",
    27: "Explaining emerging technology models like Web3 often feels foreign to observers at first. Demonstrating value remains the key to adoption.\n\nIf you want to work on emerging tech protocols, you can browse open roles on hashtagweb3.com.",
    28: "Warren Buffett advising partners to aim high highlights the power of focusing on long-term, high-impact goals.\n\nIf you want to join teams that tackle large technical challenges, you can check open listings on hashtagweb3.com.",
    29: "Building a better world requires creating transparent software systems and open-source contributions.\n\nIf you want to highlight your open-source contributions to recruiters, you can build a portfolio at cvin.bio.",
    30: "Celebrating early achievements and recognizing young talent inspire creative teams to perform at their best.\n\nIf you want to share your technical portfolio with companies, you can set up a profile at cvin.bio.",
    31: "Focusing on compassion alongside ambition leads to stronger startup cultures and better team alignment.\n\nIf you want to join developer teams with transparent hiring structures, search hashtagweb3.com.",
    32: "Managers who want to evaluate performance fairly must look at consistent effort rather than just short-term outcomes.\n\nIf you want to showcase your project management skills, you can build a portfolio page at cvin.bio.",
    33: "Reading books and pursuing continuous learning help engineers keep up with fast-moving industry changes.\n\nIf you want to apply your technical skills to different roles, you can check open positions on hashtagweb3.com.",
    34: "Discussing compensation transparently during hiring helps set clear expectations. Many tech platforms now list salary ranges upfront.\n\nIf you want to find roles with transparent details, check listings on hashtagweb3.com.",
    35: "Structured leadership transitions and mentorship support long-term company stability during growth phases.\n\nIf you are looking for roles in growing companies, you can browse listings on hashtagweb3.com.",
    36: "Early hands-on experimentation with hardware and software often drives technical curiosity and innovation.\n\nIf you want to showcase your developer projects and side experiments, you can upload your CV at cvin.bio.",
    37: "Evaluating builders based on their unique strengths, rather than a single rigid standard, helps teams excel.\n\nIf you want to match with teams that value your specific technical background, upload a profile at cvin.bio.",
    38: "Promoting equity in team growth and supporting inclusive hiring lead to stable, resilient engineering organizations.\n\nIf you want to present your professional journey to inclusive teams, you can build a portfolio at cvin.bio.",
    39: "The growth of AI initiatives and technical talent in emerging hubs shows the global scale of software development.\n\nIf you want to find roles in fast-growing technical spaces, you can browse open positions on hashtagweb3.com.",
    40: "Technical research and development lead to useful engineering breakthroughs in software and hardware.\n\nIf you want to present your research or coding projects to recruiters, you can create a portfolio page at cvin.bio.",
    41: "Continuous learning and reading remain essential habits for engineers who want to stay ahead of technical trends.\n\nIf you want to build a profile to share your learning journey, you can upload your CV at cvin.bio.",
    42: "Focusing on other opportunities rather than closed doors helps developers progress in their careers.\n\nIf you want to match with active hiring teams in tech, you can upload your CV at cvin.bio.",
    43: "Launching moonshot projects and setting ambitious goals drive technological innovation in aerospace and software engineering.\n\nIf you want to join teams working on high-impact projects, you can browse open roles on hashtagweb3.com.",
    44: "Learning from failures and maintaining a growth mindset remain critical traits for software builders.\n\nIf you want to showcase your project experience and lessons learned, you can set up a profile at cvin.bio.",
    45: "Understanding human behavior helps developers design user interfaces and software products.\n\nIf you want to showcase your product design or engineering work, you can create a portfolio page at cvin.bio.",
    46: "Writers who analyze leadership transitions note that clear communication keeps organizations stable.\n\nIf you want to find developer opportunities with transparent hiring teams, you can browse active listings on hashtagweb3.com.",
    47: "Empowering management styles shine light on team paths rather than forcing followers down a single route.\n\nIf you want to join organizations that support developer autonomy, search hashtagweb3.com.",
    48: "Mastering delegation and trusting team members remain essential practices for technical leaders.\n\nIf you want to showcase your engineering leadership projects, you can upload your CV at cvin.bio.",
    50: "Exploring augmented reality interfaces shows how frontend engineering continues to expand into spatial computing.\n\nIf you are an engineer interested in building spatial user interfaces, you can upload your CV at cvin.bio.",
    51: "Finding tasks that align with your actual technical interests resolves issues with motivation.\n\nIf you want to find developer roles that match your background, you can set up a portfolio at cvin.bio.",
    52: "Introverted leaders often succeed by managing quiet, focused development teams and encouraging deep work.\n\nIf you are looking for remote developer roles that value focus, browse hashtagweb3.com.",
    53: "Navigating career transitions requires a clear focus on core skills rather than a rigid map.\n\nIf you want to highlight your technical skills to active hiring teams, check cvin.bio.",
    54: "Focusing on sharing tangible insights rather than chasing metrics helps builders establish professional credibility.\n\nYou can use cvin.bio to build a clean, project-focused portfolio page from your CV.",
    55: "Leaders who support their team members and demonstrate direct care build stable, loyal engineering teams.\n\nIf you want to join collaborative remote teams, check open listings on hashtagweb3.com.",
    56: "Creative problem solving and finding different technical solutions remain critical for growing companies.\n\nIf you want to highlight your projects to recruiters in tech, you can build a portfolio page from your CV at cvin.bio.",
    57: "Setting boundaries and managing workloads prevent developer burnout and improve long-term software quality.\n\nIf you are looking for remote roles with healthy balance, browse open listings on hashtagweb3.com.",
    58: "Recognizing individual contributions and celebrating team milestones improve overall retention.\n\nIf you want to join transparent and supportive teams, search active listings on hashtagweb3.com.",
    59: "Reflecting on career lessons helps builders guide their professional growth and make better long-term decisions.\n\nIf you want to present your career path clearly to tech recruiters, upload your CV at cvin.bio.",
    60: "Following a structured deep work routine helps developers write better code and maintain focus.\n\nYou can showcase your deep work projects and CV by building a shareable portfolio page at cvin.bio.",
    61: "Writers who analyze organizational transitions point out that transparent communication keeps teams aligned.\n\nIf you want to find developer opportunities with collaborative hiring teams, search hashtagweb3.com.",
    62: "Providing quiet focus spaces rather than open offices helps developers write code without distraction.\n\nIf you are looking for remote roles that support uninterrupted deep work, check hashtagweb3.com.",
    63: "Thriving teams require managers who appreciate efforts and recognize individual contributions.\n\nIf you want to join teams that value outcomes and support builders, search active listings on hashtagweb3.com.",
    64: "Collaborating with developers in global hubs helps companies build international software products.\n\nIf you want to work with distributed remote teams, you can find listings on hashtagweb3.com.",
    65: "Prioritizing mental health over a demanding job prevents long-term burnout and sustains technical performance.\n\nIf you want to transition to a balanced remote role, you can upload your CV at cvin.bio.",
    66: "Building recovery time into daily schedules helps developers maintain high focus and write clean code.\n\nYou can showcase your project background to remote-first teams by uploading your CV at cvin.bio.",
    67: "Philanthropists who address systemic inequities often focus on building long-term local infrastructure.\n\nIf you want to join teams building impactful software products, browse open listings on hashtagweb3.com.",
    68: "Connecting remote teams through transparent communication channels improves engagement and alignment.\n\nIf you want to find developer opportunities with collaborative teams, search hashtagweb3.com.",
    69: "Developing emotional intelligence helps technical leaders manage conflicts and align engineering teams.\n\nIf you want to showcase your leadership experience, you can upload your CV at cvin.bio.",
    70: "Understanding the root causes of procrastination helps developers manage their tasks and hit deadlines.\n\nYou can set up a simple, project-focused portfolio page from your CV at cvin.bio.",
    71: "Global leaders demonstrating resilience during crises remind us of the importance of clear communication under pressure.\n\nIf you want to show your project experience to teams that value resilience, upload your CV at cvin.bio.",
    72: "Prioritizing workplace satisfaction and clear alignment leads to higher output and healthier team dynamics.\n\nIf you are looking to make a transition to a remote role, check listings on hashtagweb3.com.",
    73: "Providing psychological safety and supporting team members during stress reduce developer burnout.\n\nIf you want to build a profile for remote-first teams that value safety, upload your CV at cvin.bio.",
    74: "Finding the right cofounders and partners who share your goals remains a critical step for startup growth.\n\nIf you want to showcase your startup contributions to potential partners, upload your CV at cvin.bio.",
    75: "Decentralized projects and local technical initiatives solve real-world problems in creative ways.\n\nIf you want to work on decentralized systems, you can check open listings on hashtagweb3.com.",
    76: "Minimizing digital noise helps developers focus on coding projects and build deeper expertise.\n\nYou can build a clean, project-focused portfolio page from your CV at cvin.bio.",
    77: "Servant leadership models prioritize supporting employees to help them perform at their best.\n\nIf you want to join developer teams with transparent hiring structures, search hashtagweb3.com.",
    78: "Achieving major engineering milestones requires collaborative effort and rigorous technical execution.\n\nIf you want to showcase your contribution to complex engineering projects, upload your CV at cvin.bio.",
    79: "Assessing candidate character based on how they treat others helps companies hire collaborative developers.\n\nIf you want to present your professional journey clearly, you can upload your CV at cvin.bio.",
    80: "Building team camaraderie through regular check-ins supports a healthy distributed team culture.\n\nIf you want to match with collaborative remote teams in tech, check cvin.bio.",
    81: "Measuring success by overall quality of life rather than just achievements prevents long-term developer burnout.\n\nIf you want to showcase your work-life balance projects, you can build a portfolio at cvin.bio.",
    82: "Tackling complex global health issues demands scientific innovation and coordinated engineering on multiple fronts.\n\nIf you want to work on high-impact tech systems, you can check open listings on hashtagweb3.com.",
    83: "Empathetic communication from leaders helps align teams during times of organizational transition.\n\nIf you want to find developer opportunities with collaborative hiring teams, check hashtagweb3.com.",
    84: "Technical curiosity and introverted learning often guide young builders toward software engineering.\n\nIf you want to highlight your projects to recruiters in tech, you can build a portfolio page at cvin.bio.",
    85: "Reflecting on career goals helps builders find roles that align with their personal values.\n\nIf you want to share your professional CV with tech recruiters, upload it at cvin.bio.",
    86: "Maintaining a growth mindset and learning tools keep software developers competitive.\n\nIf you want to build a portfolio to showcase your ongoing learning, check cvin.bio.",
    87: "Ambitious aerospace projects and technical moonshots push the boundaries of engineering.\n\nIf you want to join teams working on high-impact systems, check open listings on hashtagweb3.com.",
    88: "Scaling technical solutions to address clean water issues shows the power of social entrepreneurship.\n\nIf you want to showcase your startup contributions to recruiters, upload your CV at cvin.bio.",
    89: "Focusing on steady, patient progress helps developers achieve long-term career growth in tech.\n\nIf you want to transition to a balanced remote role, upload your CV at cvin.bio.",
    90: "Understanding the drivers of team engagement helps managers reduce quiet quitting and improve retention.\n\nIf you are looking for remote roles with transparent expectations, browse hashtagweb3.com.",
    91: "Having a bold vision for technical products guides long-term building and engineering cycles.\n\nIf you want to join teams focused on long-term software growth, search hashtagweb3.com.",
    92: "Leaders who prioritize supporting their team members build collaborative and stable companies.\n\nIf you want to join collaborative remote teams, check active listings on hashtagweb3.com.",
    93: "Demonstrating confident humility and admitting when you do not know something improve team alignment.\n\nIf you want to build a profile to share with teams that value humility, upload your CV at cvin.bio.",
    94: "Preventing developer burnout remains essential for keeping high-performing stars on your engineering team.\n\nIf you are looking for developer opportunities with healthy balance, browse hashtagweb3.com.",
    95: "Approaching difficult conversations transparently helps resolve team conflicts in software development.\n\nIf you want to join organizations that value transparent communication, search hashtagweb3.com.",
    96: "Generative AI design tools show how computer science continues to assist creative expression.\n\nIf you want to showcase your AI engineering or design projects, check cvin.bio.",
    97: "Improving educational systems with technology helps train the next generation of software builders.\n\nIf you want to showcase your educational software projects, upload your CV at cvin.bio.",
    98: "Leveling the playing field in tech hiring helps connect diverse talent with open developer roles.\n\nYou can use cvin.bio to build a clean portfolio page that highlights your coding projects.",
    99: "Pursuing continuous learning in coding and system design remains essential for software developers.\n\nIf you want to present your engineering projects to recruiters, you can create a portfolio page at cvin.bio."
}

def run():
    with open(json_path) as f:
        posts = json.load(f)
    print(f"Loaded {len(posts)} posts.")
    
    md_content = f"# Top {len(posts)} LinkedIn Drafts (Re-framed for Vedang's Account)\n\n"
    md_content += f"This document contains the {len(posts)} LinkedIn posts. All personal anecdotes, birthdays, and family posts have been reframed into **business case studies, leadership commentaries, and industry reflections** that naturally connect the images with your brand, focusing on **AI, blockchain, and hiring**, and naturally integrating **hashtagweb3.com** or **cvin.bio**.\n\n"
    md_content += "To approve and proceed with scheduling, please review the drafts and reply to this message. Once approved, the posts will be scheduled sequentially.\n\n"
    md_content += "---\n\n"
    
    for idx, p in enumerate(posts):
        draft_text = commentaries.get(idx, "Focusing on outcomes and maintaining clear expectations are common traits of high-performing teams.\n\nIf you are looking for developer opportunities with transparent hiring teams, you can browse open roles on hashtagweb3.com.")
        image_name = f"li-viral-image-{idx + 1}.jpg"
        image_path = os.path.join(brain_dir, image_name)
        has_image = os.path.exists(image_path)
        
        md_content += f"## Post #{idx + 1}: Commentary Draft (Source: {p['author']})\n"
        md_content += f"* **Original Likes**: {p['likes']:,}\n"
        md_content += f"* **Original Link**: [LinkedIn Post]({p['post_url']})\n"
        
        if has_image:
            md_content += f"* **Media Asset**: `{image_name}`\n\n"
            md_content += f"### Image Preview\n"
            md_content += f"![Image Preview]({image_path})\n\n"
        else:
            md_content += f"* **Media Asset**: `{image_name}` (Pending Scraper Download)\n\n"
            
        md_content += f"### Original Content\n"
        md_content += f"> {p['content']}\n\n"
        md_content += f"### Proposed Rewritten Copy (Commentary Style)\n"
        md_content += f"```text\n"
        md_content += f"{draft_text}\n"
        md_content += f"```\n\n"
        md_content += f"---\n\n"
        
    with open(md_path, 'w') as f:
        f.write(md_content)
    print("Regenerated drafts at:", md_path)

if __name__ == '__main__':
    run()

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  heroColor: string;
  author?: string;
  sections: { heading: string; body: string }[];
}

export const articles: Article[] = [
  {
    slug: "finasteride-vs-minoxidil",
    title: "Finasteride vs Minoxidil: Which Hair Loss Treatment Works Better?",
    description:
      "Finasteride and minoxidil are the two proven hair loss treatments — but they work in completely different ways. Here's how they compare, and why many people use both.",
    category: "Comparison",
    readTime: "6 min read",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-12",
    heroColor: "#EEF4FB",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "Two Treatments, Two Different Jobs",
        body: 'Finasteride and minoxidil are the only two medications FDA-approved for pattern hair loss, and they attack the problem from opposite angles. Finasteride blocks DHT — the hormone that shrinks genetically susceptible follicles — so it stops loss at the source. Minoxidil doesn\'t touch hormones at all; it stimulates follicles and extends the growth phase by improving blood flow to the scalp. Because they work through different mechanisms, they\'re not really competitors — they\'re a team.',
      },
      {
        heading: "Finasteride: Stopping Loss at the Source",
        body: 'Finasteride is a daily oral pill (1mg) that reduces scalp DHT by around 60–70%. In studies, roughly 90% of men either stopped losing hair or regrew some, making it the most effective single treatment for slowing male pattern baldness. It\'s men-only and takes 3–6 months to show effect. Learn more in <a href="/articles/does-finasteride-work">does finasteride work</a> and <a href="/articles/finasteride-side-effects">finasteride side effects</a>.',
      },
      {
        heading: "Minoxidil: Stimulating Regrowth",
        body: 'Minoxidil (the active ingredient in Rogaine) is a topical foam or solution — and increasingly a low-dose oral pill — that works for both men and women. It won\'t stop the hormonal cause of hair loss, but it can thicken and regrow hair by keeping follicles in their active growth phase longer. See <a href="/articles/does-minoxidil-work">does minoxidil work</a> for what to expect.',
      },
      {
        heading: "Which Should You Choose?",
        body: 'For men with male pattern baldness, finasteride is usually the foundation because it addresses the cause. Minoxidil is often added for extra regrowth — and studies show the combination works better than either alone. Women, who can\'t use finasteride, typically start with minoxidil. Not sure where to start? <a href="/find-your-match">Take our quick quiz</a> or compare providers like <a href="/hims-vs-keeps">Hims vs Keeps</a>, both of which offer either or both.',
      },
    ],
  },
  {
    slug: "does-finasteride-work",
    title: "Does Finasteride Really Work for Hair Loss?",
    description:
      "Finasteride is the most effective single treatment for male pattern baldness — here's the evidence, how long it takes, and what results to realistically expect.",
    category: "Science",
    readTime: "5 min read",
    publishedAt: "2026-08-02",
    updatedAt: "2026-08-12",
    heroColor: "#F0F7F0",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "What the Evidence Shows",
        body: "Finasteride is well-studied and FDA-approved for male pattern hair loss. In the landmark trials, about 90% of men taking finasteride either stopped losing hair or saw regrowth over two years, and hair counts improved meaningfully versus placebo. It's widely considered the most effective single medication for slowing and reversing male pattern baldness.",
      },
      {
        heading: "How It Works",
        body: 'Male pattern hair loss is driven by DHT (dihydrotestosterone), a hormone that gradually miniaturizes follicles in genetically susceptible areas. Finasteride blocks the enzyme that converts testosterone to DHT, cutting scalp DHT by roughly 60–70%. Less DHT means follicles are no longer under constant attack. See how it compares to minoxidil in our <a href="/articles/finasteride-vs-minoxidil">finasteride vs minoxidil</a> guide.',
      },
      {
        heading: "How Long It Takes",
        body: "Finasteride is not fast. Most men see reduced shedding by 3–4 months, visible improvement around 6 months, and full results by about 12 months. The most important thing is consistency — the medication only works while you keep taking it. Stop, and DHT levels rebound and loss resumes within months.",
      },
      {
        heading: "Is It Right for You?",
        body: 'Finasteride is for men only and isn\'t suitable for everyone — review the <a href="/articles/finasteride-side-effects">side effects</a> and talk to a licensed provider first. If you\'re a good candidate, telehealth services make it easy to get: compare options like <a href="/reviews/hims">Hims</a>, <a href="/reviews/keeps">Keeps</a>, and <a href="/reviews/roman">Roman</a>, or <a href="/find-your-match">find your match</a>.',
      },
    ],
  },
  {
    slug: "does-minoxidil-work",
    title: "Does Minoxidil Work? What to Expect from Rogaine and Generics",
    description:
      "Minoxidil is a proven regrowth treatment for men and women — here's how it works, how long it takes, and why the early 'shed' is normal.",
    category: "Science",
    readTime: "5 min read",
    publishedAt: "2026-08-03",
    updatedAt: "2026-08-12",
    heroColor: "#FBF3EE",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "The Proven Regrowth Treatment",
        body: "Minoxidil (brand name Rogaine, plus many generics) is FDA-approved and works for both men and women. Studies consistently show it increases hair count and thickness, especially at the crown. The 5% strength is generally more effective than 2%, and it comes as a foam, a liquid solution, or — increasingly — a low-dose oral pill prescribed off-label.",
      },
      {
        heading: "How It Works",
        body: 'Unlike finasteride, minoxidil doesn\'t affect hormones. It\'s a vasodilator that increases blood flow to the scalp and, more importantly, extends the growth (anagen) phase of the hair cycle, so follicles stay productive longer and produce thicker strands. That\'s why it pairs so well with finasteride — see <a href="/articles/finasteride-vs-minoxidil">finasteride vs minoxidil</a>.',
      },
      {
        heading: "The Early Shed Is Normal",
        body: "Many people panic in the first 2–8 weeks when they notice more shedding. This 'dread shed' is actually a good sign: minoxidil pushes old hairs out to make room for new growth. It passes, and visible improvement typically appears around 3–4 months, with fuller results by 6–12 months.",
      },
      {
        heading: "Oral or Topical?",
        body: 'Topical minoxidil is available over the counter but requires a daily scalp routine. Low-dose oral minoxidil is prescription-only and more convenient, though it needs medical oversight. We break down the trade-offs in <a href="/articles/oral-vs-topical-minoxidil">oral vs topical minoxidil</a>. Providers like <a href="/reviews/hims">Hims</a> and <a href="/reviews/happyhead">Happy Head</a> offer both.',
      },
    ],
  },
  {
    slug: "finasteride-side-effects",
    title: "Finasteride Side Effects: What You Should Know",
    description:
      "Finasteride is generally well-tolerated, but it has real side effects and important safety warnings — especially for women. Here's an honest overview.",
    category: "Guide",
    readTime: "5 min read",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-12",
    heroColor: "#F5F0FA",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "How Common Are Side Effects?",
        body: "For most men, finasteride is well-tolerated. In clinical trials, sexual side effects — reduced libido, erectile difficulty, or lower ejaculate volume — occurred in roughly 2–4% of men, only slightly more than placebo, and typically resolved after stopping the medication (and often even while continuing it). Still, these effects are real and worth discussing with a provider.",
      },
      {
        heading: "The Rare but Debated Effects",
        body: "A small number of men report persistent side effects that continue after stopping finasteride, sometimes called 'post-finasteride syndrome.' This is uncommon and still debated in the medical community, but it's a reason to make an informed decision with a licensed clinician rather than treating finasteride casually.",
      },
      {
        heading: "Critical Warning for Women",
        body: 'Finasteride is for men only. Women who are pregnant or may become pregnant must not take it or even handle crushed or broken tablets, because it can cause birth defects in a developing male fetus. Women seeking hair loss treatment should look at <a href="/articles/womens-hair-loss-treatment">women\'s hair loss options</a>, which center on minoxidil.',
      },
      {
        heading: "Making a Safe Choice",
        body: 'Because finasteride affects hormones, proper medical screening matters. A good telehealth provider reviews your history before prescribing and offers follow-up. Compare providers with strong clinical oversight in our <a href="/reviews">reviews</a>, or <a href="/find-your-match">take our quiz</a>.',
      },
    ],
  },
  {
    slug: "oral-vs-topical-minoxidil",
    title: "Oral vs Topical Minoxidil: Which Is Right for You?",
    description:
      "Low-dose oral minoxidil has become a popular alternative to the messy topical routine. Here's how the two compare on convenience, results, and safety.",
    category: "Comparison",
    readTime: "5 min read",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-12",
    heroColor: "#EEF4FB",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "The Convenience Gap",
        body: "Topical minoxidil works, but the daily routine trips a lot of people up: applying foam or solution once or twice a day, waiting for it to dry, and dealing with residue. Low-dose oral minoxidil is simply a small daily pill — no scalp routine — which makes consistency far easier. Since these treatments only work when used regularly, convenience genuinely affects results.",
      },
      {
        heading: "Effectiveness",
        body: "Both forms are effective. Some people find oral minoxidil produces stronger, more even results because absorption is consistent and it isn't limited to where you remembered to apply it. Topical, on the other hand, delivers the drug right to the scalp with minimal systemic exposure.",
      },
      {
        heading: "Safety Differences",
        body: 'Topical minoxidil is available over the counter and mostly causes local issues like scalp irritation or dryness. Oral minoxidil is prescription-only and needs medical oversight: because it was originally a blood-pressure drug, it can affect blood pressure and cause increased body hair (hypertrichosis) or fluid retention in some people. A provider will assess whether it\'s appropriate. See <a href="/articles/does-minoxidil-work">does minoxidil work</a> for the basics.',
      },
      {
        heading: "Which to Pick",
        body: 'If you value simplicity and have no contraindications, oral minoxidil (via a provider) is compelling. If you\'d rather avoid an oral medication, topical is proven and accessible. Providers like <a href="/reviews/hims">Hims</a> and <a href="/reviews/happyhead">Happy Head</a> can prescribe oral options after a consult.',
      },
    ],
  },
  {
    slug: "dutasteride-vs-finasteride",
    title: "Dutasteride vs Finasteride for Hair Loss",
    description:
      "Dutasteride is a stronger DHT blocker than finasteride, used off-label for hair loss. Here's when it makes sense — and the trade-offs.",
    category: "Comparison",
    readTime: "5 min read",
    publishedAt: "2026-08-06",
    updatedAt: "2026-08-12",
    heroColor: "#F0F7F0",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "The Key Difference",
        body: "Both drugs lower DHT to fight male pattern hair loss, but they do it to different degrees. Finasteride blocks one form of the enzyme that makes DHT and reduces scalp DHT by around 60–70%. Dutasteride blocks both forms and can reduce DHT by more than 90%, making it the more potent option.",
      },
      {
        heading: "Approved vs Off-Label",
        body: 'Finasteride is FDA-approved specifically for hair loss. Dutasteride is FDA-approved for enlarged prostate (BPH) and used off-label for hair loss, though it\'s an established, evidence-backed choice that many providers prescribe when finasteride isn\'t enough. See <a href="/articles/does-finasteride-work">does finasteride work</a> for the finasteride baseline.',
      },
      {
        heading: "Trade-Offs to Consider",
        body: "Greater DHT suppression can mean better results for some men — but potentially a higher chance of the same hormonal side effects finasteride can cause. Dutasteride also has a much longer half-life, so it stays in your system far longer. That's why it's typically a step up after finasteride rather than a first choice.",
      },
      {
        heading: "How to Decide",
        body: 'Dutasteride is usually considered when finasteride alone hasn\'t delivered enough result. It\'s a conversation to have with a licensed provider who can weigh the benefits against the risks for your situation. <a href="/find-your-match">Find a provider</a> that offers advanced options.',
      },
    ],
  },
  {
    slug: "how-long-hair-loss-treatment-takes",
    title: "How Long Does It Take for Hair Loss Treatment to Work?",
    description:
      "Hair loss treatment is a marathon, not a sprint. Here's a realistic month-by-month timeline for finasteride and minoxidil results.",
    category: "Guide",
    readTime: "4 min read",
    publishedAt: "2026-08-07",
    updatedAt: "2026-08-12",
    heroColor: "#FBF3EE",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "Set Your Expectations",
        body: "The single biggest reason people give up on hair loss treatment is impatience. Hair grows slowly — about half an inch a month — and treatments work by gradually shifting follicles back into healthy growth cycles. That takes months, not weeks. Judging results before 6 months almost always leads to disappointment.",
      },
      {
        heading: "A Realistic Timeline",
        body: "Months 1–2: little visible change; minoxidil users may notice temporary extra shedding (a normal sign it's working). Months 3–4: shedding slows and early regrowth begins. Month 6: most people see clear improvement. Month 12: results are near their peak. From there, treatment maintains what you've regained.",
      },
      {
        heading: "It Only Lasts While You Keep Going",
        body: 'Both finasteride and minoxidil are ongoing treatments. If you stop, the underlying process resumes and gains are typically lost within 6–12 months. That\'s why picking a provider with an easy, reliable subscription matters — compare cost and convenience in <a href="/articles/hair-loss-treatment-cost">how much treatment costs</a>.',
      },
      {
        heading: "Staying Consistent",
        body: 'Consistency beats intensity. A simple routine you\'ll actually stick to — a daily pill, or a combined spray — outperforms a complex one you abandon. See <a href="/hims-vs-keeps">Hims vs Keeps</a> for two easy, subscription-based options.',
      },
    ],
  },
  {
    slug: "male-pattern-baldness-explained",
    title: "Male Pattern Baldness: Causes, Stages, and Treatment",
    description:
      "Male pattern baldness affects most men eventually. Here's what causes it, how it progresses, and what actually stops it.",
    category: "Science",
    readTime: "5 min read",
    publishedAt: "2026-08-08",
    updatedAt: "2026-08-12",
    heroColor: "#F5F0FA",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "What Causes It",
        body: "Male pattern baldness (androgenetic alopecia) is driven by genetics and hormones. In genetically susceptible men, the hormone DHT gradually miniaturizes follicles — each growth cycle produces a finer, shorter hair until the follicle stops producing visible hair altogether. It's why it typically starts at the hairline and crown.",
      },
      {
        heading: "How It Progresses",
        body: "Hair loss usually follows a recognizable pattern: a receding hairline (often an 'M' shape), then thinning at the crown, which can eventually meet in the middle. The Norwood scale describes these stages from 1 (no loss) to 7 (extensive loss). The earlier you act, the more hair there is to protect.",
      },
      {
        heading: "What Actually Stops It",
        body: 'The proven treatments target the two levers you can control: DHT and follicle activity. Finasteride lowers DHT to halt the cause; minoxidil stimulates regrowth. Used together, they\'re the evidence-backed standard of care. Read <a href="/articles/finasteride-vs-minoxidil">finasteride vs minoxidil</a> to understand the combo.',
      },
      {
        heading: "Acting Early Matters",
        body: 'Treatments are far better at keeping the hair you have than regrowing hair that\'s long gone. If you\'re noticing early thinning, that\'s the best time to start. <a href="/find-your-match">Take our quiz</a> or browse the <a href="/">top-rated providers</a>.',
      },
    ],
  },
  {
    slug: "hair-loss-treatment-cost",
    title: "How Much Does Hair Loss Treatment Cost?",
    description:
      "From cheap generics to premium custom formulas, here's what hair loss treatment actually costs through telehealth providers.",
    category: "Guide",
    readTime: "4 min read",
    publishedAt: "2026-08-09",
    updatedAt: "2026-08-12",
    heroColor: "#EEF4FB",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "The Short Answer",
        body: "Hair loss treatment is more affordable than most people expect. Through telehealth providers, generic finasteride typically runs about $20–$30 per month and minoxidil around $15 per month. Combined routines, brand-name products, or dermatologist-formulated custom compounds cost more — generally $35–$79+ per month.",
      },
      {
        heading: "What's Included",
        body: "Telehealth pricing is usually a flat monthly subscription that bundles the medication, an online provider consultation, and ongoing support and adjustments — with discreet home delivery. No insurance is required. Longer plans (3, 6, or 12 months) usually lower the effective monthly price.",
      },
      {
        heading: "Generic vs Custom",
        body: 'The cheapest route is generic finasteride and minoxidil, which are the same proven medications the brands use. At the premium end, providers like <a href="/reviews/happyhead">Happy Head</a> formulate custom topical or oral compounds tailored to your pattern of loss. Both work — it comes down to budget and how personalized you want to get.',
      },
      {
        heading: "Getting the Best Value",
        body: 'The best value isn\'t always the lowest price — it\'s the plan you\'ll actually stick with. Compare cost and convenience across providers in our <a href="/reviews">reviews</a>, or see a head-to-head like <a href="/keeps-vs-roman">Keeps vs Roman</a>.',
      },
    ],
  },
  {
    slug: "womens-hair-loss-treatment",
    title: "Women's Hair Loss: Treatment Options That Work",
    description:
      "Women lose hair too — but the treatment approach is different. Here's what's safe, what's effective, and where finasteride fits (and doesn't).",
    category: "Guide",
    readTime: "5 min read",
    publishedAt: "2026-08-10",
    updatedAt: "2026-08-12",
    heroColor: "#F0F7F0",
    author: "TopHairLoss Team",
    sections: [
      {
        heading: "It's More Common Than You Think",
        body: "Female pattern hair loss affects a large share of women, often as diffuse thinning across the top of the scalp rather than a receding hairline. Causes range from genetics and hormones to thyroid issues, stress, and iron deficiency — so a medical evaluation is especially important for women to rule out treatable underlying causes.",
      },
      {
        heading: "Minoxidil Is the Foundation",
        body: 'Minoxidil is FDA-approved for women and is the first-line treatment. It stimulates regrowth and thickening the same way it does for men, in topical or (via a provider) low-dose oral form. See <a href="/articles/does-minoxidil-work">does minoxidil work</a> and <a href="/articles/oral-vs-topical-minoxidil">oral vs topical minoxidil</a>.',
      },
      {
        heading: "Why Not Finasteride?",
        body: "Standard finasteride is not used in women of childbearing potential because of the risk of birth defects, and it's generally less central to female pattern loss. Some providers prescribe other options for specific cases, but that's a specialized decision — one reason women benefit from a provider that treats them specifically.",
      },
      {
        heading: "Finding the Right Provider",
        body: 'Many hair loss telehealth services are men-only. Providers like <a href="/reviews/happyhead">Happy Head</a> treat both men and women with custom, dermatologist-formulated options. <a href="/find-your-match">Take our quiz</a> to find a good fit.',
      },
    ],
  },
];

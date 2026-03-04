<script>
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';
  import { Badge } from '$lib/components/ui/badge';

  // Email for submissions
  const submissionEmail = "admin@solarvipani.com";

  // Topics we accept
  const acceptedTopics = [
    {
      title: "Solar Technology & Innovation",
      examples: "New panel technologies, inverter advances, battery storage solutions, smart grid integration"
    },
    {
      title: "Installation Best Practices",
      examples: "Roof assessment, system sizing, wiring standards, safety protocols, maintenance tips"
    },
    {
      title: "Solar Financing & Economics",
      examples: "ROI calculations, subsidy programs, financing options, payback period analysis"
    },
    {
      title: "Policy & Regulations",
      examples: "PM Surya Ghar Yojana updates, net metering policies, state-level incentives, compliance"
    },
    {
      title: "Case Studies & Projects",
      examples: "Real installation projects, challenges overcome, energy savings achieved, lessons learned"
    },
    {
      title: "Sustainability & Impact",
      examples: "Carbon footprint reduction, environmental benefits, grid independence, clean energy transition"
    },
    {
      title: "Consumer Education",
      examples: "System selection guides, vendor evaluation, common mistakes to avoid, warranty understanding"
    },
    {
      title: "Commercial & Industrial Solar",
      examples: "Large-scale installations, business benefits, energy management, corporate sustainability"
    }
  ];

  // Editorial guidelines
  const guidelines = [
    {
      title: "Originality Required",
      description: "All content must be 100% original and unpublished elsewhere. We check for plagiarism."
    },
    {
      title: "Expert-Level Knowledge",
      description: "Articles should demonstrate deep industry expertise and practical experience."
    },
    {
      title: "Data-Driven & Accurate",
      description: "Include credible data, statistics, and cite reliable sources. Technical accuracy is mandatory."
    },
    {
      title: "Non-Promotional Tone",
      description: "Focus on education and value, not product pitches or company promotions."
    },
    {
      title: "Clear & Accessible Writing",
      description: "Write for homeowners and businesses, not just technical experts. Explain jargon."
    },
    {
      title: "Length & Structure",
      description: "1,200-2,500 words ideal. Use headings, bullet points, and clear sections."
    },
    {
      title: "Visual Support",
      description: "Include diagrams, charts, or photos when relevant (with proper attribution)."
    },
    {
      title: "Indian Context",
      description: "Content should be relevant to the Indian solar market, regulations, and climate."
    }
  ];

  // Contributor benefits
  const benefits = [
    {
      icon: "👥",
      title: "Reach Qualified Audience",
      description: "Connect with thousands of homeowners and businesses actively researching solar solutions"
    },
    {
      icon: "🏆",
      title: "Build Authority",
      description: "Establish yourself as a thought leader in India's growing renewable energy sector"
    },
    {
      icon: "🔗",
      title: "Professional Visibility",
      description: "Author bio with link to your professional profile or company website"
    },
    {
      icon: "📊",
      title: "Share Impact",
      description: "Educate the market and accelerate India's solar adoption journey"
    }
  ];
</script>

<svelte:head>
  <title>Contribute as a Solar Expert | Write for Solar Vipani</title>
  <meta
    name="description"
    content="Share your solar expertise with thousands of Indian homeowners and businesses. Contribute original articles on solar technology, installation, policy, and sustainability. Guest writing opportunity for solar professionals."
  />
  <meta
    name="keywords"
    content="solar guest post, write for solar energy, solar expert contributor, renewable energy writing, solar industry articles, guest blogging solar"
  />
  <link rel="canonical" href="https://solarvipani.com/in/write-for-us" />

  <!-- Open Graph -->
  <meta property="og:title" content="Contribute as a Solar Expert | Write for Solar Vipani" />
  <meta property="og:description" content="Share your solar expertise with thousands of Indian homeowners and businesses researching solar solutions." />
  <meta property="og:url" content="https://solarvipani.com/in/write-for-us" />
  <meta property="og:type" content="website" />
</svelte:head>

<main class="bg-background text-foreground">
  <div class="max-w-5xl mx-auto px-[theme(--container-padding)] sm:px-[theme(--container-padding)] md:px-[theme(--container-padding)]">
    <!-- Hero Section -->
    <section class="py-[theme(--card-padding-y)] text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-3 text-primary">
        Contribute as a Solar Expert
      </h1>
      <p class="text-lg md:text-xl font-semibold mb-3 text-foreground-secondary">
        Share Your Knowledge. Shape India's Solar Future.
      </p>
      <p class="text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-foreground-secondary">
        We invite solar professionals, engineers, researchers, and sustainability experts to contribute original,
        high-quality content that helps homeowners and businesses make informed solar decisions.
      </p>
    </section>

    <!-- Why Contribute Section -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">Why Contribute to Solar Vipani?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[theme(--card-gap)]">
        {#each benefits as benefit}
          <Card class="card-interactive text-center">
            <CardContent class="pt-[theme(--card-padding-y)]">
              <div class="text-4xl mb-3">{benefit.icon}</div>
              <h3 class="text-lg font-semibold mb-3 text-foreground">{benefit.title}</h3>
              <p class="text-sm leading-relaxed text-foreground-secondary">{benefit.description}</p>
            </CardContent>
          </Card>
        {/each}
      </div>
    </section>

    <!-- Who We're Looking For -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">Who We're Looking For</h2>
      <Card>
        <CardContent class="pt-[theme(--card-padding-y)]">
          <p class="text-base md:text-lg mb-[theme(--card-gap)] text-foreground-secondary">We welcome contributions from credentialed professionals in the solar and renewable energy industry:</p>
          <div class="space-y-[theme(--card-gap)]">
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Solar Installation Professionals</strong>
              <p class="text-sm text-foreground-secondary">Licensed installers with hands-on experience in residential and commercial projects</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Electrical & Solar Engineers</strong>
              <p class="text-sm text-foreground-secondary">Technical experts in PV systems, inverters, batteries, and grid integration</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Energy Consultants & Advisors</strong>
              <p class="text-sm text-foreground-secondary">Professionals guiding customers on system design, financing, and ROI</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Researchers & Academics</strong>
              <p class="text-sm text-foreground-secondary">Scientists studying solar technology, efficiency, sustainability, or policy</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Policy & Regulatory Experts</strong>
              <p class="text-sm text-foreground-secondary">Professionals with deep knowledge of solar subsidies, net metering, and compliance</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <span class="text-xl font-bold text-success flex-shrink-0">✓</span>
            <div>
              <strong class="block mb-1 text-foreground">Sustainability Professionals</strong>
              <p class="text-sm text-foreground-secondary">Corporate sustainability managers, ESG consultants, and clean energy advocates</p>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </section>

    <!-- Topics We Accept -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">What Topics We Accept</h2>
      <p class="text-base md:text-lg leading-relaxed mb-[theme(--card-gap)] text-foreground-secondary">
        We publish expert content that educates, informs, and empowers our audience. Here are some topic areas we're interested in:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[theme(--card-gap)]">
        {#each acceptedTopics as topic}
          <Card class="border-l-4 border-primary">
            <CardContent class="pt-3">
              <h3 class="text-lg font-semibold mb-2 text-primary">{topic.title}</h3>
              <p class="text-sm text-foreground-secondary"><strong>Examples:</strong> {topic.examples}</p>
            </CardContent>
          </Card>
        {/each}
      </div>
      <Alert class="bg-primary/10 border-l-4 border-primary">
        <AlertDescription>
          <strong>Note:</strong> We prioritize actionable, practical content over generic overviews. Case studies and real-world examples are especially valued.
        </AlertDescription>
      </Alert>
    </section>

    <!-- Editorial Guidelines -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">Editorial Guidelines</h2>
      <p class="text-base md:text-lg leading-relaxed mb-[theme(--card-gap)] text-foreground-secondary">
        To maintain the highest quality standards, all submissions must meet these requirements:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        {#each guidelines as guideline}
          <Card>
            <CardContent class="pt-3">
              <h3 class="text-base font-semibold mb-2 text-foreground">{guideline.title}</h3>
              <p class="text-sm text-foreground-secondary">{guideline.description}</p>
            </CardContent>
          </Card>
        {/each}
      </div>
    </section>

    <!-- Link Policy -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">Link Policy</h2>
      <div class="space-y-[theme(--card-gap)]">
        <Card class="border-l-4 border-success">
          <CardContent class="pt-[theme(--card-padding-y)]">
            <h3 class="text-lg font-semibold mb-3 text-foreground">✓ What We Allow</h3>
            <ul class="space-y-2">
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-success font-bold">✓</span>Links to credible research papers, government resources, or industry reports
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-success font-bold">✓</span>References to relevant technical standards or certification bodies
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-success font-bold">✓</span>Author bio with one link to your professional LinkedIn or company website
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-success font-bold">✓</span>Links that genuinely add value to the reader's understanding
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card class="border-l-4 border-destructive">
          <CardContent class="pt-[theme(--card-padding-y)]">
            <h3 class="text-lg font-semibold mb-3 text-foreground">✗ What We Reject</h3>
            <ul class="space-y-2">
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-destructive font-bold">✗</span>Promotional links to products, services, or unrelated websites
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-destructive font-bold">✗</span>Affiliate links or commercial referral URLs
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-destructive font-bold">✗</span>Excessive self-promotion or company advertising within content
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-destructive font-bold">✗</span>Link exchanges, paid links, or SEO link-building schemes
              </li>
              <li class="text-sm pl-3 text-foreground-secondary">
                <span class="inline-block mr-2 text-destructive font-bold">✗</span>Links to low-quality or irrelevant sources
              </li>
            </ul>
          </CardContent>
        </Card>
        <Alert class="bg-warning/10 border-l-4 border-warning">
          <AlertDescription>
            <strong>⚠️ Important:</strong> We are not a platform for link building or SEO backlinks.
            Articles submitted primarily for link placement will be rejected immediately. Our focus is educational value, not search rankings.
          </AlertDescription>
        </Alert>
      </div>
    </section>

    <!-- Submission Process -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">How to Submit</h2>
      <div class="space-y-[theme(--card-gap)]">
        {#each [
          {num: 1, title: 'Send a Pitch', content: `Email us at <a href="mailto:${submissionEmail}">${submissionEmail}</a> with:`, items: ['Proposed article title and brief outline (3-5 bullet points)', 'Your credentials and relevant experience', 'Links to previous published work (if available)']},
          {num: 2, title: 'Receive Feedback', content: 'Our editorial team will review your pitch within 5-7 business days and respond with:', items: ['Approval to proceed with a full draft', 'Suggestions for refinement or alternative angles', 'Rejection if the topic doesn\'t align with our audience needs']},
          {num: 3, title: 'Submit Full Article', content: 'If approved, submit your complete article as:', items: ['Google Doc (with comment access) or Word document', 'Include all images, charts, or diagrams with proper attribution', 'Add a 50-75 word author bio with one professional link']},
          {num: 4, title: 'Review & Publication', content: 'We will:', items: ['Review for accuracy, clarity, and editorial standards', 'Request revisions if needed (you retain final approval)', 'Publish approved articles within 2-3 weeks', 'Notify you when your article goes live']}
        ] as step}
          <div class="flex gap-4 items-start">
            <div class="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
              {step.num}
            </div>
            <Card class="flex-1">
              <CardContent class="pt-3">
                <h3 class="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                <p class="text-sm mb-3 text-foreground-secondary">{@html step.content}</p>
                <ul class="list-disc list-inside space-y-1">
                  {#each step.items as item}
                    <li class="text-sm text-foreground-secondary">{item}</li>
                  {/each}
                </ul>
              </CardContent>
            </Card>
          </div>
        {/each}
      </div>
    </section>

    <!-- Important Disclaimers -->
    <section class="mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-[theme(--card-gap)] text-primary">Important Notes</h2>
      <Card>
        <CardContent class="pt-[theme(--card-padding-y)]">
          <ul class="space-y-3 divide-y divide-border">
            <li class="pt-3 first:pt-0 text-sm text-foreground-secondary">
              <strong class="text-foreground">Editorial Control:</strong> We reserve the right to edit submissions for clarity, length, grammar, and style. Major changes will be shared with you for approval.
            </li>
            <li class="pt-3 text-sm text-foreground-secondary">
              <strong class="text-foreground">Rejection Rights:</strong> We may decline articles that don't meet our quality standards, are overly promotional, or lack relevance to our audience.
            </li>
            <li class="pt-3 text-sm text-foreground-secondary">
              <strong class="text-foreground">No Payment:</strong> This is an unpaid guest contribution opportunity. The primary benefit is audience reach and professional visibility.
            </li>
            <li class="pt-3 text-sm text-foreground-secondary">
              <strong class="text-foreground">Content Ownership:</strong> You retain copyright of your work, but grant Solar Vipani non-exclusive rights to publish and promote it.
            </li>
            <li class="pt-3 text-sm text-foreground-secondary">
              <strong class="text-foreground">No Guaranteed Publication:</strong> Submission does not guarantee publication. We publish based on editorial merit and audience value.
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <!-- CTA Section -->
    <section class="text-center bg-gradient-to-r from-primary to-primary/90 rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] md:p-[theme(--card-gap)] text-primary-foreground shadow-[theme(--shadow-lg)] mb-[theme(--card-gap)]">
      <h2 class="text-2xl md:text-3xl font-bold mb-3 text-primary-foreground">Ready to Share Your Expertise?</h2>
      <p class="text-base md:text-lg mb-[theme(--card-gap)] max-w-xl mx-auto">
        Help homeowners and businesses across India make informed solar decisions.
        Your insights can accelerate the clean energy transition.
      </p>
      <p class="text-base md:text-lg">
        Email us at: <a href="mailto:{submissionEmail}" class="underline hover:no-underline">{submissionEmail}</a>
      </p>
    </section>
  </div>
</main>

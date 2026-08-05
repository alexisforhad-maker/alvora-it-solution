import type { ServiceDetail } from "@/types";

/**
 * Full content for every Service Detail page, keyed by slug. This is
 * the interim content source (Master Blueprint content rule: no
 * fabricated clients, testimonials, stats, certifications, or
 * partnerships) — every claim here is a capability/process statement,
 * not an unverifiable fact. Once the Services Manager (Admin/CMS
 * phase) exists, this file's shape becomes the seed data for that
 * database table.
 */
export const servicesContent: Record<string, ServiceDetail> = {
  "custom-software-development": {
    slug: "custom-software-development",
    name: "Custom Software Development",
    shortDescription: "Bespoke systems built around how your business actually works.",
    icon: "custom-software-development",
    problem:
      "Off-the-shelf software forces your business to adapt to its limitations. As you grow, workarounds pile up, manual processes multiply, and the tools meant to help start slowing you down.",
    solutionOverview:
      "We design and build custom software around your actual workflows — not a generic template. From internal tools to client-facing platforms, every system we build is scoped to solve a specific business problem, built to scale, and documented so your team can maintain it long-term.",
    included: [
      "Requirements discovery and technical scoping",
      "System architecture and database design",
      "Custom backend and frontend development",
      "Third-party integrations (payments, CRMs, internal tools)",
      "Quality assurance and testing",
      "Deployment, documentation, and handover",
    ],
    benefits: [
      "Software shaped around your workflow, not the other way around",
      "Full ownership of your codebase — no vendor lock-in",
      "Built to scale as your business grows",
      "Clean, documented code your team (or ours) can maintain",
    ],
    approach: [
      { title: "Discovery", description: "We map your current workflow and pain points before writing a single line of code." },
      { title: "Architecture", description: "We design a system architecture built for your actual scale, not a generic template." },
      { title: "Iterative Build", description: "Development happens in reviewable milestones, with your feedback shaping each stage." },
      { title: "Handover", description: "You receive full documentation and ownership — no dependency traps." },
    ],
    technologies: ["Next.js", "Node.js", "NestJS", "PostgreSQL", "TypeScript", "Docker"],
    relatedServiceSlugs: ["cloud-solutions-api-integration", "erp-crm-development", "maintenance-technical-support"],
    relatedIndustrySlugs: ["finance-fintech", "logistics-supply-chain", "professional-services"],
    faqs: [
      {
        question: "How is custom software different from using off-the-shelf tools?",
        answer:
          "Off-the-shelf tools solve generic problems. Custom software is built around your specific workflow, so you're not forced into workarounds as your business grows.",
      },
      {
        question: "Do we own the code once the project is complete?",
        answer:
          "Yes. You receive full ownership of the codebase and documentation — there's no vendor lock-in.",
      },
      {
        question: "Can you work with our existing systems?",
        answer:
          "In most cases, yes. We assess your current stack during discovery and design integrations where needed rather than requiring a full rebuild.",
      },
    ],
  },

  "website-design-development": {
    slug: "website-design-development",
    name: "Website Design & Development",
    shortDescription: "Fast, modern websites engineered for conversion and growth.",
    icon: "website-design-development",
    problem:
      "A slow, dated, or poorly structured website costs you credibility before a visitor ever reads your content — and makes it harder for search engines to find you in the first place.",
    solutionOverview:
      "We design and build fast, modern, SEO-optimized websites with a custom design system — never a templated theme. Every site is built for performance, accessibility, and conversion from the first line of code.",
    included: [
      "Custom UI/UX design (no page-builder templates)",
      "Responsive, mobile-first development",
      "SEO foundation (metadata, schema, sitemap)",
      "Performance optimization",
      "Custom CMS integration for easy content updates",
      "Accessibility (WCAG AA) compliance",
    ],
    benefits: [
      "A site that reflects your brand, not a template",
      "Fast load times that keep visitors — and search engines — happy",
      "Content you can update yourself through a custom CMS",
      "Built to convert visitors into leads",
    ],
    approach: [
      { title: "Design", description: "We create an original visual direction tailored to your brand, not a recycled theme." },
      { title: "Build", description: "We develop with modern, performance-first frameworks." },
      { title: "Optimize", description: "SEO, accessibility, and performance are built in, not bolted on afterward." },
      { title: "Launch & Support", description: "We deploy your site and remain available for ongoing updates." },
    ],
    technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    relatedServiceSlugs: ["ui-ux-design", "ecommerce-development", "it-consulting-digital-transformation"],
    relatedIndustrySlugs: ["professional-services", "real-estate", "travel-hospitality"],
    faqs: [
      {
        question: "Do you use website builders like WordPress or Wix?",
        answer:
          "No. We build custom, production-grade websites with modern frameworks — this gives you better performance, security, and long-term flexibility than a page-builder platform.",
      },
      {
        question: "Will I be able to update content myself?",
        answer:
          "Yes. We build a custom CMS layer so your team can update text, images, and pages without needing a developer for routine changes.",
      },
      {
        question: "How do you handle SEO?",
        answer:
          "SEO is built into the architecture from day one — clean URLs, metadata, structured data, and performance optimization, not an afterthought.",
      },
    ],
  },

  "ecommerce-development": {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    shortDescription: "Storefronts that scale with your catalog and your customers.",
    icon: "ecommerce-development",
    problem:
      "Generic e-commerce platforms often can't handle unique catalog structures, custom checkout flows, or integrations your business actually needs — and customization gets expensive fast.",
    solutionOverview:
      "We build e-commerce platforms tailored to how you actually sell — whether that's a custom storefront, a headless commerce architecture, or a hybrid approach. Built for real transaction volume, not a demo store.",
    included: [
      "Storefront design and development",
      "Payment gateway integration",
      "Inventory and order management systems",
      "Custom checkout flows",
      "Third-party integrations (shipping, ERP, marketing tools)",
      "Performance optimization for high-traffic periods",
    ],
    benefits: [
      "A storefront built around your actual catalog and sales process",
      "Reliable performance during high-traffic periods",
      "Integrations with the tools you already use",
      "Room to grow without a platform migration",
    ],
    approach: [
      { title: "Commerce Strategy", description: "We map your catalog, checkout, and fulfillment needs before choosing an architecture." },
      { title: "Build", description: "We develop the storefront, checkout, and admin/inventory systems." },
      { title: "Integrate", description: "Payments, shipping, and marketing tools are connected and tested." },
      { title: "Launch & Scale", description: "We monitor performance at launch and plan for growth from day one." },
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Cloud Payment Gateways"],
    relatedServiceSlugs: ["website-design-development", "cloud-solutions-api-integration", "ai-automation"],
    relatedIndustrySlugs: ["ecommerce-retail", "manufacturing", "logistics-supply-chain"],
    faqs: [
      {
        question: "Can you integrate with our existing inventory or ERP system?",
        answer:
          "Yes — we assess your existing systems during discovery and build integrations rather than requiring a full replacement wherever possible.",
      },
      {
        question: "Do you build on existing platforms like Shopify, or fully custom?",
        answer:
          "We evaluate this case by case — sometimes a custom build is the right call, other times integrating with an existing platform makes more sense. We'll recommend what fits your catalog and budget.",
      },
      {
        question: "How do you handle high-traffic periods like sales events?",
        answer:
          "We performance-test and architect for scale from the start, so your storefront stays fast and stable under increased load.",
      },
    ],
  },

  "mobile-app-development": {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    shortDescription: "Native and cross-platform apps for iOS and Android.",
    icon: "mobile-app-development",
    problem:
      "A mobile app built without a clear technical strategy often means duplicated effort for iOS and Android, inconsistent user experience, and expensive maintenance down the line.",
    solutionOverview:
      "We build mobile apps using the approach best suited to your goals — native for maximum performance, or cross-platform for faster, more cost-effective delivery across both iOS and Android.",
    included: [
      "Platform strategy (native vs. cross-platform)",
      "UI/UX design for mobile",
      "App development for iOS and Android",
      "Backend API development",
      "App Store and Google Play submission support",
      "Post-launch maintenance and updates",
    ],
    benefits: [
      "The right technical approach for your goals and budget",
      "Consistent experience across iOS and Android",
      "A backend built to support your app as it grows",
      "Ongoing support after launch, not just a handoff",
    ],
    approach: [
      { title: "Strategy", description: "We determine the right platform approach based on your goals, timeline, and budget." },
      { title: "Design", description: "We design mobile-first interfaces that feel native to each platform." },
      { title: "Development", description: "We build the app and its backend in parallel, testing continuously." },
      { title: "Launch & Support", description: "We support app store submission and remain available post-launch." },
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Node.js"],
    relatedServiceSlugs: ["ui-ux-design", "cloud-solutions-api-integration", "custom-software-development"],
    relatedIndustrySlugs: ["travel-hospitality", "healthcare", "logistics-supply-chain"],
    faqs: [
      {
        question: "Should we build native apps or a cross-platform app?",
        answer:
          "It depends on your goals. Native offers maximum performance per platform; cross-platform frameworks let us build for iOS and Android from one codebase, usually faster and more cost-effectively. We'll recommend based on your specific needs.",
      },
      {
        question: "Do you handle App Store and Google Play submission?",
        answer: "Yes — we support you through the submission and review process for both platforms.",
      },
      {
        question: "What happens after the app launches?",
        answer:
          "We offer ongoing maintenance and support to keep your app current with OS updates and evolving requirements.",
      },
    ],
  },

  "ui-ux-design": {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    shortDescription: "Interfaces that are as usable as they are impressive.",
    icon: "ui-ux-design",
    problem:
      "A visually appealing interface that's confusing to use will frustrate the people you're trying to convert — and a usable interface that looks dated undermines the trust your product needs to earn.",
    solutionOverview:
      "We design interfaces that are both genuinely usable and visually distinctive — grounded in user research, tested against real use cases, and built to be handed directly to development without ambiguity.",
    included: [
      "User research and journey mapping",
      "Wireframing and information architecture",
      "High-fidelity UI design",
      "Interactive prototyping",
      "Design system creation",
      "Developer handoff documentation",
    ],
    benefits: [
      "Interfaces grounded in how people actually use your product",
      "A design system that keeps future pages consistent",
      "Reduced back-and-forth during development",
      "A visual identity that feels distinctly yours",
    ],
    approach: [
      { title: "Research", description: "We understand your users and their goals before designing a single screen." },
      { title: "Wireframe", description: "We map structure and flow before adding visual polish." },
      { title: "Design", description: "We create high-fidelity designs and a reusable design system." },
      { title: "Prototype & Test", description: "We validate designs with interactive prototypes before development begins." },
    ],
    technologies: ["Figma", "Design Systems", "Accessibility (WCAG AA)"],
    relatedServiceSlugs: ["website-design-development", "mobile-app-development", "custom-software-development"],
    relatedIndustrySlugs: ["professional-services", "healthcare", "education"],
    faqs: [
      {
        question: "Do you design and develop, or just design?",
        answer:
          "We do both — but we're equally comfortable handing off a fully documented design system to your existing development team if that's what you need.",
      },
      {
        question: "How do you make sure the design is actually usable, not just attractive?",
        answer:
          "We start with user research and journey mapping, and validate key flows with interactive prototypes before development begins.",
      },
      {
        question: "Will we get a reusable design system, not just individual screens?",
        answer:
          "Yes — every UI/UX engagement includes a design system so future pages and features stay visually consistent.",
      },
    ],
  },

  "ai-automation": {
    slug: "ai-automation",
    name: "AI Automation & Business Process Automation",
    shortDescription: "Automate repetitive workflows and free your team to focus on growth.",
    icon: "ai-automation",
    problem:
      "Manual, repetitive processes — data entry, approvals, reporting — quietly consume hours of your team's time every week and introduce errors that compound as you scale.",
    solutionOverview:
      "We identify high-impact repetitive processes in your business and build automation — from rule-based workflow automation to AI-powered tools — that removes manual effort without removing human oversight where it matters.",
    included: [
      "Process audit and automation opportunity mapping",
      "Workflow automation development",
      "AI-powered tools (document processing, chatbots, data extraction)",
      "Integration with your existing tools and systems",
      "Testing and safeguards for automated processes",
      "Ongoing monitoring and refinement",
    ],
    benefits: [
      "Fewer hours spent on repetitive manual work",
      "Reduced human error in high-volume processes",
      "Automation built around your actual workflow, not a generic tool",
      "Human oversight retained where it matters most",
    ],
    approach: [
      { title: "Process Audit", description: "We identify which repetitive processes are worth automating first." },
      { title: "Design", description: "We design the automation logic and any AI components needed." },
      { title: "Build & Integrate", description: "We build and connect the automation to your existing tools." },
      { title: "Monitor & Refine", description: "We monitor real-world performance and refine as needed." },
    ],
    technologies: ["Node.js", "Workflow Automation", "OpenAI API", "Cloud Functions"],
    relatedServiceSlugs: ["cloud-solutions-api-integration", "erp-crm-development", "it-consulting-digital-transformation"],
    relatedIndustrySlugs: ["logistics-supply-chain", "finance-fintech", "manufacturing"],
    faqs: [
      {
        question: "How do you decide what to automate first?",
        answer:
          "We start with a process audit to find the repetitive tasks costing the most time or introducing the most errors — then prioritize based on impact.",
      },
      {
        question: "Does automation replace our team?",
        answer:
          "No — the goal is to remove repetitive manual work so your team can focus on higher-value tasks, with human oversight retained wherever it matters.",
      },
      {
        question: "Can automation connect to the tools we already use?",
        answer: "In most cases, yes. We assess your existing stack and build integrations rather than requiring a switch.",
      },
    ],
  },

  "cloud-solutions-api-integration": {
    slug: "cloud-solutions-api-integration",
    name: "Cloud Solutions & API Integration",
    shortDescription: "Scalable cloud architecture and seamless system integrations.",
    icon: "cloud-solutions-api-integration",
    problem:
      "Disconnected systems mean duplicated data entry, inconsistent records, and manual work reconciling information across tools — and infrastructure that isn't built to scale becomes a bottleneck as you grow.",
    solutionOverview:
      "We design cloud architecture built for reliability and scale, and connect your systems through well-documented APIs — so your tools share data automatically instead of requiring manual syncing.",
    included: [
      "Cloud architecture design and setup",
      "API design and development",
      "Third-party system integrations",
      "Infrastructure security hardening",
      "Monitoring and alerting setup",
      "Documentation for ongoing maintenance",
    ],
    benefits: [
      "Systems that share data automatically, not manually",
      "Infrastructure built to scale with your growth",
      "Reduced risk through security best practices",
      "Clear documentation your team can rely on",
    ],
    approach: [
      { title: "Assessment", description: "We audit your current infrastructure and integration needs." },
      { title: "Architecture", description: "We design cloud infrastructure and API contracts built for scale." },
      { title: "Build & Integrate", description: "We implement and connect systems, testing thoroughly." },
      { title: "Monitor", description: "We set up monitoring so issues are caught before they become outages." },
    ],
    technologies: ["AWS", "Vercel", "Docker", "REST & GraphQL APIs"],
    relatedServiceSlugs: ["custom-software-development", "ai-automation", "maintenance-technical-support"],
    relatedIndustrySlugs: ["finance-fintech", "logistics-supply-chain", "manufacturing"],
    faqs: [
      {
        question: "Which cloud providers do you work with?",
        answer:
          "We work primarily with AWS and Vercel, and select the right combination of services based on your specific performance, security, and budget needs.",
      },
      {
        question: "Can you integrate with legacy or on-premise systems?",
        answer:
          "In many cases, yes — we assess feasibility during the discovery phase and design an integration approach accordingly.",
      },
      {
        question: "How do you handle security for cloud infrastructure?",
        answer:
          "We follow modern security best practices — least-privilege access, encrypted data in transit and at rest, and regular monitoring.",
      },
    ],
  },

  "erp-crm-development": {
    slug: "erp-crm-development",
    name: "ERP & CRM System Development",
    shortDescription: "Custom ERP and CRM systems built around your operations.",
    icon: "erp-crm-development",
    problem:
      "Generic ERP and CRM platforms often force your team into workflows that don't match how you actually operate — leading to workarounds, spreadsheets on the side, and low adoption.",
    solutionOverview:
      "We build custom ERP and CRM systems designed around your actual operations and sales process — not a one-size-fits-all template — so your team adopts the system instead of working around it.",
    included: [
      "Operations and workflow mapping",
      "Custom module development (sales, inventory, HR, finance)",
      "Role-based access control",
      "Reporting and analytics dashboards",
      "Integration with existing tools",
      "Team training and documentation",
    ],
    benefits: [
      "A system that matches how your team actually works",
      "Higher adoption than generic, one-size-fits-all platforms",
      "Reporting built around the metrics you actually track",
      "Room to add modules as your operations evolve",
    ],
    approach: [
      { title: "Operations Mapping", description: "We document your actual workflows before designing any system." },
      { title: "Module Design", description: "We design each module (sales, inventory, etc.) around your real process." },
      { title: "Build & Integrate", description: "We develop and connect the system to your existing tools." },
      { title: "Train & Support", description: "We train your team and remain available for ongoing support." },
    ],
    technologies: ["Next.js", "PostgreSQL", "Node.js", "Role-Based Access Control"],
    relatedServiceSlugs: ["custom-software-development", "ai-automation", "it-consulting-digital-transformation"],
    relatedIndustrySlugs: ["real-estate", "manufacturing", "professional-services"],
    faqs: [
      {
        question: "Why build a custom ERP/CRM instead of using an existing platform?",
        answer:
          "Generic platforms often require your team to adapt to their workflow. A custom system is designed around how your business already operates, which tends to improve adoption.",
      },
      {
        question: "Can the system grow with our business?",
        answer:
          "Yes — we design with modularity in mind, so new modules or features can be added as your operations evolve.",
      },
      {
        question: "Do you provide training for our team?",
        answer: "Yes, team training and documentation are included as part of every ERP/CRM engagement.",
      },
    ],
  },

  "it-consulting-digital-transformation": {
    slug: "it-consulting-digital-transformation",
    name: "IT Consulting & Digital Transformation",
    shortDescription: "Strategic guidance to modernize how your business runs.",
    icon: "it-consulting-digital-transformation",
    problem:
      "Many businesses know their current systems and processes are holding them back, but aren't sure which changes will actually move the needle — or in what order to tackle them.",
    solutionOverview:
      "We assess your current technology and operations, and provide a clear, prioritized roadmap for modernization — grounded in your actual business goals, not generic best practices.",
    included: [
      "Technology and process audit",
      "Digital transformation roadmap",
      "Technology stack recommendations",
      "Prioritization based on business impact",
      "Implementation planning and oversight",
      "Ongoing advisory support",
    ],
    benefits: [
      "A clear, prioritized roadmap instead of guesswork",
      "Recommendations grounded in your actual goals",
      "Reduced risk in technology decisions",
      "A partner who can also implement the roadmap",
    ],
    approach: [
      { title: "Audit", description: "We assess your current technology, processes, and pain points." },
      { title: "Roadmap", description: "We build a prioritized plan based on business impact and feasibility." },
      { title: "Implementation Support", description: "We help execute the roadmap, whether that's us building it or advising your team." },
      { title: "Ongoing Advisory", description: "We remain available as your business and technology needs evolve." },
    ],
    technologies: ["Technology Audits", "Architecture Planning", "Cloud & Automation Strategy"],
    relatedServiceSlugs: ["custom-software-development", "cloud-solutions-api-integration", "ai-automation"],
    relatedIndustrySlugs: ["professional-services", "finance-fintech", "education"],
    faqs: [
      {
        question: "Do you only advise, or can you also implement the roadmap?",
        answer:
          "Both — we can provide strategic advisory only, or take on implementation ourselves once the roadmap is defined.",
      },
      {
        question: "How long does a typical digital transformation engagement take?",
        answer:
          "It depends on scope — the audit and roadmap phase is typically the fastest part; implementation timelines vary based on what's being built or changed.",
      },
      {
        question: "Is this only for large enterprises?",
        answer:
          "No — we work with startups and SMEs just as often, tailoring the scope of the roadmap to your size and stage.",
      },
    ],
  },

  "maintenance-technical-support": {
    slug: "maintenance-technical-support",
    name: "Maintenance & Technical Support",
    shortDescription: "Ongoing care that keeps your systems fast, secure, and current.",
    icon: "maintenance-technical-support",
    problem:
      "Software that isn't actively maintained accumulates security vulnerabilities, performance issues, and compatibility problems — often invisibly, until something breaks at the worst possible time.",
    solutionOverview:
      "We provide ongoing maintenance and technical support for systems we've built and, in many cases, systems built by others — keeping your software secure, current, and performing well long after launch.",
    included: [
      "Regular security updates and patching",
      "Performance monitoring and optimization",
      "Bug fixes and issue resolution",
      "Feature updates and enhancements",
      "Uptime monitoring and alerting",
      "Priority support response",
    ],
    benefits: [
      "Systems that stay secure and current over time",
      "Faster resolution when issues arise",
      "One partner for both new development and ongoing care",
      "Predictable monthly support rather than reactive firefighting",
    ],
    approach: [
      { title: "Assessment", description: "We review your current system's health, security, and technical debt." },
      { title: "Support Plan", description: "We set up a maintenance plan matched to your system's needs." },
      { title: "Ongoing Care", description: "We handle updates, monitoring, and issue resolution on an ongoing basis." },
      { title: "Continuous Reporting", description: "You receive regular updates on system health and work completed." },
    ],
    technologies: ["Monitoring Tools", "CI/CD Pipelines", "Security Patching"],
    relatedServiceSlugs: ["cloud-solutions-api-integration", "custom-software-development", "it-consulting-digital-transformation"],
    relatedIndustrySlugs: ["healthcare", "finance-fintech", "ecommerce-retail"],
    faqs: [
      {
        question: "Do you only support systems Alvora built?",
        answer:
          "We primarily support systems we've built, but we can take on maintenance for existing systems after an initial technical assessment.",
      },
      {
        question: "What's included in a monthly retainer?",
        answer:
          "Typically security updates, monitoring, bug fixes, and a set number of support hours — the specifics are scoped to your system during onboarding.",
      },
      {
        question: "How quickly do you respond to urgent issues?",
        answer:
          "Response times are defined in your support agreement, with priority handling for critical issues affecting live systems.",
      },
    ],
  },
};

import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Anurag',
    lastName: 'Singh',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Senior Software Engineer',
    avatar: '/images/avatar.jpg',
    location: 'Asia/Kolkata',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
    residence: 'India',
    languages: []  // optional: Leave the array empty if you don't want to display languages
}

const newsletter = {
    display: false,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>I occasionally write about design, technology, and share thoughts on the intersection of creativity and engineering.</>
}

const social = [
    // Links are automatically displayed.
    // Import new icons in /once-ui/icons.ts
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/anurag-s01',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/in/anurag-s01/',
    },
    {
        name: 'Stack Overflow',
        icon: 'stackOverflow',
        link: 'https://stackoverflow.com/users/21785880/anurator',
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:mail.anurags01@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name}'s Portfolio`,
    description: `Portfolio website showcasing my work as a ${person.role}`,
    headline: <>Software engineer and builder</>,
    subline: <>I'm Anurag, a Senior Software Engineer at <InlineCode>Jubilant FoodWorks</InlineCode> with a focus on building scalable, high-performance systems.<br /> Outside of work, I stay engaged with new technologies and explore ways to innovate and improve software development processes.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: false,
        link: 'https://cal.com'
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>Anurag is a India-based software engineer with a passion for delivering robust, scalable systems that address real-world challenges. His work combines technical expertise with a strong problem-solving approach to create high-impact software that drives business success.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'Jubilant FoodWorks Ltd.',
                timeframe: 'Aug 2025 - Present',
                role: 'Senior Software Engineer',
                achievements: [
                    <>Architected a zero-deployment, multi-tenant Campaign Engine microservice with a custom rule evaluation core for complex condition schemas, enabling real-time cart personalization and dynamic promotions for millions of daily user sessions.</>,
                    <>Digitized Corporate Orders end-to-end from a fully offline process to a self-serve online platform, eliminating manual fulfillment overhead and expanding B2B revenue.</>,
                    <>Grew Domino's active payment channels by integrating Swiggy Toing with core ordering backend and onboarding Razorpay and VIPL eVoucher payment partners.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks Ltd.',
                timeframe: 'July 2023 - July 2025',
                role: 'Software Engineer',
                achievements: [
                    <>Unified all JFL brand notifications into a centralized, event-driven, multi-tenant Notification Platform on Kafka and Spring Boot, processing millions of requests/day across 5 channels.</>,
                    <>Extended Domino's ordering reach to India's rail passenger network by integrating Zomato IRCTC Train Orders via a dynamic template-driven backend.</>,
                    <>Boosted IRCTC flow conversion rate by 230 bps and grew train order volume by 25% by leading a complete backend revamp to a Next-Gen Train Ordering Flow.</>,
                    <>Cut MongoDB query latency by 79% (18.7ms to 3.9ms) and reduced request handling overhead by 91% through advanced query profiling and index strategy redesign.</>,
                    <>Drove up to 49% uplift in campaign-driven conversions by shipping Flat Price Menu - a feature with time- and region-scoped feature toggles and A/B experimentation.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks',
                timeframe: 'Jan 2023 - Jun 2023',
                role: 'Graduate Engineering Trainee',
                achievements: [
                    <>Hardened reliability of core BAU microservices by implementing circuit breakers via Resilience4j and executing a Java and Spring Boot version upgrade.</>,
                    <>Eliminated high-severity CVEs across the microservices estate by integrating OWASP Dependency-Check into CI/CD pipelines.</>
                ],
                images: []
            },
            {
                company: 'Standard Chartered',
                timeframe: 'May 2022 - July 2022',
                role: 'Technology Intern',
                achievements: [
                    <>Reduced corporate payment file validation errors and manual review cycles by delivering a full-stack solution - a custom Java-based JSON validator with automated failure-detail reporting and a React.js web interface.</>
                ],
                images: []
            }
        ]
    },
    studies: {
        display: true, // set to false to hide this section
        title: 'Education',
        institutions: [
            {
                name: 'National Institue of Technology, Jamshedpur',
                description: <>Studied Computer Science & Engineering.</>,
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            { title: "Java", icon: 'java' },
            { title: "C++", icon: 'cpp' },
            { title: "Spring Boot", icon: 'springboot' },
            { title: "Apache Kafka", icon: 'apacheKafka' },
            { title: "MySQL", icon: "mysql" },
            { title: "MongoDB", icon: "mongoDB" },
            { title: "Aerospike", icon: "aerospike" },
            { title: "AWS", icon: "aws" },
            { title: "Docker", icon: "docker" },
            { title: "Git", icon: "git" }
        ]
    }
}

const blog = {
    label: 'Blog',
    title: 'Writing about design and tech...',
    description: `Read what ${person.name} has been up to recently`
    // Create new blog posts by adding a new .mdx file to app/blog/posts
    // All posts will be listed on the /blog route
}

const work = {
    label: 'Work',
    title: 'My projects',
    description: `Design and dev projects by ${person.name}`
    // Create new project pages by adding a new .mdx file to app/blog/posts
    // All projects will be listed on the /home and /work routes
}

const gallery = {
    label: 'Gallery',
    title: 'My photo gallery',
    description: `A photo collection by ${person.name}`,
    // Images from https://pexels.com
    images: [
        {
            src: '/images/gallery/img-01.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-02.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-03.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-04.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 3024,
            height: 4032
        },
        {
            src: '/images/gallery/img-05.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-06.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-07.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 3024,
            height: 4032
        },
        {
            src: '/images/gallery/img-08.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 2677,
            height: 2008
        },
        {
            src: '/images/gallery/img-09.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 3037,
            height: 2099
        },
        {
            src: '/images/gallery/img-10.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-11.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-12.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-13.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 4032,
            height: 3024
        },
        {
            src: '/images/gallery/img-14.jpg',
            alt: 'image',
            orientation: 'horizontal',
            width: 3531,
            height: 2192
        },
        {
            src: '/images/gallery/img-15.jpg',
            alt: 'image',
            orientation: 'vertical',
            width: 3024,
            height: 4032
        },
    ]
}

export { person, social, newsletter, home, about, blog, work, gallery };
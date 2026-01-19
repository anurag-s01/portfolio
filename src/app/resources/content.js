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
                    <>Driving end-to-end backend development for Corporate Orders, transforming a fully offline process into a seamless online experience.</>,
                    <>Building order flow integrations for Razorpay and VIPL eVoucher partners for Domino’s, expanding market reach.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks Ltd.',
                timeframe: 'July 2023 - July 2025',
                role: 'Software Engineer',
                achievements: [
                    <>Engineered an in-house scalable, event-driven multi-tenant Notification Platform using Kafka and Spring Boot, handling millions of requests/day.</>,
                    <>Spearheaded backend integration between Domino’s and Zomato IRCTC Train Orders using a dynamic template-based architecture.</>,
                    <>Achieved 79% latency reduction in MongoDB query execution and 91% improvement in request handling overhead.</>,
                    <>Delivered Flat Price Menu feature contributing to up to 49% uplift in campaign-driven conversions.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks',
                timeframe: 'Jan 2023 - Jun 2023',
                role: 'Graduate Engineering Trainee',
                achievements: [
                    <>Contributed to core service reliability by Java & Spring-boot version upgrade and implementing circuit-breakers using Resilience4j.</>,
                    <>Strengthened application security by remediating exploit vectors & third-party vulnerable libraries using OWASP dependency-check.</>
                ],
                images: []
            },
            {
                company: 'Standard Chartered',
                timeframe: 'May 2022 - July 2022',
                role: 'Technology Intern',
                achievements: [
                    <>Built a custom in-house JSON validator using Java for processing corporate payment files with details validation failure reporting.</>,
                    <>Implemented web interface using React.js for corporate payment files validator.</>
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

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
    title: `${person.name} – ${person.role} | Portfolio`,
    description: `${person.name}, ${person.role} building distributed systems, event-driven platforms and large-scale microservices at Jubilant FoodWorks (Domino's India).`,
    headline: 'Building backends that carry millions of orders',
    subline: <>I'm Anurag, a Senior Software Engineer at Jubilant FoodWorks (Domino's India). I architect distributed systems at scale: event-driven, multi-tenant platforms and microservices that hold up under peak traffic and turn slow, manual processes into self-serve products.</>,
    stats: [
        { value: 100, suffix: '+', label: 'campaign changes / qtr, zero deploys' },
        { value: 2500, suffix: '+', label: 'stores load-managed' },
        { value: 80, suffix: '%', label: 'p99 latency cut' },
        { value: 5, suffix: '', label: 'brands on one platform' },
    ],
    awards: [
        { title: '5× Silver Award', description: 'TWID pay-by-rewards, campaign and delivery-charge platform, cross-brand notification platform, Domino\'s–Zomato IRCTC, multi-tenancy program.' },
        { title: 'Star Employee', description: 'Recognized for impact on the notification platform and train-ordering launches.' },
        { title: 'Chairperson\'s Award Nominee 2025', description: 'Best Market Maker of the Year, for the flat-price menu capability.' },
    ]
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.residence}`,
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
        description: <>Anurag is an India-based backend engineer who builds the systems behind Domino's India: campaign engines, communication platforms, payments and real-time store operations. He likes turning manual, deployment-heavy processes into self-serve platforms, and making hot paths measurably faster.</>
    },
    work: {
        display: true, // set to false to hide this section
        title: 'Work Experience',
        experiences: [
            {
                company: 'Jubilant FoodWorks',
                timeframe: 'Aug 2025 - Present',
                role: 'Senior Software Engineer',
                achievements: [
                    <>Built a multi-tenant Campaign Engine in Java and Spring Boot with a custom rule-evaluation core, absorbing 100+ campaign changes per quarter with zero deployments. Personalized packaging and COD charge campaigns on it lifted new-user conversion ~16% in the first month.</>,
                    <>Cut p99 latency from 29.4ms to 5.8ms (80%) and average latency from 14.6ms to 2.6ms on an ordering-path service by removing an N+1 query and adding an in-memory cache.</>,
                    <>Automated operational-load mitigation across 2,500+ stores with a real-time platform that ingests customer, rider and order events through Kafka, scores per-store load against a predictive model, and triggers graduated mitigations over RabbitMQ.</>,
                    <>Added 4+ payment and partner integrations: TWID loyalty points as a new tender across cash, card, UPI and wallet flows, plus Razorpay, VIPL eVoucher and Swiggy Toing.</>,
                    <>Moved corporate ordering from an offline, manual process to a self-serve platform taking orders of up to 1,000 unique items without adding load to store systems.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks',
                timeframe: 'Jul 2023 - Jul 2025',
                role: 'Software Engineer',
                achievements: [
                    <>Built the platform behind every customer communication across all 5 JFL brands, replacing 11+ isolated vendor integrations. Multi-tenant and event-driven on Kafka and Spring Boot, serving SMS, Push, Email, WhatsApp and Live Activities with multi-vendor fallback, handling millions of requests a day.</>,
                    <>Reduced MongoDB query latency from 18.7ms to 3.9ms (79%) on the notification hot path by profiling queries, redesigning indexes and trimming projections.</>,
                    <>Rebuilt the Domino's–IRCTC train ordering backend end to end on a template-driven design, expanding reach through Zomato and raising flow conversion 230 bps and train order volume 25%.</>,
                    <>Shipped a flat-price menu with time and region controls and A/B testing, driving up to 49% more campaign-driven conversions.</>
                ],
                images: []
            },
            {
                company: 'Jubilant FoodWorks',
                timeframe: 'Jan 2023 - Jun 2023',
                role: 'Graduate Engineering Trainee',
                achievements: [
                    <>Added Resilience4j circuit breakers to 3 core order-processing services and upgraded Java and Spring Boot across 8+ services.</>,
                    <>Moved dependency scanning into CI/CD with OWASP Dependency-Check across 8+ services and fixed the high-severity CVEs it surfaced.</>
                ],
                images: []
            },
            {
                company: 'Standard Chartered',
                timeframe: '2022',
                role: 'Technology Intern',
                achievements: [
                    <>Built an in-house Java validator for corporate payment files in JSON and CSV, replacing a third-party tool, with a React interface showing which records failed and why.</>
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
                name: 'National Institute of Technology, Jamshedpur',
                description: <>B.Tech with Honors, Computer Science and Engineering. CGPA 8.44/10, 2023.</>,
            }
        ]
    },
    technical: {
        display: true, // set to false to hide this section
        title: 'Technical skills',
        skills: [
            { title: "Java", icon: 'java' },
            { title: "Spring Boot", icon: 'springboot' },
            { title: "Spring Batch", icon: 'spring' },
            { title: "Apache Kafka", icon: 'apacheKafka' },
            { title: "RabbitMQ", icon: 'rabbitmq' },
            { title: "MongoDB", icon: "mongoDB" },
            { title: "MySQL", icon: "mysql" },
            { title: "Aerospike", icon: "aerospike" },
            { title: "Elasticsearch", icon: "elasticsearch" },
            { title: "AWS", icon: "aws" },
            { title: "Docker", icon: "docker" },
            { title: "Grafana", icon: "grafana" },
            { title: "Datadog", icon: "datadog" },
            { title: "C++", icon: 'cpp' },
            { title: "Git", icon: "git" }
        ],
    }
}

const work = {
    label: 'Work',
    title: 'Selected work',
    description: `Backend systems and projects built by ${person.name}`
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

export { person, social, home, about, work, gallery };
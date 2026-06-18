import { getPosts } from '@/app/utils/utils';
import { Flex, Grid } from '@/once-ui/components';

import { ProjectCard } from '@/components';

interface ProjectsProps {
    range?: [number, number?];
    locale: string;
}

export function Projects({ range, locale }: ProjectsProps) {
    let allProjects = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);

    const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedProjects = range
        ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
        : sortedProjects;

    const isHomePage = !!range;

    const content = displayedProjects.map((post) => (
        <ProjectCard
            key={post.slug}
            href={`work/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}/>
    ));

    if (isHomePage) {
        return (
            <Grid
                columns="repeat(2, 1fr)"
                tabletColumns="1col"
                mobileColumns="1col"
                fillWidth gap="xl" marginBottom="40" paddingX="l">
                {content}
            </Grid>
        );
    }

    return (
        <Flex
            fillWidth gap="xl" marginBottom="40" paddingX="l"
            direction="column">
            {content}
        </Flex>
    );
}
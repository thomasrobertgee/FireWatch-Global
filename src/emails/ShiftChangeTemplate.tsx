
import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Hr,
    Img,
} from '@react-email/components';
import { Tailwind } from '@react-email/components';

interface ArticlePreview {
    title: string;
    category: string;
    url: string; // or id to link to site
    summary: string;
}

interface ShiftChangeEmailProps {
    introText?: string;
    articles?: ArticlePreview[];
}

export const ShiftChangeTemplate = ({
    introText = "Stay safe on your shift. Here is your daily intelligence briefing.",
    articles = [],
}: ShiftChangeEmailProps) => {
    const previewText = `FireWatch Global: Shift Change Report`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-gray-200 my-[40px] mx-auto p-[20px] max-w-[465px]">
                        {/* Header */}
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0 uppercase tracking-widest">
                                FireWatch <span className="text-[#D32F2F]">Global</span> (DEBUG)
                            </Heading>
                            <Text className="text-gray-500 text-xs font-bold text-center uppercase tracking-widest mb-8">
                                Shift Change Report
                            </Text>
                        </Section>

                        {/* Intro */}
                        <Section className="mb-[32px]">
                            <Text className="text-black text-[16px] leading-[24px] italic border-l-4 border-[#D32F2F] pl-4">
                                "{introText}"
                            </Text>
                        </Section>

                        <Hr className="border border-gray-100 my-[26px] mx-0 w-full" />

                        {/* Briefings */}
                        <Heading className="text-black text-[18px] font-bold p-0 my-[30px] mx-0 uppercase tracking-widest">
                            Top 3 Briefings
                        </Heading>

                        {articles.length > 0 ? (
                            articles.map((article, index) => (
                                <Section key={index} className="mb-[24px]">
                                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest m-0">
                                        {article.category}
                                    </Text>
                                    <Link
                                        href={article.url}
                                        className="text-black text-[16px] font-bold no-underline hover:underline block mt-1 mb-2"
                                    >
                                        {article.title}
                                    </Link>
                                    <Text className="text-gray-600 text-[14px] leading-[24px] m-0">
                                        {article.summary}
                                    </Text>
                                </Section>
                            ))
                        ) : (
                            <Text className="text-gray-500">No major briefings for this shift.</Text>
                        )}

                        <Hr className="border border-gray-100 my-[26px] mx-0 w-full" />

                        {/* Call to Action */}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#10b981] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3 uppercase tracking-widest"
                                href="http://localhost:3000/health-ledger"
                            >
                                View Health Ledger
                            </Button>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px] mt-8 text-center">
                            © 2025 FireWatch Global. Stay Safe.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ShiftChangeTemplate;

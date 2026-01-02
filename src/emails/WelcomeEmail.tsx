
import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Button,
    Hr,
    Img,
} from '@react-email/components';
import { Tailwind } from '@react-email/components';

export const WelcomeEmail = () => {
    const previewText = `Welcome to FireWatch Global`;

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
                                FireWatch <span className="text-[#D32F2F]">Global</span>
                            </Heading>
                        </Section>

                        {/* Welcome Message */}
                        <Section className="mb-[32px]">
                            <Text className="text-black text-[16px] leading-[24px]">
                                Welcome to FireWatch Global.
                            </Text>
                            <Text className="text-black text-[16px] leading-[24px]">
                                You are now part of a global network dedicated to firefighting intelligence. We monitor the world so you can stay focused on the mission.
                            </Text>
                        </Section>

                        <Hr className="border border-gray-100 my-[26px] mx-0 w-full" />

                        {/* Pillars */}
                        <Section className="mb-[32px]">
                            <Heading className="text-black text-[16px] font-bold p-0 mb-[20px] mx-0 uppercase tracking-widest">
                                Our Pillars
                            </Heading>

                            <div className="mb-4">
                                <Text className="text-black text-[14px] font-bold m-0 text-[#D32F2F] uppercase tracking-wider">01. Global Operations</Text>
                                <Text className="text-gray-600 text-[14px] mt-1">Real-time incident analysis and strategic operational shifts from around the world.</Text>
                            </div>

                            <div className="mb-4">
                                <Text className="text-black text-[14px] font-bold m-0 text-[#D32F2F] uppercase tracking-wider">02. The Health Ledger</Text>
                                <Text className="text-gray-600 text-[14px] mt-1">Tracking presumptive legislation, carcinogen research, and long-term wellness data.</Text>
                            </div>

                            <div className="mb-4">
                                <Text className="text-black text-[14px] font-bold m-0 text-[#D32F2F] uppercase tracking-wider">03. Innovation Reports</Text>
                                <Text className="text-gray-600 text-[14px] mt-1">The latest in apparatus engineering, PPE development, and tactical software.</Text>
                            </div>
                        </Section>

                        <Hr className="border border-gray-100 my-[26px] mx-0 w-full" />

                        {/* Call to Action */}
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#10b981] rounded text-white text-[12px] font-bold no-underline text-center px-5 py-3 uppercase tracking-widest"
                                href="http://localhost:3000"
                            >
                                Explore the Dashboard
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

export default WelcomeEmail;

import { Cast } from '@/components/cast';
import Container from '@/components/common/Container';
import { siteConfig } from '@/config/siteConfig';
import { getCastWithCredits } from '@/services/MovieService';
import { Metadata } from 'next';
import React from 'react';

interface CastPageProps {
  params: Promise<{
    castId: string;
  }>;
}

export async function generateMetadata({ params }: CastPageProps): Promise<Metadata> {
  const { castId } = await params;
  
  try {
    // Fetch cast data to generate proper metadata
    const castData = await getCastWithCredits(castId);
    
    if (!castData?.data) {
      return {
        title: `Cast Profile - ${siteConfig.siteName}`,
        description: `Actor profile and filmography on ${siteConfig.siteName}`,
        robots: {
          index: false, // Don't index error pages
          follow: true,
        },
      };
    }

    const cast = castData.data;
    
    // Generate unique, descriptive metadata
    const knownFor = cast.combinedCredits?.cast
      ?.slice(0, 3)
      .map(credit => credit.displayTitle || credit.title || credit.name)
      .join(', ');

    const birthYear = cast.birthday ? new Date(cast.birthday).getFullYear() : null;
    const ageInfo = birthYear ? ` (born ${birthYear})` : '';
    
    const title = `${cast.name}${ageInfo} - Actor Profile & Filmography | ${siteConfig.siteName}`;
    
    const description = cast.biography 
      ? `${cast.biography.slice(0, 120)}...`
      : `Explore ${cast.name}'s complete filmography and career highlights${knownFor ? `, known for ${knownFor}` : ''}. ${cast.knownForDepartment || 'Actor'} profile on ${siteConfig.siteName}.`;

    return {
      title,
      description: description.slice(0, 160),
      keywords: [
        cast.name,
        'actor',
        'filmography',
        'movies',
        'biography',
        cast.knownForDepartment,
        ...(knownFor ? knownFor.split(', ') : []),
      ].filter(Boolean).join(', '),
      openGraph: {
        title: `${cast.name} - Actor Profile`,
        description: description.slice(0, 160),
        images: cast.profilePath ? [
          {
            url: `https://image.tmdb.org/t/p/w500${cast.profilePath}`,
            width: 500,
            height: 750,
            alt: `${cast.name} profile photo`,
          }
        ] : [],
        type: 'profile',
        siteName: siteConfig.siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cast.name} - Actor Profile`,
        description: description.slice(0, 160),
        images: cast.profilePath ? [`https://image.tmdb.org/t/p/w500${cast.profilePath}`] : [],
      },
      alternates: {
        canonical: `/cast/${castId}`, // Set canonical URL
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      other: {
        'person:name': cast.name,
        'person:birthday': cast.birthday || '',
        'person:birthplace': cast.placeOfBirth || '',
        'person:profession': cast.knownForDepartment || '',
      },
    };
  } catch (error) {
    console.error('Error generating metadata for cast page:', error);
    
    return {
      title: `Cast Profile - ${siteConfig.siteName}`,
      description: `Actor profile and filmography on ${siteConfig.siteName}`,
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function CastPage({ params }: CastPageProps) {
  const { castId } = await params;
  
  return (
    <Container>
      <Cast castId={castId} />
    </Container>
  );
}
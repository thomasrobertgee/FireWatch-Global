export interface Article {
  id: string;
  title: string;
  category: 'Operations' | 'Welfare' | 'Innovation' | 'Environment';
  summary: string[];
  source: string;
  sourceUrl: string;
  imageUrl?: string;
}

export const articles: Article[] = [
  {
    id: 'london-pay-dispute',
    title: 'London Fire Brigade Union Announces Ballot on Pay Dispute',
    category: 'Welfare',
    summary: [
      'Firefighters in London are balloting for strike action over pay and conditions.',
      'The Fire Brigades Union (FBU) cites a lack of progress in negotiations with government officials.',
      'Potential strikes could affect services across the capital starting next month.'
    ],
    source: 'BBC News',
    sourceUrl: 'https://www.bbc.co.uk/news'
  },
  {
    id: 'pfas-cancer-research',
    title: 'Groundbreaking Study Links firefighter PPE to High Levels of PFAS',
    category: 'Welfare',
    summary: [
      'New research from the University of Central Lancashire identifies "forever chemicals" in turnout gear.',
      'Long-term exposure is linked to increased cancer rates among serving firefighters.',
      ' Unions are calling for immediate replacement of contaminated equipment.'
    ],
    source: 'The Guardian',
    sourceUrl: 'https://www.theguardian.com'
  },
  {
    id: 'electric-fire-engines-berlin',
    title: 'Berlin Fire Department Deploys World’s First Electric Fire Engine Fleet',
    category: 'Innovation',
    summary: [
      'Berlin has successfully tested and deployed Rosenbauer electric fire trucks.',
      'The vehicles reduce emissions and noise pollution significantly during operations.',
      'Charging infrastructure has been integrated into three major stations across the city.'
    ],
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com'
  },
  {
    id: 'australian-bushfire-season',
    title: 'Australia Braces for "Catastrophic" Bushfire Season Amidst Record Heat',
    category: 'Environment',
    summary: [
      'Meteorologists predict one of the driest summers on record for New South Wales.',
      'Emergency services are pre-positioning assets in high-risk zones ahead of December.',
      'New aerial firefighting tankers have been leased from North America to bolster aerial support.'
    ],
    source: 'ABC News Australia',
    sourceUrl: 'https://www.abc.net.au/news'
  },
  {
    id: 'drone-response-unit',
    title: 'Launch of Dedicated Drone Response Unit for High-Rise Incidents',
    category: 'Operations',
    summary: [
      'A new specialized drone unit will assist in rapid assessment of high-rise fires.',
      'Drones are equipped with thermal imaging to detect hotspots through smoke.',
      'The initiative aims to improve firefighter safety by identifying structural risks early.'
    ],
    source: 'FireRescue1',
    sourceUrl: 'https://www.firerescue1.com'
  },
  {
    id: 'wildfire-ai-prediction',
    title: 'AI Model Predicts Wildfire Spread with 90% Accuracy',
    category: 'Innovation',
    summary: [
      'Researchers have developed an AI tool that predicts wildfire paths in real-time.',
      'The system uses satellite data and wind patterns to forecast fire movement.',
      'Early tests in California showed a 90% accuracy rate in predicting spread over 24 hours.'
    ],
    source: 'Nature Journal',
    sourceUrl: 'https://www.nature.com'
  }
];

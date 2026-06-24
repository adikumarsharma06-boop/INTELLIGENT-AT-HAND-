/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppItem, SystemNotification, SystemLog } from './types';

export const INITIAL_CATEGORIES = [
  'All',
  'AI Chat',
  'Content Creation',
  'Data Analysis',
  'Productivity'
];

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'iah-chatbot',
    name: 'IAH Chatbot',
    description: 'Autonomous conversational assistant and neural chat terminal. Solve complex logical problems, analyze code, and access natural-language reasoning instantly.',
    logo: 'MessageSquare',
    category: 'AI Chat',
    tags: ['Conversational AI', 'Neural Chat', 'Logic Assistant'],
    url: 'https://iahchatbot.netlify.app/',
    featured: true,
    premium: false,
    views: 31205,
    rating: 4.9,
    ratingsCount: 840,
    estimatedLaunchTime: '0.4s',
    uptime: '99.99%'
  },
  {
    id: 'architech-agent',
    name: 'Architech Agent',
    description: 'Immersive structure designer and spatial reasoning assistant. Directly co-author architectural blueprints, floor plans, and custom interior modules with ease.',
    logo: 'Sparkles',
    category: 'Content Creation',
    tags: ['3D Blueprints', 'Spatial AI', 'Floor Planner', 'Architecture'],
    url: 'https://architechagent.netlify.app/',
    featured: true,
    premium: false,
    views: 28409,
    rating: 4.8,
    ratingsCount: 650,
    estimatedLaunchTime: '1.2s',
    uptime: '99.95%'
  },
  {
    id: 'earthvision-ai',
    name: 'EarthVision AI',
    description: 'Advanced geospatial maps analyzer and ecological observer. Interrogate deep high-fidelity sat-imagery pipelines and check environmental shifts worldwide.',
    logo: 'Globe',
    category: 'Data Analysis',
    tags: ['Satellite Imagery', 'Geospatial AI', 'Ecological Mapping', 'Maps Platform'],
    url: 'https://earthvisionai.netlify.app/',
    featured: true,
    premium: false,
    views: 29503,
    rating: 4.9,
    ratingsCount: 710,
    estimatedLaunchTime: '0.9s',
    uptime: '99.97%'
  },
  {
    id: 'futuristic-hab-tracker',
    name: 'Futuristic Habitation Tracker',
    description: 'Intelligent environment and routine workflow companion. Log health markers, track daily goals, and optimize your systems from a sleek cybernetic engine.',
    logo: 'Activity',
    category: 'Productivity',
    tags: ['Habit Tracker', 'Smart Living', 'Analytics Engine', 'Cybernetics'],
    url: 'https://futuristichabbittrcaker.netlify.app/',
    featured: true,
    premium: false,
    views: 24391,
    rating: 4.8,
    ratingsCount: 512,
    estimatedLaunchTime: '0.8s',
    uptime: '99.92%'
  },
  {
    id: 'iah-ai-studio',
    name: 'IAH AI Studio',
    description: 'Sovereign intelligence studio and builder workspace. Formulate customized model workflows, code responsive user interfaces, and deploy instant sandboxes.',
    logo: 'Sparkles',
    category: 'Content Creation',
    tags: ['Intelligence Studio', 'Code Sandboxing', 'Visual Generation', 'Workspace'],
    url: 'https://iahaistudio.netlify.app/',
    featured: true,
    premium: false,
    views: 25402,
    rating: 4.8,
    ratingsCount: 420,
    estimatedLaunchTime: '1.5s',
    uptime: '99.94%'
  },
  {
    id: 'iah-ai-helper',
    name: 'IAH AI Helper',
    description: 'Autonomous orchestration assistant and companion toolkit. Calibrate system telemetry, coordinate low-latency runs, and automate routine tasks with sovereign AI precision.',
    logo: 'HelpCircle',
    category: 'Productivity',
    tags: ['System Helper', 'Automation Tool', 'Orchestration Core', 'Ecosystem Companion'],
    url: 'https://iahaihelper.netlify.app/',
    featured: true,
    premium: false,
    views: 18450,
    rating: 4.9,
    ratingsCount: 320,
    estimatedLaunchTime: '0.6s',
    uptime: '99.98%'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to IAH.AI Platform!',
    message: 'Explore the next generation of AI services. Access built-in premium chat, professional copywriting, and direct vector artwork utilities instantly.',
    date: '2026-06-07 18:00',
    read: false,
    category: 'system'
  },
  {
    id: 'notif-2',
    title: 'New Built-in App: Scribe Copywriter Suite',
    message: 'Our writing companion Scribe Pro Writing Suite has launched! Automatically draft newsletters, email copies, and LinkedIn micro-blogs with high-fidelity control.',
    date: '2026-06-06 14:30',
    read: false,
    category: 'new-app'
  },
  {
    id: 'notif-3',
    title: 'Exclusive Offer: Get 50% Off Lifetime Pro',
    message: 'Unlock unlimited high-resolution image synthesis, premium database sizes, and unlimited multi-step chatbot reasoning with our seasonal launch benefits.',
    date: '2026-06-05 09:00',
    read: true,
    category: 'premium'
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-06-13T10:10:00.000Z',
    message: 'Cryptographic core engine booted on port 3000.',
    level: 'INFO',
    source: 'SYSTEM'
  },
  {
    id: 'log-2',
    timestamp: '2026-06-13T10:10:05.120Z',
    message: 'Secure sandbox pipeline tunnels successfully established.',
    level: 'INFO',
    source: 'NETWORK_GATE'
  },
  {
    id: 'log-3',
    timestamp: '2026-06-13T10:10:06.402Z',
    message: 'Persistent db.json repository verified and synced into master state memory.',
    level: 'INFO',
    source: 'DATABASE_ENGINE'
  },
  {
    id: 'log-4',
    timestamp: '2026-06-13T10:12:35.801Z',
    message: 'Sovereign SSL check completed. TLS 1.3 protocol selected.',
    level: 'INFO',
    source: 'SECURITY_SHIELD'
  },
  {
    id: 'log-5',
    timestamp: '2026-06-13T10:15:12.194Z',
    message: 'Validation warning: Non-critical cluster latency detected: 24ms jitter.',
    level: 'WARN',
    source: 'TELEMETRY'
  },
  {
    id: 'log-6',
    timestamp: '2026-06-13T10:18:42.503Z',
    message: 'Connection established with global edge proxy endpoints.',
    level: 'INFO',
    source: 'NETWORK_GATE'
  }
];


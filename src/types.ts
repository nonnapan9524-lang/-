/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExperimentStep {
  id: string;
  name: string;
  objective: string;
  procedure: string[];
  resultSummary: string;
  imageUrl: string;
  imageAlt: string;
  imageExplanationAI?: {
    normal: string;
    scientific: string;
    kids: string;
  };
}

export interface ProjectData {
  titleTh: string;
  titleEn: string;
  category: string;
  school: string;
  team: string[];
  advisor: string;
  abstractTh: string;
  abstractEn: string;
  hypotheses: string[];
  objectives: string[];
  benefits: string[];
  experiments: ExperimentStep[];
  recommendations: string[];
}

export interface TeacherFeedback {
  id: string;
  author: string;
  role: 'ครูที่ปรึกษา' | 'ผู้เชี่ยวชาญ' | 'ผู้ชมทั่วไป' | 'กรรมการวิชาการ';
  content: string;
  rating: number;
  createdAt: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'lg' | 'xl';
  readingAssistance: boolean;
  simplifiedMode: boolean;
  highContrast: boolean;
}

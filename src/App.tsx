/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  FlaskConical,
  Upload,
  Volume2,
  HelpCircle,
  CheckCircle,
  TrendingUp,
  User,
  Award,
  AlertTriangle,
  Activity,
  FileText,
  Settings,
  Glasses,
  Sun,
  Flame,
  Eye,
  Info,
  ArrowRight,
  RotateCcw,
  MessageSquare,
  Check,
  Menu,
  X,
  Plus,
  Play,
  Square
} from 'lucide-react';
import { DEFAULT_PROJECT, PRESET_IMAGES } from './data';
import { AccessibilitySettings, TeacherFeedback, ExperimentStep } from './types';

export default function App() {
  // Application states
  const [project, setProject] = useState(DEFAULT_PROJECT);
  const [activeTab, setActiveTab] = useState<'overview' | 'experiments' | 'ai-lab'>('overview');
  const [selectedExperiment, setSelectedExperiment] = useState<string>(DEFAULT_PROJECT.experiments[0].id);
  const [experimentTone, setExperimentTone] = useState<Record<string, 'normal' | 'scientific' | 'kids'>>({});

  // Mobile menu trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accessibility States
  const [a11y, setA11y] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    readingAssistance: false,
    simplifiedMode: false,
    highContrast: false,
  });

  // Highlight paragraph helper for narration
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Interactive AI Assistant states
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiConsultResult, setAiConsultResult] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [aiIsMock, setAiIsMock] = useState(false);

  // Live custom photo uploader states
  const [userImage, setUserImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [customUploadTone, setCustomUploadTone] = useState<'normal' | 'scientific' | 'kids'>('normal');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysisIsMock, setImageAnalysisIsMock] = useState(false);

  // Initial setup for tones of experiments
  useEffect(() => {
    const initialTones: Record<string, 'normal' | 'scientific' | 'kids'> = {};
    project.experiments.forEach(exp => {
      initialTones[exp.id] = 'normal';
    });
    setExperimentTone(initialTones);
  }, [project]);

  // Handle Speech Narration Toggle
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop anything playing

      if (a11y.readingAssistance && currentlySpeakingText === text) {
        setCurrentlySpeakingText(null);
        return;
      }

      // Filter formatting or markdown out of text for clean speech synthesis
      const cleanText = text
        .replace(/[#*`_]/g, '')
        .replace(/🍊|🔬|🧸|✨|🌱|⭐/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'th-TH';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setCurrentlySpeakingText(null);
      };

      utterance.onerror = () => {
        setCurrentlySpeakingText(null);
      };

      speechUtteranceRef.current = utterance;
      setCurrentlySpeakingText(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("ขออภัย บราว์เซอร์ของคุณไม่สนับสนุนระบบเสียงพูดอัตโนมัติ");
    }
  };

  const cancelSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingText(null);
    }
  };

  // Close speech when leaving tab
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Set default questions for AI Critic
  const sampleQuestions = [
    { label: "แนะนำวิธีเพิ่มสารสปริงเด้งสู้ฟันเหนียวดึ๋งธรรมชาติ", q: "อยากให้ช่วยวิเคราะห์สูตรสารปรับปรุงเนื้อสัมผัสอย่างเจลคาราจีแนนร่วมกับแป้งบุก หรือเจลตินจากพืชชนิดอื่นเพื่อให้มีความยืดหยุ่นสู้ฟันใกล้เคียงกับเนื้อสัมผัสลูกชิ้นสัตว์เกรดพรีเมียมที่สุด" },
    { label: "ขจัดกลิ่นเหม็นหืนเฉพาะตัวของถั่วเหลืองอย่างไร", q: "มีวิธีการใช้ความร้อน ยอดชาเขียว หรือการหมักสารจุลินทรีย์ธรรมชาติใดมาช่วยดับกลิ่นเหม็นดิบและกลิ่นเฉพาะตัวของถั่วเหลือง โดยที่ไม่ทำให้สูญเสียสัดส่วนโปรตีน 50g กิโลโปรกรัมรวมที่ขุดค้นมา?" },
    { label: "เสนอแนะวิธีเพิ่มเฉดสีชมพูแดงระเรื่อธรรมชาติ", q: "ในการแข่งขันประกวดวิทยาศาสตร์ โรสสีชมพูแดงให้เหมือนเนื้อดิบเป็นเรื่องสำคัญมาก เราอยากทราบเทคนิคการเพิ่มเม็ดสีธรรมชาติจากแร่ธาตุบีทรูท หรือเบต้าแคโรทีนที่คงทนไม่แตกเหลวเวลานำไปปรุงร้อนจัด" }
  ];

  // AI Project Advisory Request
  const handleConsultAI = async (questionText: string) => {
    setIsConsulting(true);
    setAiConsultResult(null);
    try {
      const response = await fetch('/api/consult-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: project.titleTh,
          abstract: project.abstractTh,
          userQuestion: questionText,
          category: project.category
        }),
      });

      if (!response.ok) {
        throw new Error('ระบบเซิร์ฟเวอร์ขัดข้อง ไม่สามารถประมวลผลการพิจารณาได้');
      }

      const resData = await response.json();
      setAiConsultResult(resData.text);
      setAiIsMock(!!resData.isMock);
    } catch (err: any) {
      setAiConsultResult(`❌ ขออภัย เกิดข้อผิดพลาดในการประมวลผล: ${err?.message || err}`);
    } finally {
      setIsConsulting(false);
    }
  };

  // Live Custom Image Analysis Request
  const handleAnalyzeImage = async () => {
    if (!userImage) {
      alert("กรุณาอัปโหลดรูปภาพหรือเลือกรูปภาพจำลองก่อนกดปุ่มวิเคราะห์");
      return;
    }

    setIsAnalyzingImage(true);
    setAiAnalysisResult(null);
    try {
      const response = await fetch('/api/explain-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: userImage,
          mimeType: 'image/png',
          title: "เนื้อเทียมโครงงานวิทยาศาสตร์ผู้ใช้",
          mode: customUploadTone
        }),
      });

      if (!response.ok) {
        throw new Error('การประมวลผลอิมเมจล้มเหลว');
      }

      const resData = await response.json();
      setAiAnalysisResult(resData.text);
      setImageAnalysisIsMock(!!resData.isMock);
    } catch (err: any) {
      setAiAnalysisResult(`❌ ไม่สามารถเรียกตรวจ AI ได้ในขณะนี้: ${err?.message || err}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Image upload base64 converter
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setAiAnalysisResult(null); // Clear previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  // Selecting preset as upload
  const handleSelectPresetFile = (url: string, name: string) => {
    setUploadedFileName(name);
    // Convert current URL context into Base64 format to allow proper server upload processing
    // Or we can just pass the direct URL back since endpoints fallback nicely.
    // For convenience we fetch and turn to base64, or pass simple fake base64. Let's send directly since server handles it robustly.
    setUserImage(url);
    setAiAnalysisResult(null);
  };

  // Accessibility Font Weight and Grid Layout Class Configs
  const getFontSizeClass = (element: 'title' | 'body' | 'heading') => {
    if (a11y.fontSize === 'normal') {
      if (element === 'title') return 'text-2xl md:text-4xl';
      if (element === 'heading') return 'text-xl md:text-2xl';
      return 'text-base leading-relaxed';
    }
    if (a11y.fontSize === 'lg') {
      if (element === 'title') return 'text-3xl md:text-5xl';
      if (element === 'heading') return 'text-2xl md:text-3xl';
      return 'text-lg leading-relaxed';
    }
    // xl size
    if (element === 'title') return 'text-4xl md:text-6xl';
    if (element === 'heading') return 'text-3xl md:text-4xl';
    return 'text-xl md:text-2xl leading-loose';
  };

  const getSimplifiedText = (originalText: string, keyWord: string, replacement: string) => {
    if (a11y.simplifiedMode) {
      return originalText.split(keyWord).join(` [ ${replacement} ] `);
    }
    return originalText;
  };

  // Active experiment details shortcut
  const activeExperiment = project.experiments.find(e => e.id === selectedExperiment) || project.experiments[0];

  return (
    <div id="applet-main-container" className={`min-h-screen transition-colors duration-200 ${
      a11y.highContrast ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-800'
    } flex flex-col`}>

      {/* 🛡️ PCSHS Orange & Blue High Contrast Accent Bar */}
      <div id="pcshs-branding-strip" className="h-2 w-full bg-gradient-to-r from-pcshs-blue via-pcshs-orange to-pcshs-blue-light" />

      {/* ⚙️ Accessibility Floating Drawer (Top Section for Ease of Access on Mobile) */}
      <section id="accessibility-toolbar-section" className={`sticky top-0 z-50 border-b transition-colors shadow-sm ${
        a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-orange-100 text-pcshs-orange flex items-center justify-center">
              <Glasses className="w-4 h-4" />
            </span>
            <span className="font-semibold text-slate-900 dark:text-zinc-100">
              ระบบอำนวยความสะดวกเพื่อคนทุกกลุ่ม (Accessibility Solutions)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Font Size Adjusters */}
            <div className="flex items-center gap-1 border rounded-lg p-1 bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700">
              <span className="text-xs px-1 text-slate-500">ขนาดอักษร:</span>
              <button
                id="btn-font-normal"
                onClick={() => setA11y(prev => ({ ...prev, fontSize: 'normal' }))}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  a11y.fontSize === 'normal'
                    ? 'bg-pcshs-blue text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ปกติ
              </button>
              <button
                id="btn-font-lg"
                onClick={() => setA11y(prev => ({ ...prev, fontSize: 'lg' }))}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  a11y.fontSize === 'lg'
                    ? 'bg-pcshs-blue text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ใหญ่
              </button>
              <button
                id="btn-font-xl"
                onClick={() => setA11y(prev => ({ ...prev, fontSize: 'xl' }))}
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  a11y.fontSize === 'xl'
                    ? 'bg-pcshs-blue text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                ใหญ่มาก
              </button>
            </div>

            {/* Reading Assistance Switch */}
            <button
              id="toggle-reading-assistance"
              onClick={() => {
                const updated = !a11y.readingAssistance;
                setA11y(prev => ({ ...prev, readingAssistance: updated }));
                if (!updated) cancelSpeech();
              }}
              className={`flex items-center gap-1.5 py-1 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                a11y.readingAssistance
                  ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="สลับการอ่านออกเสียงเป็นภาษาไทยอัตโนมัติเมื่อกดเลือกส่วนหัวข้อ"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{a11y.readingAssistance ? '🔊 เปิดช่วยอ่านออกเสียง' : '🔇 ปิดช่วยอ่านออกเสียง'}</span>
            </button>

            {/* Simplified Science Toggle */}
            <button
              id="toggle-simplified-mode"
              onClick={() => setA11y(prev => ({ ...prev, simplifiedMode: !prev.simplifiedMode }))}
              className={`flex items-center gap-1.5 py-1 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                a11y.simplifiedMode
                  ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
              title="แปลคำศัพท์วิชาการยากๆ ให้กลายเป็นคำอธิบายภาษาชาวบ้านอย่างง่ายทันที"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{a11y.simplifiedMode ? '💡 โหมดภาษาง่ายกระชับพิเศษ' : '🔬 ภาษาทางวิชาการปกติ'}</span>
            </button>

            {/* Contrast Mode Toggle */}
            <button
              id="toggle-contrast"
              onClick={() => setA11y(prev => ({ ...prev, highContrast: !prev.highContrast }))}
              className={`flex items-center gap-1.5 py-1 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                a11y.highContrast
                  ? 'bg-purple-700 border-purple-700 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{a11y.highContrast ? '☀️ โทนปานกลาง' : '🌙 โทนถนอมสายตาคมชัด'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 🇹🇭 Elegant Header with School Icon Logo Concept (Orange & Blue) */}
      <header id="pcshs-header-hero" className={`relative overflow-hidden border-b transition-colors ${
        a11y.highContrast 
          ? 'bg-zinc-900 border-zinc-800 text-white' 
          : 'bg-gradient-to-br from-pcshs-blue-dark via-pcshs-blue to-pcshs-blue-light border-slate-200 text-white'
      } py-12 md:py-16 px-4`}>
        {/* Background Subtle Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pcshs-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[10%] w-80 h-80 bg-pcshs-blue-light/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Decorative PCSHS Digital Emblem and Category Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white p-2.5 flex flex-col items-center justify-center shadow-lg border-2 border-pcshs-orange/40 hover:scale-105 transition-transform duration-200" title="โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย นครศรีธรรมราช">
              {/* Actual School Emblem Graphic */}
              <img
                src="/assets/input_file_5.png"
                onError={(e) => {
                  e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Logo_of_Princess_Chulabhorn_Science_High_School_Nakhon_Si_Thammarat.png";
                }}
                alt="ตราสัญลักษณ์โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย นครศรีธรรมราช"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2.5 bg-pcshs-orange text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                ม.ต้น
              </span>
            </div>
          </div>

          {/* Project Titles and Author Context */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              <span className="bg-pcshs-orange/20 text-pcshs-orange border border-pcshs-orange/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-pcshs-orange" />
                {project.category}
              </span>
              <span className="bg-blue-900/40 text-blue-200 border border-blue-700/50 text-xs px-3 py-1 rounded-full">
                💡 โครงงานวิทยาศาสตร์กลุ่มอาหารแห่งอนาคต
              </span>
            </div>

            <h1 className={`font-bold transition-all ${getFontSizeClass('title')} text-shadow-subtle leading-tight mb-2 text-white`}>
              {project.titleTh}
            </h1>
            <p className="text-slate-300 text-sm md:text-lg font-mono tracking-tight mb-6">
              {project.titleEn}
            </p>

            {/* School Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs md:text-sm text-slate-300">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <User className="w-4 h-4 text-pcshs-orange shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">คณะผู้จัดทำ</span>
                  <span className="font-medium text-slate-100">{project.team.join(', ')}</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Award className="w-4 h-4 text-pcshs-orange shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">คุณครูที่ปรึกษา</span>
                  <span className="font-medium text-slate-100">{project.advisor}</span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 sm:col-span-2 md:col-span-1">
                <BookOpen className="w-4 h-4 text-pcshs-orange shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">สถาบันวิชาการ</span>
                  <span className="font-medium text-slate-100">{project.school}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 📍 Tab Navigation */}
      <nav id="applet-primary-navigation" className={`border-b sticky top-12 z-40 ${
        a11y.highContrast ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex overflow-x-auto gap-4 py-3">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-5 py-2 font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === 'overview'
                  ? 'text-pcshs-orange border-pcshs-orange font-bold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 dark:text-zinc-400 hover:border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ภาพรวมและสมมติฐาน</span>
            </button>
            <button
              id="tab-experiments"
              onClick={() => setActiveTab('experiments')}
              className={`flex items-center gap-2 px-5 py-2 font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === 'experiments'
                  ? 'text-pcshs-orange border-pcshs-orange font-bold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 dark:text-zinc-400 hover:border-slate-300'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>8 ขั้นตอนทดลองโครงงาน</span>
            </button>
            <button
              id="tab-ai-lab"
              onClick={() => setActiveTab('ai-lab')}
              className={`flex items-center gap-2 px-5 py-2 font-extrabold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                activeTab === 'ai-lab'
                  ? 'text-pcshs-orange border-pcshs-orange font-bold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 dark:text-zinc-400 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ห้องพิจารณา / คลาวด์กล้อง AI</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden lg:block">
            {currentlySpeakingText && (
              <div className="flex items-center gap-1 bg-orange-100 text-pcshs-orange font-bold py-1 px-3 rounded-full animate-pulse border border-orange-200">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>กำลังอ่านออกเสียง TH...</span>
                <button onClick={cancelSpeech} className="ml-1 p-0.5 bg-orange-500 text-white rounded hover:bg-orange-600">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 📖 Text To Speech highlighting context notification bar */}
      {currentlySpeakingText && (
        <div className="bg-orange-50 dark:bg-zinc-800 border-b border-orange-200 dark:border-zinc-700 py-2.5 px-4 text-center">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm">
            <p className="text-slate-700 dark:text-zinc-200 italic line-clamp-1">
              " {currentlySpeakingText} "
            </p>
            <button
              id="btn-nav-cancel-speech"
              onClick={cancelSpeech}
              className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded-full shrink-0 flex items-center gap-1 font-semibold"
            >
              <Square className="w-3 h-3 fill-white" />
              หยุดพากย์เสียง
            </button>
          </div>
        </div>
      )}

      {/* 🚀 Main Display Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main functional panels (8 units on wide screens, full on smaller) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ==================== TAB 1 PART A: OVERVIEW & SMART SECTIONS ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">

              {/* 🎯 HIGHEST PRIORITY 1: วัตถุประสงค์ (OBJECTIVES) — DISPLAYED FIRST AS REQUIRED */}
              <section id="section-objectives" className={`rounded-2xl shadow-sm border p-6 md:p-8 transition-all ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div 
                  className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-6 cursor-help"
                  onClick={() => speakText("วัตถุประสงค์ของโครงงานนี้มีทั้งหมดสี่ประการหลักครับ")}
                  title="คลิกเพื่อฟังเสียงอ่านเฉพาะส่วนคอมพ์"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pcshs-blue text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-pcshs-orange/40">
                      01
                    </div>
                    <div>
                      <h2 className={`font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400 ${getFontSizeClass('heading')}`}>
                        1. วัตถุประสงค์ (Objectives)
                      </h2>
                      <p className="text-xs text-slate-500 pl-3">เป้าหมายเชิงกลยุทธ์หลักสี่ประการที่เรามุ่งวิจัย</p>
                    </div>
                  </div>
                  {a11y.readingAssistance && (
                    <span className="text-orange-500 shrink-0 text-xs flex items-center gap-1 font-semibold">
                      <Volume2 className="w-4 h-4 animate-bounce" /> กดฟัง
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.objectives.map((obj, idx) => (
                    <div
                      key={`obj-${idx}`}
                      onClick={() => speakText(obj)}
                      className={`group p-4 rounded-lg border-l-4 transition-all duration-200 cursor-pointer ${
                        a11y.highContrast
                          ? 'bg-zinc-800 border-zinc-700 hover:border-pcshs-orange border-l-pcshs-orange'
                          : 'bg-slate-50 border-slate-200 border-l-pcshs-blue hover:border-l-pcshs-orange hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="w-8 h-8 rounded-full bg-pcshs-blue text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
                          0{idx + 1}
                        </span>
                        <p className={`font-medium ${getFontSizeClass('body')} text-slate-800 dark:text-zinc-200 leading-relaxed`}>
                          {getSimplifiedText(obj, "วิเคราะห์เชิงเคมีวิธีเจนเนอรัล Kjeldahl", "ต้มย่อยสลายหาค่าไนโตรเจนเต้าหู้ในแล็บมาตรฐาน")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 🎯 HIGHEST PRIORITY 2: สมมติฐาน (HYPOTHESES) — DISPLAYED SECOND AS REQUIRED */}
              <section id="section-hypotheses" className={`rounded-2xl shadow-sm border p-6 md:p-8 transition-all ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div 
                  className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-6 cursor-help"
                  onClick={() => speakText("สมมติฐานโครงงานสี่ข้อ สัมพันธ์โดยตรงกับการทดลองแปรอัตราส่วน")}
                  title="คลิกเพื่อฟังเสียงอ่าน"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pcshs-orange text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-pcshs-blue/40">
                      02
                    </div>
                    <div>
                      <h2 className={`font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400 ${getFontSizeClass('heading')}`}>
                        2. สมมติฐาน (Scientific Hypotheses)
                      </h2>
                      <p className="text-xs text-slate-500 pl-3">กรอบการทดลองเพื่อคาดคะแนความเชื่อมโยงของผลลัพธ์</p>
                    </div>
                  </div>
                  {a11y.readingAssistance && (
                    <span className="text-orange-500 shrink-0 text-xs flex items-center gap-1 font-semibold">
                      <Volume2 className="w-4 h-4 animate-bounce" /> กดฟัง
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {project.hypotheses.map((hype, idx) => (
                    <div
                      key={`hype-${idx}`}
                      onClick={() => speakText(hype)}
                      className={`p-4 rounded-lg border-l-4 transition-all duration-150 cursor-pointer ${
                        a11y.highContrast
                          ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700/80 border-l-pcshs-orange'
                          : 'bg-slate-50 hover:bg-amber-50/20 border-slate-200 hover:border-l-pcshs-orange border-l-pcshs-blue'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <CheckCircle className="w-4 h-4 text-pcshs-orange shrink-0 animate-pulse" />
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-pcshs-orange uppercase tracking-wider block">สมมติฐานหลักข้อที่ {idx + 1}</span>
                          <p className={`font-medium mt-0.5 ${getFontSizeClass('body')} text-slate-700 dark:text-zinc-200 leading-relaxed`}>
                            {getSimplifiedText(hype, "มีนัยทางฟิสิกส์", "เห็นวิจัยชัดเจนด้วยแรงดึงเครื่องหนีบ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 📖 ABSTRACT SECTION (บทคัดย่อสองภาษา) */}
              <section id="section-abstract" className={`rounded-2xl shadow-sm border p-6 md:p-8 transition-all ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pcshs-blue-light text-white rounded-xl shadow-md">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className={`font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400 ${getFontSizeClass('heading')}`}>
                        3. บทคัดย่อ (Abstract)
                      </h2>
                      <p className="text-xs text-slate-500 pl-3">สรุปความเป็นมา ปริมาณการทดแทนกรดอะมิโนครบถ้วน และผลลัพธ์</p>
                    </div>
                  </div>
                </div>

                {/* Side-by-Side Multilingual Toggle View to make it stunning */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => speakText(project.abstractTh)}
                    className={`p-5 rounded-xl border cursor-pointer relative hover:shadow-sm transition-colors ${
                      a11y.highContrast 
                        ? 'bg-zinc-950 border-zinc-800' 
                        : 'bg-orange-50/45 border-orange-100'
                    }`}
                  >
                    <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-pcshs-orange text-white text-[10px] font-bold">TH</span>
                    <h3 className={`font-semibold mb-3 text-sm flex items-center gap-1 ${
                      a11y.highContrast ? 'text-pcshs-orange-light' : 'text-pcshs-blue'
                    }`}>
                      บทคัดย่อเนื้อหาภาษาไทย
                    </h3>
                    <p className={`text-justify ${getFontSizeClass('body')} ${
                      a11y.highContrast ? 'text-zinc-100' : 'text-slate-900'
                    }`}>
                      {getSimplifiedText(project.abstractTh, "คุณค่าทางโภชนาการ", "สารอาหารบำรุงวิจัย")}
                    </p>
                  </div>

                  <div className={`p-5 rounded-xl border relative hover:shadow-sm transition-colors ${
                    a11y.highContrast 
                      ? 'bg-zinc-950 border-zinc-800' 
                      : 'bg-blue-50/30 border-blue-100/60'
                  }`}>
                    <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded bg-pcshs-blue text-white text-[10px] font-bold">EN</span>
                    <h3 className={`font-semibold mb-3 text-sm ${
                      a11y.highContrast ? 'text-pcshs-orange-light' : 'text-pcshs-blue'
                    }`}>
                      English Summary Translation
                    </h3>
                    <p className={`text-justify text-sm ${
                      a11y.fontSize === 'normal' ? 'text-sm' : 'text-base'
                    } ${
                      a11y.highContrast ? 'text-zinc-200' : 'text-slate-800'
                    }`}>
                      {project.abstractEn}
                    </p>
                  </div>
                </div>
              </section>

              {/* 🏆 BENEFITS EXPECTED (ประโยชน์ที่คาดว่าจะได้รับ) */}
              <section id="section-benefits" className={`rounded-2xl shadow-sm border p-6 md:p-8 transition-all ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div 
                  className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-4 cursor-help"
                  onClick={() => speakText("คุณค่าและผลงานประโยชน์ของแผ่นเนื้อสามรวมชนิดนี้ที่มอบแก่สังคม")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className={`font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400 ${getFontSizeClass('heading')}`}>
                        4. คุณประโยชน์และการต่อยอดใช้งานจริง
                      </h2>
                      <p className="text-xs text-slate-500 pl-3">การขยายผลสติปัญญาทางนวัตกรรมอาหารสู่สังคมและเศรษฐกิจประเทศ</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-4">
                  {project.benefits.map((benefit, idx) => (
                    <div
                      key={`ben-${idx}`}
                      onClick={() => speakText(benefit)}
                      className="flex items-start gap-3 cursor-pointer hover:translate-x-1 transition-transform"
                    >
                      <div className="p-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 shrink-0 mt-0.5">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className={`${getFontSizeClass('body')} text-slate-700 dark:text-zinc-200`}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next Tab Triggers at the bottom of Tab 1 */}
              <div className="flex justify-end pt-4">
                <button
                  id="btn-goto-experiments"
                  onClick={() => {
                    setActiveTab('experiments');
                    setSelectedExperiment(project.experiments[0].id);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="bg-pcshs-orange hover:bg-pcshs-orange-dark text-white rounded-xl py-3 px-6 text-sm font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all hover:gap-3"
                >
                  <span>คลิกพาสู่ 8 ขั้นตอนการทดลองเชิงสถิติ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ==================== TAB 2: THE 8 EXPERIMENTS TIMELINE & TONE (AI LENS) ==================== */}
          {activeTab === 'experiments' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div id="experiments-core-header" className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pcshs-blue text-white rounded-lg">
                    <FlaskConical className="w-5 h-5 text-pcshs-orange shadow-sm" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400">8 ขั้นตอนและเป้าหมายการทดลองเชิงวิทยาศาสตร์เคมีอาหาร</h2>
                    <p className="text-xs text-slate-500 pl-3">คลิกเลือกปุ่มหมายเลขการทดลองด้านล่างเพื่อสลับพิจารณารายงานเชิงลึก</p>
                  </div>
                </div>
              </div>

              {/* 🔢 Interactive Stepper Numbers Button Array */}
              <div id="timeline-stepper" className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {project.experiments.map((exp, idx) => (
                  <button
                    key={exp.id}
                    id={`btn-stepper-${exp.id}`}
                    onClick={() => setSelectedExperiment(exp.id)}
                    className={`p-2.5 rounded-xl text-center font-bold text-sm transition-all cursor-pointer border ${
                      selectedExperiment === exp.id
                        ? 'bg-pcshs-orange text-white border-pcshs-orange shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-orange-50/45 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-medium">EXP</span>
                    <span className="text-lg">{idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* 🧪 Selected Experiment Card Display */}
              <article 
                id={`experiment-detail-card-${activeExperiment.id}`} 
                className={`rounded-2xl border shadow-md overflow-hidden transition-all duration-300 ${
                  a11y.highContrast ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-slate-200'
                }`}
              >
                {/* Visual Header / Banner of the selected experiment */}
                <div className="relative h-48 md:h-64 bg-slate-100 overflow-hidden">
                  <img
                    id={`img-experiment-${activeExperiment.id}`}
                    src={activeExperiment.imageUrl}
                    alt={activeExperiment.imageAlt}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4 md:p-6">
                    <div>
                      <span className="bg-pcshs-orange text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                        {activeExperiment.id === 'exp-8' ? '🏆 บูรณาการขั้นสุดท้าย' : 'การวิจัยถั่วเหลือง-อิมัลชัน'}
                      </span>
                      <h3 className="text-white text-lg md:text-2xl font-bold">
                        {activeExperiment.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Tab body content */}
                <div className="p-6 md:p-8 space-y-6">

                  {/* Objective sub-block */}
                  <div className="bg-orange-50/20 dark:bg-zinc-800/40 p-4 rounded-xl border border-orange-100/40 dark:border-zinc-700">
                    <h4 className="text-xs font-bold text-pcshs-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                      <AtomIcon className="w-3.5 h-3.5" /> วัตถุประสงค์ของการทดลองนี้ (Target Objective)
                    </h4>
                    <p className={`font-mono text-xs md:text-sm text-slate-700 dark:text-zinc-300 ${getFontSizeClass('body')}`}>
                      {activeExperiment.objective}
                    </p>
                  </div>

                  {/* Steps procedure block */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-pcshs-blue dark:text-orange-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-pcshs-orange" /> วิธีการดำเนินงานย่อยทีละขั้นตอน (Detailed Procedures):
                    </h4>
                    <ol className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {activeExperiment.procedure.map((step, sIdx) => (
                        <li
                          key={`step-${sIdx}`}
                          onClick={() => speakText(`ขั้นตอนที่ ${sIdx+1}: ${step}`)}
                          className="py-3 pl-2 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg p-1 transition-colors"
                        >
                          <span className="font-mono text-xs font-extrabold text-pcshs-orange shrink-0 bg-orange-100 border border-orange-200 dark:bg-zinc-800 dark:border-zinc-700 w-5.5 h-5.5 rounded-full flex items-center justify-center">
                            {sIdx + 1}
                          </span>
                          <span className={`${getFontSizeClass('body')} text-slate-700 dark:text-zinc-300`}>
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Result Summary Block */}
                  <div className="bg-emerald-50/20 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-xl">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> สรุปผลสรุปวิจัยย่อย (Experiment Conclusion):
                    </h4>
                    <p className={`text-slate-800 dark:text-zinc-200 font-medium ${getFontSizeClass('body')}`}>
                      {getSimplifiedText(activeExperiment.resultSummary, "อัตราสลายตัวของดินโปรตีน", "สัดส่วนเนื้อเจลถั่วที่จะยวบเหลวในซุป")}
                    </p>
                  </div>

                  {/* ==================== 🤖 INTERACTIVE AI LENS IMAGE EXPLAINMENT ==================== */}
                  <div id="ai-lens-image-explainer" className="border-t pt-6 border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-pcshs-blue dark:text-orange-400 text-sm md:text-base flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-pcshs-orange animate-spin" />
                          <span className="underline decoration-pcshs-orange decoration-2">กล้องเลนส์ AI: อธิบายภาพจำลองของส่วนนี้ (AI Visual Explainer)</span>
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-zinc-300 font-semibold mt-0.5">ปรับเปลี่ยนภาษาการเล่าเรื่องของวิทยาศาสตร์ให้เข้าใจง่ายตามกลุ่มผู้ดูของคุณ</p>
                      </div>

                      {/* 🔄 Explainer Mode Toggle Buttons */}
                      <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-center">
                        <button
                          id={`btn-tone-normal-${activeExperiment.id}`}
                          onClick={() => setExperimentTone(prev => ({ ...prev, [activeExperiment.id]: 'normal' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            (experimentTone[activeExperiment.id] || 'normal') === 'normal'
                              ? 'bg-pcshs-orange text-white shadow'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                          }`}
                        >
                          ทั่วไป 🍊
                        </button>
                        <button
                          id={`btn-tone-scientific-${activeExperiment.id}`}
                          onClick={() => setExperimentTone(prev => ({ ...prev, [activeExperiment.id]: 'scientific' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            (experimentTone[activeExperiment.id] || 'normal') === 'scientific'
                              ? 'bg-pcshs-blue text-white shadow'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                          }`}
                        >
                          นักวิชาการ 🔬
                        </button>
                        <button
                          id={`btn-tone-kids-${activeExperiment.id}`}
                          onClick={() => setExperimentTone(prev => ({ ...prev, [activeExperiment.id]: 'kids' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            (experimentTone[activeExperiment.id] || 'normal') === 'kids'
                              ? 'bg-teal-600 text-white shadow'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                          }`}
                        >
                          ประถม/เด็ก 🧸
                        </button>
                      </div>
                    </div>

                    {/* AI explanation bubble text container */}
                    <div 
                      onClick={() => {
                        const tone = experimentTone[activeExperiment.id] || 'normal';
                        const txt = activeExperiment.imageExplanationAI?.[tone] || '';
                        speakText(txt);
                      }}
                      className="p-5 rounded-2xl bg-slate-100/80 dark:bg-zinc-800/90 border-2 border-dashed border-slate-400 dark:border-zinc-650 hover:border-pcshs-orange transition-all cursor-play"
                      title="กดเพื่อให้อ่านออกเสียงคำอธิบายรูปจาก AI"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1 shrink-0 select-none">
                          {(experimentTone[activeExperiment.id] || 'normal') === 'kids' ? '💬' : '🤖'}
                        </span>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-zinc-700 dark:text-zinc-100 inline-block mb-2">
                            ระดับคำอธิบายกลุ่มจำเพาะ: {(experimentTone[activeExperiment.id] || 'normal') === 'kids' ? 'เยาวชนสนุกสนาน' : (experimentTone[activeExperiment.id] || 'normal') === 'scientific' ? 'นักวิทยาศาสตร์เชิงทฤษฎี' : 'ผู้บริโภคบุคคลทั่วไป'}
                          </span>
                          <p className={`font-bold not-italic ${getFontSizeClass('body')} text-slate-900 dark:text-white`}>
                            {activeExperiment.imageExplanationAI?.[experimentTone[activeExperiment.id] || 'normal']}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-800 dark:text-zinc-200 font-extrabold border-t pt-2 border-slate-300 dark:border-zinc-700">
                            <span className="flex items-center gap-1">💡 <span className="underline decoration-pcshs-orange decoration-1">คลิกที่กรอบฟองข้อความเพื่อเปิดเสียงพากย์วิเคราะห์</span></span>
                            <span>ซ.ภ. AI Assistant Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </article>

              {/* 🏆 Recommendations section in experiments tab to show completeness */}
              <section id="experiments-recommendations" className={`rounded-xl border shadow p-6 ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-bold text-pcshs-blue-light dark:text-orange-400 heading text-base md:text-lg mb-4 flex items-center gap-1.5">
                  <Info className="w-5 h-5 text-pcshs-orange" />
                  <span>ข้อเสนอแนะเพื่อขยายขอบเขตการทดลอง (Scientific Recommendations)</span>
                </h3>
                <ul className="space-y-2">
                  {project.recommendations.map((rec, rIdx) => (
                    <li key={`rec-${rIdx}`} className="flex items-start gap-2.5">
                      <span className="p-1 rounded-full bg-orange-100 text-pcshs-orange text-xs shrink-0 mt-1">📌</span>
                      <p className={`text-slate-700 dark:text-zinc-300 ${getFontSizeClass('body')}`}>
                        {rec}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          )}

          {/* ==================== TAB 3: AI LAB ADVISORY WIDGET & DRAG/DROP EXPLORER ==================== */}
          {activeTab === 'ai-lab' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div id="ai-lab-header" className="pb-3 border-b border-slate-200 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pcshs-orange animate-bounce" />
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 border-l-4 border-pcshs-orange pl-3 dark:text-amber-400">ห้องปฏิบัติการวิทยาศาสตร์อัจฉริยะ (PCSHS AI Food-Science Room)</h2>
                  <p className="text-xs text-slate-500 pl-3">ทดลองให้ AI ที่ปรึกษาตรวจให้คะแนน เสนอโครงงาน หรือวิเคราะห์ความพร้อมวัตถุดิบลายไขมันพืช</p>
                </div>
              </div>

              {/* Sub-widget 1: AI Critic Consultation and custom questions advice */}
              <section id="section-ai-critic" className={`rounded-2xl border shadow p-6 space-y-6 ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div className="space-y-2">
                  <h3 className="font-bold text-pcshs-blue dark:text-orange-400 flex items-center gap-1.5">
                    <MessageSquare className="w-5 h-5 text-pcshs-orange" />
                    <span>สอบถามขอคำแนะนำที่ปรึกษาโครงงานวิชาการวิทยาศาสตร์</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    พิมพ์รายละเอียดหรือไอเดียเนื้อเทียมเพิ่มเพื่อขอความคิดเห็นเชิงเคมีวิเคราะห์ หรือวิกฤติสารควบคุมความหนืดของก้อนคาราจีแนน
                  </p>
                </div>

                {/* Grid of sample suggestions */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-400 block uppercase">ปุ่มด่วนเลือกหัวข้อขอคำตอบยอดฮิต:</span>
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((sq, iIdx) => (
                      <button
                        key={iIdx}
                        id={`btn-sample-question-${iIdx}`}
                        onClick={() => {
                          setCustomQuestion(sq.q);
                          handleConsultAI(sq.q);
                        }}
                        className="bg-slate-100 hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 hover:text-pcshs-orange border border-slate-200 dark:border-zinc-700 text-xs py-2 px-3 rounded-lg text-left transition-all max-w-full truncate font-medium cursor-pointer"
                      >
                        ⚡ {sq.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input block */}
                <div className="space-y-3">
                  <textarea
                    id="input-consult-ai"
                    rows={4}
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="พิมพ์โครงงาน นวัตกรรม หรือข้อสงสัยเคมีของคุณตรงนี้ได้เลยครับ ครูที่ปรึกษา AI พร้อมตอบคุณแล้ว..."
                    className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-pcshs-orange focus:border-transparent outline-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">เนื้อที่พิมพ์จะอ้างอิงสูตรธัญพืชของโครงการเนื้อเทียม ซ.ภ. และเป้าหมาย Kjeldahl</span>
                    <button
                      id="btn-trigger-consult-ai"
                      onClick={() => handleConsultAI(customQuestion)}
                      disabled={isConsulting || !customQuestion.trim()}
                      className="bg-pcshs-orange text-white py-2 px-5 rounded-lg text-xs font-bold hover:bg-pcshs-orange-dark shadow transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {isConsulting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>กำลังประมวลผลข้อคิดเห็น...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ขอคำปรึกษาด่วนกับที่ปรึกษา AI ⚡</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Advice result render panel */}
                {aiConsultResult && (
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    aiIsMock 
                      ? 'border-dashed border-orange-200 bg-amber-50/15 dark:bg-zinc-800' 
                      : 'border-emerald-200 bg-emerald-50/10 dark:bg-zinc-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">👩‍🔬</span>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="font-bold text-slate-800 dark:text-zinc-100 text-xs md:text-sm">
                            ผลการตอบพิจารณาจากที่ปรึกษาเคมีอาหาร ซ.ภ.
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                            {aiIsMock ? 'คลาสรูมโหมดจำลอง' : 'คลาวด์ไลฟ์ Gemini API'}
                          </span>
                        </div>
                        {/* Text rendering with newlines support */}
                        <div className={`text-slate-700 dark:text-zinc-200 leading-relaxed text-sm whitespace-pre-wrap ${getFontSizeClass('body')}`}>
                          {aiConsultResult}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>คัดสรรความเชื่อมกรดอมิโน 9 ชนิดครบสูตรเพื่อสุขภาพไทย</span>
                          <button
                            onClick={() => {
                              speakText(aiConsultResult);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded text-xs shrink-0 flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> พากย์เสียงบทวิเคราะห์นี้
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Sub-widget 2: Real-time Cloud Image Custom Scanner Explainer */}
              <section id="section-image-scanner" className={`rounded-2xl border shadow p-6 space-y-6 ${
                a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
              }`}>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-pcshs-blue dark:text-orange-400 flex items-center gap-1.5 text-base md:text-lg">
                    <Eye className="w-5 h-5 text-pcshs-orange" />
                    <span className="underline decoration-pcshs-orange decoration-2">กล่องจำลองและกล้องอุตสาหกรรมวิเคราะห์รูปภาพด้วย AI</span>
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-zinc-200 font-bold bg-orange-50/30 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-orange-100 dark:border-zinc-800">
                    อัปโหลดรูปภาพกิจกรรมโครงงานอาหาร ขนมปัง เนื้อสัตว์เทียมของคุณเอง หรือเลือกสับรูปภาพต้นแบบ เพื่อให้ AI จำหลักอธิบายริ้วรอยละเอียด
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left sub-block: Interactive drag-drop file input or preset picker */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-100 block uppercase border-b pb-1 mb-2">เลือกรูปภาพจากการทดลองต้นแบบ:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((preset, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => handleSelectPresetFile(preset.url, preset.name)}
                          className={`p-2 rounded-xl border max-w-full text-left transition-all hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer ${
                            uploadedFileName === preset.name
                              ? 'border-pcshs-orange bg-orange-50/40 font-bold'
                              : 'border-slate-350 dark:border-zinc-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-20 object-cover rounded-lg mb-1.5 select-none"
                          />
                          <p className="text-[10px] text-slate-900 dark:text-zinc-150 font-bold truncate">{preset.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 border-slate-300 dark:border-zinc-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-100 block mb-2 uppercase">หรืออัปโหลดไฟล์จริงจากระบบคุณ:</span>
                      <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-400 dark:border-zinc-650 rounded-xl hover:border-pcshs-orange cursor-pointer hover:bg-orange-50/15 bg-slate-50/50 dark:bg-zinc-900/10">
                        <Upload className="w-8 h-8 text-pcshs-orange dark:text-orange-400 mb-2 animate-bounce" />
                        <span className="text-xs text-slate-900 dark:text-white font-extrabold">กดเพื่ออัปโหลดไฟล์รูปภาพวิจัย (.JPG / .PNG)</span>
                        <input
                           id="file-upload-input"
                           type="file"
                           accept="image/*"
                           onChange={handleImageChange}
                           className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Right sub-block: Current uploaded preview and analysis controls */}
                  <div className="flex flex-col justify-between space-y-4 border-l pl-0 md:pl-6 border-slate-300 dark:border-zinc-800">
                    <div className="space-y-3 flex-1">
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-100 block uppercase border-b pb-1 mb-2">รูปภาพที่พร้อมวิเคราะห์ในขณะนี้:</span>
                      {userImage ? (
                        <div className="relative rounded-xl overflow-hidden border shadow-inner max-h-48 flex items-center justify-center bg-slate-900">
                          <img
                            src={userImage}
                            alt="พร้อมตรวจ"
                            className="max-h-48 object-contain"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase shadow">
                            ตรวจสอบแล้ว
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 rounded-xl bg-slate-200/50 dark:bg-zinc-800/80 flex items-center justify-center text-xs text-slate-700 dark:text-zinc-200 font-extrabold border-2 border-dashed border-slate-300 dark:border-zinc-700 text-center p-4">
                          กรุณาเลือกรูปภาพจำลองทางด้านซ้าย หรืออัปโหลดไฟล์จริงเพื่อทดลองใช้งานกล้องสแกน AI
                        </div>
                      )}

                      {/* Tone changer for image analysis explanation */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-800 dark:text-zinc-200">เลือกกลุ่มกลุ่มเป้าหมายที่จะให้อ่านคำอธิบาย:</label>
                        <select
                          id="select-custom-tone"
                          value={customUploadTone}
                          onChange={(e: any) => setCustomUploadTone(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-400 dark:border-zinc-650 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold"
                        >
                          <option value="normal">บุคคลธรรมดาทั่วไป - สื่อเข้าใจง่ายในครัวเรือน 🍊</option>
                          <option value="scientific">นักวิทยาการเคมี - สื่อหลักการ ฟิสิกส์ สถิติ 🔬</option>
                          <option value="kids">น้องๆประถม/เด็ก - สนุกสนาน เปรียบเปรยเหมือนการ์ตูน 🧸</option>
                        </select>
                      </div>
                    </div>

                    <button
                      id="btn-analyze-image"
                      onClick={handleAnalyzeImage}
                      disabled={isAnalyzingImage || !userImage}
                      className="w-full bg-pcshs-orange text-white py-3 px-6 rounded-xl text-xs font-bold hover:bg-pcshs-orange-dark shadow transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isAnalyzingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>AI กำลังเพดานสแกนและประมวลผลข้อความ...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>วิเคราะห์ด้วยคลาวด์อิมเมจ AI 🤖</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-widget analysis results rendering */}
                {aiAnalysisResult && (
                  <div className={`p-6 rounded-2xl border-2 transition-all ${
                    imageAnalysisIsMock 
                      ? 'border-dashed border-orange-200 bg-amber-50/15 dark:bg-zinc-800' 
                      : 'border-emerald-200 bg-emerald-50/10 dark:bg-zinc-900'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="font-bold text-slate-800 dark:text-zinc-100 text-xs md:text-sm">
                            บทวิเคราะห์แผ่นริ้วรอยจำลองภาพโดย AI เกรดพรีเมียม
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                            {imageAnalysisIsMock ? 'โครงร่างโหมดจำลอง' : 'ใช้งานจริง Gemini API'}
                          </span>
                        </div>
                        <div className={`text-slate-700 dark:text-zinc-200 leading-relaxed text-sm whitespace-pre-wrap ${getFontSizeClass('body')}`}>
                          {aiAnalysisResult}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t pt-2">
                          <span>กลั่นโปรตีนด้วยกลไก Kjeldahl ต้านการหอมหืนน้ำมันมะพร้าว</span>
                          <button
                            onClick={() => speakText(aiAnalysisResult)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 px-3 py-1 rounded text-xs shrink-0 flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> และพากย์ออกเสียงไทย
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Info Side Dashboard (4 units on wide screens, full on smaller) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* 📙 Quick Overview Panel on Meat substitute properties */}
          <section id="sidebar-science-properties" className={`p-6 rounded-2xl border shadow-sm space-y-4 transition-all ${
            a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm text-pcshs-blue dark:text-orange-400 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-pcshs-orange" />
              <span>ดัชนีโภชนาการเนื้อพืช ซ.ภ. (Nutritional Density)</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50/20 dark:bg-zinc-800/60 text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-400">เป้าหมายโปรตีน (ต่อ 100g):</span>
                <span className="font-mono font-bold text-pcshs-orange">~ 50.0 กรัม</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/10 dark:bg-zinc-800/60 text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-400">การยืนยันเคมีเป๊ะ (Kjeldahl Method):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">49.3 กรัม / 49.3%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/10 dark:bg-zinc-800/60 text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-400">กรดอะมิโนจำเป็น (9 Essential Aminos):</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">ครบสมบูรณ์แบบ 100%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50/20 dark:bg-zinc-800/60 text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-400">ไขมันอิมัลชันแทรกลาย:</span>
                <span className="font-mono font-bold text-pcshs-orange">น้ำมันมะพร้าว + คาราจีแนน (1:9)</span>
              </div>
            </div>

            {/* Micro comparison layout */}
            <div className="border-t pt-3 border-slate-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block mb-1">COMPARED TO COMMERCIAL MEAT</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-1 border rounded border-slate-150">
                  <span className="block text-slate-400">เนื้อสัตว์บดจริง</span>
                  <span className="font-bold text-slate-700 dark:text-zinc-300">โปรตีน 20-25g</span>
                </div>
                <div className="p-1 border border-pcshs-orange/30 rounded bg-orange-50/10 text-pcshs-orange">
                  <span className="block text-slate-400 text-pcshs-orange/70">สูตรสามสหายสมบูรณ์</span>
                  <span className="font-bold">โปรตีน 50g (สูงกว่า 2 เท่า!)</span>
                </div>
              </div>
            </div>
          </section>

          {/* 🌿 Materials Used Visual List */}
          <section id="sidebar-plant-materials" className={`p-6 rounded-2xl border shadow-sm space-y-4 transition-all ${
            a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm text-pcshs-blue dark:text-orange-400 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-pcshs-orange" />
              <span>คลังชีวมณฑลวัตถุดิบล้ำยุค (Base Ingredients)</span>
            </h3>

            <div className="space-y-4">
              {/* Soybean profile */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 shrink-0 flex items-center justify-center font-bold text-xs">
                  ถอย
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">ถั่วเหลืองดิบคัดเกรด (Pure Soybeans)</span>
                  <p className="text-[11px] text-slate-500">มอบกรดอะมิโนจำพวกไอโซลูซีน และลิวซีน แกนหลักสร้างเนื้อเหนียว</p>
                </div>
              </div>

              {/* Quinoa profile */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 shrink-0 flex items-center justify-center font-bold text-xs">
                  ควิน
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">ควินัวพรีเมียมสามสี (Quinoa Seed Complex)</span>
                  <p className="text-[11px] text-slate-500">ซัพพลายโปรตีนสากลและแร่ธาตุวิตามินบี พร้อมเพิ่มสัมผัสเคี้ยวขัดฟันพรีเมียม</p>
                </div>
              </div>

              {/* Chia seed profile */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0 flex items-center justify-center font-bold text-xs">
                  เจีย
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">เมล็ดเจียธรรมชาติพองตัว (Chia Mucilage Fiber)</span>
                  <p className="text-[11px] text-slate-500">มอบใยเจลาตินสารกาวเหนียวยึดอุ้มน้ำ ป้องกันแผ่นแห้งสลายเวลานำไปถอดร้อน</p>
                </div>
              </div>

              {/* Coconut Oil Profile */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0 flex items-center justify-center font-bold text-xs">
                  มะพร
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-zinc-200 block">น้ำมันมะพร้าว + คาราจีแนนสาหร่าย (Saturated Oil Emulsion)</span>
                  <p className="text-[11px] text-slate-500">เซ็ตเจลลี่แข็งในอุณหภูมิเย็น ละลายหอมเยิ้มในเตาไฟ เสมือนสัมผัสมันอาร์กติกแทรก</p>
                </div>
              </div>
            </div>
          </section>

          {/* 📢 Fast Navigation Drawer Shortcuts */}
          <section id="sidebar-shortcut-nav" className={`p-6 rounded-2xl border shadow-sm space-y-3 transition-all ${
            a11y.highContrast ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest block">คู่มือลัดขั้นตอนวิจัยถั่ว (Fast Nav)</h3>
            <div className="space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setTimeout(() => {
                    document.getElementById('section-objectives')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left p-2 rounded hover:bg-orange-50/50 dark:hover:bg-zinc-850 hover:text-pcshs-orange flex items-center justify-between cursor-pointer"
              >
                <span>1. วัตถุประสงค์ (Objectives)</span>
                <ArrowRight className="w-3 h-3 text-pcshs-orange" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setTimeout(() => {
                    document.getElementById('section-hypotheses')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left p-2 rounded hover:bg-orange-50/50 dark:hover:bg-zinc-850 hover:text-pcshs-orange flex items-center justify-between cursor-pointer"
              >
                <span>2. สมมติฐาน (Hypotheses)</span>
                <ArrowRight className="w-3 h-3 text-pcshs-orange" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setTimeout(() => {
                    document.getElementById('section-abstract')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left p-2 rounded hover:bg-orange-50/50 dark:hover:bg-zinc-850 hover:text-pcshs-orange flex items-center justify-between cursor-pointer"
              >
                <span>3. บทคัดย่อโครงงาน (Abstract)</span>
                <ArrowRight className="w-3 h-3 text-pcshs-orange" />
              </button>
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setTimeout(() => {
                    document.getElementById('section-benefits')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full text-left p-2 rounded hover:bg-orange-50/50 dark:hover:bg-zinc-850 hover:text-pcshs-orange flex items-center justify-between cursor-pointer"
              >
                <span>4. ประโยชน์โภชนาการพืช</span>
                <ArrowRight className="w-3 h-3 text-pcshs-orange" />
              </button>
            </div>
          </section>

          {/* 🏷️ PCSHS Scientific Motto Card Block */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-pcshs-blue to-pcshs-blue-light text-white text-xs border border-pcshs-orange/30 shadow-md relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-pcshs-orange/20 rounded-full" />
            <Award className="w-8 h-8 text-pcshs-orange pb-2" />
            <p className="font-medium italic leading-relaxed text-slate-200">
              "เพราะการวิสัชนาเคมีและนวัตกรรมอาหารในโรงเรียนวิทยาศาสตร์ของเรา คือหนทางขับเคลื่อนความยั่งยืนที่เข้าถึงคุณประโยชน์ของผู้ใช้งานขี่พืชพรรณท้องถิ่นไทยในภายภาครองหน้า"
            </p>
            <span className="block text-right mt-3 text-[10px] text-pcshs-orange-light font-bold">
              โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย นครศรีธรรมราช
            </span>
          </div>

        </aside>

      </main>

      {/* 🔮 Footer */}
      <footer id="applet-primary-footer" className={`mt-auto transition-colors border-t py-12 px-4 shadow-inner ${
        a11y.highContrast 
          ? 'bg-zinc-950 border-zinc-800 text-zinc-500' 
          : 'bg-pcshs-blue-dark border-zinc-900 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <img
              src="/assets/input_file_5.png"
              onError={(e) => {
                e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Logo_of_Princess_Chulabhorn_Science_High_School_Nakhon_Si_Thammarat.png";
              }}
              alt="ตราสัญลักษณ์โรงเรียน"
              className="w-10 h-10 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span>PCSHS Science Project Hub - PCSHS Nakhon Si Thammarat</span>
              </h4>
              <p className="text-xs text-slate-500">
                แพลตฟอร์มคัดสรรและวิเคราะห์เนื้อสมมูลโปรตีนสูงเพื่อผู้บริโภคมังสวิรัติด้วยขีปนาวุโส AI
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <button onClick={() => { setActiveTab('overview'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer">หน้าหลักบทสรุป</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => { setActiveTab('experiments'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer">บัญชี 8 การทดลอง</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => { setActiveTab('ai-lab'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer">ห้องประเมินผล AI</button>
          </div>

          <div className="text-[11px] text-slate-500">
            <span>© 2026 Princess Chulabhorn Science High School. All Rights Reserved.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Inline fallback light atoms for full safety in compiles
function AtomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18" />
      <path d="M12 2v20" />
      <path d="M22 12H2" />
    </svg>
  );
}

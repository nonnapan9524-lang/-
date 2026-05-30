/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Lazy-initialize Gemini client to prevent crashing if GEMINI_API_KEY is not set
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (aiClient) return aiClient;

  // Let's check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ ค้นไม่พบคีย์อิมเมจในสภาพแวดล้อม (GEMINI_API_KEY) โปรดตรวจสอบหน้า Settings > Secrets");
  }

  aiClient = new GoogleGenAI({
    apiKey: apiKey || 'MOCK_API_KEY', // Fallback to avoid error on startup
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // For handling base64 uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ limit: '30mb', extended: true }));

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Analyze and Explain Image Endpoint using Gemini
  app.post('/api/explain-image', async (req, res) => {
    const { image, mimeType, title, mode } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพสำหรับการวิเคราะห์' });
    }

    try {
      // Lazy init of Gen AI
      const ai = getGenAI();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // If API key is missing, provide a friendly Mock analysis to demonstrate the capability
        console.log("Mocking Gemini response because GEMINI_API_KEY is missing");
        setTimeout(() => {
          let mockDescription = "";
          if (mode === 'kids') {
            mockDescription = ` น้อง ๆ หนู ๆ เห็นวงจรนี้ไหมเอ่ย? 🧪 นี่คือ "เครื่องตรวจวัดสุขภาพต้นไม้จิ๋ว" ของพี่ ๆ โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัยนะ! 🌳 ประกอบด้วยแถบวัดความชื้นปักลงดินและแผงวงจรไฟกะพริบ เมื่อต้นไม้กระหายน้ำ มันจะส่งสัญญาณเตือนเป็นรูปอิโมจิเศร้า 😢 ให้เราตักน้ำมารดจนกว่าจะเปลี่ยนเป็นอิโมจิยิ้ม 😊 สนุกและเข้าใจง่ายใช่ไหมล่ะคุณผู้ใช้กลุ่มเยาวชน!`;
          } else if (mode === 'scientific') {
            mockDescription = `🔬 **ข้อมูลเชิงวิชาการ (Academic Insights):** ภาพแสดงแผงวงจรต้นแบบ Embedded System ควบคุมเซนเซอร์วัดค่าความต้านทานไฟฟ้าของดิน (Soil Moisture Sensor Model-02) มีไมโครคอนโทรลเลอร์ ESP32 เชื่อมต่อเครือข่ายไร้สายผ่านโปรโตคอล MQTT ผลลัพธ์จากการทดลองระบุว่า ความคลาดเคลื่อนเฉลี่ยอยู่ในระดับต่ำกว่า ±1.4% มีการซีลกันน้ำ IP65 ป้องกันความเขื้นในสภาพแวดล้อมจริง เหมาะกับการขยายผลในระดับแปลงเกษตรโรงเรือนอัจฉริยะ (Smart Greenhouse Manager)`;
          } else {
            mockDescription = `🍊 **คำอธิบายสำหรับบุคคลทั่วไป:** ภาพจำลองชุดโครงงาน "ตู้วัดสุขภาพต้นไม้ประหยัดพลังงาน" ของพวกเราครับ ส่วนหลักตรงกลางคือชุดแผงวงจรไมโครชิปสัญชาติไทย โดยขอบด้านล่างมีหัวต่อสายสีส้มสดใสโยงไปยังเข็มวัดความชื้นสีน้ำเงิน ซึ่งจะใช้ปักลงในดินกระถางเพื่อส่งค่าความชื้นขึ้นระบบ Cloud ช่วยให้เกษตรกรหรือทุกคนดูข้อมูลได้ผ่านเว็บนี้ สรุปง่าย ๆ ก็คือ "มันช่วยบอกได้ว่า ถึงเวลาที่ต้องรดน้ำต้นไม้หรือยัง" โดยที่ทุกคนไม่ต้องคาดเดาเอง สะดวกและลดปัญหาต้นไม้ตายคันดินได้ยอดเยี่ยมเลยล่ะครับ!`;
          }
          return res.json({ text: mockDescription, isMock: true });
        }, 1500);
        return;
      }

      // We need to clean base64 data string (remove prefixes like data:image/png;base64,)
      let base64Data = image;
      let actualMime = mimeType || 'image/png';

      if (image.includes(';base64,')) {
        const parts = image.split(';base64,');
        const mimePart = parts[0];
        actualMime = mimePart.replace('data:', '');
        base64Data = parts[1];
      }

      const imagePart = {
        inlineData: {
          mimeType: actualMime,
          data: base64Data,
        },
      };

      const systemPrompt = `คุณเป็นครูและหัวหน้านักวิทยาศาสตร์รางวัลระดับโลกของกลุ่มโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย (Princess Chulabhorn Science High School) ที่อบอุ่นและมีเมตตา มีหน้าที่ช่วยอธิบายภาพของหัวข้อโครงงานวิทยาศาสตร์ต่อไปนี้ให้กับผู้ใช้หลากหลายกลุ่ม
หัวข้อของภาพนี้เกี่ยวข้องกับ: "${title || 'ไม่ระบุหัวข้อโครงงาน'}"

โปรดเขียนคำอธิบายด้วยภาษาไทยที่สะอาด น่าอ่าน เรียบร้อย และเข้าถึงได้ง่าย (Accessible and Friendly) โดยปรับตามระดับความลึกที่เลือกดังนี้:
1. หากโหมดผู้ใช้คือ 'kids' (เยาวชน/ภาษาอย่างง่าย): จงใช้คำเปรียบเทียบที่เห็นภาพ อบอุ่น สนุกสนาน คล้ายเล่าเรื่องวิทยาศาตร์แสนสนุกให้เด็กประถมฟัง มีอิโมจิน่ารักที่สื่อความหมายพอเหมาะ หลีกเลี่ยงคำศัพท์ที่ยากจนเกินไป
2. หากโหมดผู้ใช้คือ 'scientific' (นักวิชาการ/กรรมการการประกวด): จงเขียนในเชิงเทคนิค ระบบ สถิติ ตัวแปร หรือหลักการทำงานตามสากลวิทยาศาสตร์ เน้นความเป็นเหตุเป็นผลและผลลัพธ์ที่วัดค่าได้จริง แต่อ่านแล้วเข้าใจโครงสร้างทันที ไม่เยิ่นเย้อ
3. หากโหมดผู้ใช้คือ 'normal' (บุคคลทั่วไป/ผู้ใช้ทุกคน): จงเขียนให้ทุกคนอ่านเข้าใจ อธิบายคำศัพท์วิทยาศาสตร์ในบริบทที่ประยุกต์ใช้งานจริงในชีวิตประจำวันอย่างเป็นมิตร สื่อถึงคุณค่าที่โครงงานนี้มอบให้สังคม

กฎสำคัญ:
- อธิบายสิ่งที่มีในรูปภาพเป็นหลัก และเชื่อมโยงไปที่หัวข้อโครงงานวิทยาศาสตร์
- เขียนเฉพาะส่วนข้อความที่จะตอบผู้ใช้อย่างงดงามและถูกต้องในภาษาไทย ไม่ต้องสร้าง Markup รอบนอกที่ดูรกตา ใช้ Markdown ล้อมหัวข้อเพื่อความสแกนอ่านง่าย
- ห้ามกล่าวอ้างตัวแปรใดๆ ที่คุณกุขึ้นมาเองซึ่งไม่น่าเกี่ยวข้องกับโครงงานวิทยาศาสตร์
- เขียนแนะนำต่อท้ายรูปภาพว่า ผู้ใช้น่าจะพิจารณาสังเกตจุดใดในรูปภาพมากที่สุดเป็นพิเศษ`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [imagePart, { text: `กรุณาอธิบายในโหมดสำหรับ: ${mode || 'normal'}` }],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text || 'ไม่สามารถวิเคราะห์หาคำอธิบายที่เหมาะสมได้', isMock: false });

    } catch (apiError: any) {
      console.error('Error with Gemini API:', apiError);
      return res.status(500).json({ error: `เกิดข้อผิดพลาดในการเรียกใช้ระบบวิเคราะห์รูปภาพด้วย AI: ${apiError?.message || apiError}` });
    }
  });

  // 2. Project Advisory & Suggestion Assistant using Gemini
  app.post('/api/consult-project', async (req, res) => {
    const { title, abstract, userQuestion, category } = req.body;

    try {
      const ai = getGenAI();
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.log("Mocking Consult response because GEMINI_API_KEY is missing");
        setTimeout(() => {
          const mockFeedback = `⭐ **ข้อเสนอแนะในการปรับปรุงโครงงานจากวิทยาศาสตร์จุฬาภรณราชวิทยาลัย (Mock AI Consultant)**

ขอบคุณที่เสนไอเดียโครงงานระดับพรีเมียมเข้ามาครับ เพื่อให้โครงงาน **"${title || 'โครงงานที่ระบุ'}"** ของคุณได้มาตรฐานโรงเรียนวิทยาศาสตร์ชั้นนำของประเทศ นี่คือข้อคิดและจุดเสนอแนะหลัก 3 ข้อครับ:

1. 🎯 **ความสอดคล้องเชิงสถิติ (Statistical Rigor):**
   ในรายงาน ให้ระบุจํานวนซ้ำสําหรับการทดลองแนะนําให้ทําอย่างน้อย 3-5 ซ้ำ (Replicates) เพื่อหาค่าเฉลี่ยและส่าคัญคือความคลาดเคลื่อนทางมาตรฐาน (Standard Error) เพื่อความถูกต้องน่าเชื่อถือของโครงงานกลุ่มสาขา ${category || 'วิทยาศาสตร์'}
2. 🌿 **การต่อยอดและประโยชน์ท้องถิ่น (Local Innovation Application):**
   เพื่อมุ่งสู่การชนะเลิศ ให้ระบุแนวทางการประยุกต์ใช้วัสดุเหลือทิ้งในชุมชนหรือใช้สิ่งประดิษฐ์ในบริบทชีวิตเกษตรกรรอบโรงเรียน ซ.ภ. ของท่านเพื่อให้เกิดคุณค่าทางชีวมณฑล (Bio-economy)
3. 📱 **การรับรู้ผ่าน UI ที่เข้าถึงง่าย (A11y Visual Delivery):**
   อภิปรายผลด้วยการแปลรูปแบบข้อความเป็นภาพกราฟที่เด่นชัด (Data Visualization) จะช่วยดึงดูดกรรมการบุคคลทั่วไปได้เร็วที่สุด

หวังว่าคำแนะนำนี้จะช่วยผลักดันโครงงานของน้อง ๆ ไประดับนานาชาติได้นะครับ! ✨`;
          return res.json({ text: mockFeedback, isMock: true });
        }, 1200);
        return;
      }

      const prompt = `ในฐานะที่ปรึกษาโครงงานวิทยาศาสตร์อาวุโสแห่งกลุ่มโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ที่มีความเชี่ยวชาญการประเมินวิจัยเพื่อส่งประกวดระดับประเทศและระดับสากล (เช่น Intel ISEF, งานวิชาการนวัตกรรม ซ.ภ.)
ข้อมูลโครงงานที่ส่งมาขอคำปรึกษา:
- ชื่อโครงงาน: ${title}
- สาขาหลัก: ${category || 'ไม่ระบุสาขา'}
- บทคัดย่อ/รายละเอียดเบื้องต้น: ${abstract}

คำถามหรือจุดที่ผู้ใช้ขอคำปรึกษาเป็นพิเศษ: "${userQuestion || 'ต้องการให้วิเคราะห์ความพร้อมและความน่าสนใจภาพรวม พร้อมแนวทางปรับปรุงและเป้าหมายการทดลองเพิ่มเติม'}"

จงตอบด้วยภาษาไทยที่สุภาพ เป็นมืออาชีพ เปี่ยมด้วยความหวังและพลังบวก สร้างแรงบันดาลใจ โดยจัดระเบียบเนื้อหาเป็นหัวข้อ Markdown:
1. 💡 **การประเมินโครงงานภาพรวม (Overall Evaluation):** จุดเด่นและคุณค่าเชิงนวัตกรรม
2. 🛠️ **ประเด็นที่ควรปรับปรุงเพิ่มเติม (Constructive Feedback):** เน้นรายละเอียดทางวิทยาศาสตร์ (เช่น ควบคุมตัวแปรต้น ตัวแปรตาม ตัวแปรควบคุมอย่างไร, สถิติวิจัย หรือความคลาดเคลื่อน)
3. 🚀 **ข้อเสนอแนะเพื่อการต่อยอดทางเทคโนโลยีหรือชุมชน (Future Potential):** การนำไปประยุกต์ใช้จริงหรือแนวทางเพื่อมุ่งสู่เชิงพาณิชย์/ช่วยเหลือท้องถิ่น
4. 🍊💙 **คำคมสร้างแรงบันดาลใจของนักวิจัย ซ.ภ.**`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.75,
        },
      });

      return res.json({ text: response.text || 'ไม่สามารถประมวลผลคำปรึกษาได้ในขณะนี้', isMock: false });

    } catch (consultError: any) {
      console.error('Error with Gemini Consult API:', consultError);
      return res.status(500).json({ error: `เกิดข้อผิดพลาดจากปัญญาประดิษฐ์ในการประเมินคำขอพิจารณา: ${consultError?.message || consultError}` });
    }
  });

  // Serve static application inside container integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PCSHS Showroom Server] Running successfully on port http://localhost:${PORT}`);
  });
}

startServer();

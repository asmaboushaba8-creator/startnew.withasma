import { useState } from "react";

const GOALS = [
  { label: "🎓 باك", val: "اجتياز شهادة البكالوريا" },
  { label: "📚 جامعة", val: "النجاح في الجامعة" },
  { label: "🚀 مشروع", val: "إطلاق مشروع شخصي" },
  { label: "🌍 لغة", val: "تعلم لغة جديدة" },
  { label: "💪 عادات", val: "بناء عادات صحية" },
  { label: "💼 عمل", val: "إيجاد عمل أو وظيفة" },
  { label: "💻 تقنية", val: "تطوير مهارة تقنية" },
  { label: "✍️ كتابة", val: "كتابة كتاب أو محتوى" },
];

const PROBLEMS = [
  { label: "😵 متشتت", val: "التشتت وعدم التركيز" },
  { label: "⏳ نأجل بزاف", val: "التسويف والتأجيل المستمر" },
  { label: "🕐 نضيع الوقت", val: "إضاعة الوقت بدون فائدة" },
  { label: "🤷 ما نعرفش منين نبدا", val: "عدم معرفة نقطة البداية" },
  { label: "🔥 نفقد الحماس بسرعة", val: "فقدان الحماس والاستمرارية" },
];

const stepColors = ["#4facfe", "#a18dfe", "#43e97b"];

export default function App() {
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setError("");
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 80) {
      setError("من فضلك أدخل عمرك بشكل صحيح"); return;
    }
    if (!goal) { setError("اختر هدفك من الخيارات"); return; }
    if (!problem) { setError("اختر أكبر مشكلة تواجهك"); return; }
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, goal, problem, details: details.replace(/['"]/g, " ") }),
      });
      if (!res.ok) throw new Error("خطأ في الاتصال");
      const data = await res.json();
      if (!data.day1_title) throw new Error("تعذّر قراءة الخطة، حاول مرة ثانية");
      setPlan(data);
    } catch (e) {
      setError(e.message || "حصل خطأ غير متوقع");
    }
    setLoading(false);
  }

  function getPlanText() {
    return `🚀 خارطة البداية
👤 العمر: ${age} سنة
🎯 الهدف: ${goal}
⚡ التحدي: ${problem}

━━ اليوم الأول ━━
${plan.day1_title}
1️⃣ ${plan.day1_task1}
2️⃣ ${plan.day1_task2}
3️⃣ ${plan.day1_task3}

━━ الأسبوع الأول ━━
⏰ ${plan.week1_hours}
🎯 30 دقيقة: ${plan.week1_focus}

الأسبوع 2: ${plan.week2}
الأسبوع 3: ${plan.week3}
الأسبوع 4: ${plan.week4}

❌ ممنوع: ${plan.forbidden}
🎯 ${plan.tip}

🎯 ركز على الاستمرارية مشي الكمال.`;
  }

  function copyPlan() {
    const text = getPlanText();
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(fallback);
    } else fallback();
  }

  function downloadPlan() {
    const blob = new Blob([getPlanText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "خارطة-البداية.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setPlan(null); setGoal(""); setProblem(""); setAge(""); setDetails(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inp = { width: "100%", background: "#0d0f14", border: "1px solid #1f2330", borderRadius: ".6rem", color: "#eceef5", fontFamily: "inherit", fontSize: "1rem", padding: ".7rem 1rem", outline: "none", boxSizing: "border-box" };
  const lbl = { display: "block", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#888", marginBottom: ".6rem" };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#eceef5", fontFamily: "system-ui,sans-serif", padding: "2rem 1rem 3rem" }}>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-block", fontSize: ".68rem", fontWeight: 700, letterSpacing: ".15em", color: "#f5a623", border: "1px solid #f5a62340", padding: ".3rem .9rem", borderRadius: "2rem", marginBottom: "1.2rem", background: "#f5a6230d" }}>✦ START NOW</div>
        <h1 style={{ fontSize: "clamp(1.5rem,5vw,2.5rem)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
          🚀 من التشتت إلى <span style={{ color: "#f5a623" }}>أول خطوة</span>
          <br /><span style={{ fontSize: "clamp(.95rem,3vw,1.5rem)", color: "#c8ccda", fontWeight: 400 }}>في أقل من دقيقة</span>
        </h1>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", background: "#13161e", border: "1px solid #1f2330", borderRadius: "1.2rem", padding: "1.8rem" }}>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>عمرك</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="مثال: 20" min={10} max={80} style={inp} />
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>هدفك الرئيسي</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
            {GOALS.map(g => (
              <button key={g.val} onClick={() => setGoal(g.val)} style={{ fontSize: ".78rem", padding: ".35rem .8rem", borderRadius: "2rem", border: `1px solid ${goal === g.val ? "#f5a623" : "#1f2330"}`, cursor: "pointer", color: goal === g.val ? "#0d0f14" : "#c8ccda", background: goal === g.val ? "#f5a623" : "transparent", fontFamily: "inherit", fontWeight: goal === g.val ? 700 : 400 }}>{g.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.2rem" }}>
          <label style={lbl}>أكبر مشكلة تواجهك؟</label>
          <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
            {PROBLEMS.map(p => (
              <button key={p.val} onClick={() => setProblem(p.val)} style={{ fontSize: ".88rem", padding: ".5rem 1rem", borderRadius: ".6rem", textAlign: "right", border: `1px solid ${problem === p.val ? "#f5a623" : "#1f2330"}`, cursor: "pointer", color: problem === p.val ? "#0d0f14" : "#c8ccda", background: problem === p.val ? "#f5a623" : "#0d0f14", fontFamily: "inherit", fontWeight: problem === p.val ? 700 : 400, display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${problem === p.val ? "#0d0f14" : "#3a3f52"}`, flexShrink: 0 }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ mar

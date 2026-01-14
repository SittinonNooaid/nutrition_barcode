import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || "https://pgbhlllimmzjeejlmbhr.supabase.co";
const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || "sb_publishable_5cOz9wt99V9cS4dg_NSYhQ_XaRaOtYC";

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const COLORS = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  gray: "bg-gray-200"
};

// #region Ingredients Analysis Helper Functions
function parseIngredients(ingredientsText) {
  if (!ingredientsText || typeof ingredientsText !== 'string') return [];
  
  // Remove common prefixes and clean up
  let text = ingredientsText
    .toLowerCase()
    .replace(/^ingredients?[:\s]*/i, '')
    .replace(/\(.*?\)/g, '') // Remove parentheses content
    .trim();
  
  // Split by common delimiters
  const ingredients = text
    .split(/[,;，；]/)
    .map(ing => ing.trim())
    .filter(ing => ing.length > 0)
    .map(ing => ing.replace(/^\d+[\.\)]\s*/, '').trim()); // Remove numbered prefixes
  
  return ingredients;
}

function detectAllergens(ingredients) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:37',message:'detectAllergens entry',data:{ingredients:ingredients,ingredientsType:typeof ingredients,isArray:Array.isArray(ingredients)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (!Array.isArray(ingredients)) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:37',message:'detectAllergens invalid input',data:{ingredients:ingredients,ingredientsType:typeof ingredients},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return [];
  }
  
  const allergenKeywords = {
    'milk': ['milk', 'dairy', 'lactose', 'whey', 'casein', 'butter', 'cheese', 'cream', 'นม', 'เนย', 'ชีส'],
    'egg': ['egg', 'albumin', 'lecithin', 'mayonnaise', 'ไข่', 'เลซิติน'],
    'peanuts': ['peanut', 'groundnut', 'arachis', 'ถั่วลิสง'],
    'tree nuts': ['almond', 'walnut', 'cashew', 'hazelnut', 'pistachio', 'pecan', 'macadamia', 'brazil nut', 'nut', 'ถั่ว', 'อัลมอนด์', 'วอลนัท'],
    'soy': ['soy', 'soya', 'tofu', 'tempeh', 'miso', 'edamame', 'ถั่วเหลือง'],
    'gluten': ['wheat', 'gluten', 'barley', 'rye', 'oats', 'flour', 'bread', 'pasta', 'ขนมปัง', 'แป้ง', 'ข้าวสาลี'],
    'fish': ['fish', 'tuna', 'salmon', 'sardine', 'anchovy', 'ปลา', 'ทูน่า'],
    'shellfish': ['shrimp', 'prawn', 'crab', 'lobster', 'mussel', 'oyster', 'shellfish', 'crustacean', 'กุ้ง', 'ปู'],
    'sesame': ['sesame', 'tahini', 'งา']
  };
  
  const detected = [];
  const ingredientsLower = ingredients.map(ing => String(ing || '').toLowerCase());
  
  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    const found = keywords.some(keyword => 
      ingredientsLower.some(ing => ing.includes(keyword.toLowerCase()))
    );
    if (found) {
      detected.push(allergen);
    }
  }
  
  return detected;
}

function detectRiskTags(ingredients) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:65',message:'detectRiskTags entry',data:{ingredients:ingredients,ingredientsType:typeof ingredients,isArray:Array.isArray(ingredients)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  if (!Array.isArray(ingredients)) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:65',message:'detectRiskTags invalid input',data:{ingredients:ingredients,ingredientsType:typeof ingredients},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return [];
  }
  
  const riskKeywords = {
    'added sugar': ['sugar', 'sucrose', 'fructose', 'glucose', 'syrup', 'honey', 'molasses', 'dextrose', 'น้ำตาล', 'ไซรัป'],
    'palm oil': ['palm oil', 'palm', 'palmitate', 'น้ำมันปาล์ม'],
    'preservatives': ['preservative', 'sodium benzoate', 'potassium sorbate', 'bht', 'bha', 'nitrite', 'nitrate', 'วัตถุกันเสีย'],
    'artificial sweeteners': ['aspartame', 'sucralose', 'saccharin', 'acesulfame', 'stevia', 'sweetener', 'สารให้ความหวาน']
  };
  
  const detected = [];
  const ingredientsLower = ingredients.map(ing => String(ing || '').toLowerCase());
  
  for (const [tag, keywords] of Object.entries(riskKeywords)) {
    const found = keywords.some(keyword => 
      ingredientsLower.some(ing => ing.includes(keyword.toLowerCase()))
    );
    if (found) {
      detected.push(tag);
    }
  }
  
  return detected;
}

function analyzeIngredients(ingredientsText) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:88',message:'analyzeIngredients entry',data:{ingredientsText:ingredientsText,ingredientsTextType:typeof ingredientsText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  try {
    const ingredients = parseIngredients(ingredientsText);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:88',message:'parseIngredients result',data:{ingredients:ingredients,ingredientsLength:ingredients?.length,isArray:Array.isArray(ingredients)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    const allergens = detectAllergens(ingredients);
    const riskTags = detectRiskTags(ingredients);
  
  // Determine warning level
  let warningLevel = 'low';
  if (allergens.length > 0 || riskTags.length >= 2) {
    warningLevel = 'high';
  } else if (riskTags.length === 1) {
    warningLevel = 'medium';
  }
  
  // Generate summary
  let summary = '';
  if (allergens.length > 0) {
    summary += `Contains ${allergens.join(', ')}. `;
  }
  if (riskTags.length > 0) {
    summary += `${riskTags.length > 1 ? 'Multiple concerns' : riskTags[0]}: ${riskTags.join(', ')}.`;
  }
  if (!summary) {
    summary = 'ไม่พบสารก่อภูมิแพ้หรือปัจจัยเสี่ยงที่สำคัญใดๆ';
    // summary = 'No major allergens or risk factors detected.';
  }
  
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:88',message:'analyzeIngredients result',data:{ingredients:ingredients,allergens:allergens,riskTags:riskTags,warningLevel:warningLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    
    return {
      ingredients,
      allergens,
      risk_tags: riskTags,
      warning_level: warningLevel,
      summary: summary.trim()
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:88',message:'analyzeIngredients error',data:{error:error?.message,errorStack:error?.stack,ingredientsText:ingredientsText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    
    return {
      ingredients: [],
      allergens: [],
      risk_tags: [],
      warning_level: 'low',
      summary: 'Unable to analyze ingredients.'
    };
  }
}
// #endregion

function uuid() {
  if (globalThis.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function NutritionApp() {
  const [page, setPage] = useState("scan");
  const [barcode, setBarcode] = useState("");
  const [food, setFood] = useState(null);
  const [todayLog, setTodayLog] = useState([]);

  useEffect(() => {
    if (supabase) loadToday();
  }, []);

  async function loadToday() {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from("food_logs_2").select("*").eq("date", today).order("created_at", { ascending: true });
    if (data) setTodayLog(data);
  }

  async function saveFood(food) {
    const today = new Date().toISOString().slice(0, 10);
    const record = {
      id: uuid(),
      date: today,
      food_name: String(food.food_name || "Unknown"),
      calories: Number(food.calories || 0),
      sugar: Number(food.sugar || 0),
      fat: Number(food.fat || 0),
      sodium: Number(food.sodium || 0),
      quantity: Number(food.quantity || 1)
    };
    const { data, error } = await supabase.from("food_logs_2").insert([record]).select();
    if (error) throw error;
    return data?.[0];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {page === "scan" && (
          <ScanPage
            barcode={barcode}
            setBarcode={setBarcode}
            onResult={(f) => {
              setFood(f);
              setPage("result");
            }}
            onGoToSummary={() => setPage("summary")}
          />
        )}

        {page === "result" && food && (
          <ResultPage
            food={food}
            onAdd={async () => {
              const saved = await saveFood(food);
              if (saved) setTodayLog(p => [...p, saved]);
              setPage("summary");
            }}
            onBack={() => setPage("scan")}
          />
        )}

        {page === "summary" && (
          <SummaryPage
            log={todayLog}
            onBack={() => setPage("scan")}
          />
        )}
      </div>
    </div>
  );
}

function ScanPage({ barcode, setBarcode, onResult, onGoToSummary }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchFood() {
    if (!barcode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await res.json();
      if (data.status !== 1) throw new Error();
      const p = data.product;
      const n = p.nutriments || {};
      console.log('p', p)
      
      // Extract ingredients text (prefer English, fallback to any available)
      const ingredientsText = p.ingredients_text_en || p.ingredients_text || p.ingredients_text_th || '';
      console.log('ingredientsText',  ingredientsText)
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:265',message:'Before analyzeIngredients',data:{ingredientsText:ingredientsText,hasText:!!ingredientsText,ingredientsTextType:typeof ingredientsText,analyzeIngredientsExists:typeof analyzeIngredients==='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      // #endregion
      
      // Analyze ingredients (new feature - appended to existing data)
      let ingredientsAnalysis = null;
      try {
        ingredientsAnalysis = ingredientsText ? analyzeIngredients(ingredientsText) : null;
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:268',message:'After analyzeIngredients',data:{ingredientsAnalysis:ingredientsAnalysis,hasAnalysis:!!ingredientsAnalysis},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
        // #endregion
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:268',message:'analyzeIngredients error in fetchFood',data:{error:err?.message,errorStack:err?.stack,ingredientsText:ingredientsText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'L'})}).catch(()=>{});
        // #endregion
        ingredientsAnalysis = null;
      }
      
      onResult({
        food_name: p.product_name || "Unknown",
        calories: Math.round(n["energy-kcal_100g"] || 0),
        sugar: Math.round(n["sugars_100g"] || 0),
        fat: Math.round(n["fat_100g"] || 0),
        sodium: Math.round((n["sodium_100g"] || 0) * 1000),
        quantity: 1,
        // New fields appended - ingredients analysis
        ingredients_analysis: ingredientsAnalysis,
        ingredients_text: ingredientsText
      });
    } catch {
      setError("ไม่พบข้อมูลสินค้า กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg mb-4">
          <span className="text-5xl">🍎</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          สแกนบาร์โค้ดอาหาร
        </h1>
        <p className="text-gray-600 text-sm">ตรวจสอบข้อมูลโภชนาการได้ทันที</p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input 
            value={barcode} 
            onChange={e => setBarcode(e.target.value)}
            placeholder="กรุณากรอกบาร์โค้ด..."
            className="w-full p-4 pr-12 rounded-2xl border-2 border-gray-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all text-lg"
            onKeyPress={(e) => e.key === 'Enter' && fetchFood()}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">📱</span>
        </div>
        
        <button 
          onClick={fetchFood} 
          disabled={loading || !barcode}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>กำลังวิเคราะห์...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>วิเคราะห์</span>
            </>
          )}
        </button>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>


      <button 
        id='go-to-summary-page' 
        onClick={onGoToSummary}
        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold text-lg shadow-sm hover:shadow-md hover:border-indigo-400 hover:text-indigo-600 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
      >
        <span>📊</span>
        <span>ดูสรุปวันนี้</span>
      </button>
    </div>
  );
}

function ResultPage({ food, onAdd, onBack }) {
  const score = trafficLight(food);
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
      >
        <span className="text-xl">←</span>
        <span>กลับ</span>
      </button>
      
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-2 pb-4 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl mb-2">
            <span className="text-3xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{food.food_name}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Stat label="แคลอรี่" value={food.calories} unit="kcal" color={score.calories} icon="🔥" />
          <Stat label="น้ำตาล" value={food.sugar} unit="g" color={score.sugar} icon="🍬" />
          <Stat label="ไขมัน" value={food.fat} unit="g" color={score.fat} icon="🧈" />
          <Stat label="โซเดียม" value={food.sodium} unit="mg" color={score.sodium} icon="🧂" />
        </div>
      </div>

      {/* Ingredients Analysis & Allergen Warning - New Feature */}
      {food.ingredients_analysis && (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-4">
          {/* #region agent log */}
          {(() => {
            fetch('http://127.0.0.1:7243/ingest/f5f854ff-ae5b-4ae8-8170-f978598887ff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NutritionApp.jsx:373',message:'ResultPage ingredients_analysis check',data:{hasAnalysis:!!food.ingredients_analysis,analysisType:typeof food.ingredients_analysis,allergens:food.ingredients_analysis?.allergens,allergensType:typeof food.ingredients_analysis?.allergens,riskTags:food.ingredients_analysis?.risk_tags,riskTagsType:typeof food.ingredients_analysis?.risk_tags,ingredients:food.ingredients_analysis?.ingredients,ingredientsType:typeof food.ingredients_analysis?.ingredients},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
            return null;
          })()}
          {/* #endregion */}
          
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">การวิเคราะห์ส่วนผสม</h3>
          </div>
          
          {/* Warning Level Badge */}
          {food.ingredients_analysis?.warning_level && food.ingredients_analysis.warning_level !== 'low' && (
            <div className={`p-3 rounded-xl flex items-center gap-2 ${
              food.ingredients_analysis.warning_level === 'high' 
                ? 'bg-red-50 border-2 border-red-200' 
                : 'bg-yellow-50 border-2 border-yellow-200'
            }`}>
              <span className="text-xl">
                {food.ingredients_analysis.warning_level === 'high' ? '⚠️' : '⚡'}
              </span>
              <span className={`font-semibold ${
                food.ingredients_analysis.warning_level === 'high' ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {food.ingredients_analysis.warning_level === 'high' ? 'ระดับความเสี่ยงสูง' : 'ระดับความเสี่ยงปานกลาง'}
              </span>
            </div>
          )}
          
          {/* Summary */}
          {/* {food.ingredients_analysis?.summary && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed">{food.ingredients_analysis.summary}</p>
            </div>
          )} */}
          
          {/* Allergens */}
          {Array.isArray(food.ingredients_analysis?.allergens) && food.ingredients_analysis.allergens.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>🚫</span>
                <span>สารก่อภูมิแพ้</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.ingredients_analysis.allergens.map((allergen, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Risk Tags */}
          {Array.isArray(food.ingredients_analysis?.risk_tags) && food.ingredients_analysis.risk_tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>⚡</span>
                <span>ข้อควรระวัง</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.ingredients_analysis.risk_tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Ingredients List */}
          {Array.isArray(food.ingredients_analysis?.ingredients) && food.ingredients_analysis.ingredients.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span>📋</span>
                <span>รายการส่วนผสม ({food.ingredients_analysis.ingredients.length} รายการ)</span>
              </h4>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {food.ingredients_analysis.ingredients.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <button 
        onClick={onAdd} 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
      >
        <span>➕</span>
        <span>เพิ่มลงในบันทึก</span>
      </button>
    </div>
  );
}

function Stat({ label, value, color, unit = "", icon = "" }) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red: "bg-red-100 text-red-700 border-red-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200"
  };
  
  const dotColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
    gray: "bg-gray-400"
  };
  
  return (
    <div className={`p-4 rounded-2xl border-2 ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`inline-block w-3 h-3 rounded-full ${dotColors[color]} flex-shrink-0`} />
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm text-gray-600">{unit}</span>}
      </div>
    </div>
  );
}

function SummaryPage({ log, onBack }) {
  const total = log.reduce((s, f) => +s + +f.calories, 0);
  const totalSugar = log.reduce((s, f) => s + (Number(f.sugar) || 0), 0);
  const totalFat = log.reduce((s, f) => s + (Number(f.fat) || 0), 0);
  const totalSodium = log.reduce((s, f) => s + (Number(f.sodium) || 0), 0);
  
  const dailyGoal = 2000; // kcal
  const progress = Math.min((total / dailyGoal) * 100, 100);
  
  return (
    <div className="flex-1 flex flex-col p-6 space-y-6">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
      >
        <span className="text-xl">←</span>
        <span>กลับ</span>
      </button>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          สรุปวันนี้
        </h2>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">แคลอรี่ทั้งหมด</span>
            <span className="text-2xl font-bold text-indigo-600">{total.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                progress < 50 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                progress < 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right">เป้าหมาย: {dailyGoal.toLocaleString()} kcal</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-2xl mb-1">🍬</div>
            <div className="text-xs text-gray-600 mb-1">น้ำตาล</div>
            <div className="text-lg font-bold text-blue-600">{totalSugar.toFixed(1)}g</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl mb-1">🧈</div>
            <div className="text-xs text-gray-600 mb-1">ไขมัน</div>
            <div className="text-lg font-bold text-orange-600">{totalFat.toFixed(1)}g</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <div className="text-2xl mb-1">🧂</div>
            <div className="text-xs text-gray-600 mb-1">โซเดียม</div>
            <div className="text-lg font-bold text-purple-600">{totalSodium.toFixed(0)}mg</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700 px-2">รายการอาหาร ({log.length})</h3>
        {log.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-gray-500">ยังไม่มีรายการอาหารวันนี้</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {log.map((f, index) => (
              <div 
                key={f.id} 
                className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{f.food_name}</div>
                    <div className="text-sm text-gray-500">จำนวน: {f.quantity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">{f.calories}</div>
                  <div className="text-xs text-gray-400">kcal</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function trafficLight(food) {
  return {
    calories: food.calories <= 120 ? "green" : food.calories <= 250 ? "yellow" : "red",
    sugar: food.sugar <= 6 ? "green" : food.sugar <= 12 ? "yellow" : "red",
    fat: food.fat <= 5 ? "green" : food.fat <= 10 ? "yellow" : "red",
    sodium: food.sodium <= 300 ? "green" : food.sodium <= 600 ? "yellow" : "red"
  };
}

if (import.meta?.env?.DEV) {
  console.assert(trafficLight({ calories: 100, sugar: 2, fat: 2, sodium: 100 }).calories === "green");
  console.assert(trafficLight({ calories: 300, sugar: 2, fat: 2, sodium: 100 }).calories === "red");
}

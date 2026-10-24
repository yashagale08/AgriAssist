// AgriAssist frontend connections and multilingual UI.
// The existing visual theme is preserved; only text behavior and chat scrolling are corrected.
const API_BASE = "http://127.0.0.1:5000";
const CROP_ENDPOINT = "/api/recommend";
const PRICE_ENDPOINT = "/api/predict-live";
const CROP_LIST_ENDPOINT = "/api/crops";
const CHAT_ENDPOINT = "/api/chat";
const predictionHistory = [];
let currentLanguage = "en";
let currentPage = "crop";

const UI_TEXT = {
  en: {
    brandTagline: "Smart Farming, Better Tomorrow",
    navHome: "⌂　Home", navChatbot: "▣　Chatbot", navCrop: "🌿　Crop Recommendation",
    navPrice: "▥　Crop Price Prediction", navHistory: "◷　History", navSettings: "⚙　Settings",
    pageTitle_home: "Home", pageTitle_crop: "Crop Recommendation", pageTitle_price: "Crop Price Prediction",
    pageTitle_chatbot: "AgriAssist Chatbot", pageTitle_history: "Prediction History", pageTitle_settings: "Settings",
    pageSubtitle_home: "Smart farming support powered by data and AI.",
    pageSubtitle_crop: "Get crop suggestions based on temperature, rainfall and humidity.",
    pageSubtitle_price: "Estimate crop prices using your AgriAssist prediction model.",
    pageSubtitle_chatbot: "Ask your farming questions in your preferred language.",
    pageSubtitle_history: "Review your recent predictions.",
    pageSubtitle_settings: "Personalize your AgriAssist experience.",
    homeHeading: "🌱 Welcome to AgriAssist", homeIntro: "Your smart farming companion. Choose a feature to get started.",
    tileCropTitle: "Crop Recommendation", tileCropDesc: "Find crops suited to your soil, water and season.",
    tileChatTitle: "AgriAssist Chatbot", tileChatDesc: "Ask farming questions.",
    tilePriceTitle: "Crop Price Prediction", tilePriceDesc: "Estimate crop prices with your model.",
    tileHistoryTitle: "History", tileHistoryDesc: "Review this session's predictions.",
    cropHeading: "Enter Your Agricultural Details", cropIntro: "Enter the weather details to get a crop recommendation.",
    tempLabel: "Temperature (°C)", tempHelp: "Enter the current or expected temperature.", tempPlaceholder: "e.g. 25",
    rainLabel: "Rainfall (mm)", rainHelp: "Enter the expected rainfall amount.", rainPlaceholder: "e.g. 200",
    humidityLabel: "Humidity (%)", humidityHelp: "Enter humidity from 0 to 100.", humidityPlaceholder: "e.g. 80",
    cropSubmit: "🌿　Get Crop Recommendation", cropLoading: "Getting recommendation…",
    cropResultTitle: "🌱 Recommended Crop", cropResultPending: "Your recommended crop will appear here after you submit the details.",
    cropFailure: "Recommendation failed", genericBackendHint: "Check that Flask is running and the API route is available.",
    priceHeading: "Crop Price Prediction", priceIntro: "Select a crop to estimate its price using available historical data.",
    priceLabel: "Crop", priceHelp: "Select a crop available in your database.", selectCrop: "Select crop", loadingCrops: "Loading crops…",
    cropLoadFailure: "Could not load crops", priceSubmit: "📈　Predict Crop Price", priceLoading: "Predicting price…",
    priceResultTitle: "💰 Predicted Crop Price", priceResultPending: "Your predicted price will appear here after submitting the details.",
    priceFailure: "Price prediction failed", selectCropError: "Please select a crop.",
    chatHeading: "AgriAssist Chatbot", chatIntro: "Ask your farming questions in your preferred language.",
    chatInputPlaceholder: "Type your message…", chatWelcome: "Hello! 👋\nI am AgriAssist, your AI farming assistant.\nHow can I help you today?",
    quickCrop: "🌿 Crop recommendation", quickPrice: "📈 Crop price prediction", quickTips: "💡 Farming tips",
    chatThinking: "AgriAssist is thinking…", youLabel: "You", botLabel: "AgriAssist",
    chatFailure: "Sorry, I couldn't get a reply just now. Please try again.",
    historyHeading: "🕘 Prediction History", historyIntro: "Predictions made during this browser session.", historyEmpty: "No predictions yet.", historyClear: "Clear History",
    settingsHeading: "⚙ Settings", settingsIntro: "Customize your AgriAssist experience.",
    settingsAppearance: "Appearance", settingsAppearanceHelp: "Switch between light and dark mode.",
    settingsThemeBtn: "Toggle theme", settingsLanguage: "Language", settingsLanguageHelp: "Choose your preferred language.",
    settingsApiInfo: "API endpoints can be configured in script.js.",
    footerTagline: "Empowering Farmers with Smart Solutions", footerAbout: "About", footerPrivacy: "Privacy", footerContact: "Contact",
    historyCrop: "Crop recommendation", historyPrice: "Crop price prediction", errorPleaseQuestion: "Please enter a question."
  },
  hi: {
    brandTagline: "स्मार्ट खेती, बेहतर कल",
    navHome: "⌂　होम", navChatbot: "▣　चैटबॉट", navCrop: "🌿　फसल सुझाव",
    navPrice: "▥　फसल मूल्य अनुमान", navHistory: "◷　इतिहास", navSettings: "⚙　सेटिंग्स",
    pageTitle_home: "होम", pageTitle_crop: "फसल सुझाव", pageTitle_price: "फसल मूल्य अनुमान",
    pageTitle_chatbot: "AgriAssist चैटबॉट", pageTitle_history: "अनुमान इतिहास", pageTitle_settings: "सेटिंग्स",
    pageSubtitle_home: "डेटा और AI की मदद से स्मार्ट खेती की जानकारी।",
    pageSubtitle_crop: "तापमान, वर्षा और नमी के आधार पर फसल का सुझाव पाएँ।",
    pageSubtitle_price: "AgriAssist मॉडल से फसल के मूल्य का अनुमान लगाएँ।",
    pageSubtitle_chatbot: "अपनी पसंदीदा भाषा में खेती से जुड़े सवाल पूछें।",
    pageSubtitle_history: "अपने हाल के अनुमानों को देखें।", pageSubtitle_settings: "AgriAssist को अपनी पसंद के अनुसार बनाएँ।",
    homeHeading: "🌱 AgriAssist में आपका स्वागत है", homeIntro: "आपका स्मार्ट खेती साथी। शुरू करने के लिए कोई सुविधा चुनें।",
    tileCropTitle: "फसल सुझाव", tileCropDesc: "मिट्टी, पानी और मौसम के अनुसार फसल चुनें।",
    tileChatTitle: "AgriAssist चैटबॉट", tileChatDesc: "खेती से जुड़े सवाल पूछें।",
    tilePriceTitle: "फसल मूल्य अनुमान", tilePriceDesc: "मॉडल से फसल के मूल्य का अनुमान पाएँ।",
    tileHistoryTitle: "इतिहास", tileHistoryDesc: "इस सत्र के अनुमान देखें।",
    cropHeading: "अपनी कृषि संबंधी जानकारी भरें", cropIntro: "फसल का सुझाव पाने के लिए मौसम की जानकारी भरें।",
    tempLabel: "तापमान (°C)", tempHelp: "वर्तमान या अनुमानित तापमान दर्ज करें।", tempPlaceholder: "जैसे 25",
    rainLabel: "वर्षा (mm)", rainHelp: "अनुमानित वर्षा दर्ज करें।", rainPlaceholder: "जैसे 200",
    humidityLabel: "नमी (%)", humidityHelp: "नमी 0 से 100 के बीच दर्ज करें।", humidityPlaceholder: "जैसे 80",
    cropSubmit: "🌿　फसल का सुझाव पाएँ", cropLoading: "सुझाव तैयार हो रहा है…",
    cropResultTitle: "🌱 सुझाई गई फसल", cropResultPending: "जानकारी जमा करने के बाद सुझाई गई फसल यहाँ दिखाई देगी।",
    cropFailure: "फसल सुझाव नहीं मिल पाया", genericBackendHint: "जाँचें कि Flask चल रहा है और API उपलब्ध है।",
    priceHeading: "फसल मूल्य अनुमान", priceIntro: "उपलब्ध पुराने मूल्य डेटा के आधार पर फसल चुनें।",
    priceLabel: "फसल", priceHelp: "अपने डेटाबेस में उपलब्ध फसल चुनें।", selectCrop: "फसल चुनें", loadingCrops: "फसलें लोड हो रही हैं…",
    cropLoadFailure: "फसलें लोड नहीं हो सकीं", priceSubmit: "📈　फसल का मूल्य अनुमानित करें", priceLoading: "मूल्य का अनुमान हो रहा है…",
    priceResultTitle: "💰 फसल का अनुमानित मूल्य", priceResultPending: "जानकारी जमा करने के बाद अनुमानित मूल्य यहाँ दिखाई देगा।",
    priceFailure: "मूल्य का अनुमान नहीं मिल पाया", selectCropError: "कृपया फसल चुनें।",
    chatHeading: "AgriAssist चैटबॉट", chatIntro: "अपनी पसंदीदा भाषा में खेती से जुड़े सवाल पूछें।",
    chatInputPlaceholder: "अपना संदेश लिखें…", chatWelcome: "नमस्ते! 👋\nमैं AgriAssist हूँ, आपका AI खेती सहायक।\nआज मैं आपकी कैसे मदद कर सकता हूँ?",
    quickCrop: "🌿 फसल का सुझाव", quickPrice: "📈 फसल मूल्य अनुमान", quickTips: "💡 खेती के सुझाव",
    chatThinking: "AgriAssist जवाब तैयार कर रहा है…", youLabel: "आप", botLabel: "AgriAssist",
    chatFailure: "माफ़ कीजिए, अभी जवाब नहीं मिल पाया। कृपया फिर से कोशिश करें।",
    historyHeading: "🕘 अनुमान इतिहास", historyIntro: "इस ब्राउज़र सत्र में किए गए अनुमान।", historyEmpty: "अभी कोई अनुमान नहीं है।", historyClear: "इतिहास साफ़ करें",
    settingsHeading: "⚙ सेटिंग्स", settingsIntro: "AgriAssist को अपनी पसंद के अनुसार बनाएँ।", settingsAppearance: "दिखावट",
    settingsAppearanceHelp: "लाइट और डार्क मोड बदलें।", settingsThemeBtn: "थीम बदलें", settingsLanguage: "भाषा",
    settingsLanguageHelp: "अपनी पसंदीदा भाषा चुनें।", settingsApiInfo: "API सेटिंग्स script.js में बदली जा सकती हैं।",
    footerTagline: "स्मार्ट समाधानों से किसानों को सशक्त बनाएँ", footerAbout: "परिचय", footerPrivacy: "गोपनीयता", footerContact: "संपर्क",
    historyCrop: "फसल सुझाव", historyPrice: "फसल मूल्य अनुमान", errorPleaseQuestion: "कृपया अपना सवाल लिखें।"
  },
  mr: {
    brandTagline: "स्मार्ट शेती, उज्ज्वल उद्या",
    navHome: "⌂　मुख्यपृष्ठ", navChatbot: "▣　चॅटबॉट", navCrop: "🌿　पीक शिफारस",
    navPrice: "▥　पीक भावाचा अंदाज", navHistory: "◷　इतिहास", navSettings: "⚙　सेटिंग्ज",
    pageTitle_home: "मुख्यपृष्ठ", pageTitle_crop: "पीक शिफारस", pageTitle_price: "पीक भावाचा अंदाज",
    pageTitle_chatbot: "AgriAssist चॅटबॉट", pageTitle_history: "अंदाजांचा इतिहास", pageTitle_settings: "सेटिंग्ज",
    pageSubtitle_home: "डेटा आणि AI च्या मदतीने स्मार्ट शेतीची माहिती.",
    pageSubtitle_crop: "तापमान, पाऊस आणि आर्द्रतेनुसार पिकाची शिफारस मिळवा.",
    pageSubtitle_price: "AgriAssist मॉडेलच्या मदतीने पिकाच्या भावाचा अंदाज घ्या.",
    pageSubtitle_chatbot: "तुमच्या पसंतीच्या भाषेत शेतीविषयक प्रश्न विचारा.",
    pageSubtitle_history: "तुमचे अलीकडील अंदाज पाहा.", pageSubtitle_settings: "AgriAssist तुमच्या पसंतीनुसार बदला.",
    homeHeading: "🌱 AgriAssist मध्ये आपले स्वागत आहे", homeIntro: "तुमचा स्मार्ट शेती साथीदार. सुरुवात करण्यासाठी सुविधा निवडा.",
    tileCropTitle: "पीक शिफारस", tileCropDesc: "माती, पाणी आणि हंगामानुसार पीक निवडा.",
    tileChatTitle: "AgriAssist चॅटबॉट", tileChatDesc: "शेतीविषयक प्रश्न विचारा.",
    tilePriceTitle: "पीक भावाचा अंदाज", tilePriceDesc: "मॉडेलच्या मदतीने पिकाच्या भावाचा अंदाज घ्या.",
    tileHistoryTitle: "इतिहास", tileHistoryDesc: "या सत्रातील अंदाज पाहा.",
    cropHeading: "तुमची शेतीविषयक माहिती भरा", cropIntro: "पीक शिफारस मिळवण्यासाठी हवामानाची माहिती भरा.",
    tempLabel: "तापमान (°C)", tempHelp: "सध्याचे किंवा अपेक्षित तापमान भरा.", tempPlaceholder: "उदा. 25",
    rainLabel: "पाऊस (mm)", rainHelp: "अपेक्षित पावसाचे प्रमाण भरा.", rainPlaceholder: "उदा. 200",
    humidityLabel: "आर्द्रता (%)", humidityHelp: "आर्द्रता 0 ते 100 दरम्यान भरा.", humidityPlaceholder: "उदा. 80",
    cropSubmit: "🌿　पीक शिफारस मिळवा", cropLoading: "शिफारस मिळवत आहे…",
    cropResultTitle: "🌱 शिफारस केलेले पीक", cropResultPending: "माहिती सबमिट केल्यानंतर शिफारस केलेले पीक येथे दिसेल.",
    cropFailure: "पीक शिफारस मिळाली नाही", genericBackendHint: "Flask सुरू आहे आणि API उपलब्ध आहे का ते तपासा.",
    priceHeading: "पीक भावाचा अंदाज", priceIntro: "उपलब्ध ऐतिहासिक भावांच्या आधारे पीक निवडा.",
    priceLabel: "पीक", priceHelp: "तुमच्या डेटाबेसमधील पीक निवडा.", selectCrop: "पीक निवडा", loadingCrops: "पिके लोड होत आहेत…",
    cropLoadFailure: "पिके लोड झाली नाहीत", priceSubmit: "📈　पीक भावाचा अंदाज घ्या", priceLoading: "भावाचा अंदाज घेत आहे…",
    priceResultTitle: "💰 पिकाचा अंदाजित भाव", priceResultPending: "माहिती सबमिट केल्यानंतर अंदाजित भाव येथे दिसेल.",
    priceFailure: "भावाचा अंदाज मिळाला नाही", selectCropError: "कृपया पीक निवडा.",
    chatHeading: "AgriAssist चॅटबॉट", chatIntro: "तुमच्या पसंतीच्या भाषेत शेतीविषयक प्रश्न विचारा.",
    chatInputPlaceholder: "तुमचा संदेश लिहा…", chatWelcome: "नमस्कार! 👋\nमी AgriAssist, तुमचा AI शेती सहाय्यक आहे.\nआज मी तुम्हाला कशी मदत करू शकतो?",
    quickCrop: "🌿 पीक शिफारस", quickPrice: "📈 पीक भावाचा अंदाज", quickTips: "💡 शेतीविषयक टिप्स",
    chatThinking: "AgriAssist उत्तर तयार करत आहे…", youLabel: "तुम्ही", botLabel: "AgriAssist",
    chatFailure: "माफ करा, आत्ता उत्तर मिळाले नाही. कृपया पुन्हा प्रयत्न करा.",
    historyHeading: "🕘 अंदाजांचा इतिहास", historyIntro: "या ब्राउझर सत्रात केलेले अंदाज.", historyEmpty: "अजून कोणतेही अंदाज नाहीत.", historyClear: "इतिहास साफ करा",
    settingsHeading: "⚙ सेटिंग्ज", settingsIntro: "AgriAssist तुमच्या पसंतीनुसार बदला.", settingsAppearance: "दिसणे",
    settingsAppearanceHelp: "लाईट आणि डार्क मोड बदला.", settingsThemeBtn: "थीम बदला", settingsLanguage: "भाषा",
    settingsLanguageHelp: "तुमची पसंतीची भाषा निवडा.", settingsApiInfo: "API सेटिंग्ज script.js मध्ये बदलता येतात.",
    footerTagline: "स्मार्ट उपायांनी शेतकऱ्यांना सक्षम बनवा", footerAbout: "माहिती", footerPrivacy: "गोपनीयता", footerContact: "संपर्क",
    historyCrop: "पीक शिफारस", historyPrice: "पीक भावाचा अंदाज", errorPleaseQuestion: "कृपया तुमचा प्रश्न लिहा."
  }
};

function t(key) {
  return (UI_TEXT[currentLanguage] && UI_TEXT[currentLanguage][key]) || UI_TEXT.en[key] || key;
}

function setText(selector, key) {
  const el = document.querySelector(selector);
  if (el) el.textContent = t(key);
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  setText(".brand small", "brandTagline");
  const navKeys = {
    home: "navHome", chatbot: "navChatbot", crop: "navCrop",
    "crop-price": "navPrice", history: "navHistory", settings: "navSettings"
  };
  document.querySelectorAll(".sidebar nav [data-page]").forEach((el) => {
    el.textContent = t(navKeys[el.dataset.page]);
  });

  setText("#page-home h2", "homeHeading");
  setText("#page-home > p", "homeIntro");
  const tileKeys = [
    ["tileCropTitle", "tileCropDesc"], ["tileChatTitle", "tileChatDesc"],
    ["tilePriceTitle", "tilePriceDesc"], ["tileHistoryTitle", "tileHistoryDesc"]
  ];
  document.querySelectorAll("#page-home .tiles button").forEach((button, i) => {
    if (tileKeys[i]) {
      const bold = button.querySelector("b");
      const small = button.querySelector("small");
      if (bold) bold.textContent = t(tileKeys[i][0]);
      if (small) small.textContent = t(tileKeys[i][1]);
    }
  });

  setText("#page-crop .heading h2", "cropHeading");
  setText("#page-crop .heading p", "cropIntro");
  [["tempLabel", "tempHelp"], ["rainLabel", "rainHelp"], ["humidityLabel", "humidityHelp"]].forEach((keys, i) => {
    const field = document.querySelectorAll("#cropForm .field")[i];
    if (field) {
      const bold = field.querySelector("b");
      const small = field.querySelector("small");
      if (bold) bold.textContent = t(keys[0]);
      if (small) small.textContent = t(keys[1]);
    }
  });
  setText("#page-crop .result h3", "cropResultTitle");
  if (!document.getElementById("cropName").textContent) setText("#cropDetails", "cropResultPending");
  const temp = document.getElementById("temp");
  const rain = document.getElementById("rain");
  const humidity = document.getElementById("humidity");
  if (temp) temp.placeholder = t("tempPlaceholder");
  if (rain) rain.placeholder = t("rainPlaceholder");
  if (humidity) humidity.placeholder = t("humidityPlaceholder");
  const cropBtn = document.querySelector("#cropForm button[type='submit']");
  if (cropBtn && !cropBtn.disabled) cropBtn.textContent = t("cropSubmit");

  setText("#page-crop-price .heading h2", "priceHeading");
  setText("#page-crop-price .heading p", "priceIntro");
  const priceField = document.querySelector("#priceForm .field");
  if (priceField) {
    setText("#priceForm .field b", "priceLabel");
    setText("#priceForm .field small", "priceHelp");
  }
  const priceSelect = document.getElementById("priceCrop");
  if (priceSelect && !priceSelect.disabled && priceSelect.options.length && priceSelect.options[0].value === "") {
    priceSelect.options[0].textContent = t("selectCrop");
  }
  setText("#page-crop-price .result h3", "priceResultTitle");
  if (!document.getElementById("priceResult").textContent) setText("#priceDetails", "priceResultPending");
  const priceBtn = document.querySelector("#priceForm button[type='submit']");
  if (priceBtn && !priceBtn.disabled) priceBtn.textContent = t("priceSubmit");

  setText("#page-chatbot .chat-head h2", "chatHeading");
  setText("#page-chatbot .chat-head p", "chatIntro");
  const chatInput = document.getElementById("chatInput");
  if (chatInput) chatInput.placeholder = t("chatInputPlaceholder");
  const welcome = document.querySelector("#messages > .bubble.initial");
  if (welcome) renderChatText(welcome.querySelector(".message-text") || welcome, t("chatWelcome"));
  const quickButtons = document.querySelectorAll("#messages .quick [data-prompt]");
  ["quickCrop", "quickPrice", "quickTips"].forEach((key, i) => {
    if (quickButtons[i]) quickButtons[i].textContent = t(key);
  });

  setText("#page-history h2", "historyHeading");
  setText("#page-history > p", "historyIntro");
  const historyList = document.getElementById("historyList");
  if (historyList && historyList.dataset.empty === "true") historyList.textContent = t("historyEmpty");
  setText("#clearHistory", "historyClear");

  setText("#page-settings h2", "settingsHeading");
  setText("#page-settings > p", "settingsIntro");
  const settingRows = document.querySelectorAll("#page-settings .setting");
  if (settingRows[0]) {
    settingRows[0].querySelector("b").textContent = t("settingsAppearance");
    settingRows[0].querySelector("small").textContent = t("settingsAppearanceHelp");
  }
  if (settingRows[1]) {
    settingRows[1].querySelector("b").textContent = t("settingsLanguage");
    settingRows[1].querySelector("small").textContent = t("settingsLanguageHelp");
  }
  setText("#settingsTheme", "settingsThemeBtn");
  const apiNote = document.querySelector("#page-settings p.muted");
  if (apiNote) apiNote.textContent = t("settingsApiInfo");

  const footer = document.querySelector("footer");
  if (footer) {
    const textNode = Array.from(footer.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes("|"));
    if (textNode) textNode.textContent = "　|　 " + t("footerTagline") + " ";
    const links = footer.querySelector("span");
    if (links) links.textContent = t("footerAbout") + "　" + t("footerPrivacy") + "　" + t("footerContact");
  }

  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  if (heroTitle && heroSubtitle) {
    const suffix = currentPage === "crop-price" ? "price" : currentPage;
    heroTitle.textContent = t("pageTitle_" + suffix);
    heroSubtitle.textContent = t("pageSubtitle_" + suffix);
  }
}

function showPage(page) {
  currentPage = page;
  document.querySelectorAll(".page").forEach((x) => x.classList.add("hidden"));
  const el = document.getElementById("page-" + page) || document.getElementById("page-home");
  el.classList.remove("hidden");
  document.querySelectorAll("[data-page]").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === page);
  });
  const suffix = page === "crop-price" ? "price" : page;
  document.getElementById("heroTitle").textContent = t("pageTitle_" + suffix) || "AgriAssist";
  document.getElementById("heroSubtitle").textContent = t("pageSubtitle_" + suffix) || "";
  if (window.location.hash !== "#" + page) window.history.replaceState(null, "", "#" + page);
  if (page === "chatbot") scrollMessagesToBottom("auto");
}

document.querySelectorAll("[data-page]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(a.dataset.page);
  });
});
document.querySelectorAll("[data-go]").forEach((b) => {
  b.addEventListener("click", () => showPage(b.dataset.go));
});

function addHistory(type, text) {
  predictionHistory.unshift({ type, text, time: new Date().toLocaleString() });
  const list = document.getElementById("historyList");
  list.dataset.empty = "false";
  list.innerHTML = "";
  predictionHistory.forEach((item) => {
    const div = document.createElement("p");
    div.className = "history-item";
    div.textContent = `${item.type}: ${item.text} — ${item.time}`;
    list.appendChild(div);
  });
}

document.getElementById("clearHistory").addEventListener("click", () => {
  predictionHistory.length = 0;
  const list = document.getElementById("historyList");
  list.dataset.empty = "true";
  list.textContent = t("historyEmpty");
});

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `HTTP ${response.status}`);
  return data;
}

async function post(path, data) {
  const response = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readResponse(response);
}

// Crop recommendation fields match the Flask API: temp, rain and humidity.
document.getElementById("cropForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("cropStatus");
  status.textContent = "";
  const data = {
    temp: Number(document.getElementById("temp").value),
    rain: Number(document.getElementById("rain").value),
    humidity: Number(document.getElementById("humidity").value),
  };
  const btn = e.currentTarget.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = t("cropLoading");
  try {
    const result = await post(CROP_ENDPOINT, data);
    const crop = result.recommended_crop;
    if (crop === undefined || crop === null) throw new Error("The backend did not return a crop name.");
    document.getElementById("cropName").textContent = String(crop);
    document.getElementById("cropDetails").textContent = result.message || t("cropResultPending");
    addHistory(t("historyCrop"), String(crop));
  } catch (err) {
    status.textContent = t("cropFailure") + ": " + err.message + ". " + t("genericBackendHint");
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = t("cropSubmit");
  }
});

async function loadCrops() {
  const select = document.getElementById("priceCrop");
  try {
    const response = await fetch(API_BASE + CROP_LIST_ENDPOINT);
    const data = await readResponse(response);
    if (!Array.isArray(data.crops) || data.crops.length === 0) throw new Error("No crops were found in the crops table.");
    select.replaceChildren(new Option(t("selectCrop"), ""));
    data.crops.forEach((crop) => select.add(new Option(crop.crop_name, String(crop.crop_id))));
    select.disabled = false;
  } catch (err) {
    select.replaceChildren(new Option(t("cropLoadFailure"), ""));
    select.disabled = true;
    document.getElementById("priceStatus").textContent = t("cropLoadFailure") + ": " + err.message + ". " + t("genericBackendHint");
    console.error(err);
  }
}
loadCrops();

document.getElementById("priceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("priceStatus");
  status.textContent = "";
  const cropId = document.getElementById("priceCrop").value;
  const btn = e.currentTarget.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.textContent = t("priceLoading");
  try {
    if (!cropId) throw new Error(t("selectCropError"));
    
const selectedCrop = document.getElementById("priceCrop")
    .selectedOptions[0].textContent.trim();

const state = document.getElementById("marketState").value.trim();
const district = document.getElementById("marketDistrict").value.trim();

if (!state || !district) {
    throw new Error(
        "Please enter your state and district in the Live Agricultural Market Prices section first."
    );
}

const query = new URLSearchParams({
    commodity: selectedCrop,
    state: state,
    district: district
});

const response = await fetch(
    `${API_BASE}${PRICE_ENDPOINT}?${query.toString()}`,
    { cache: "no-store" }
);

    const result = await readResponse(response);
    const price = result.predicted_price;
    if (price === undefined || price === null) throw new Error("The backend did not return a predicted price.");
    document.getElementById("priceResult").textContent = typeof price === "number" ? "₹" + price.toLocaleString("en-IN") : String(price);
    document.getElementById("priceDetails").textContent = result.message || t("priceResultPending");
    addHistory(t("historyPrice"), document.getElementById("priceCrop").selectedOptions[0].text + ": " + price);
  } catch (err) {
    status.textContent = t("priceFailure") + ": " + err.message;
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = t("priceSubmit");
  }
});

function renderChatText(target, text) {
  target.replaceChildren();
  // Render basic **bold** Markdown safely while leaving all other text as text nodes.
  const source = String(text ?? "").replace(/^\s*\*\s+/gm, "• ");
  const parts = source.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((part) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      target.appendChild(strong);
    } else {
      target.appendChild(document.createTextNode(part));
    }
  });
}

function scrollMessagesToBottom(behavior = "smooth") {
  const messages = document.getElementById("messages");
  if (!messages) return;
  requestAnimationFrame(() => {
    messages.scrollTo({ top: messages.scrollHeight, behavior });
  });
}

function addChat(text, who, options = {}) {
  const div = document.createElement("div");
  div.className = `bubble ${who === "user" ? "user" : "bot"}${options.initial ? " initial" : ""}`;
  const speaker = document.createElement("strong");
  speaker.className = "speaker";
  speaker.textContent = (who === "user" ? t("youLabel") : t("botLabel")) + ": ";
  const content = document.createElement("span");
  content.className = "message-text";
  renderChatText(content, text);
  div.append(speaker, content);
  document.getElementById("messages").appendChild(div);
  scrollMessagesToBottom();
  return div;
}

function updateChatBubble(bubble, text) {
  const content = bubble.querySelector(".message-text");
  if (content) renderChatText(content, text);
  scrollMessagesToBottom();
}

function languageInstruction(language) {
  if (language === "hi") return "Reply in Hindi. Farmer's question: ";
  if (language === "mr") return "Reply in Marathi. Farmer's question: ";
  return "Reply in simple English. Farmer's question: ";
}

async function sendChat(message) {
  message = message.trim();
  if (!message) return;
  addChat(message, "user");
  document.getElementById("chatInput").value = "";
  const status = document.getElementById("chatStatus");
  status.textContent = "";
  const quick = document.querySelector("#messages .quick");
  if (quick) quick.remove();
  const language = currentLanguage;
  const pendingBubble = addChat(t("chatThinking"), "bot");
  try {
    const result = await post(CHAT_ENDPOINT, { query: languageInstruction(language) + message });
    const reply = result.answer;
    if (reply === undefined || reply === null) throw new Error("The backend did not return an answer.");
    updateChatBubble(pendingBubble, String(reply));
  } catch (err) {
    updateChatBubble(pendingBubble, t("chatFailure"));
    status.textContent = "" + err.message;
    console.error(err);
  }
}

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  sendChat(document.getElementById("chatInput").value);
});
document.querySelectorAll("[data-prompt]").forEach((b) => {
  b.addEventListener("click", () => sendChat(b.dataset.prompt));
});

function toggleTheme() { document.documentElement.classList.toggle("dark"); }
document.getElementById("themeToggle").addEventListener("click", toggleTheme);
document.getElementById("settingsTheme").addEventListener("click", toggleTheme);

function syncLang(value) {
  currentLanguage = ["en", "hi", "mr"].includes(value) ? value : "en";
  ["languageSelect", "chatLanguage", "settingsLanguage"].forEach((id) => {
    const select = document.getElementById(id);
    if (select) select.value = currentLanguage;
  });
  applyTranslations();
}
["languageSelect", "chatLanguage", "settingsLanguage"].forEach((id) => {
  document.getElementById(id).addEventListener("change", (e) => syncLang(e.target.value));
});

window.addEventListener("hashchange", () => {
  const page = window.location.hash.slice(1);
  if (["home", "crop", "crop-price", "chatbot", "history", "settings"].includes(page)) showPage(page);
});

// Translate the page on startup and mark the welcome message so it is localizable.
const firstBubble = document.querySelector("#messages > .bubble");
if (firstBubble) {
  firstBubble.classList.add("bot", "initial");
  const speaker = document.createElement("strong");
  speaker.className = "speaker";
  speaker.textContent = t("botLabel") + ": ";
  const content = document.createElement("span");
  content.className = "message-text";
  renderChatText(content, t("chatWelcome"));
  firstBubble.replaceChildren(speaker, content);
}
const historyList = document.getElementById("historyList");
if (historyList && historyList.textContent.trim() === "No predictions yet.") historyList.dataset.empty = "true";
applyTranslations();
const initialPage = window.location.hash.slice(1);
showPage(["home", "crop", "crop-price", "chatbot", "history", "settings"].includes(initialPage) ? initialPage : "crop");


/* Live market prices: separate from the existing predicted-price model */
const liveMarketForm = document.getElementById("liveMarketForm");

const MARKET_TEXT = {
  en: {
    heading: "Live Agricultural Market Prices",
    intro: "Search reported market prices by state and district across India.",
    state: "State / Union Territory", stateHelp: "Enter the state you want to search.",
    statePlaceholder: "e.g. Maharashtra, Punjab, Karnataka",
    district: "District", districtHelp: "Enter a district in that state.",
    districtPlaceholder: "e.g. Nashik, Pune, Amritsar",
    button: "🌾 Check Market Prices", loading: "Loading market prices…",
    initial: "Enter a state and district, then click Check Market Prices.",
    note: "These are reported market prices, not guaranteed future prices. Availability depends on the records provided by the market data source.",
    date: "Date", commodity: "Commodity", market: "Market", variety: "Variety",
    min: "Min. Price", modal: "Modal Price", max: "Max. Price",
    missing: "Please enter both state and district.",
    none: "No matching market records found. Try another district or crop.",
    success: "Market prices loaded successfully.",
    failed: "Could not load market prices: ",
    unitNote: "Reported market prices; verify the source unit before use."
  },
  hi: {
    heading: "कृषि मंडी के वर्तमान भाव", intro: "भारत के किसी भी राज्य और जिले के उपलब्ध मंडी भाव खोजें।",
    state: "राज्य / केंद्र शासित प्रदेश", stateHelp: "जिस राज्य के भाव चाहिए, उसका नाम लिखें।",
    statePlaceholder: "जैसे महाराष्ट्र, पंजाब, कर्नाटक",
    district: "जिला", districtHelp: "उस राज्य के जिले का नाम लिखें।",
    districtPlaceholder: "जैसे नाशिक, पुणे, अमृतसर",
    button: "🌾 मंडी भाव देखें", loading: "मंडी भाव लोड हो रहे हैं…",
    initial: "राज्य और जिला लिखकर मंडी भाव देखें पर क्लिक करें।",
    note: "ये रिपोर्ट किए गए मंडी भाव हैं, भविष्य के मूल्य की गारंटी नहीं। उपलब्धता डेटा स्रोत पर निर्भर करती है।",
    date: "तारीख", commodity: "फसल", market: "मंडी", variety: "किस्म",
    min: "न्यूनतम भाव", modal: "मोडल भाव", max: "अधिकतम भाव",
    missing: "कृपया राज्य और जिला दोनों भरें।",
    none: "कोई मेल खाता रिकॉर्ड नहीं मिला। दूसरा जिला या फसल आज़माएँ।",
    success: "मंडी भाव सफलतापूर्वक लोड हुए।",
    failed: "मंडी भाव लोड नहीं हो सके: ",
    unitNote: "उपयोग से पहले स्रोत में दिए गए मूल्य की इकाई जाँचें।"
  },
  mr: {
    heading: "थेट कृषी बाजारभाव", intro: "भारतातील कोणत्याही राज्य आणि जिल्ह्याचे उपलब्ध बाजारभाव शोधा.",
    state: "राज्य / केंद्रशासित प्रदेश", stateHelp: "भाव पाहण्यासाठी राज्याचे नाव लिहा.",
    statePlaceholder: "उदा. महाराष्ट्र, पंजाब, कर्नाटक",
    district: "जिल्हा", districtHelp: "त्या राज्यातील जिल्ह्याचे नाव लिहा.",
    districtPlaceholder: "उदा. नाशिक, पुणे, अमृतसर",
    button: "🌾 बाजारभाव पहा", loading: "बाजारभाव लोड होत आहेत…",
    initial: "राज्य आणि जिल्हा लिहून बाजारभाव पहा यावर क्लिक करा.",
    note: "हे नोंदवलेले बाजारभाव आहेत; भविष्यातील किमतीची हमी नाही. उपलब्धता डेटा स्रोतावर अवलंबून आहे.",
    date: "दिनांक", commodity: "पीक", market: "बाजार", variety: "जात",
    min: "किमान भाव", modal: "मोडल भाव", max: "कमाल भाव",
    missing: "कृपया राज्य आणि जिल्हा दोन्ही भरा.",
    none: "जुळणाऱ्या नोंदी सापडल्या नाहीत. दुसरा जिल्हा किंवा पीक वापरून पाहा.",
    success: "बाजारभाव यशस्वीपणे लोड झाले.",
    failed: "बाजारभाव लोड करता आले नाहीत: ",
    unitNote: "वापरण्यापूर्वी स्रोतामधील किमतीचे एकक तपासा."
  }
};

function marketText() {
  return MARKET_TEXT[currentLanguage] || MARKET_TEXT.en;
}

function applyMarketTranslations() {
  if (!liveMarketForm) return;
  const tMarket = marketText();
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  };
  set("liveMarketHeading", tMarket.heading);
  set("liveMarketIntro", tMarket.intro);
  set("marketStateLabel", tMarket.state);
  set("marketStateHelp", tMarket.stateHelp);
  set("marketDistrictLabel", tMarket.district);
  set("marketDistrictHelp", tMarket.districtHelp);
  set("liveMarketNote", tMarket.note);
  const stateInput = document.getElementById("marketState");
  const districtInput = document.getElementById("marketDistrict");
  if (stateInput) stateInput.placeholder = tMarket.statePlaceholder;
  if (districtInput) districtInput.placeholder = tMarket.districtPlaceholder;
  const button = document.getElementById("liveMarketBtn");
  if (button && !button.disabled) button.textContent = tMarket.button;
  const details = document.getElementById("liveMarketDetails");
  const records = document.getElementById("liveMarketRecords");
  if (details && records && records.childElementCount === 0 && !details.dataset.loaded) {
    details.textContent = tMarket.initial;
  }
}

if (liveMarketForm) {
  liveMarketForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const state = document.getElementById("marketState").value.trim();
    const district = document.getElementById("marketDistrict").value.trim();
    const status = document.getElementById("liveMarketStatus");
    const details = document.getElementById("liveMarketDetails");
    const recordsContainer = document.getElementById("liveMarketRecords");
    const button = document.getElementById("liveMarketBtn");
    const txt = marketText();

    status.textContent = "";
    details.textContent = "";
    details.dataset.loaded = "false";
    recordsContainer.replaceChildren();

    if (!state || !district) {
      status.textContent = txt.missing;
      return;
    }

    button.disabled = true;
    button.textContent = txt.loading;

    try {
     const params = new URLSearchParams({
    state: state,
    district: district,
    limit: "10"
});
      

      const response = await fetch(`${API_BASE}/api/market-prices?${params.toString()}`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      if (!Array.isArray(data.records)) throw new Error("The market API response is missing its records list.");

      if (data.records.length === 0) {
        details.textContent = txt.none;
        details.dataset.loaded = "true";
        return;
      }

      details.textContent = `${data.source || "data.gov.in"} | ${state} | ${district} | ${data.records.length}`;
      details.dataset.loaded = "true";

      const table = document.createElement("table");
      table.className = "market-price-table";
      const headers = [txt.date, txt.commodity, txt.market, txt.variety, txt.min, txt.modal, txt.max];
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headers.forEach((label) => {
        const th = document.createElement("th");
        th.textContent = label;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      data.records.forEach((record) => {
        const row = document.createElement("tr");
        const values = [
          record.Arrival_Date ?? "—",
          record.Commodity ?? "—",
          record.Market ? String(record.Market).trim() : "—",
          record.Variety ?? "—",
          record.Min_Price ?? "—",
          record.Modal_Price ?? "—",
          record.Max_Price ?? "—"
        ];
        values.forEach((value) => {
          const td = document.createElement("td");
          td.textContent = typeof value === "number" && Number.isFinite(value)
            ? value.toLocaleString("en-IN") : String(value);
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      recordsContainer.appendChild(table);

      const note = document.createElement("p");
      note.className = "muted";
      note.textContent = txt.unitNote;
      recordsContainer.appendChild(note);
      status.textContent = txt.success;
    } catch (error) {
      console.error("Live market price error:", error);
      status.textContent = txt.failed + error.message;
    } finally {
      button.disabled = false;
      button.textContent = marketText().button;
    }
  });

  // Existing language selectors already call syncLang/applyTranslations.
  // This listener only translates the added market-price controls.
  ["languageSelect", "chatLanguage", "settingsLanguage"].forEach((id) => {
    const selector = document.getElementById(id);
    if (selector) selector.addEventListener("change", () => {
      window.setTimeout(applyMarketTranslations, 0);
    });
  });
  applyMarketTranslations();
}

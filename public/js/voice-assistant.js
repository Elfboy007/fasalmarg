// Fasalmarg AI Voice Assistant for Indian Farmers
// Features Web Speech Recognition, Regional Audio Synthesis, and Natural Language Intent Routing

window.VoiceAssistant = (function() {
  let isListening = false;
  let recognition = null;
  const synth = window.speechSynthesis;

  // Initialize Speech Recognition if supported by browser
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
      isListening = true;
      updateVoiceUiState(true);
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onerror = function(err) {
      console.warn("Speech recognition error:", err);
      isListening = false;
      updateVoiceUiState(false);
      showVoiceResponse("Could not hear clearly. Please tap one of the quick voice options below.");
    };

    recognition.onend = function() {
      isListening = false;
      updateVoiceUiState(false);
    };
  }

  function openModal() {
    const modal = document.getElementById("voice-assistant-modal");
    if (modal) {
      modal.classList.add("active");
      const currentLang = window.FasalmargI18n ? window.FasalmargI18n.getLang() : "en";
      
      // Greet the farmer
      const greetings = {
        en: "Namaste Ramesh. How can I help with your crops, prices, or finance today?",
        hi: "नमस्ते रमेश जी। आज आप फसल भाव, बिक्री या ऋण के बारे में क्या जानना चाहते हैं?",
        mr: "नमस्कार रमेश भाऊ. आज तुम्हाला बाजारभाव, माल विक्री किंवा कर्जाविषयी काय माहिती हवी आहे?",
        ta: "வணக்கம் ரமேஷ். பயிர் விலை அல்லது கடன் பற்றி உங்களுக்கு என்ன உதவி வேண்டும்?",
        te: "నమస్కారం రమేష్ గారు. నేడు మీకు మార్కెట్ ధరలు లేదా రుణాల గురించి ఏమి సహాయం కావాలి?",
        bn: "নমস্কার রমেশ বাবু। আজ আপনি ফসল দর বা ঋণ সম্পর্কে কী জানতে চান?"
      };
      
      const welcome = greetings[currentLang] || greetings.en;
      showVoiceResponse(welcome);
      speak(welcome, currentLang);
    }
  }

  function closeModal() {
    const modal = document.getElementById("voice-assistant-modal");
    if (modal) {
      modal.classList.remove("active");
    }
    stopListening();
    if (synth) synth.cancel();
  }

  function toggleListening() {
    if (!recognition) {
      showVoiceResponse("Speech recognition not supported in this browser. Please tap any quick command below.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (recognition && !isListening) {
      try {
        const lang = window.FasalmargI18n ? window.FasalmargI18n.getLang() : "en";
        const langCodes = {
          en: "en-IN",
          hi: "hi-IN",
          mr: "mr-IN",
          ta: "ta-IN",
          te: "te-IN",
          bn: "bn-IN"
        };
        recognition.lang = langCodes[lang] || "en-IN";
        recognition.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
      }
    }
  }

  function stopListening() {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    isListening = false;
    updateVoiceUiState(false);
  }

  function updateVoiceUiState(listening) {
    const micBtn = document.getElementById("voice-assistant-mic-btn");
    const statusText = document.getElementById("voice-status-text");
    const waveAnim = document.getElementById("voice-wave-animation");

    if (micBtn) {
      if (listening) {
        micBtn.classList.add("listening");
      } else {
        micBtn.classList.remove("listening");
      }
    }

    if (statusText) {
      statusText.textContent = listening ? "Listening... Speak now 🎙️" : "Tap microphone to speak";
    }

    if (waveAnim) {
      waveAnim.style.display = listening ? "flex" : "none";
    }
  }

  function handleVoiceCommand(query) {
    const q = query.toLowerCase().trim();
    const queryDisplay = document.getElementById("voice-user-transcript");
    if (queryDisplay) {
      queryDisplay.textContent = `"${query}"`;
    }

    const currentLang = window.FasalmargI18n ? window.FasalmargI18n.getLang() : "en";

    // Intent: Check Price / Mandi भाव
    if (q.includes("price") || q.includes("भाव") || q.includes("bhav") || q.includes("rate") || q.includes("விலை") || q.includes("ధర") || q.includes("দর") || q.includes("tomato") || q.includes("टमाटर")) {
      const response = {
        en: "Nashik Mandi Tomato is trading at ₹2,850 per quintal, up 24% this week. I am opening Price Insights for you.",
        hi: "नासिक मंडी में टमाटर का भाव ₹2,850 प्रति क्विंटल है और मांग में 24% वृद्धि है। मैं आपके लिए भाव स्क्रीन खोल रहा हूँ।",
        mr: "नाशिक बाजार समितीत टोमॅटोचा भाव ₹२,८५० प्रति क्विंटल असून मागणी २४% वाढली आहे. मी बाजारभाव स्क्रीन उघडत आहे.",
        ta: "நாசிக் மண்டியில் தக்காளி குவிண்டாலுக்கு ₹2,850 ஆக உள்ளது. விலை விவரங்களைத் திறக்கிறேன்.",
        te: "నాసిక్ మార్కెట్లో టమాటా ధర క్వింటాలుకు ₹2,850 గా ఉంది. ధరల వివరాలను తెరుస్తున్నాను.",
        bn: "নাসিক মান্ডিতে টমেটোর দর প্রতি কুইন্টাল ₹২,৮৫০। দর তালিকা খোলা হচ্ছে।"
      }[currentLang] || "Tomato price is ₹2,850/Quintal. Opening Price Insights.";

      showVoiceResponse(response);
      speak(response, currentLang);
      setTimeout(() => {
        closeModal();
        window.FasalmargApp.navigateTo("price-insights");
      }, 2500);
      return;
    }

    // Intent: Sell Crop / फसल बेचें
    if (q.includes("sell") || q.includes("बेच") || q.includes("विक") || q.includes("விற்க") || q.includes("అమ్మ") || q.includes("বিক্রি") || q.includes("quintal")) {
      const response = {
        en: "Great! 7 buyers are looking for Tomato right now. Highest offer is ₹3,050/Q from ABC Agro Foods. Opening Sell Crop page.",
        hi: "बहुत बढ़िया! 7 खरीदार अभी टमाटर ढूंढ रहे हैं। ABC एग्रो फूड्स का सबसे अधिक प्रस्ताव ₹3,050/क्विंटल है। फसल बिक्री स्क्रीन खुल रही है।",
        mr: "उत्तम! ७ व्यापारी सध्या टोमॅटो खरेदीसाठी तयार आहेत. ABC ॲग्रो फूड्सची सर्वाधिक ₹३,०५० ऑफर आहे. विक्री स्क्रीन उघडत आहे.",
        ta: "7 வாங்குபவர்கள் தக்காளிக்கு தயாராக உள்ளனர். விற்பனை பக்கத்தைத் திறக்கிறேன்.",
        te: "7 మంది కొనుగోలుదారులు సిద్ధంగా ఉన్నారు. పంట విక్రయ పేజీని తెరుస్తున్నాను.",
        bn: "৭ জন ক্রেতা টমেটো কেনার জন্য প্রস্তুত। বিক্রয় পেজ খোলা হচ্ছে।"
      }[currentLang] || "Opening Sell Crop page.";

      showVoiceResponse(response);
      speak(response, currentLang);
      setTimeout(() => {
        closeModal();
        window.FasalmargApp.navigateTo("my-crops");
      }, 2500);
      return;
    }

    // Intent: Payment / पैसे
    if (q.includes("payment") || q.includes("पैसे") || q.includes("पेमेंट") || q.includes("खाते") || q.includes("ரூபாய்") || q.includes("డబ్బు") || q.includes("টাকা")) {
      const response = {
        en: "You have ₹56,000 pending in escrow from ABC Agro Foods, expected within 24 hours of delivery. Opening Payments page.",
        hi: "आपके ₹56,000 ABC एग्रो फूड्स के सुरक्षित एस्क्रो में हैं, जो डिलीवरी के 24 घंटे में आपके खाते में आ जाएंगे। पेमेंट्स स्क्रीन खुल रही है।",
        mr: "तुमचे ₹५६,००० ABC ॲग्रो फूड्सच्या एस्क्रो खात्यात सुरक्षित आहेत. माल पोहोचताच २४ तासांत खात्यात जमा होतील.",
        ta: "உங்களுக்கு ₹56,000 நிலுவைத் தொகை உள்ளது. பணம் செலுத்தும் பக்கத்தைத் திறக்கிறேன்.",
        te: "మీకు ₹56,000 రావలసి ఉంది. చెల్లింపుల పేజీని తెరుస్తున్నాను.",
        bn: "আপনার ₹৫৬,০০০ বকেয়া রয়েছে। পেমেন্ট পেজ খোলা হচ্ছে।"
      }[currentLang] || "Opening Payments page.";

      showVoiceResponse(response);
      speak(response, currentLang);
      setTimeout(() => {
        closeModal();
        window.FasalmargApp.navigateTo("payments");
      }, 2500);
      return;
    }

    // Intent: Finance / Loan / KCC / ऋण
    if (q.includes("loan") || q.includes("ऋण") || q.includes("कर्ज") || q.includes("kcc") || q.includes("finance") || q.includes("பணம்") || q.includes("రుణం")) {
      const response = {
        en: "You are pre-eligible for a 4% subsidized Kisan Credit Card loan up to ₹1,50,000 based on your farm records. Opening Finance Support.",
        hi: "आप अपनी 4 एकड़ जमीन के आधार पर 4% ब्याज पर ₹1,50,000 तक के KCC किसान क्रेडिट कार्ड के लिए पात्र हैं। ऋण सहायता स्क्रीन खुल रही है।",
        mr: "आपण आपल्या जमिनीच्या आधारावर ४% व्याजाने ₹१,५०,००० पर्यंतच्या KCC किसान क्रेडिट कार्डसाठी पात्र आहात. कर्ज सहाय्य स्क्रीन उघडत आहे.",
        ta: "நீங்கள் 4% வட்டி KCC கடனுக்கு தகுதியுடையவர். நிதி ஆதரவு பக்கத்தைத் திறக்கிறேன்.",
        te: "మీరు 4% వడ్డీతో KCC రుణానికి అర్హులు. రుణ పేజీని తెరుస్తున్నాను.",
        bn: "আপনি ৪% সুদে KCC ঋণের জন্য যোগ্য। ঋণ সহায়তা পেজ খোলা হচ্ছে।"
      }[currentLang] || "Opening Finance Support.";

      showVoiceResponse(response);
      speak(response, currentLang);
      setTimeout(() => {
        closeModal();
        window.FasalmargApp.navigateTo("finance-support");
      }, 2500);
      return;
    }

    // Default intent
    const defaultReply = {
      en: `Got it: "${query}". Connecting you with Fasalmarg AI Farm Assistant.`,
      hi: `समझ गए: "${query}"। आपको मेराकी AI सहायक से जोड़ रहे हैं।`,
      mr: `समजले: "${query}". तुम्हाला मेराकी AI सहाय्यकाशी जोडत आहोत.`,
      ta: `புரிந்தது: "${query}". AI உதவியாளருடன் இணைக்கிறேன்.`,
      te: `అర్థమైంది: "${query}". AI అసిస్టెంట్ కు కనెక్ట్ చేస్తున్నాను.`,
      bn: `বুঝতে পেরেছি: "${query}"। AI সহকারীর সাথে যুক্ত করা হচ্ছে।`
    }[currentLang] || `Got it. Opening AI Assistant.`;

    showVoiceResponse(defaultReply);
    speak(defaultReply, currentLang);
    setTimeout(() => {
      closeModal();
      window.FasalmargApp.navigateTo("ai-assistant");
    }, 2500);
  }

  function showVoiceResponse(text) {
    const respEl = document.getElementById("voice-assistant-reply");
    if (respEl) {
      respEl.textContent = text;
      respEl.style.opacity = "1";
    }
  }

  function speak(text, langCode) {
    if (!synth) return;
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = {
        en: "en-IN",
        hi: "hi-IN",
        mr: "mr-IN",
        ta: "ta-IN",
        te: "te-IN",
        bn: "bn-IN"
      };
      utterance.lang = langMap[langCode] || "en-IN";
      utterance.rate = 0.95; // Slightly slower, clearer cadence for farmers
      utterance.pitch = 1.0;
      synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  }

  return {
    openModal,
    closeModal,
    toggleListening,
    handleVoiceCommand,
    speak
  };
})();

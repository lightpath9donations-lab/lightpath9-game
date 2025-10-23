// scene manager, i18n, copyUPI, and feedback sending (EmailJS + mailto fallback)

// === Configuration / placeholders ===
// Replace these with your EmailJS values if you want feedback emailed directly.
// See README.md for instructions.
const EMAILJS_USER_ID = "";       // e.g. "user_xxx" (leave empty to use mailto fallback)
const EMAILJS_SERVICE_ID = "";    // e.g. "service_xxx"
const EMAILJS_TEMPLATE_ID = "";   // e.g. "template_xxx"

(function initEmailJS() {
  if (window.emailjs && EMAILJS_USER_ID) {
    try {
      emailjs.init(EMAILJS_USER_ID);
    } catch (e) {
      console.warn("EmailJS init failed", e);
    }
  }
})();

// === i18n strings ===
const I18N = {
  en: {
    title: "Light Seeker",
    subtitle: "The Path of Giving",
    village_title: "The Village",
    village_text: 'A calm monk approaches you beside a lantern-lit lane. He asks softly, "Will you share your light with those who need it?"',
    share: "Share your light",
    reflect: "I will reflect first",
    market_title: "The Marketplace",
    market_text: "A friendly merchant is setting up a small donation box near their stall but needs an extra hand. Would you help arrange the box and write a blessing?",
    help_box: "Help set up the donation box",
    blessing_placeholder: "Write a short blessing (optional)",
    finish: "Finish and continue",
    back: "Go back",
    temple_title: "The Temple",
    temple_text: "Within the temple you are invited to offer a symbolic donation — an act of intention rather than amount. Choose what you offer.",
    offer_prayer: "A prayer",
    offer_song: "A song",
    offer_seed: "A seed",
    receive: "Receive the blessing",
    back_market: "Back to market",
    light_title: "The Light",
    light_text: "You are bathed in warm light. The community thanks you for your intention.",
    upi_label: "UPI ID",
    copy: "Copy",
    upi_hint: "Scan the QR to donate or copy the UPI ID. Thank you for your generosity.",
    restart: "Walk the path again",
    footer: "Minimal spiritual UI — easy to host on GitHub Pages or Netlify",
    feedback_title: "Send feedback",
    send: "Send",
    cancel: "Cancel",
    feedback_note: "Feedback will be sent by email (requires EmailJS setup) or fallback to your mail client."
  },
  hi: {
    title: "लाइट सीकर",
    subtitle: "दिया देने का मार्ग",
    village_title: "गाँव",
    village_text: 'एक शांत भिक्षु दीपक-प्रकाशित पगडंडी旁 आता है और शांत स्वर में पूछता है, "क्या आप अपना प्रकाश उन लोगों के साथ बाँटेंगे जिन्हें इसकी आवश्यकता है?"',
    share: "अपना प्रकाश बाँटें",
    reflect: "पहले मैं ध्यान करूँगा",
    market_title: "बाजार",
    market_text: "एक दोस्ताना व्यापारी अपने ठेले के पास एक छोटा दान पेटी लगा रहा है और उसे मदद की ज़रूरत है। क्या आप पेटी सजाने और एक आशीष लिखने में मदद करेंगे?",
    help_box: "दान पेटी लगाने में मदद करें",
    blessing_placeholder: "एक छोटी आशीष लिखें (वैकल्पिक)",
    finish: "पूरा करके आगे बढ़ें",
    back: "वापस जाएँ",
    temple_title: "मंदिर",
    temple_text: "मंदिर में आपको एक प्रतीकात्मक दान देने के लिए आमंत्रित किया गया है — यह राशि नहीं, बल्कि इरादा है। चुनें कि आप क्या अर्पित करते हैं।",
    offer_prayer: "एक प्रार्थना",
    offer_song: "एक गीत",
    offer_seed: "एक बीज",
    receive: "आशीर्वाद प्राप्त करें",
    back_market: "बाजार पर वापस जाएँ",
    light_title: "प्रकाश",
    light_text: "आप को गर्म प्रकाश में नहलाया जाता है। समुदाय आपके इरादे के लिए आभारी है।",
    upi_label: "UPI आईडी",
    copy: "कॉपी",
    upi_hint: "दान करने के लिए QR स्कैन करें या UPI आईडी कॉपी करें। आपकी उदारता के लिए धन्यवाद।",
    restart: "पथ फिर से चलें",
    footer: "सरल आध्यात्मिक UI — GitHub Pages पर होस्ट करना आसान",
    feedback_title: "प्रतिक्रिया भेजें",
    send: "भेजें",
    cancel: "रद्द करें",
    feedback_note: "प्रतिक्रिया ईमेल से भेजी जाएगी (EmailJS सेटअप आवश्यक) या आपके मेल क्लाइंट का उपयोग किया जाएगा।"
  }
};

// === Helper: translate DOM by data-i18n attributes ===
function applyLanguage(lang = "en") {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = I18N[lang] && I18N[lang][key];
    if (text) el.textContent = text;
  });
  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = I18N[lang] && I18N[lang][key];
    if (text) el.setAttribute("placeholder", text);
  });
  // direction / lang attribute
  document.documentElement.lang = (lang === "hi") ? "hi" : "en";
}

// Initialize language controls and UI behavior once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const langEn = document.getElementById("langEn");
  const langHi = document.getElementById("langHi");
  let currentLang = "en";
  applyLanguage(currentLang);

  function setLang(lang) {
    currentLang = lang;
    applyLanguage(lang);
    // button UI
    if (lang === "en") {
      langEn.classList.add("active-lang");
      langEn.setAttribute("aria-pressed", "true");
      langHi.classList.remove("active-lang");
      langHi.setAttribute("aria-pressed", "false");
    } else {
      langHi.classList.add("active-lang");
      langHi.setAttribute("aria-pressed", "true");
      langEn.classList.remove("active-lang");
      langEn.setAttribute("aria-pressed", "false");
    }
  }

  langEn.addEventListener("click", () => setLang("en"));
  langHi.addEventListener("click", () => setLang("hi"));

  // Scene manager with fade transitions
  const scenes = Array.from(document.querySelectorAll(".scene"));
  const state = { note: "", boxSetup: false, blessing: "", offer: "" };

  function showScene(name) {
    scenes.forEach(s => {
      const isTarget = s.dataset.scene === name;
      if (isTarget) {
        s.removeAttribute("hidden");
        s.classList.add("visible");
        s.setAttribute("aria-hidden", "false");
      } else {
        s.classList.remove("visible");
        setTimeout(() => {
          if (!s.classList.contains("visible")) {
            s.setAttribute("hidden", "");
            s.setAttribute("aria-hidden", "true");
          }
        }, 380);
      }
    });
    document.activeElement && document.activeElement.blur();
  }

  // initial scene
  showScene("village");

  // global click delegation for navigation
  document.body.addEventListener("click", (e) => {
    const el = e.target.closest("[data-next]");
    if (!el) return;
    const next = el.dataset.next;
    if (el.dataset.note) state.note = el.dataset.note;
    if (next === "temple") {
      const box = document.getElementById("boxSetup");
      const blessingInput = document.getElementById("blessing");
      if (box) state.boxSetup = box.checked;
      if (blessingInput) state.blessing = blessingInput.value.trim();
    }
    showScene(next);
  });

  // temple donation choices
  document.querySelectorAll(".donation-options .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const offer = btn.dataset.offer;
      state.offer = offer || "";
      const friendly = {
        prayer: I18N[currentLang].offer_prayer || "You offered a heartfelt prayer.",
        song: I18N[currentLang].offer_song || "You share a song that lifts weary hearts.",
        seed: I18N[currentLang].offer_seed || "You plant a seed of future hope."
      };
      const summary = document.querySelector(".summary");
      if (summary) {
        summary.textContent = friendly[offer] || (I18N[currentLang].receive || "You offered your intention.");
      }
    });
  });

  // copyUPI with good feedback and fallbacks
  async function copyUPI() {
    const copyBtn = document.getElementById("copyBtn");
    const upiInput = document.getElementById("upiId");
    const upi = upiInput ? upiInput.value.trim() : "";

    if (!upi) {
      if (copyBtn) {
        const old = copyBtn.textContent;
        copyBtn.textContent = I18N[currentLang].copy || "No UPI";
        setTimeout(() => (copyBtn.textContent = old), 1400);
      } else {
        window.alert("No UPI ID available to copy.");
      }
      return;
    }

    if (copyBtn) copyBtn.disabled = true;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upi);
      } else if (upiInput) {
        upiInput.select();
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
      } else {
        window.prompt("Copy the UPI ID:", upi);
      }

      if (copyBtn) {
        copyBtn.textContent = (currentLang === "hi") ? "कॉपी हुई ✓" : "Copied ✓";
        setTimeout(() => {
          copyBtn.textContent = I18N[currentLang].copy || "Copy";
          copyBtn.disabled = false;
        }, 1600);
      }
    } catch (err) {
      if (copyBtn) {
        copyBtn.textContent = (currentLang === "hi") ? "पुनः प्रयास" : "Try Again";
        setTimeout(() => (copyBtn.textContent = I18N[currentLang].copy || "Copy"), 1400);
        copyBtn.disabled = false;
      }
      try {
        if (upiInput) {
          upiInput.select();
          document.execCommand("copy");
          window.getSelection().removeAllRanges();
        } else {
          window.prompt("Copy the UPI ID:", upi);
        }
      } catch (_) {
        window.prompt("Copy the UPI ID:", upi);
      }
    }
  }

  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) copyBtn.addEventListener("click", copyUPI);

  // restart
  const restartBtn = document.getElementById("restart");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      state.note = ""; state.boxSetup = false; state.blessing = ""; state.offer = "";
      const box = document.getElementById("boxSetup");
      const blessingInput = document.getElementById("blessing");
      const summary = document.querySelector(".summary");
      if (box) box.checked = false;
      if (blessingInput) blessingInput.value = "";
      if (summary) summary.textContent = "";
      showScene("village");
    });
  }

  // Accessibility: Enter activates first [data-next] button in a scene
  document.querySelectorAll(".scene").forEach(s => {
    s.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const nextBtn = s.querySelector("[data-next]");
        if (nextBtn) nextBtn.click();
      }
    });
  });

  // === Feedback modal logic ===
  const feedbackModal = document.getElementById("feedbackModal");
  const feedbackOpen = document.getElementById("feedbackOpen");
  const feedbackClose = document.getElementById("feedbackClose");
  const fbCancel = document.getElementById("fbCancel");
  const fbForm = document.getElementById("feedbackForm");
  const fbSend = document.getElementById("fbSend");

  function openFeedback() {
    if (!feedbackModal) return;
    feedbackModal.removeAttribute("hidden");
    feedbackModal.setAttribute("aria-hidden", "false");
    setTimeout(() => document.getElementById("fb-name")?.focus(), 120);
  }
  function closeFeedback() {
    if (!feedbackModal) return;
    feedbackModal.setAttribute("hidden", "");
    feedbackModal.setAttribute("aria-hidden", "true");
    feedbackOpen?.focus();
  }

  feedbackOpen?.addEventListener("click", openFeedback);
  feedbackClose?.addEventListener("click", closeFeedback);
  fbCancel?.addEventListener("click", closeFeedback);
  feedbackModal?.addEventListener("click", (e) => {
    if (e.target === feedbackModal) closeFeedback();
  });

  async function sendFeedback(e) {
    e.preventDefault();
    const name = document.getElementById("fb-name")?.value || "";
    const email = document.getElementById("fb-email")?.value || "";
    const message = document.getElementById("fb-message")?.value || "";

    if (!message.trim()) {
      window.alert("Please write a message.");
      return;
    }

    fbSend.disabled = true;
    const originalText = fbSend.textContent;
    fbSend.textContent = (currentLang === "hi") ? "भेज रहे..." : "Sending...";

    // Use EmailJS if configured
    if (EMAILJS_USER_ID && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs) {
      try {
        const templateParams = {
          from_name: name,
          from_email: email,
          message: message
        };
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        fbSend.textContent = (currentLang === "hi") ? "भेजा गया ✓" : "Sent ✓";
        setTimeout(() => {
          fbSend.textContent = originalText;
          fbSend.disabled = false;
          fbForm.reset();
          closeFeedback();
        }, 1400);
        return;
      } catch (err) {
        console.warn("EmailJS send failed:", err);
      }
    }

    // mailto fallback (opens user's mail client)
    try {
      const subject = encodeURIComponent("Light Seeker Feedback");
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      fbSend.textContent = (currentLang === "hi") ? "मेल खुला" : "Opening mail client";
      setTimeout(() => {
        fbSend.textContent = originalText;
        fbSend.disabled = false;
        fbForm.reset();
        closeFeedback();
      }, 900);
    } catch (err) {
      window.alert("Unable to open mail client. Please copy and send your feedback manually.");
      fbSend.disabled = false;
      fbSend.textContent = originalText;
    }
  }

  fbForm?.addEventListener("submit", sendFeedback);
});
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo/page-meta";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const hi = locale === "hi";
  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: hi
      ? `गोपनीयता नीति | ${siteConfig.brandName}`
      : `Privacy Policy | ${siteConfig.brandName}`,
    description: hi
      ? `${siteConfig.brandName} आपकी व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और सुरक्षित रखता है — गोपनीयता नीति।`
      : `How ${siteConfig.brandName} collects, uses and protects your personal information — privacy policy.`,
  });
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const brand = siteConfig.brandName;
  const site = siteConfig.siteUrl;
  const email = siteConfig.email;

  const toc = hi
    ? [
        { id: "overview", label: "अवलोकन" },
        { id: "collect", label: "हम क्या एकत्र करते हैं" },
        { id: "use", label: "जानकारी का उपयोग" },
        { id: "share", label: "साझाकरण व प्रकटीकरण" },
        { id: "cookies", label: "कुकीज़ व स्टोरेज" },
        { id: "security", label: "सुरक्षा" },
        { id: "rights", label: "आपके अधिकार" },
        { id: "comms", label: "संचार व WhatsApp" },
        { id: "children", label: "नाबालिग" },
        { id: "changes", label: "नीति में बदलाव" },
        { id: "contact", label: "संपर्क" },
      ]
    : [
        { id: "overview", label: "Overview" },
        { id: "collect", label: "Information we collect" },
        { id: "use", label: "How we use information" },
        { id: "share", label: "Sharing & disclosure" },
        { id: "cookies", label: "Cookies & storage" },
        { id: "security", label: "Security" },
        { id: "rights", label: "Your rights" },
        { id: "comms", label: "Communications & WhatsApp" },
        { id: "children", label: "Children" },
        { id: "changes", label: "Policy changes" },
        { id: "contact", label: "Contact" },
      ];

  return (
    <LegalPageShell
      locale={locale}
      path="/privacy"
      eyebrow={brand}
      title={hi ? "गोपनीयता नीति" : "Privacy Policy"}
      description={
        hi
          ? `${brand} पर आपकी गोपनीयता हमारे लिए महत्वपूर्ण है। यह नीति बताती है कि हम डेटा कैसे संभालते हैं।`
          : `Your privacy matters at ${brand}. This policy explains how we handle your data.`
      }
      updatedLabel={
        hi ? "अंतिम अपडेट: अगस्त 2026" : "Last updated: August 2026"
      }
      toc={toc}
    >
      <section id="overview">
        <h2>{hi ? "1. अवलोकन" : "1. Overview"}</h2>
        <p>
          {hi
            ? `यह गोपनीयता नीति ${site} और संबंधित ${brand} अनुभवों (“प्लेटफ़ॉर्म”) के आगंतुकों, सदस्यों और उपयोगकर्ताओं (“आप”) पर लागू होती है — चाहे आप कंप्यूटर, मोबाइल या अन्य डिवाइस से पहुँचें।`
            : `This Privacy Policy applies to visitors, members and users (“you”) of ${site} and related ${brand} experiences (the “Platform”), whether accessed via computer, mobile or another device.`}
        </p>
        <p>
          {hi
            ? `“व्यक्तिगत जानकारी” में वह डेटा शामिल है जिससे आपको आसानी से पहचाना या संपर्क किया जा सके — जैसे नाम, ईमेल, फ़ोन नंबर, जन्म विवरण या स्थान। अनामीकृत/एकत्रित डेटा व्यक्तिगत जानकारी नहीं माना जाता।`
            : `“Personal Information” means information that alone or combined can readily identify or contact you — such as name, email, phone number, birth details or location. Anonymised or aggregated data is not treated as Personal Information.`}
        </p>
        <p>
          {hi
            ? `प्लेटफ़ॉर्म का उपयोग करके आप इस नीति से सहमत होते हैं। यदि सहमत नहीं हैं, तो उपयोग न करें। संबंधित नियम: `
            : `By using the Platform you agree to this Privacy Policy. If you do not accept it, do not use the Platform. See also our `}
          <Link href="/terms">
            {hi ? "नियम व शर्तें" : "Terms & Conditions"}
          </Link>
          .
        </p>
      </section>

      <section id="collect">
        <h2>
          {hi
            ? "2. हम क्या जानकारी एकत्र करते हैं"
            : "2. Information we collect"}
        </h2>
        <h3>{hi ? "आपके द्वारा प्रदान की गई जानकारी" : "Information you provide"}</h3>
        <p>
          {hi
            ? "अकाउंट, OTP लॉगिन, कुंडली फ़ॉर्म, चैट, नोट्स या संपर्क फ़ॉर्म के दौरान आप निम्नलिखित दे सकते हैं:"
            : "When you create an account, verify OTP, submit kundli forms, chat, save notes or contact us, you may provide:"}
        </p>
        <ul>
          <li>
            {hi
              ? "संपर्क विवरण: मोबाइल नंबर, ईमेल, नाम"
              : "Contact details: mobile number, email, name"}
          </li>
          <li>
            {hi
              ? "जन्म विवरण: तिथि, समय, स्थान (चार्ट/ज्योतिष गणना हेतु)"
              : "Birth details: date, time, place (for charts and astrology calculations)"}
          </li>
          <li>
            {hi
              ? "प्राथमिकताएँ: भाषा, रुचियाँ, WhatsApp अपडेट ऑप्ट-इन"
              : "Preferences: language, topics of interest, WhatsApp updates opt-in"}
          </li>
          <li>
            {hi
              ? "संदेश, नोट्स, फ़ीडबैक और सहायता अनुरोध"
              : "Messages, notes, feedback and support requests"}
          </li>
          <li>
            {hi
              ? "भुगतान विवरण (यदि सशुल्क सेवाएँ सक्रिय हों) — आमतौर पर भुगतान प्रोसेसर द्वारा संसाधित"
              : "Payment details (if paid services are enabled) — typically processed by a payment provider"}
          </li>
        </ul>
        <h3>{hi ? "स्वचालित रूप से एकत्र जानकारी" : "Information collected automatically"}</h3>
        <ul>
          <li>
            {hi
              ? "डिवाइस व ब्राउज़र जानकारी, IP पता, ऑपरेटिंग सिस्टम"
              : "Device and browser information, IP address, operating system"}
          </li>
          <li>
            {hi
              ? "उपयोग डेटा: पृष्ठ दृश्य, सत्र अवधि, सुविधा उपयोग"
              : "Usage data: page views, session duration, feature usage"}
          </li>
          <li>
            {hi
              ? "लगभग स्थान (IP या आपकी अनुमति से)"
              : "Approximate location (from IP or with your permission)"}
          </li>
          <li>
            {hi
              ? "कुकीज़, लोकल स्टोरेज और समान तकनीकें"
              : "Cookies, local storage and similar technologies"}
          </li>
        </ul>
        <h3>{hi ? "संचार रिकॉर्ड" : "Communications records"}</h3>
        <p>
          {hi
            ? `जब आप ${brand} या परामर्श चैनलों (चैट, ईमेल, WhatsApp आदि) से संवाद करते हैं, हम सेवा गुणवत्ता, सहायता और कानूनी अनुपालन हेतु प्रतिलिपियाँ रख सकते हैं।`
            : `When you communicate with ${brand} or consultation channels (chat, email, WhatsApp, etc.), we may retain transcripts or copies for service quality, support and legal compliance.`}
        </p>
      </section>

      <section id="use">
        <h2>
          {hi
            ? "3. हम जानकारी का उपयोग कैसे करते हैं"
            : "3. How we use the information we collect"}
        </h2>
        <p>
          {hi
            ? "हम एकत्र जानकारी का उपयोग इन उद्देश्यों के लिए करते हैं:"
            : "We use collected information to:"}
        </p>
        <ul>
          <li>
            {hi
              ? "अकाउंट बनाना/प्रमाणित करना और प्लेटफ़ॉर्म संचालित करना"
              : "Create and authenticate accounts and operate the Platform"}
          </li>
          <li>
            {hi
              ? "कुंडली, कैलकुलेटर, राशिफल और वैयक्तिकृत ज्योतिष सामग्री प्रदान करना"
              : "Provide kundli, calculators, horoscope and personalised astrology content"}
          </li>
          <li>
            {hi
              ? "एआई गुरु और सहायता अनुभव सुधारना"
              : "Power AI Guru and improve support experiences"}
          </li>
          <li>
            {hi
              ? "चार्ट, नोट्स और प्राथमिकताएँ सहेजना (आपके अनुरोध पर)"
              : "Save charts, notes and preferences (at your request)"}
          </li>
          <li>
            {hi
              ? "सेवा अपडेट, सुरक्षा अलर्ट और प्रशासनिक सूचनाएँ भेजना"
              : "Send service updates, security alerts and administrative notices"}
          </li>
          <li>
            {hi
              ? "आपकी सहमति से मार्केटिंग / WhatsApp अपडेट (आप ऑप्ट-आउट कर सकते हैं)"
              : "Send marketing or WhatsApp updates with your consent (you may opt out)"}
          </li>
          <li>
            {hi
              ? "रिसर्च, उत्पाद विश्लेषण, धोखाधड़ी रोकथाम और कानूनी अनुपालन"
              : "Research, product analysis, fraud prevention and legal compliance"}
          </li>
        </ul>
        <p>
          {hi
            ? "समय-समय पर हम नई उपयोग विधियाँ अपना सकते हैं; यदि पहले एकत्र डेटा के लिए प्रथाएँ बदलती हैं, तो हम कानून अनुसार सूचना/सहमति का उचित प्रयास करेंगे।"
            : "From time to time we may use information for new purposes; if practices change regarding previously collected data, we will make reasonable efforts to provide notice and obtain consent as required by law."}
        </p>
      </section>

      <section id="share">
        <h2>
          {hi
            ? "4. साझाकरण व प्रकटीकरण"
            : "4. Sharing & disclosure"}
        </h2>
        <p>
          {hi
            ? `हम आपकी व्यक्तिगत जानकारी को बेचते नहीं हैं। हम निम्नलिखित स्थितियों में साझा कर सकते हैं:`
            : `We do not sell your Personal Information. We may share information in these cases:`}
        </p>
        <ul>
          <li>
            {hi
              ? "सेवा प्रदाता: होस्टिंग, विश्लेषण, SMS/OTP, ईमेल, भुगतान, क्लाउड स्टोरेज — केवल आवश्यक सीमा तक"
              : "Service providers: hosting, analytics, SMS/OTP, email, payments, cloud storage — only as needed"}
          </li>
          <li>
            {hi
              ? "परामर्श: यदि आप मानव परामर्श चुनते हैं, प्रासंगिक नाम/जन्म/रुचि विवरण सलाहकार से साझा हो सकता है"
              : "Consultations: if you choose a human consultation, relevant name/birth/interest details may be shared with the advisor"}
          </li>
          <li>
            {hi
              ? "कानूनी आवश्यकता: न्यायालय आदेश, कानून प्रवर्तन, अधिकारों की सुरक्षा"
              : "Legal requirements: court orders, law enforcement, protecting rights or safety"}
          </li>
          <li>
            {hi
              ? "व्यवसाय हस्तांतरण: विलय, अधिग्रहण या परिसंपत्ति बिक्री की स्थिति में"
              : "Business transfers: merger, acquisition or sale of assets"}
          </li>
          <li>
            {hi
              ? "आपकी सहमति से अन्य साझाकरण"
              : "Other sharing with your consent"}
          </li>
        </ul>
        <p>
          {hi
            ? `यदि आप सार्वजनिक फ़ोरम या तीसरे पक्ष के लिंक का उपयोग करते हैं, तो वह जानकारी दूसरों द्वारा एकत्र की जा सकती है — ${brand} उनके व्यवहार के लिए उत्तरदायी नहीं है।`
            : `If you use public forums or follow third-party links, that information may be collected by others — ${brand} is not responsible for their practices.`}
        </p>
      </section>

      <section id="cookies">
        <h2>
          {hi
            ? "5. कुकीज़, लोकल स्टोरेज व विज्ञापन"
            : "5. Cookies, local storage & advertising"}
        </h2>
        <p>
          {hi
            ? "हम कुकीज़, पिक्सेल टैग और ब्राउज़र/ऐप लोकल स्टोरेज का उपयोग सत्र, प्राथमिकताएँ, विश्लेषण और (जहाँ लागू) मार्केटिंग के लिए कर सकते हैं। आप ब्राउज़र सेटिंग से कुकीज़ सीमित कर सकते हैं; कुछ सुविधाएँ प्रभावित हो सकती हैं।"
            : "We may use cookies, pixel tags and browser/app local storage for sessions, preferences, analytics and (where applicable) marketing. You can limit cookies in browser settings; some features may not work fully."}
        </p>
        <p>
          {hi
            ? "तीसरे पक्ष के विज्ञापन नेटवर्क, यदि उपयोग हों, अन्य साइटों पर आपकी विज़िट संबंधी जानकारी का उपयोग विज्ञापन दिखाने के लिए कर सकते हैं।"
            : "Third-party advertising companies, if used, may use information about your visits to this and other sites to show relevant ads."}
        </p>
      </section>

      <section id="security">
        <h2>{hi ? "6. सुरक्षा" : "6. How we protect your information"}</h2>
        <p>
          {hi
            ? "इंटरनेट पर कोई भी ट्रांसमिशन पूर्णतः सुरक्षित होने की गारंटी नहीं दी जा सकती। हम नुकसान, दुरुपयोग और अनधिकृत पहुँच से बचाने के लिए उचित प्रशासनिक, तकनीकी और संगठनात्मक उपाय अपनाते हैं — जैसे एन्क्रिप्टेड ट्रांसमिशन (जहाँ उपलब्ध), पहुँच नियंत्रण और सुरक्षित सर्वर प्रथाएँ।"
            : "No data transmission over the internet can be guaranteed fully secure. We use reasonable administrative, technical and organisational measures designed to protect against loss, misuse and unauthorised access — including encrypted transmission where available, access controls and secure server practices."}
        </p>
        <p>
          {hi
            ? "आप अपने डिवाइस, OTP और अकाउंट पहुँच की सुरक्षा बनाए रखने के लिए भी जिम्मेदार हैं।"
            : "You are also responsible for keeping your device, OTP and account access secure."}
        </p>
      </section>

      <section id="rights">
        <h2>
          {hi
            ? "7. आपकी पसंद व अधिकार"
            : "7. Your choices & rights"}
        </h2>
        <p>
          {hi
            ? "लागू कानून के अधीन, आप निम्न का अनुरोध कर सकते हैं:"
            : "Subject to applicable law, you may request to:"}
        </p>
        <ul>
          <li>
            {hi
              ? "अपनी व्यक्तिगत जानकारी देखना या अपडेट करना"
              : "Access or update your Personal Information"}
          </li>
          <li>
            {hi
              ? "अकाउंट निष्क्रिय/हटाना (कुछ कानूनी रिकॉर्ड बनाए रखे जा सकते हैं)"
              : "Deactivate or delete your account (some records may be retained as required by law)"}
          </li>
          <li>
            {hi
              ? "मार्केटिंग या WhatsApp अपडेट से ऑप्ट-आउट"
              : "Opt out of marketing or WhatsApp update messages"}
          </li>
        </ul>
        <p>
          {hi ? (
            <>
              अनुरोध भेजें: <a href={`mailto:${email}`}>{email}</a>. हम पहचान
              सत्यापन के बाद उचित समय में जवाब देंगे।
            </>
          ) : (
            <>
              Send requests to <a href={`mailto:${email}`}>{email}</a>. We will
              respond within a reasonable time after verifying your identity.
            </>
          )}
        </p>
      </section>

      <section id="comms">
        <h2>
          {hi
            ? "8. संचार, SMS व WhatsApp"
            : "8. Communications, SMS & WhatsApp"}
        </h2>
        <p>
          {hi
            ? `अकाउंट सुविधाओं के लिए हम OTP और सेवा संदेश SMS या अन्य चैनलों से भेज सकते हैं। लॉगिन पर “WhatsApp पर अपडेट” चुनने पर आप ${brand} से अपडेट, ऑफ़र या सेवा संदेश WhatsApp/SMS/कॉल/ईमेल पर प्राप्त करने की सहमति दे सकते हैं।`
            : `We may send OTP and service messages by SMS or other channels for account features. If you opt in to “Get updates on WhatsApp” at login, you consent to receive updates, offers or service messages from ${brand} via WhatsApp, SMS, call or email.`}
        </p>
        <p>
          {hi
            ? "आप किसी भी समय ऑप्ट-आउट निर्देशों का पालन कर या हमें ईमेल कर सहमति वापस ले सकते हैं। लेन-देन/सुरक्षा संदेश आवश्यक होने पर जारी रह सकते हैं।"
            : "You may withdraw consent at any time via opt-out instructions or by emailing us. Transactional or security messages may continue where necessary."}
        </p>
      </section>

      <section id="children">
        <h2>{hi ? "9. नाबालिग" : "9. Children"}</h2>
        <p>
          {hi
            ? `प्लेटफ़ॉर्म 18 वर्ष से कम आयु के व्यक्तियों के लिए अभिप्रेत नहीं है। हम जानबूझकर नाबालिगों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि किसी नाबालिग ने जानकारी दी है, तो ${email} पर संपर्क करें।`
            : `The Platform is not intended for persons under 18. We do not knowingly collect Personal Information from minors. If you believe a minor has provided information, contact ${email}.`}
        </p>
      </section>

      <section id="changes">
        <h2>
          {hi ? "10. इस नीति में बदलाव" : "10. Changes to this Privacy Policy"}
        </h2>
        <p>
          {hi
            ? "हम समय-समय पर इस नीति को अपडेट कर सकते हैं। अद्यतन तिथि पृष्ठ पर दिखेगी। परिवर्तनों के बाद प्लेटफ़ॉर्म का उपयोग, कानून द्वारा अनुमत सीमा तक, अद्यतन नीति की स्वीकृति माना जाएगा। कृपया नीति को समय-समय पर देखें।"
            : "We may update this policy from time to time. The “Last updated” date will change on this page. Your use of the Platform after changes constitutes acceptance of the updated policy to the fullest extent permitted by law. Please review this page periodically."}
        </p>
      </section>

      <section id="contact">
        <h2>{hi ? "11. संपर्क करें" : "11. Contact us"}</h2>
        <p>
          {hi
            ? `गोपनीयता संबंधी प्रश्नों के लिए ${brand} से संपर्क करें:`
            : `For privacy questions or feedback, contact ${brand}:`}
        </p>
        <ul>
          <li>
            {hi ? "ईमेल: " : "Email: "}
            <a href={`mailto:${email}`}>{email}</a>
          </li>
          <li>
            {hi ? "वेबसाइट: " : "Website: "}
            <a href={site} target="_blank" rel="noopener noreferrer">
              {site}
            </a>
          </li>
          <li>
            {hi ? "ब्रांड: " : "Brand: "}
            {brand}
          </li>
        </ul>
        <p>
          {hi
            ? "हम पूर्ण गोपनीयता की गारंटी नहीं दे सकते कि सभी निजी संचार कभी भी अनपेक्षित रूप से प्रकट नहीं होंगे; फिर भी हम आपकी जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। प्लेटफ़ॉर्म का उपयोग आपके अपने जोखिम पर है।"
            : "While we are committed to protecting your privacy, we cannot ensure that all private communications will never be disclosed in ways not described here. You assume responsibility for your use of the Platform and the internet generally."}
        </p>
      </section>
    </LegalPageShell>
  );
}

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
    path: "/terms",
    title: hi
      ? `नियम व शर्तें | ${siteConfig.brandName}`
      : `Terms & Conditions | ${siteConfig.brandName}`,
    description: hi
      ? `${siteConfig.brandName} वेबसाइट, अकाउंट, कुंडली उपकरण, परामर्श और डिजिटल सेवाओं के उपयोग की नियम व शर्तें।`
      : `Terms and conditions for using ${siteConfig.brandName} websites, accounts, kundli tools, consultations and digital services.`,
  });
}

export default async function TermsPage() {
  const locale = await getLocale();
  const hi = locale === "hi";
  const brand = siteConfig.brandName;
  const site = siteConfig.siteUrl;
  const email = siteConfig.email;

  const toc = hi
    ? [
        { id: "introduction", label: "परिचय" },
        { id: "services", label: "सेवाओं की परिभाषा" },
        { id: "astrology-disclaimer", label: "ज्योतिष अस्वीकरण" },
        { id: "accounts", label: "अकाउंट व सुरक्षा" },
        { id: "conduct", label: "सदस्य आचरण" },
        { id: "fees", label: "शुल्क व भुगतान" },
        { id: "ip", label: "बौद्धिक संपदा" },
        { id: "privacy", label: "गोपनीयता" },
        { id: "liability", label: "दायित्व सीमा" },
        { id: "indemnity", label: "क्षतिपूर्ति" },
        { id: "changes", label: "परिवर्तन व समाप्ति" },
        { id: "law", label: "कानून व संपर्क" },
      ]
    : [
        { id: "introduction", label: "Introduction" },
        { id: "services", label: "Definition of services" },
        { id: "astrology-disclaimer", label: "Astrology disclaimer" },
        { id: "accounts", label: "Accounts & security" },
        { id: "conduct", label: "Member conduct" },
        { id: "fees", label: "Fees & payment" },
        { id: "ip", label: "Intellectual property" },
        { id: "privacy", label: "Privacy" },
        { id: "liability", label: "Limitation of liability" },
        { id: "indemnity", label: "Indemnification" },
        { id: "changes", label: "Changes & termination" },
        { id: "law", label: "Governing law & contact" },
      ];

  return (
    <LegalPageShell
      locale={locale}
      path="/terms"
      eyebrow={brand}
      title={hi ? "नियम व शर्तें" : "Terms & Conditions"}
      description={
        hi
          ? `${brand} प्लेटफ़ॉर्म का उपयोग करने से पहले कृपया इन नियमों को ध्यान से पढ़ें।`
          : `Please read these terms carefully before using the ${brand} platform.`
      }
      updatedLabel={
        hi ? "अंतिम अपडेट: अगस्त 2026" : "Last updated: August 2026"
      }
      toc={toc}
    >
      <section id="introduction">
        <h2>{hi ? "1. परिचय" : "1. Introduction"}</h2>
        <p>
          {hi
            ? `ये नियम व शर्तें (“अनुबंध”) उन सभी उपयोगकर्ताओं (“आप”, “सदस्य”) पर लागू होती हैं जो ${site} पर उपलब्ध ${brand} वेबसाइट, मोबाइल अनुभव, अकाउंट, मुफ़्त ज्योतिष उपकरण, एआई मार्गदर्शन और संबंधित परामर्श सेवाओं (“प्लेटफ़ॉर्म” / “साइट्स”) का उपयोग करते हैं।`
            : `These Terms and Conditions (this “Agreement”) apply to all users (“you”, “Member”) who access or use the ${brand} website, mobile experience, accounts, free astrology tools, AI guidance and related consultation services (the “Platform” / “Sites”) available at ${site}.`}
        </p>
        <p>
          {hi
            ? `साइट्स का संचालन ${brand} द्वारा किया जाता है। प्लेटफ़ॉर्म का कोई भी भाग उपयोग करके आप इस अनुबंध से बाध्य होने के लिए सहमत होते हैं। यदि आप किसी खंड से सहमत नहीं हैं, तो तुरंत उपयोग बंद करें।`
            : `The Sites are operated by ${brand}. By using any part of the Platform you agree to be bound by this Agreement. If you do not agree to any clause, you must stop using the Sites immediately.`}
        </p>
        <p>
          <strong>
            {hi
              ? "आप पुष्टि करते हैं कि आप कम से कम 18 वर्ष के हैं और कानून के अंतर्गत बाध्यकारी अनुबंध करने के लिए सक्षम हैं।"
              : "YOU AFFIRM THAT YOU ARE AT LEAST 18 YEARS OF AGE AND COMPETENT UNDER LAW TO ENTER INTO A BINDING CONTRACT."}
          </strong>
        </p>
        <p>
          {hi
            ? `${brand} कानूनी अनुपालन या वैध व्यावसायिक कारणों से इन नियमों को कभी भी संशोधित कर सकता है। महत्वपूर्ण परिवर्तनों की सूचना देने का उचित प्रयास किया जाएगा। संशोधन के बाद प्लेटफ़ॉर्म का निरंतर उपयोग अद्यतन नियमों की स्वीकृति माना जाएगा।`
            : `${brand} may modify this Agreement at any time for legal compliance or legitimate business reasons. We will make reasonable efforts to notify you of material changes. Continued use of the Platform after changes means you accept the updated Agreement.`}
        </p>
      </section>

      <section id="services">
        <h2>{hi ? "2. सेवाओं की परिभाषा" : "2. Definition of services"}</h2>
        <p>
          {hi
            ? `${brand} एक डिजिटल ज्योतिष प्लेटफ़ॉर्म प्रदान करता है जिसमें जन्म कुंडली / चार्ट उपकरण, गुण मिलान, राशिफल, पंचांग व मुहूर्त जानकारी, कैलकुलेटर, शिक्षण सामग्री, एआई गुरु चैट, अकाउंट सुविधाएँ (चार्ट सेव, नोट्स), और WhatsApp / कॉल / ईमेल के माध्यम से वैकल्पिक मानव परामर्श शामिल हो सकते हैं।`
            : `${brand} provides a digital astrology platform that may include birth chart / kundli tools, gun milan, horoscope, panchang and muhurat information, calculators, learning content, AI Guru chat, account features (saved charts, notes), and optional human consultations via WhatsApp, call or email.`}
        </p>
        <h3>
          {hi
            ? "प्लेटफ़ॉर्म पर उपलब्ध सामग्री"
            : "Content made available via the Platform"}
        </h3>
        <p>
          {hi
            ? `आप अपने अकाउंट के अंतर्गत होने वाले प्रत्येक लेन-देन और अनुरोध के लिए स्वयं जिम्मेदार हैं। परामर्शदाता या विशेषज्ञ (यदि उपलब्ध हों) ${brand} के कर्मचारी, एजेंट या प्रतिनिधि नहीं हो सकते; ${brand} उनके किसी कथन, चूक या सलाह के लिए जिम्मेदार नहीं है जब तक कि लिखित रूप में स्पष्ट रूप से कहा न गया हो।`
            : `You are solely responsible for every transaction and request under your account. Consultants or experts (where available) are not employees, agents or representatives of ${brand} unless expressly stated in writing, and ${brand} assumes no responsibility for their acts, omissions or advice.`}
        </p>
        <p>
          {hi
            ? `${brand} यह गारंटी नहीं देता कि प्लेटफ़ॉर्म हमेशा उपलब्ध, त्रुटि-मुक्त या आपकी अपेक्षाओं के अनुरूप होगा; या कि कोई भी गणना, व्याख्या या सलाह सटीक, पूर्ण या आपके लिए उपयुक्त होगी।`
            : `${brand} makes no guarantee that the Platform will always be available, error-free or fit for your expectations; or that any calculation, interpretation or advice will be accurate, complete or suitable for your needs.`}
        </p>
      </section>

      <section id="astrology-disclaimer">
        <h2>
          {hi
            ? "3. ज्योतिष, एआई व मार्गदर्शन अस्वीकरण"
            : "3. Astrology, AI & guidance disclaimer"}
        </h2>
        <p>
          {hi
            ? "ज्योतिष, कुंडली, राशिफल, रेमेडी सुझाव, एआई आउटपुट और संबंधित सामग्री सामान्य जानकारी, सांस्कृतिक रुचि या मनोरंजन उद्देश्यों के लिए हैं। वे चिकित्सा, मानसिक स्वास्थ्य, कानूनी, वित्तीय या पेशेवर सलाह का विकल्प नहीं हैं।"
            : "Astrology, kundli, horoscope, remedy suggestions, AI outputs and related content are provided for general information, cultural interest or entertainment purposes. They are not a substitute for medical, mental-health, legal, financial or other professional advice."}
        </p>
        <p>
          {hi
            ? "महत्वपूर्ण जीवन निर्णय (स्वास्थ्य, विवाह, करियर, निवेश आदि) लेने से पहले योग्य पेशेवरों से परामर्श करें। प्लेटफ़ॉर्म सामग्री पर किसी भी निर्भरता का जोखिम पूरी तरह आपका है।"
            : "Before taking important life decisions (health, marriage, career, investments, etc.), consult qualified professionals. Any reliance on Platform content is at your sole risk."}
        </p>
        <p>
          {hi
            ? `${brand} किसी विशेषज्ञ की योग्यता, प्रमाणपत्र या पृष्ठभूमि को सत्यापित करने की गारंटी नहीं देता। सदस्यों को सलाह दी जाती है कि वे स्वतंत्र रूप से सत्यापन करें।`
            : `${brand} does not warrant verification of any expert’s skills, credentials or background. Members are strongly encouraged to verify independently.`}
        </p>
        <p>
          {hi
            ? `आप ${brand} और उससे जुड़े पक्षों को ज्योतिष/एआई/परामर्श सामग्री से उत्पन्न किसी भी दावे से मुक्त रखने के लिए सहमत होते हैं।`
            : `You release and hold harmless ${brand} and its affiliates, officers, employees and agents from claims arising from astrology, AI or consultation content accessed through the Platform.`}
        </p>
      </section>

      <section id="accounts">
        <h2>
          {hi ? "4. अकाउंट, OTP व सुरक्षा" : "4. Accounts, OTP & security"}
        </h2>
        <p>
          {hi
            ? "कुछ सुविधाओं के लिए आपको मोबाइल OTP या अन्य साधनों से अकाउंट बनाना पड़ सकता है। पंजीकरण में दी गई जानकारी सही, पूर्ण और अद्यतन रखें।"
            : "Some features require creating an account via mobile OTP or other means. Information you provide at registration must be accurate, complete and kept up to date."}
        </p>
        <ul>
          <li>
            {hi
              ? "आप अपने अकाउंट, OTP, डिवाइस और सत्र की गोपनीयता के लिए जिम्मेदार हैं।"
              : "You are responsible for maintaining the confidentiality of your account, OTP, device and sessions."}
          </li>
          <li>
            {hi
              ? "आपके अकाउंट के अंतर्गत होने वाली सभी गतिविधियाँ आपकी जिम्मेदारी हैं।"
              : "You are fully responsible for all activity that occurs under your account."}
          </li>
          <li>
            {hi
              ? "अनधिकृत उपयोग की सूचना तुरंत हमें दें।"
              : "Notify us immediately of any unauthorised use or security breach."}
          </li>
          <li>
            {hi
              ? "दूसरे व्यक्ति के अकाउंट का उपयोग न करें।"
              : "Do not use another person’s account without permission."}
          </li>
        </ul>
        <p>
          {hi
            ? `${brand} आपके पासवर्ड/OTP के दुरुपयोग से होने वाली हानि के लिए उत्तरदायी नहीं होगा, चाहे वह आपकी जानकारी में हुआ हो या नहीं।`
            : `${brand} will not be liable for losses arising from someone else using your account or OTP, with or without your knowledge.`}
        </p>
      </section>

      <section id="conduct">
        <h2>{hi ? "5. सदस्य आचरण व उपयोग" : "5. Member conduct & use"}</h2>
        <p>
          {hi
            ? "पंजीकरण या उपयोग करके आप प्रतिनिधित्व करते हैं और सहमत होते हैं कि:"
            : "By registering or using the Platform you represent and agree that:"}
        </p>
        <ul>
          <li>
            {hi
              ? "आप कम से कम 18 वर्ष के हैं (या कानून द्वारा मान्यता प्राप्त इकाई हैं)।"
              : "You are at least 18 years of age (or a legally recognised entity)."}
          </li>
          <li>
            {hi
              ? "आप सर्वर, नेटवर्क या सुरक्षा में बाधा नहीं डालेंगे और अनधिकृत पहुँच का प्रयास नहीं करेंगे।"
              : "You will not disrupt servers, networks or security, or attempt unauthorised access."}
          </li>
          <li>
            {hi
              ? "आप अवैध, अपमानजनक, उत्पीड़क, अश्लील, भेदभावपूर्ण या हानिकारक सामग्री पोस्ट/प्रसारित नहीं करेंगे।"
              : "You will not post or transmit unlawful, harassing, defamatory, obscene, racist, harmful or otherwise objectionable material."}
          </li>
          <li>
            {hi
              ? "आप स्पैम, मैलवेयर, तीसरे पक्ष के विज्ञापन या बौद्धिक संपदा का उल्लंघन करने वाली सामग्री नहीं भेजेंगे।"
              : "You will not send spam, malware, third-party ads, or content that infringes intellectual property."}
          </li>
          <li>
            {hi
              ? "आप लागू स्थानीय, राष्ट्रीय या अंतर्राष्ट्रीय कानून का उल्लंघन नहीं करेंगे।"
              : "You will not violate applicable local, national or international law."}
          </li>
          <li>
            {hi
              ? "आप किसी अन्य व्यक्ति का प्रतिरूपण नहीं करेंगे।"
              : "You will not impersonate any person or entity."}
          </li>
        </ul>
        <p>
          {hi
            ? `${brand} अपने विवेक से उल्लंघनकारी सामग्री हटाने या अकाउंट निलंबित/समाप्त करने का अधिकार रखता है।`
            : `${brand} may, in its absolute discretion, remove violating content and suspend or terminate accounts.`}
        </p>
        <p>
          {hi
            ? `आप प्लेटफ़ॉर्म पर पोस्ट/प्रेषित सामग्री के लिए ${brand} को विश्वव्यापी, रॉयल्टी-मुक्त लाइसेंस देते हैं ताकि सेवाएँ संचालित, सुधार और प्रदर्शित की जा सकें।`
            : `You grant ${brand} a worldwide, royalty-free licence to use, reproduce, edit, transmit, display and create derivative works from content you submit, as needed to operate and improve the Platform.`}
        </p>
      </section>

      <section id="fees">
        <h2>{hi ? "6. शुल्क व भुगतान" : "6. Fees & payment"}</h2>
        <p>
          {hi
            ? "कई उपकरण निःशुल्क हो सकते हैं। सशुल्क परामर्श, प्रीमियम सुविधाएँ या अन्य उत्पाद अलग से बताए गए मूल्य पर उपलब्ध हो सकते हैं। भुगतान जानकारी सटीक रखें और भुगतान करने के लिए अधिकृत हों।"
            : "Many tools may be free. Paid consultations, premium features or other products may be offered at prices shown at checkout. Keep payment details accurate and ensure you are authorised to pay."}
        </p>
        <ul>
          <li>
            {hi
              ? "आप अपने अकाउंट के अंतर्गत हुए सभी शुल्कों के लिए उत्तरदायी हैं।"
              : "You are solely responsible for all fees incurred under your account."}
          </li>
          <li>
            {hi
              ? "भुगतान गेटवे त्रुटियों की रिपोर्ट हमें तुरंत करें; हम उचित जाँच के बाद सुधार करेंगे।"
              : "Report payment gateway errors promptly; we will investigate and correct genuine mistakes where appropriate."}
          </li>
          <li>
            {hi
              ? `रिफ़ंड, यदि लागू हों, ${brand} की तत्कालीन रिफ़ंड नीति और लागू कानून के अनुसार होंगे।`
              : `Refunds, if any, are governed by ${brand}’s then-current refund practices and applicable law.`}
          </li>
        </ul>
      </section>

      <section id="ip">
        <h2>{hi ? "7. बौद्धिक संपदा" : "7. Intellectual property"}</h2>
        <p>
          {hi
            ? `साइट्स, सॉफ़्टवेयर, डिज़ाइन, लोगो, टेक्स्ट, ग्राफ़िक्स, डेटाबेस और संगठन ${brand} या उसके लाइसेंसधारकों की संपत्ति हैं। यह अनुबंध आपको पेटेंट, कॉपीराइट, ट्रेडमार्क या अन्य IP अधिकार नहीं देता।`
            : `The Sites, software, design, logos, text, graphics, databases and organisation are owned by ${brand} or its licensors. This Agreement does not grant you patents, copyrights, trademarks or other IP rights.`}
        </p>
        <p>
          {hi
            ? "आप स्रोत कोड को reverse engineer, कॉपी, संशोधित या व्यावसायिक रूप से पुनर्वितरित नहीं करेंगे, न ही भ्रमित करने वाले समान चिह्न/डोमेन का उपयोग करेंगे।"
            : "You may not reverse engineer, copy, modify or commercially redistribute source code, nor use confusingly similar marks or domain names."}
        </p>
        <p>
          {hi
            ? `${brand} सदस्यों को प्लेटफ़ॉर्म का सीमित, गैर-विशिष्ट, रद्द करने योग्य लाइसेंस देता है — बशर्ते आप इन नियमों का पालन करें।`
            : `${brand} grants Members a limited, non-exclusive, revocable licence to use the Sites while fully compliant with this Agreement.`}
        </p>
      </section>

      <section id="privacy">
        <h2>{hi ? "8. गोपनीयता" : "8. Privacy"}</h2>
        <p>
          {hi ? (
            <>
              अकाउंट बनाकर या प्लेटफ़ॉर्म उपयोग करके आप हमारी{" "}
              <Link href="/privacy">गोपनीयता नीति</Link> से भी सहमत होते हैं,
              जो बताती है कि हम व्यक्तिगत जानकारी कैसे एकत्र, उपयोग और साझा करते
              हैं।
            </>
          ) : (
            <>
              By registering or using the Platform you also agree to our{" "}
              <Link href="/privacy">Privacy Policy</Link>, which explains how
              we collect, use and share personal information.
            </>
          )}
        </p>
        <p>
          {hi
            ? `${brand} कानूनी प्रक्रिया, अधिकारों की सुरक्षा, धोखाधड़ी रोकथाम या लागू कानून के अनुपालन के लिए सदस्य जानकारी प्रकट कर सकता है।`
            : `${brand} may disclose Member information when reasonably necessary to comply with law, protect rights or property, investigate fraud, or enforce this Agreement.`}
        </p>
      </section>

      <section id="liability">
        <h2>
          {hi
            ? "9. वारंटी अस्वीकरण व दायित्व सीमा"
            : "9. Disclaimer of warranty & limitation of liability"}
        </h2>
        <p>
          {hi
            ? `प्लेटफ़ॉर्म “जैसा है” और “जैसा उपलब्ध है” आधार पर प्रदान किया जाता है। कानून द्वारा अनुमत अधिकतम सीमा तक, ${brand} व्यापारिकता, किसी विशेष उद्देश्य के लिए उपयुक्तता, गैर-उल्लंघन, सुरक्षा या सटीकता की सभी व्यक्त या निहित वारंटियाँ अस्वीकार करता है।`
            : `THE PLATFORM IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, ${brand} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, SECURITY AND ACCURACY.`}
        </p>
        <p>
          {hi
            ? `${brand}, उसके सहयोगी या अधिकारी किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, परिणामी, विशेष या दंडात्मक क्षति (लाभ, डेटा या व्यवसाय की हानि सहित) के लिए उत्तरदायी नहीं होंगे।`
            : `${brand}, its affiliates and their officers, directors, employees and agents shall not be liable for any direct, indirect, incidental, consequential, special, punitive or exemplary damages (including loss of business, revenue, profits, data or other economic advantage).`}
        </p>
        <p>
          {hi
            ? `यदि लागू कानून उपरोक्त सीमा की अनुमति नहीं देता, तो दायित्व केवल कानून द्वारा आवश्यक सीमा तक संशोधित माना जाएगा, और ${brand} का अधिकतम कुल दायित्व ₹500 या USD $10 (जो अधिक हो) तक सीमित होगा।`
            : `If applicable law does not allow the limitation above, liability will be deemed modified only as required by law, and ${brand}’s maximum aggregate liability will be capped at ₹500 or USD $10, whichever is higher.`}
        </p>
      </section>

      <section id="indemnity">
        <h2>{hi ? "10. क्षतिपूर्ति" : "10. Indemnification"}</h2>
        <p>
          {hi
            ? `आप ${brand} और क्षतिपूर्ति पक्षों को उन दावों, हानियों, लागतों और वकील शुल्क से बचाएँगे और क्षतिपूर्ति देंगे जो (a) आपके द्वारा इस अनुबंध के उल्लंघन, (b) आपके द्वारा पोस्ट/प्रेषित सामग्री, या (c) प्लेटफ़ॉर्म के आपके उपयोग से उत्पन्न हों।`
            : `You shall defend, indemnify and hold harmless ${brand} and its officers, directors, employees and agents from losses, damages, costs and reasonable attorneys’ fees arising from: (a) your breach of this Agreement; (b) content you submit or transmit; or (c) your use of the Platform.`}
        </p>
      </section>

      <section id="changes">
        <h2>
          {hi
            ? "11. सेवाओं में परिवर्तन व समाप्ति"
            : "11. Modifications & termination of services"}
        </h2>
        <p>
          {hi
            ? `${brand} किसी भी सेवा को अस्थायी या स्थायी रूप से संशोधित या बंद कर सकता है, सूचना के साथ या बिना। हम निरंतरता, समयबद्धता या त्रुटि-मुक्त संचालन की गारंटी नहीं देते।`
            : `${brand} may modify or discontinue any service temporarily or permanently, with or without notice. We do not guarantee uninterrupted, timely, secure or error-free operation.`}
        </p>
        <p>
          {hi
            ? `${brand} किसी भी कारण से सदस्य की भागीदारी समाप्त कर सकता है और वर्तमान/भविष्य के उपयोग से इनकार कर सकता है।`
            : `${brand} may, in its sole discretion, terminate a Member’s participation and refuse current or future use of the Sites.`}
        </p>
        <h3>{hi ? "लिंक व विज्ञापन" : "Links & advertisements"}</h3>
        <p>
          {hi
            ? `साइट्स में तीसरे पक्ष के लिंक या विज्ञापन हो सकते हैं। ${brand} उनकी सामग्री, उत्पादों, गोपनीयता प्रथाओं या लेन-देन के लिए उत्तरदायी नहीं है।`
            : `The Sites may contain third-party links or advertisements. ${brand} is not responsible for their content, products, privacy practices or any resulting transactions.`}
        </p>
      </section>

      <section id="law">
        <h2>
          {hi
            ? "12. विविध, कानून व संपर्क"
            : "12. Miscellaneous, governing law & contact"}
        </h2>
        <p>
          {hi
            ? "यह अनुबंध भारत के कानूनों के अनुसार व्याख्यायित होगा। इससे उत्पन्न विवादों का विशेष क्षेत्राधिकार भारत के सक्षम न्यायालयों में होगा।"
            : "This Agreement shall be interpreted in accordance with the laws of India (excluding conflict-of-law rules). Legal proceedings arising out of this Agreement shall occur exclusively in the competent courts in India."}
        </p>
        <p>
          {hi
            ? `आप ${brand} की लिखित सहमति के बिना इस अनुबंध के अधिकार/दायित्व असाइन नहीं कर सकते। यदि कोई प्रावधान अवैध पाया जाए, शेष प्रावधान प्रभावी रहेंगे। यह अनुबंध (और संदर्भित नीतियाँ) विषयवस्तु पर संपूर्ण समझौता है।`
            : `You may not assign rights or obligations under this Agreement without ${brand}’s prior written consent. If any provision is held invalid, the remaining provisions remain in effect. This Agreement (and policies referenced herein) constitutes the entire agreement on the subject matter.`}
        </p>
        <p>
          {hi ? (
            <>
              कॉपीराइट या नीति संबंधी पूछताछ:{" "}
              <a href={`mailto:${email}`}>{email}</a> · वेबसाइट:{" "}
              <a href={site} target="_blank" rel="noopener noreferrer">
                {site}
              </a>
            </>
          ) : (
            <>
              For copyright notices or policy questions, contact{" "}
              <a href={`mailto:${email}`}>{email}</a> · Website:{" "}
              <a href={site} target="_blank" rel="noopener noreferrer">
                {site}
              </a>
            </>
          )}
        </p>
        <p>
          {hi
            ? "यदि आपको लगता है कि आपकी कृति का उल्लंघन हुआ है, तो हस्ताक्षर, कार्य का विवरण, उल्लंघनकारी सामग्री का स्थान, संपर्क विवरण और सद्भावना कथन के साथ ईमेल करें।"
            : "If you believe your work has been copied in a way that constitutes copyright infringement, email us with your signature, a description of the work, the location of the allegedly infringing material on the Site, your contact details, and a good-faith statement that use is unauthorised."}
        </p>
      </section>
    </LegalPageShell>
  );
}

'use client'

import Image from "next/image";
import { useState } from "react";

const LanguageMegaMenu = ({ textClass }) => {
  const [click, setClick] = useState(false);
  const [activeTab, setActiveTab] = useState('languages');
  const handleCurrency = () => setClick((prevState) => !prevState);

  // الحصول على رابط علم الدولة من Flaticon
  const getFlagUrl = (code) => {
    const flagUrls = {
      SA: "https://cdn-icons-png.flaticon.com/128/12360/12360412.png", // السعودية
      US: "https://cdn-icons-png.flaticon.com/512/323/323310.png", // أمريكا
      FR: "https://cdn-icons-png.flaticon.com/512/323/323315.png", // فرنسا
      ES: "https://cdn-icons-png.flaticon.com/512/323/323365.png", // إسبانيا
      DE: "https://cdn-icons-png.flaticon.com/128/323/323332.png", // ألمانيا
      PT: "https://cdn-icons-png.flaticon.com/128/3909/3909361.png", // البرتغال
      TR: "https://cdn-icons-png.flaticon.com/128/3909/3909414.png", // تركيا
      RU: "https://cdn-icons-png.flaticon.com/128/4628/4628645.png", // روسيا
      AE: "https://cdn-icons-png.flaticon.com/128/323/323301.png", // الإمارات
      KW: "https://cdn-icons-png.flaticon.com/128/323/323313.png", // الكويت
      QA: "https://cdn-icons-png.flaticon.com/128/323/323297.png", // قطر
      BH: "https://cdn-icons-png.flaticon.com/128/11849/11849478.png", // البحرين
      OM: "https://cdn-icons-png.flaticon.com/128/11849/11849532.png", // عمان
      MA: "https://cdn-icons-png.flaticon.com/128/1705/1705008.png", // المغرب
      JO: "https://cdn-icons-png.flaticon.com/128/9993/9993683.png", // الأردن
      GB: "https://cdn-icons-png.flaticon.com/128/323/323329.png"  // بريطانيا
    };
    return flagUrls[code] || "https://cdn-icons-png.flaticon.com/512/323/323329.png"; // علم افتراضي
  };

  const languageContent = [
    { id: 1, language: "العربية", code: "SA" },
    { id: 2, language: "English", code: "US" },
    { id: 3, language: "Français", code: "FR" },
    { id: 4, language: "Español", code: "ES" },
    { id: 5, language: "Deutsch", code: "DE" },
    { id: 6, language: "Português", code: "PT" },
    { id: 7, language: "Türkçe", code: "TR" },
    { id: 8, language: "Русский", code: "RU" }
  ];

  const currencyContent = [
    { id: 1, currency: "SAR", name: "Saudi Riyal", symbol: "SAR", code: "SA" },
    { id: 2, currency: "USD", name: "US Dollar", symbol: "USD", code: "US" },
    { id: 3, currency: "EUR", name: "Euro", symbol: "EUR", code: "FR" },
    { id: 4, currency: "EUR", name: "Euro", symbol: "EUR", code: "ES" },
    { id: 5, currency: "EUR", name: "Euro", symbol: "EUR", code: "DE" },
    { id: 6, currency: "EUR", name: "Euro", symbol: "EUR", code: "PT" },
    { id: 7, currency: "TRY", name: "Turkish Lira", symbol: "TRY", code: "TR" },
    { id: 8, currency: "RUB", name: "Russian Ruble", symbol: "RUB", code: "RU" },
    { id: 9, currency: "AED", name: "UAE Dirham", symbol: "AED", code: "AE" },
    { id: 10, currency: "KWD", name: "Kuwaiti Dinar", symbol: "KWD", code: "KW" },
    { id: 11, currency: "QAR", name: "Qatari Riyal", symbol: "QAR", code: "QA" },
    { id: 12, currency: "BHD", name: "Bahraini Dinar", symbol: "BHD", code: "BH" },
    { id: 13, currency: "OMR", name: "Omani Rial", symbol: "OMR", code: "OM" },
    { id: 14, currency: "MAD", name: "Moroccan Dirham", symbol: "MAD", code: "MA" },
    { id: 15, currency: "JOD", name: "Jordanian Dinar", symbol: "JOD", code: "JO" },
    { id: 16, currency: "GBP", name: "British Pound", symbol: "GBP", code: "GB" }
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(languageContent[0]);
  const [selectedCurrencyItem, setSelectedCurrencyItem] = useState(currencyContent[0]);

  const handleItemClick = (item) => {
    if (activeTab === 'languages') {
      setSelectedCurrency(item);
      // تحديد العملة تلقائياً بناء على اللغة المختارة
      const correspondingCurrency = currencyContent.find(currency => currency.code === item.code);
      if (correspondingCurrency) {
        setSelectedCurrencyItem(correspondingCurrency);
      }
    } else {
      setSelectedCurrencyItem(item);
    }
    setClick(false);
  };

  return (
    <>
      <style jsx>{`
        .flag-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          flex-shrink: 0;
        }
        .flag-icon {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .language-currency-btn:hover {
          background-color: rgba(139, 69, 199, 0.15) !important;
        }
      `}</style>
      
      {/* Start language currency Selector */}
              <div className="col-auto">
                  <button
            className={`d-flex items-center text-16 px-18 py-10 rounded-4 language-currency-btn ${textClass}`}
            onClick={handleCurrency}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              transition: 'all 0.3s ease',
              minWidth: 'fit-content'
            }}
        >
          <span className="flag-container mr-12">
            <img 
              src={getFlagUrl(selectedCurrency.code)}
              alt={`${selectedCurrency.language} flag`}
              className="flag-icon"
              loading="lazy"
            />
          </span>
          <div 
            style={{
              width: '1.5px',
              height: '18px',
              backgroundColor: 'rgba(139, 69, 199, 0.3)',
              margin: '0 8px'
            }}
          ></div>
          <span className="text-16 fw-500" style={{color: '#000000'}}>
            {selectedCurrencyItem.symbol}
          </span>
        </button>
      </div>
      {/* End language currency Selector */}

      <div className={`langMenu js-langMenu ${click ? "" : "is-hidden"}`}>
        <div className="currencyMenu__bg" onClick={handleCurrency}></div>
        <div className="langMenu__content bg-white rounded-4">
          <div className="d-flex items-center justify-between px-30 py-20 sm:px-15 border-bottom-light">
            <div className="d-flex items-center">
              <button 
                className={`text-16 fw-500 lh-15 mr-30 pb-10 ${activeTab === 'languages' ? 'text-blue-1 border-bottom-blue' : 'text-dark-3'}`}
                onClick={() => setActiveTab('languages')}
                style={{borderBottom: activeTab === 'languages' ? '2px solid #3b82f6' : 'none'}}
              >
                Languages
              </button>
              <button 
                className={`text-16 fw-500 lh-15 pb-10 ${activeTab === 'currency' ? 'text-blue-1 border-bottom-blue' : 'text-dark-3'}`}
                onClick={() => setActiveTab('currency')}
                style={{borderBottom: activeTab === 'currency' ? '2px solid #3b82f6' : 'none'}}
              >
                Currency
              </button>
            </div>
            {/* End tabs */}
            <button className="pointer" onClick={handleCurrency}>
              <i className="icon-close" />
            </button>
            {/* End close button */}
          </div>
          {/* End flex-wrapper */}
          <ul className="modalGrid px-30 py-30 sm:px-15 sm:py-15">
            {activeTab === 'languages' ? (
              languageContent.map((item) => (
                <li
                  className={`modalGrid__item js-item ${
                    selectedCurrency.language === item.language ? "active" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="py-10 px-15 sm:px-5 sm:py-5">
                    <div className="d-flex items-center">
                      <span className="flag-container mr-10">
                        <img 
                          src={getFlagUrl(item.code)}
                          alt={`${item.language} flag`}
                          className="flag-icon"
                          loading="lazy"
                        />
                      </span>
                      <div>
                        <div className="text-15 lh-15 fw-500 text-dark-1">
                          {item.language}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              currencyContent.map((item) => (
                <li
                  className={`modalGrid__item js-item ${
                    selectedCurrencyItem.currency === item.currency ? "active" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="py-10 px-15 sm:px-5 sm:py-5">
                    <div className="d-flex items-center">
                      <span className="flag-container mr-10">
                        <img 
                          src={getFlagUrl(item.code)}
                          alt={`${item.currency} flag`}
                          className="flag-icon"
                          loading="lazy"
                        />
                      </span>
                      <div>
                        <div className="text-15 lh-15 fw-500 text-dark-1">
                          {item.currency} - {item.name}
                        </div>
                        <div className="text-14 lh-15 mt-5 text-dark-3">
                          {item.symbol}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {/* End langMenu */}
      </div>
    </>
  );
};

export default LanguageMegaMenu;
